describe('OData v3', function() {
    var OdataTransport = kendo.data.transports.odata;
    var BATCH_URL = 'http://example.com';

    it('supports submit', function() {
        var odata = new OdataTransport();

        assert.equal('function', typeof odata.submit);
    });

    it('transport option defaults are set', function() {
        var odata = new OdataTransport();

        assert.equal(odata.options.update.dataType, 'json');
        assert.equal(odata.options.destroy.dataType, 'json');
        assert.equal(odata.options.create.dataType, 'json');
    });

    it('supportss batchUrl setting', function() {
        var odata = new OdataTransport();

        odata.setBatchDetails(BATCH_URL);

        assert.equal(odata.options.batchUrl, BATCH_URL);
    });

    it('makes request to batchUrl', function() {
        var stub = sinon.stub($, 'ajax', function() {
           return $.Deferred();
        });

        var odata = new OdataTransport();

        odata.setBatchDetails(BATCH_URL);

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

    function changesets(data) {
        var matcher = /changeset_(.*)/g;

        var changesets = [];

        var match;

        while (match = matcher.exec(data)) {
            var changeset = match[1].replace('--', '');

            if (changesets.indexOf(changeset) < 0) {
              changesets.push(changeset);
            }
        }

        return changesets;
    }

    it('posts every operation as a separate changeset', function() {
        var stub = sinon.stub($, 'ajax', function() {
           return $.Deferred();
        });

        var odata = new OdataTransport();

        odata.setBatchDetails(BATCH_URL);

        odata.submit({
          data: {
            created: [{}, {}],
            updated: [],
            destroyed: []
          }
        });

        var request = stub.getCall(0).args[0].data;

        assert.equal(changesets(request).length, 2);
    });

    it('invokes success callback with server response', function(done) {
        var response = '--batchresponse_f93844b1-9742-4a4b-9fad-c100b3b21b31\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_cd2111d2-d6c4-4aa9-b8f8-04001c3488be\r\n\
\r\n\
--changesetresponse_cd2111d2-d6c4-4aa9-b8f8-04001c3488be\r\n\
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
{"odata.metadata":"http://services.odata.org/V3/(S(yrfmnhb3d1xr0g4a105tepiq))/OData/OData.svc/$metadata#Products/@Element","ID":56,"Name":"Two","Description":null,"ReleaseDate":null,"DiscontinuedDate":null,"Rating":null,"Price":null}\r\n\
--changesetresponse_cd2111d2-d6c4-4aa9-b8f8-04001c3488be--\r\n\
--batchresponse_f93844b1-9742-4a4b-9fad-c100b3b21b31\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_1153ef9d-e15b-4ef0-b949-c189b6ab683c\r\n\
\r\n\
--changesetresponse_1153ef9d-e15b-4ef0-b949-c189b6ab683c\r\n\
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
{"odata.metadata":"http://services.odata.org/V3/(S(yrfmnhb3d1xr0g4a105tepiq))/OData/OData.svc/$metadata#Products/@Element","ID":55,"Name":"One","Description":null,"ReleaseDate":null,"DiscontinuedDate":null,"Rating":null,"Price":null}\r\n\
--changesetresponse_1153ef9d-e15b-4ef0-b949-c189b6ab683c--\r\n\
--batchresponse_f93844b1-9742-4a4b-9fad-c100b3b21b31--';

        var stub = sinon.stub($, 'ajax', function(options) {
            options.complete({ responseText: response}, 'success');
        });

        var odata = new OdataTransport();

        odata.setBatchDetails(BATCH_URL);

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

    afterEach(function() {
      if ($.ajax.restore) {
        $.ajax.restore();
      }
    });
});
