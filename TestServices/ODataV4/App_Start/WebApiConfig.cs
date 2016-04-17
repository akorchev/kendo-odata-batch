using ODataV4.Models;
using System.Web.Http;
using System.Web.OData.Batch;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;

namespace ODataV4
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API routes
            config.MapHttpAttributeRoutes();

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Airline>("Airlines").EntityType.HasKey(c => c.AirlineCode);
            config.MapODataServiceRoute("odata", "", builder.GetEdmModel(), new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));

        }

    }

}