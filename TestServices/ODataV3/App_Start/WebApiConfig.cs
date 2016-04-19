using ODataV3.Models;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.OData.Batch;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;

namespace ODataV3
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);
            
            // Web API routes
            config.MapHttpAttributeRoutes();

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Product>("Products").EntityType.HasKey(c => c.ID);
            config.Routes.MapODataServiceRoute("odata", "", builder.GetEdmModel(), new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));

        }

    }

}