(function ($, kendo) {
  function pack(data, boundary) {
    var body = [];

    $.each(data, function (i, d) {
      var t = d.type.toUpperCase(), noBody = ['GET', 'DELETE'];

      body.push('--' + boundary);
      body.push('Content-Type: application/http');
      body.push('Content-Transfer-Encoding: binary', '');

      body.push(t + ' ' + d.url + ' HTTP/1.1');

      /* Don't care about content type for requests that have no body. */
      if (noBody.indexOf(t) < 0) {
        body.push('Content-Type: ' + (d.contentType || 'application/json; charset=utf-8'));
      }

      body.push('Host: ' + location.host);
      body.push('', d.data ? JSON.stringify(d.data) : '');
    });

    body.push('--' + boundary + '--', '');

    return body.join('\r\n');
  }

  function unpack (xhr, status, complete) {
    var lines = xhr.responseText.split('\r\n'),
      boundary = lines[0], data = [], d = null;

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
              } catch (ex) { }
            }
          }
        }
      });

      complete.call(this, xhr, status, data);
  }

  function ajaxBatch(params) {
    var boundary = new Date().getTime().toString();

    $.ajax({
      type: 'POST',
      url: params.url,
      data: pack(params.data, boundary),
      contentType: 'multipart/mixed; boundary="' + boundary + '"',
      complete: params.complete ?
        function (xnr, status) { unpack(xnr, status, params.complete); } :
          null
    });
  }

  var odata = kendo.data.transports['odata-v4'];

  function enqueue(items, type, url) {
    return items.map(function(item) {
      return {
        data: item,
        type: type,
        url: typeof url == 'function' ? url(item) : url
      }
    });
  }

  kendo.data.transports['odata-v4'] = kendo.data.RemoteTransport.extend({
    init: function(options) {
      kendo.data.RemoteTransport.fn.init.call(this, $.extend({}, odata, options))
    },
    parameterMap: function(options, type) {
      var result = odata.parameterMap(options, type);

      if (type == 'read') {
        if (typeof result.$skip != 'undefined') {
        }
      }

      return result;
    },
    submit: function(e) {
      var requests = [].concat(
        enqueue(e.data.created, 'POST', this.options.create.url),
        enqueue(e.data.updated, 'PUT', this.options.update.url),
        enqueue(e.data.destroyed, 'DELETE', this.options.destroy.url)
      );

      var batchUrl = this.options.read.url.substring(0, this.options.read.url.lastIndexOf('/')) + '/$batch';

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
            e.error(response);
          }
        }
      })
    }
  });

  kendo.data.schemas['odata-v4'].data = function(d) {
    var data = d.value || data;

    if (!$.isArray(data)) {
      data = [data];
    }

    return data.map(function(item) {
      var clone = {};

      for (var key in item) {
        if (key.indexOf('@odata') < 0) {
          clone[key] = item[key];
        }
      }

      return clone;
    })
  };
})(jQuery, kendo);
