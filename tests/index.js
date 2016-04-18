var BATCH_URL = 'http://example.com';

describe('OData v3', function() {
    var OdataTransport = kendo.data.transports.odata;

    var odata;

    var UPDATE_RESPONSE = '--batchresponse_91b203e3-d391-4c19-a5ff-3736dbdea6f3\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_8cc86f3c-e69f-46a2-9133-602391c3634c\r\n\
\r\n\
--changesetresponse_8cc86f3c-e69f-46a2-9133-602391c3634c\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 204 No Content\r\n\
X-Content-Type-Options: nosniff\r\n\
Cache-Control: no-cache\r\n\
DataServiceVersion: 1.0;\r\n\
\r\n\
\r\n\
--changesetresponse_8cc86f3c-e69f-46a2-9133-602391c3634c--\r\n\
--batchresponse_91b203e3-d391-4c19-a5ff-3736dbdea6f3\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_20151335-5293-411d-9ede-499f0ef3bcbf\r\n\
\r\n\
--changesetresponse_20151335-5293-411d-9ede-499f0ef3bcbf\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 204 No Content\r\n\
X-Content-Type-Options: nosniff\r\n\
Cache-Control: no-cache\r\n\
DataServiceVersion: 1.0;\r\n\
\r\n\
\r\n\
--changesetresponse_20151335-5293-411d-9ede-499f0ef3bcbf--\r\n\
--batchresponse_91b203e3-d391-4c19-a5ff-3736dbdea6f3--';


    var SUCCESS_RESPONSE = '--batchresponse_f93844b1-9742-4a4b-9fad-c100b3b21b31\r\n\
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

    var MIXED_RESPONSE = '--batchresponse_f93844b1-9742-4a4b-9fad-c100b3b21b31\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_cd2111d2-d6c4-4aa9-b8f8-04001c3488be\r\n\
\r\n\
--changesetresponse_cd2111d2-d6c4-4aa9-b8f8-04001c3488be\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 400 Bad Request\r\n\
DataServiceVersion: 3.0;\r\n\
Content-Type: application/json;odata=minimalmetadata;streaming=true;charset=utf-8\r\n\
X-Content-Type-Options: nosniff\r\n\
Cache-Control: no-cache\r\n\
Location: http://services.odata.org/V3/(S(yrfmnhb3d1xr0g4a105tepiq))/OData/OData.svc/Products(56)\r\n\
\r\n\
{"message":"Error"}\r\n\
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


    it('posts operations as a separate changesets', function() {
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

        assert.equal(changesets(request).length, 4);
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

    it('invokes success and error callbacks when creating items', function(done) {
        var stub = stubAjaxWithResponse(MIXED_RESPONSE);

        odata.submit({
          data: {
            created: [{}, {}],
            updated: [],
            destroyed: []
          },
          success: function(result, type) {
            if (type == 'create') {
              assert.equal(result.length, 2);
              assert.equal(result[0], null);
              assert.equal(result[1].ID, 55);
            }
          },
          error: function(xhr, status, result) {
            assert.equal(result.length, 1);
            assert.equal(result[0].message, 'Error');

            done();
          }
        });
    });

    it('invokes success and error callbacks when updating items', function(done) {
        var stub = stubAjaxWithResponse(MIXED_RESPONSE);

        odata.submit({
          data: {
            created: [],
            updated: [{}, {}],
            destroyed: []
          },
          success: function(result, type) {
            if (type == 'update') {
              assert.equal(result.length, 2);
              assert.equal(result[0], null);
              assert.equal(result[1].ID, 55);
            }
          },
          error: function(xhr, status, result) {
            assert.equal(result.length, 1);
            assert.equal(result[0].message, 'Error');

            done();
          }
        });
    });

    it('invokes success and error callbacks when destroying items', function(done) {
        var stub = stubAjaxWithResponse(MIXED_RESPONSE);

        odata.submit({
          data: {
            created: [],
            updated: [],
            destroyed: [{}, {}],
          },
          success: function(result, type) {
            if (type == 'destroy') {
              assert.equal(result.length, 2);
              assert.equal(result[0], null);
              assert.equal(result[1].ID, 55);
            }
          },
          error: function(xhr, status, result) {
            assert.equal(result.length, 1);
            assert.equal(result[0].message, 'Error');

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
      odata = new OdataTransport();

      odata.setBatchDetails(BATCH_URL);
    })

    // Utilies

    function stubAjaxWithResponse(response) {
        return sinon.stub($, 'ajax', function(options) {
            options.complete({ responseText: response}, 'success');
        });
    }

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
});

describe('DataSource', function() {

  it('keeps failed inserted items in dirty state', function(done) {
    var dataSource = new kendo.data.DataSource({
      batch: true,
      schema: {
        model: { ID: 'id' }
      },
      transport: {
        read: function() {
        },
        submit: function(e) {
         e.success([
           null,
           { id: 1}
         ], 'create');
        }
      }
    });

    dataSource.add({ text: 'fails' });
    dataSource.add({ text: 'succeeds' });

    dataSource.sync()
      .then(function() {

        assert.equal(dataSource.at(0).get('id'), null);
        assert.equal(dataSource.at(0).isNew(), true);

        assert.equal(dataSource.at(1).get('id'), 1);
        assert.equal(dataSource.at(1).isNew(), false);

        done();
      })
  });

  it('keeps failed updated items in dirty state', function(done) {
    var dataSource = new kendo.data.DataSource({
      batch: true,
      schema: {
        model: { ID: 'id' }
      },
      transport: {
        read: function(options) {
          options.success([
            { id: 0, text: '0' },
            { id: 1, text: '1' }
          ])
        },
        submit: function(e) {
         e.success([
           null,
           { id: 1}
         ], 'update');
        }
      }
    });

    dataSource.fetch()

    dataSource.at(0).set('text', 'fails')
    dataSource.at(1).set('text', 'succeeds')

    dataSource.sync()
      .then(function() {
        assert.equal(dataSource.at(0).get('text'), 'fails');
        assert.equal(dataSource.at(0).dirty, true);

        assert.equal(dataSource.at(1).get('text'), 'succeeds');
        assert.equal(dataSource.at(1).dirty, false);

        done();
      })
  });

  it('keeps failed updated items in dirty state', function(done) {
    var dataSource = new kendo.data.DataSource({
      batch: true,
      schema: {
        model: { ID: 'id' }
      },
      transport: {
        read: function(options) {
          options.success([
            { id: 1, text: '0' },
            { id: 2, text: '1' }
          ])
        },
        submit: function(e) {
         e.success([
           null,
           { id: 2}
         ], 'update');
        }
      }
    });

    dataSource.fetch();

    dataSource.at(0).set('text', 'fails');
    dataSource.at(1).set('text', 'succeeds');

    dataSource.sync()
      .then(function() {
        assert.equal(dataSource.at(0).get('text'), 'fails');
        assert.equal(dataSource.at(0).dirty, true);

        assert.equal(dataSource.at(1).get('text'), 'succeeds');
        assert.equal(dataSource.at(1).dirty, false);

        done();
      })
  });

  it('keeps failed destroyed items', function(done) {
    var dataSource = new kendo.data.DataSource({
      batch: true,
      schema: {
        model: { ID: 'id' }
      },
      transport: {
        read: function(options) {
          options.success([
            { id: 1, text: '0' },
            { id: 2, text: '1' }
          ])
        },
        submit: function(e) {
         e.success([
           null,
           { id: 1 }
         ], 'destroy');
        }
      }
    });

    dataSource.fetch(function() {
      var one = dataSource.at(0);
      var two = dataSource.at(1);

      dataSource.remove(one);
      dataSource.remove(two);

      dataSource.sync()
        .then(function() {
          assert.equal(dataSource.destroyed().length, 1);

          assert.equal(dataSource.total(), 0);

          done();
        })
    });
  });
});
