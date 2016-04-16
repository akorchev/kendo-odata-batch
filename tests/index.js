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

    afterEach(function() {
      if ($.ajax.restore) {
        $.ajax.restore();
      }
    });
});
