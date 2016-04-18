using Microsoft.Data.OData;
using ODataV3.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.OData;
using System.Web.Http.OData.Query;
using TestServices;

namespace ODataV3.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProductsController : ODataController
    {

        #region Private Members

        private static ODataValidationSettings _validationSettings = new ODataValidationSettings();
        private static List<Product> _products = new List<Product>();

        #endregion

        #region GET

        // GET: odata/Products
        [EnableQuery]
        public async Task<IHttpActionResult> GetProducts(ODataQueryOptions<Product> queryOptions)
        {
            // validate the query.
            try
            {
                queryOptions.Validate(_validationSettings);
            }
            catch (ODataException ex)
            {
                return BadRequest(ex.Message);
            }

            LoadProducts();

            return Ok<IEnumerable<Product>>(_products);
        }

        // GET: odata/Products(5)
        [EnableQuery]
        public async Task<IHttpActionResult> GetProduct([FromODataUri] int key, ODataQueryOptions<Product> queryOptions)
        {
            // validate the query.
            try
            {
                queryOptions.Validate(_validationSettings);
            }
            catch (ODataException ex)
            {
                return BadRequest(ex.Message);
            }

            if (key == 1) return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));

            LoadProducts();
            var product = _products.FirstOrDefault(c => c.ID == key);
            return Ok(product);
        }

        #endregion

        #region PUT

        // PUT: odata/Products(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Product> delta)
        {
            Validate(delta.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key == 2) return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));

            LoadProducts();
            var product = _products.FirstOrDefault(c => c.ID == key);
            var clone = product.Clone();

            delta.Put(clone);

            return Updated(clone);
        }

        #endregion

        #region POST

        // POST: odata/Products
        public async Task<IHttpActionResult> Post(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (product.ID == 3) return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(product.ID.ToString()));

            return Created(product);
        }

        #endregion

        #region PATCH

        // PATCH: odata/Products(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Product> delta)
        {
            Validate(delta.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key == 4) return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));

            LoadProducts();
            var product = _products.FirstOrDefault(c => c.ID == key);
            var clone = product.Clone();

            delta.Patch(clone);

            return Updated(clone);
        }

        #endregion

        #region DELETE

        // DELETE: odata/Products(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            //RWM: Always fail on ID 3 for testing.
            if (key == 5) return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));
            return StatusCode(HttpStatusCode.NoContent);
        }

        #endregion

        #region Private Methods

        private void LoadProducts()
        {
            if (!_products.Any())
            {
                _products.Add(new Product(0, "Bread", "Whole grain bread", new DateTime(1992, 01, 01), null, 4, 2.5M));
                _products.Add(new Product(1, "Milk", "Low fat milk", new DateTime(1995, 10, 01), null, 3, 3.5M));
                _products.Add(new Product(2, "Vint Soda", "Americana Variety - Mix of 6 flavors", new DateTime(2000, 10, 01), null, 3, 20.9M));
                _products.Add(new Product(3, "Havina Cola", "The Original Key Lime Cola", new DateTime(2005, 01, 01), new DateTime(2006, 10, 01), 3, 19.9M));
                _products.Add(new Product(4, "Fruit Punch", "Mango flavor, 8.3 Ounce Cans (Pack of 24)", new DateTime(2003, 01, 05), null, 3, 22.99M));
                _products.Add(new Product(5, "Cranberry Juice", "16-Ounce Plastic Bottles (Pack of 12)", new DateTime(2006, 01, 01), null, 3, 22.8M));
                _products.Add(new Product(6, "Pink Lemonade", "36 Ounce Cans (Pack of 3)", new DateTime(2006, 11, 05), null, 3, 18.8M));
                _products.Add(new Product(7, "DVD Player", "1080P Upconversion DVD Player", new DateTime(2006, 11, 15), null, 5, 35.88M));
                _products.Add(new Product(8, "LCD HDTV", "42 inch 1080p LCD with Built-in Blu-ray Disc Player", new DateTime(2008, 05, 08), null, 3, 1088.8M));
            }
        }

        #endregion


    }

}
