using Microsoft.Data.OData;
using ODataV3.Models;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Query;
using TestServices;

namespace ODataV3.Controllers
{

    public class LedgerEntriesController : ODataController
    {

        private static ODataValidationSettings _validationSettings = new ODataValidationSettings();

        // GET: odata/LedgerEntries
        [EnableQuery]
        public async Task<IHttpActionResult> GetLedgerEntries(ODataQueryOptions<LedgerEntry> queryOptions)
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

            return Ok(Enumerable.Empty<LedgerEntry>());
        }

        // GET: odata/LedgerEntries(5)
        [EnableQuery]
        public async Task<IHttpActionResult> GetLedgerEntry([FromODataUri] System.Guid key, ODataQueryOptions<LedgerEntry> queryOptions)
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

            return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));
        }

        // PUT: odata/LedgerEntries(5)
        public async Task<IHttpActionResult> Put([FromODataUri] System.Guid key, LedgerEntry LedgerEntry)
        {
            Validate(LedgerEntry);

            if (!ModelState.IsValid || LedgerEntry.Id == Guid.Empty)
            {
                return BadRequest(ModelState);
            }
            LedgerEntry.DateUpdated = DateTime.Now;

            return Updated(LedgerEntry);
        }

        // POST: odata/LedgerEntries
        public async Task<IHttpActionResult> Post(LedgerEntry LedgerEntry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (LedgerEntry.Id == Guid.Empty)
            {
                LedgerEntry.Id = Guid.NewGuid();
            }
            LedgerEntry.DateUpdated = DateTime.Now;

            return Created(LedgerEntry);
        }

        // PATCH: odata/LedgerEntries(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] System.Guid key, LedgerEntry LedgerEntry)
        {
            Validate(LedgerEntry);

            if (!ModelState.IsValid || LedgerEntry.Id == Guid.Empty)
            {
                return BadRequest(ModelState);
            }

            if (LedgerEntry.Id == Guid.Empty)
            {
                LedgerEntry.Id = Guid.NewGuid();
            }
            LedgerEntry.DateUpdated = DateTime.Now;

            return Updated(LedgerEntry);
        }

        // DELETE: odata/LedgerEntries(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] System.Guid key)
        {
            return StatusCode(HttpStatusCode.NoContent);
        }

    }

}