var BATCH_URL = 'http://example.com';

describe('useTransaction=true', function() {
    var OdataTransport = kendo.data.transports.odata;

    var odata;

    var UPDATE_RESPONSE = '--batchresponse_c3e286db-7131-4728-925e-54aaecfd7937\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_009c32a0-c62b-4341-8e62-b5d8b16f2106\r\n\
\r\n\
--changesetresponse_009c32a0-c62b-4341-8e62-b5d8b16f2106\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 204 No Content\r\n\
X-Content-Type-Options: nosniff\r\n\
Cache-Control: no-cache\r\n\
DataServiceVersion: 1.0;\r\n\
\r\n\
\r\n\
--changesetresponse_009c32a0-c62b-4341-8e62-b5d8b16f2106\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 204 No Content\r\n\
X-Content-Type-Options: nosniff\r\n\
Cache-Control: no-cache\r\n\
DataServiceVersion: 1.0;\r\n\
\r\n\
\r\n\
--changesetresponse_009c32a0-c62b-4341-8e62-b5d8b16f2106--\r\n\
--batchresponse_c3e286db-7131-4728-925e-54aaecfd7937--';

  var SUCCESS_RESPONSE = '--batchresponse_f25cb4c6-aafa-451e-a5cf-4b4f134d8cc9\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_503145db-70fc-4a52-bd3a-58f0bf05be1a\r\n\
\r\n\
--changesetresponse_503145db-70fc-4a52-bd3a-58f0bf05be1a\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 201 Created\r\n\
DataServiceVersion: 3.0;\r\n\
Content-Type: application/json;odata=minimalmetadata;streaming=true;charset=utf-8\r\n\
X-Content-Type-Options: nosniff\r\n\
Cache-Control: no-cache\r\n\
Location: http://services.odata.org/V3/(S(yrfmnhb3d1xr0g4a105tepiq))/OData/OData.svc/Products(56)\r\n\
\r\n\
{"odata.metadata":"http://services.odata.org/V3/(S(yrfmnhb3d1xr0g4a105tepiq))/OData/OData.svc/$metadata#Products/@Element","ID":56,"Name":"gggg","Description":null,"ReleaseDate":null,"DiscontinuedDate":null,"Rating":null,"Price":null}\r\n\
--changesetresponse_503145db-70fc-4a52-bd3a-58f0bf05be1a\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 201 Created\r\n\
DataServiceVersion: 3.0;\r\n\
Content-Type: application/json;odata=minimalmetadata;streaming=true;charset=utf-8\r\n\
X-Content-Type-Options: nosniff\r\n\
Cache-Control: no-cache\r\n\
Location: http://services.odata.org/V3/(S(yrfmnhb3d1xr0g4a105tepiq))/OData/OData.svc/Products(55)\r\n\
\r\n\
{"odata.metadata":"http://services.odata.org/V3/(S(yrfmnhb3d1xr0g4a105tepiq))/OData/OData.svc/$metadata#Products/@Element","ID":55,"Name":"asdf","Description":null,"ReleaseDate":null,"DiscontinuedDate":null,"Rating":null,"Price":null}\r\n\
--changesetresponse_503145db-70fc-4a52-bd3a-58f0bf05be1a--\r\n\
--batchresponse_f25cb4c6-aafa-451e-a5cf-4b4f134d8cc9--';

var ERROR_RESPONSE = '--batchresponse_dfdcb4b9-86c7-4933-9dd2-0f9d404b6123\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_ebfbe8c1-2608-4203-b40c-a04ee4df3468\r\n\
\r\n\
--changesetresponse_ebfbe8c1-2608-4203-b40c-a04ee4df3468\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 400 Bad Request\r\n\
X-Content-Type-Options: nosniff\r\n\
DataServiceVersion: 3.0;\r\n\
Content-Type: application/json;odata=minimalmetadata;streaming=true;charset=utf-8\r\n\
\r\n\
{"odata.error":{"message": {"value": "Error"}}}\r\n\
--changesetresponse_ebfbe8c1-2608-4203-b40c-a04ee4df3468--\r\n\
--batchresponse_dfdcb4b9-86c7-4933-9dd2-0f9d404b6123--';

    it('transport option defaults are initialized', function() {
        assert.equal(odata.options.update.dataType, 'json');
        assert.equal(odata.options.destroy.dataType, 'json');
        assert.equal(odata.options.create.dataType, 'json');
    });

    it('supports batchUrl setting', function() {
        odata.setBatchDetails(BATCH_URL);

        assert.equal(odata.options.batchUrl, BATCH_URL);
    });

    it('makes request to batchUrl', function() {
        var stub = sinon.stub($, 'ajax', function() {
           return $.Deferred();
        });

        odata.submit({
          data: {
            created: [{ }],
            updated: [],
            destroyed: []
          }
        });

        assert.equal(stub.calledOnce, true);
        assert.equal(stub.getCall(0).args[0].url, BATCH_URL);
    });


    it('posts operations as a single changeset', function() {
        var stub = sinon.stub($, 'ajax', function() {
           return $.Deferred();
        });

        odata.submit({
          data: {
            created: [{}, {}],
            updated: [{}],
            destroyed: [{}]
          }
        });

        var request = stub.getCall(0).args[0].data;

        assert.equal(changesets(request).length, 1);
    });

    it('invokes success callback with server response on create', function(done) {
        var stub = stubAjaxWithResponse(SUCCESS_RESPONSE);

        odata.submit({
          data: {
            created: [{}, {}],
            updated: [],
            destroyed: []
          },
          success: function(result, type) {
            if (type == 'create') {
              assert.equal(result.length, 2);
              assert.equal(result[0].ID, 56);
              assert.equal(result[1].ID, 55);

              done();
            }
          }
        });
    });

    it('invokes success callback with the posted data on update', function(done) {
        var stub = stubAjaxWithResponse(UPDATE_RESPONSE);

        odata.submit({
          data: {
            created: [],
            updated: [{ ID: 1 }, { ID: 2 }],
            destroyed: []
          },
          success: function(result, type) {
            if (type == 'update') {
              assert.equal(result.length, 2);
              assert.equal(result[0].ID, 1);
              assert.equal(result[1].ID, 2);

              done();
            }
          }
        });

    });

    it('invokes error handler on create', function(done) {
        var stub = stubAjaxWithResponse(ERROR_RESPONSE);

        odata.submit({
          data: {
            created: [{}, {}],
            updated: [],
            destroyed: []
          },
          error: function(xhr, status, result) {
            assert.equal(result.length, 1);

            assert.equal(result[0]['odata.error'].message.value, 'Error');

            done();
          }
        });
    });

    it('invokes error handler on update', function(done) {
        var stub = stubAjaxWithResponse(ERROR_RESPONSE);

        odata.submit({
          data: {
            created: [],
            updated: [{}, {}],
            destroyed: []
          },
          error: function(xhr, status, result) {
            assert.equal(result.length, 1);
            assert.equal(result[0]['odata.error'].message.value, 'Error');

            done();
          }
        });
    });

    it('invokes error handler on destroy', function(done) {
        var stub = stubAjaxWithResponse(ERROR_RESPONSE);

        odata.submit({
          data: {
            created: [],
            updated: [],
            destroyed: [{}, {}],
          },
          error: function(xhr, status, result) {
            assert.equal(result.length, 1);
            assert.equal(result[0]['odata.error'].message.value, 'Error');

            done();
          }
        });
    });

    afterEach(function() {
      if ($.ajax.restore) {
        $.ajax.restore();
      }
    });

    beforeEach(function() {
      odata = new OdataTransport({
        useTransaction: true
      });

      odata.setBatchDetails(BATCH_URL);
    })

    // Utilies

    function stubAjaxWithResponse(response) {
        return sinon.stub($, 'ajax', function(options) {
            options.complete({ responseText: response}, 'success');
        });
    }

    function changesets(data) {
        var matcher = /changeset_(.*?)--/g;

        var changesets = [];

        var match;

        while (match = matcher.exec(data)) {
            var changeset = match[1];

            if (changesets.indexOf(changeset) < 0) {
              changesets.push(changeset);
            }
        }

        return changesets;
    }
});
