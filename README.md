# OData Batch operations with Kendo UI

KendoUI's DataSource supports batching operations. But Telerik never mapped their batching support to OData's built-in batching. AdvancedREI paid to have one of the original members of the Kendo UI team fix this problem, and now we're making it available free to everyone under the MIT license.

## Usage

Include "kendo.data.odata-batch.js" in your page after all other Kendo UI scripts. Use 'odata-v4' or 'odata' as data source type.

The endpoint of the OData service is either set via the `batchUrl` option or determined from `options.read.url`. In addition some v3 services may require specifying the type of the entity via the [type option](index.html#L169). You'll need to check you're V3 feed to see the type names to use.

> The original v2 'odata' transport is replaced with a v3 one.

## Running the tests

1. Make sure NodeJS is installed
2. Clone the repository
3. Run `npm install`
4. Run `npm test`

## Running the demo

1. Make sure NodeJS is installed
2. Clone the repository
3. Run `npm install`
4. Run `npm start`
5. Open `http://localhost:3000/static/` in your browser
