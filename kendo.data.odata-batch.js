(function ($, kendo) {
    function pack(data, boundary) {
        var body = [];
        var changeset = kendo.guid();

        $.each(data, function (i, d) {
            var t = d.type.toUpperCase(), noBody = ['GET', 'DELETE'];

            body.push('--batch_' + boundary);

            var changeset = kendo.guid();

            body.push('Content-Type: multipart/mixed; boundary=changeset_' + changeset, '');

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
            body.push('--changeset_' + changeset + '--', '');
        });

        body.push('--batch_' + boundary + '--', '');

        return body.join('\r\n');
    }

    function unpack(xhr, status, params) {
        var complete = params.complete;
        var requests = params.data;

        if (status != 'success') {
          return complete.call(this, xhr, status, xhr.responseText);
        }

        var responseText = xhr.responseText;

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

        var data = {
          created: [],
          updated: [],
          destroyed: [],
          errors: []
        };

        requests.forEach(function(request, index) {
            var response = responses[index];

            var lines = response.split('\r\n\r\n');

            var result = {};

            result.status = parseInt((function (m) {
                return m || [0, 0];
            })(/HTTP\/1.1 ([0-9]+)/g.exec(lines[1]))[1], 10);

            try {
                result.data = JSON.parse(lines[2])
            } catch (error) {
                result.data = lines[2];
            }

            var payload = result.status >= 200 && result.status < 400 ? result.data : null;

            if (request.type == 'POST') {
                data.created.push(payload);
            } else if (request.type == 'PUT') {
                data.updated.push(payload);
            } else if (request.type == 'DELETE') {
                data.destroyed.push(payload);
            }

            if (result.status >= 400) {
              data.errors.push(result.data);
            }
        });

        complete.call(this, xhr, status, data);
    }

    function ajaxBatch(params) {
        var boundary = kendo.guid();

        $.ajax({
            type: 'POST',
            url: params.url,
            data: pack(params.data, boundary),
            contentType: 'multipart/mixed; boundary=batch_' + boundary,
            complete: params.complete ?
              function (xhr, status) { unpack(xhr, status, params); } :
                null
        });
    }

    var odata = kendo.data.transports['odata'];
    var odata4 = kendo.data.transports['odata-v4'];

    function enqueue(items, verb, url, type) {
        return items.map(function (item) {
            if (type) {
                item['odata.type'] = type;
            }

            for (var key in item) {
              var value = item[key];

              // Convert numbers to strings to handle Edm.Decimal
              if (typeof value === 'number') {
                item[key] = value + '';
              }
            }

            return {
                data: item,
                type: verb,
                url: typeof url == 'function' ? url(item) : url
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
                    e.success(response.created, 'create')
                    e.success(response.updated, 'update');
                    e.success(response.destroyed, 'destroy');

                    if (response.errors.length) {
                        e.error(xhr, 'error', response.errors);
                    }
                } else {
                    e.error(xhr, status, response);
                }
            }
        })
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
            kendo.data.RemoteTransport.fn.init.call(this, $.extend(true, {}, odata4, options));
        },
        submit: submit,
        setBatchDetails: function (batchUrl) {
            this.options.batchUrl = batchUrl;
        }
    });

    kendo.data.schemas['odata-v4'].data = data;

    kendo.data.transports['odata'] = kendo.data.RemoteTransport.extend({
        init: function (options) {
            kendo.data.RemoteTransport.fn.init.call(this, $.extend(true, {}, odata, options));
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

    // Patching the Kendo UI DataSource to support mixed (success and error) server responses.
    kendo.data.DataSource.prototype._accept = function(result) {
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

            if (item === null) {
              // Null means failed server response - skip everything in this case.
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
