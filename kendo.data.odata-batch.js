(function ($, kendo) {
  function pack(data, boundary) {
    var body = [];
    var changeset = kendo.guid();

    body.push('--batch_' + boundary);
    body.push('Content-Type: multipart/mixed; boundary=changeset_' + changeset, '');

    $.each(data, function (i, d) {
      var t = d.type.toUpperCase(), noBody = ['GET', 'DELETE'];

      body.push('--changeset_' + changeset);
      body.push('Content-Type: application/http');
      body.push('Content-Transfer-Encoding: binary');
      body.push('Content-ID:' + i + 1, '');

      body.push(t + ' ' + d.url + ' HTTP/1.1');

      /* Don't care about content type for requests that have no body. */
      if (noBody.indexOf(t) < 0) {
        body.push('Content-Type: ' + (d.contentType || 'application/json; charset=utf-8'));
      }

      body.push('Host: ' + location.host);
      body.push('', d.data ? JSON.stringify(d.data) : '');
    });

    body.push('--changeset_' + changeset + '--', '');
    body.push('--batch_' + boundary + '--', '');

    return body.join('\r\n');
  }

  function unpack (xhr, status, complete) {
    var lines = xhr.responseText.split('\r\n'),
      boundary = lines[3], data = [], d = null;

    console.log(lines)

    $.each(lines, function (i, l) {
      if (l.length) {
        if (l.indexOf(boundary) == 0) {
          if (d) data.push(d);
          d = {};
        } else if (d) {
          if (!d.status) {
            d.status = parseInt((function (m) {
              return m || [0, 0];
            })(/HTTP\/1.1 ([0-9]+)/g.exec(l))[1], 10);
          } else if (!d.data) {
            try {
              d.data = JSON.parse(l);
            } catch (ex) {
              d.data = l;
            }
          }

          if (d.status >= 400) {
            status = 'error';
          }
        }
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
        function (xnr, status) { unpack(xnr, status, params.complete); } :
          null
    });
  }

  var odata = kendo.data.transports['odata-v4'];

  function enqueue(items, verb, url, type) {
    return items.map(function(item) {
      if (type) {
        item['odata.type'] = type;
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
      complete: function(xhr, status, response) {
        if (status == 'success') {
          var create = response.filter(function(item) {
            return item.status == 201;
          }).map(function(item) {
            return item.data;
          })

          e.success(create, 'create');
          e.success([], "update");
          e.success([], "destroy");
        } else {
          console.log(response);
          e.error(response);
        }
      }
    })
  }

  kendo.data.transports['odata-v4'] = kendo.data.RemoteTransport.extend({
    init: function(options) {
      kendo.data.RemoteTransport.fn.init.call(this, $.extend({}, odata, options));
    },
    submit: submit
  });

  function data(d) {
    var data = d.value || data;

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

  kendo.data.schemas['odata-v4'].data = data;

  kendo.data.transports['odata-v3'] = kendo.data.RemoteTransport.extend({
    init: function(options) {
      kendo.data.RemoteTransport.fn.init.call(this, $.extend({}, odata, options, {
        parameterMap: this.parameterMap
      }));
    },
    submit: submit,
    parameterMap: function(options, type) {
      var result = odata.parameterMap(options, type);

      if (type == 'read') {
        if (result['$count'] == true) {
          delete result['$count'];
          result['$inlinecount'] = 'allpages';
        }
      }

      return result;
    }
  });

  kendo.data.schemas['odata-v3'] = {
    data: data,
    total: function(d) {
      return Number(d['odata.count']);
    }
  };
})(jQuery, kendo);
