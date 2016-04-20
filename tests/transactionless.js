var BATCH_URL = 'http://example.com';

describe('useTransaction=false', function() {
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

var GUID_RESPONSE = '--batchresponse_9a307bd5-3bc8-4d3f-a0ef-15ec32654258\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_1bfff412-fcec-4e3c-957c-7e81b2807cc1\r\n\
\r\n\
--changesetresponse_1bfff412-fcec-4e3c-957c-7e81b2807cc1\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 201 Created\r\n\
Location: http://localhost:57608/LedgerEntries(guid\'d8e301d7-8160-49ad-afbe-51d53c92e94a\')\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: application/json; charset=utf-8\r\n\
DataServiceVersion: 3.0\r\n\
\r\n\
{\r\n\
  "odata.metadata":"http://localhost:57608/$metadata#LedgerEntries/@Element","Id":"d8e301d7-8160-49ad-afbe-51d53c92e94a","ScenarioId":"00000000-0000-0000-0000-000000000000","LedgerEntryType":"Income","Description":"asdfasdfasdf","Amount":"75","Conversion":3,"AnnualIncrease":"0","DateApplicable":null,"CreatedById":null,"DateCreated":"2016-04-19T18:20:40.654Z","DateUpdated":"2016-04-19T11:20:51.703125-07:00","Notes":"ffff"\r\n\
}\r\n\
--changesetresponse_1bfff412-fcec-4e3c-957c-7e81b2807cc1--\r\n\
--batchresponse_9a307bd5-3bc8-4d3f-a0ef-15ec32654258\r\n\
Content-Type: multipart/mixed; boundary=changesetresponse_c46105b1-2b39-4326-ad9d-4400a05b3d1a\r\n\
\r\n\
--changesetresponse_c46105b1-2b39-4326-ad9d-4400a05b3d1a\r\n\
Content-Type: application/http\r\n\
Content-Transfer-Encoding: binary\r\n\
\r\n\
HTTP/1.1 201 Created\r\n\
Location: http://localhost:57608/LedgerEntries(guid\'78176875-e992-4a39-a330-1ebe0e4cb1a6\')\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: application/json; charset=utf-8\r\n\
DataServiceVersion: 3.0\r\n\
\r\n\
{\r\n\
  "odata.metadata":"http://localhost:57608/$metadata#LedgerEntries/@Element","Id":"78176875-e992-4a39-a330-1ebe0e4cb1a6","ScenarioId":"00000000-0000-0000-0000-000000000000","LedgerEntryType":"Income","Description":"asdf","Amount":"50","Conversion":3,"AnnualIncrease":"0","DateApplicable":null,"CreatedById":null,"DateCreated":"2016-04-19T18:20:40.654Z","DateUpdated":"2016-04-19T11:20:51.703125-07:00","Notes":"asdfasdf"\r\n\
}\r\n\
--changesetresponse_c46105b1-2b39-4326-ad9d-4400a05b3d1a--\r\n\
--batchresponse_9a307bd5-3bc8-4d3f-a0ef-15ec32654258--';

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

    it('invokes success callback with guid server response on create', function(done) {
        var stub = stubAjaxWithResponse(GUID_RESPONSE);

        odata.submit({
          data: {
            created: [{}, {}],
            updated: [],
            destroyed: []
          },
          success: function(result, type) {
            if (type == 'create') {
              assert.equal(result.length, 2);
              assert.equal(result[0].Id, 'd8e301d7-8160-49ad-afbe-51d53c92e94a');
              assert.equal(result[1].Id, '78176875-e992-4a39-a330-1ebe0e4cb1a6');

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
              assert.equal(result[0].__error, true);
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
              assert.equal(result[0].__error, true);
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

    it('merges request data with response data', function(done) {
        var stub = stubAjaxWithResponse(SUCCESS_RESPONSE);

        odata.submit({
          data: {
            created: [],
            updated: [{ name: 'foo'}, {}],
            destroyed: []
          },
          success: function(result, type) {
            if (type == 'update') {
              assert.equal(result.length, 2);
              assert.equal(result[0].name, 'foo');
              done();
            }
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
              assert.equal(result[0].__error, true);
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

describe('DataSource', function() {

  var guid = kendo.guid();
  var emptyGuid = guid.replace(/\w/g, '0');

  it('keeps failed inserted items in dirty state', function(done) {
    var dataSource = new kendo.data.DataSource({
      batch: true,
      schema: {
        model: {
          id: 'id',
          fields: {
            id: { defaultValue: emptyGuid }
          }
        }
      },
      transport: {
        useTransaction: false,
        read: function() {
        },
        submit: function(e) {
         e.success([
           { __error: true },
           { id: guid }
         ], 'create');
        }
      }
    });

    dataSource.add({ text: 'fails' });
    dataSource.add({ text: 'succeeds' });

    dataSource.sync()
      .then(function() {

        assert.equal(dataSource.at(0).get('id'), emptyGuid);
        assert.equal(dataSource.at(0).isNew(), true);

        assert.equal(dataSource.at(1).get('id'), guid);
        assert.equal(dataSource.at(1).isNew(), false);

        done();
      })
  });

  it('keeps failed updated items in dirty state', function(done) {
    var dataSource = new kendo.data.DataSource({
      batch: true,
      schema: {
        model: { id: 'id' }
      },
      transport: {
        useTransaction: false,
        read: function(options) {
          options.success([
            { id: 0, text: '0' },
            { id: 1, text: '1' }
          ])
        },
        submit: function(e) {
         e.success([
           { __error: true },
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
        model: { id: 'id' }
      },
      transport: {
        useTransaction: false,
        read: function(options) {
          options.success([
            { id: 1, text: '0' },
            { id: 2, text: '1' }
          ])
        },
        submit: function(e) {
         e.success([
           { __error: true },
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
        model: { id: 'id' }
      },
      transport: {
        useTransaction: false,
        read: function(options) {
          options.success([
            { id: 1, text: '0' },
            { id: 2, text: '1' }
          ])
        },
        submit: function(e) {
         e.success([
           { __error: true },
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

  it('supports nested objects', function(done) {
    var item = {
      "FloorPlan":{
        "Id":"00ffaedf-11b8-4f0b-81ea-e0bfa94b7f9c",
        "PropertyId":"cc578123-3673-43db-87c0-25ae2f00e3df",
        "CreatedById":"4e60e633-0f43-4eae-8b2b-4e976f3bed02",
        "Name":"2+11",
        "SquareFootage":650,
        "Bedrooms":"2.0",
        "Bathrooms":"1.0",
        "Notes":null,
        "TotalUnits":12,
        "DateCreated":"2015-08-26T21:42:49.293",
        "DateUpdated":"2015-09-11T12:22:26.193"
      },"Id":"c2704ac5-f85b-4b9d-9f49-b25cf6501098",
      "ScenarioId":"ac4c606d-bdce-49f4-9c61-2266d78e8cac",
      "FloorPlanId":"00ffaedf-11b8-4f0b-81ea-e0bfa94b7f9c",
      "MarketRent":"1265.0000",
      "RentInflation":"0.03",
      "ShouldRaiseRentAnnually":true,
      "StandardLeaseTerm":36,
      "MonthsVacant":1,
      "TurnoverCosts":"250.0000",
      "RenovationCosts":"1500.0000",
      "RenovationTime":0,
      "CostInflation":"0.03",
      "DateCreated":"2015-09-06T02:42:49.34",
      "DateUpdated":"2016-04-20T07:01:05.843"
    };

    var dataSource = new kendo.data.DataSource({
      batch: true,
      schema: {
        model: {
          id: 'Id',
          fields: {
            'FloorPlan.Name': { type: 'string' }
          }
        },
        data: kendo.data.schemas['odata'].data
      },
      transport: {
        useTransaction: false,
        read: function(options) {
          options.success(
            {
              "odata.count":"1","value":[ item ]
            });
        },
        submit: function(e) {
         e.success([
           $.extend({}, item,
           {
             "Id":"c2704ac5-f85b-4b9d-9f49-b25cf6501098",
             "ScenarioId":"ac4c606d-bdce-49f4-9c61-2266d78e8cac",
             "FloorPlanId":"00ffaedf-11b8-4f0b-81ea-e0bfa94b7f9c",
             "MarketRent":"1290",
             "RentInflation":"0.03",
             "ShouldRaiseRentAnnually":true,
             "StandardLeaseTerm":36,
             "MonthsVacant":1,
             "TurnoverCosts":"250",
             "RenovationCosts":"1500",
             "RenovationTime":0,
             "CostInflation":"0.03",
             "DateCreated":"2015-09-06T06:42:49.34Z",
             "DateUpdated":"2016-04-20T07:52:11.3638222+00:00"
           })
         ], 'update');
        }
      }
    });

    dataSource.fetch(function() {
      dataSource.at(0).set('MarketRent', '1290');
      dataSource.sync()
        .then(function() {
          assert.equal(dataSource.at(0).FloorPlan.Name, '2+11');
          assert.equal(dataSource.at(0).MarketRent, '1290');
          assert.equal(dataSource.at(0).dirty, false);

          done();
        })
    })
  })
});
