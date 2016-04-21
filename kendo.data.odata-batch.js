/**
 * OData Batch Fix for Kendo UI v0.9.5 (http://github.com/advancedrei/kendo-odata-batch)
 * Copyright (C) 2016 AdvancedREI, LLC. All Rights Reserved.
 *
 * Written by Atanas Korchev.
 * Licensed under the MIT License: https://opensource.org/licenses/MIT
*/

(function ($, kendo) {
    function pack(data, boundary, useTransaction) {
        var body = [];

        var changeset = kendo.guid();

        if (useTransaction) {
            body.push('--batch_' + boundary);
            body.push('Content-Type: multipart/mixed; boundary=changeset_' + changeset, '');
        }

        $.each(data, function (i, d) {
            var t = d.type.toUpperCase(), noBody = ['GET', 'DELETE'];

            if (!useTransaction) {
                body.push('--batch_' + boundary);

                changeset = kendo.guid();

                body.push('Content-Type: multipart/mixed; boundary=changeset_' + changeset, '');
            }

            body.push('--changeset_' + changeset);
            body.push('Content-Type: application/http');
            body.push('Content-Transfer-Encoding: binary');
            body.push('Content-ID:' + i + 1, '');

            body.push(t + ' ' + d.url + ' HTTP/1.1');

            /* Don't care about content type for requests that have no body. */
            if (noBody.indexOf(t) < 0) {
                body.push('Content-Type: ' + (d.contentType || 'application/json; charset=utf-8'));
                body.push('Accept: ' + (d.contentType || 'application/json; charset=utf-8'));
            }

            body.push('Host: ' + location.host);
            body.push('', d.data ? JSON.stringify(d.data) : '');

            if (!useTransaction) {
                body.push('--changeset_' + changeset + '--', '');
            }
        });

        if (useTransaction) {
            body.push('--changeset_' + changeset + '--', '');
        }

        body.push('--batch_' + boundary + '--', '');

        return body.join('\r\n');
    }

    function splitSingleChangeset(responseText) {
        return responseText.split(/--changesetresponse_(?:.*)/g).slice(1, -1);
    }

    function splitMultipleChangeset(responseText) {
        var matcher = /--changesetresponse_(.*)/g;

        var match;

        var responses = []

        while (match = matcher.exec(responseText)) {
            var start = match.index + match[0].length;

            match = matcher.exec(responseText);

            if (match) {
              var end = match.index;

              var response = $.trim(responseText.substring(start, end));

              responses.push(response);
            }
        }

        return responses;
    }

    function unpack(xhr, status, params, useTransaction) {
        var complete = params.complete;
        var requests = params.data;

        if (status != 'success') {
          return complete.call(this, xhr, status, xhr.responseText);
        }

        var responseText = xhr.responseText;

        var responses = useTransaction ? splitSingleChangeset(responseText) :
                                         splitMultipleChangeset(responseText);

        var result = {
          created: [],
          updated: [],
          destroyed: [],
          errors: []
        };

        requests.forEach(function(request, index) {
            var raw = responses[index];

            if (!raw) {
              // If there is a failure in transactional mode there is only one response
              return;
            }

            var lines = $.trim(raw).split('\r\n\r\n');

            var response = {};

            response.status = parseInt((function (m) {
                return m || [0, 0];
            })(/HTTP\/1.1 ([0-9]+)/g.exec(lines[1]))[1], 10);

            try {
                response.data = JSON.parse(lines[2])
            } catch (error) {
                response.data = lines[2];
            }

            var success = response.status >= 200 && response.status < 400;

            var payload =  success ? $.extend({}, request.data, response.data) : { __error: true };

            if (request.type == 'POST') {
                if (success || !useTransaction) {
                    result.created.push(payload);
                }
            } else if (request.type == 'PUT') {
                if (success || !useTransaction) {
                    result.updated.push(payload);
                }
            } else if (request.type == 'DELETE') {
                if (success || !useTransaction) {
                    result.destroyed.push(payload);
                }
            }

            if (!success) {
                result.errors.push(response.data);
            }
        });

        complete.call(this, xhr, status, result);
    }

    function ajaxBatch(params, useTransaction) {
        var boundary = kendo.guid();

        $.ajax({
            type: 'POST',
            url: params.url,
            data: pack(params.data, boundary, useTransaction),
            contentType: 'multipart/mixed; boundary=batch_' + boundary,
            complete: params.complete ?
              function (xhr, status) { unpack(xhr, status, params, useTransaction); } :
                null
        });
    }

    var odata = kendo.data.transports['odata'];
    var odata4 = kendo.data.transports['odata-v4'];

    function convertNumbersToStrings(item) {
        for (var key in item) {
            var value = item[key];

            var type = $.type(value);

            // Convert numbers to strings to handle Edm.Decimal
            if (type === 'number') {
                item[key] = value + '';
            } else if (type === 'object') {
                convertNumbersToStrings(value)
            }
        }
    }

    function enqueue(items, verb, url, type) {
        return items.map(function (item) {
            if (type) {
                item['odata.type'] = type;
            }

            // Convert numbers to strings to handle Edm.Decimal
            convertNumbersToStrings(item);

            return {
                data: item,
                type: verb,
                url: typeof url === 'function' ? url(item) : url
            }
        });
    }

    function submit(e) {
        var requests = [].concat(
          enqueue(e.data.created, 'POST', this.options.create.url, this.options.type),
          enqueue(e.data.updated, 'PUT', this.options.update.url, this.options.type),
          enqueue(e.data.destroyed, 'DELETE', this.options.destroy.url)
        );

        var batchUrl = this.options.batchUrl || this.options.read.url.substring(0, this.options.read.url.lastIndexOf('/')) + '/$batch'

        ajaxBatch({
            url: batchUrl,
            data: requests,
            complete: function (xhr, status, response) {
                if (status == 'success') {
                    if (response.created.length) {
                        e.success(response.created, 'create')
                    }

                    if (response.updated.length) {
                        e.success(response.updated, 'update');
                    }

                    if (response.destroyed.length) {
                        e.success(response.destroyed, 'destroy');
                    }

                    if (response.errors.length) {
                        e.error(xhr, 'error', response.errors);
                    }
                } else {
                    e.error(xhr, status, response);
                }
            }
        }, this.options.useTransaction)
    }

    function data(d) {
        var data = d.value || d;

        if (!$.isArray(data)) {
            data = [data];
        }

        return data.map(strip);
    }

    function strip(item) {
        var clone = {};

        for (var key in item) {
            if (key.indexOf('odata') >= 0) {
                continue;
            }

            clone[key] = item[key];
        }

        return clone;
    }

    kendo.data.transports['odata-v4'] = kendo.data.RemoteTransport.extend({
        init: function (options) {
            kendo.data.RemoteTransport.fn.init.call(this, $.extend(true, { useTransaction: false }, odata4, options));

            this.useTransaction = this.options.useTransaction;
        },
        submit: submit,
        setBatchDetails: function (batchUrl) {
            this.options.batchUrl = batchUrl;
        }
    });

    kendo.data.schemas['odata-v4'].data = data;

    kendo.data.transports['odata'] = kendo.data.RemoteTransport.extend({
        init: function (options) {
            kendo.data.RemoteTransport.fn.init.call(this, $.extend(true, { useTransaction: false }, odata, options));

            this.useTransaction = this.options.useTransaction;
        },
        submit: submit,
        setBatchDetails: function (batchUrl, objectType) {
            this.options.batchUrl = batchUrl;
            this.options.type = objectType;
        }
    });

    kendo.data.transports['odata'].parameterMap = odata.parameterMap;

    kendo.data.schemas['odata'] = {
        type: 'json',
        data: data,
        total: function (d) {
            return Number(d['odata.count']);
        }
    };

    var transactionalAccept = kendo.data.DataSource.prototype._accept;

    // Patching the Kendo UI DataSource to support mixed (success and error) server responses.
    kendo.data.DataSource.prototype._accept = function(result) {
        var useTransaction = this.transport.useTransaction;

        if (typeof useTransaction === 'undefined' || useTransaction === true) {
            return transactionalAccept.call(this, result);
        }

        var that = this;
        var models = result.models;
        var response = result.response;
        var serverGroup = that._isServerGrouped();
        var pristine = that._pristineData;
        var type = result.type;

        that.trigger('requestEnd', { response: response, type: type });

        if (response && !$.isEmptyObject(response)) {
            response = that.reader.parse(response);

            if (that._handleCustomErrors(response)) {
                return;
            }

            response = that.reader.data(response);

            if (!$.isArray(response)) {
                response = [response];
            }
        } else {
            response = $.map(models, function(model) { return model.toJSON(); } );
        }

        for (var idx = 0, length = models.length; idx < length; idx++) {
            var item = response[idx];

            if (item.__error === true) {
              // Failed server response - skip everything in this case.
              continue;
            }

            if (type !== 'destroy') {
                models[idx].accept(item);

                if (type === 'create') {
                    pristine.push(serverGroup ? that._wrapInEmptyGroup(models[idx]) : item);
                } else if (type === 'update') {
                    that._updatePristineForModel(models[idx], item);
                }
            } else {
                // Remove the item instead of clearing the _destroyed array which the original code does.
                that._destroyed.splice($.inArray(that._destroyed, models[idx]), 1);

                that._removePristineForModel(models[idx]);
            }
        }
    }
})(jQuery, kendo);
