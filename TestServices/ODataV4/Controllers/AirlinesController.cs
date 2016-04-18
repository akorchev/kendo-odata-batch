using Microsoft.OData.Core;
using ODataV4.Models;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.OData;
using System.Web.OData.Query;
using TestServices;

namespace ODataV4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AirlinesController : ODataController
    {

        #region Private Members

        private static ODataValidationSettings _validationSettings = new ODataValidationSettings();
        private static List<Airline> _airlines = new List<Airline>();

        #endregion

        #region GET

        // GET: odata/Airlines
        [EnableQuery]
        public async Task<IHttpActionResult> GetAirlines(ODataQueryOptions<Airline> queryOptions)
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

            LoadAirlines();

            return Ok<IEnumerable<Airline>>(_airlines);
        }

        // GET: odata/Airlines(5)
        [EnableQuery]
        public async Task<IHttpActionResult> GetAirline([FromODataUri] string key, ODataQueryOptions<Airline> queryOptions)
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

            if (key == "FM") return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));

            LoadAirlines();
            var airline = _airlines.FirstOrDefault(c => c.AirlineCode == key);
            return Ok(airline);
        }

        #endregion

        #region PUT

        // PUT: odata/Airlines(5)
        public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<Airline> delta)
        {
            Validate(delta.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key == "MU") return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));

            LoadAirlines();
            var airline = _airlines.FirstOrDefault(c => c.AirlineCode == key);
            var clone = airline.Clone();

            delta.Put(clone);

            return Updated(clone);
        }

        #endregion

        #region POST

        // POST: odata/Airlines
        public async Task<IHttpActionResult> Post(Airline airline)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (airline.AirlineCode == "AF") return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(airline.AirlineCode));

            return Created(airline);
        }

        #endregion

        #region PATCH

        // PATCH: odata/Airlines(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<Airline> delta)
        {
            Validate(delta.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key == "AZ") return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));

            LoadAirlines();
            var airline = _airlines.FirstOrDefault(c => c.AirlineCode == key);
            var clone = airline.Clone();

            delta.Patch(clone);

            return Updated(clone);
        }

        #endregion

        #region DELETE

        // DELETE: odata/Airlines(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        {
            if (key == "AC") return Content(HttpStatusCode.NotFound, ODataErrors.EntityNotFound(key.ToString()));
            return StatusCode(HttpStatusCode.NoContent);

        }

        #endregion

        #region Private Methods

        private void LoadAirlines()
        {
            if (!_airlines.Any())
            {
                _airlines.Add(new Airline("AA", "American Airlines"));
                _airlines.Add(new Airline("FM", "Shanghai Airlines"));
                _airlines.Add(new Airline("MU", "China Eastern Airlines"));
                _airlines.Add(new Airline("AF", "Air France"));
                _airlines.Add(new Airline("AZ", "Alitalia"));
                _airlines.Add(new Airline("AC", "Air Canada"));
                _airlines.Add(new Airline("OS", "Austrian Airlines"));
                _airlines.Add(new Airline("TK", "Turkish Airlines"));
            }
        }

        #endregion

    }
}
