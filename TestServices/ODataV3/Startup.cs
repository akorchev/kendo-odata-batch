using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(ODataV3.Startup))]

namespace ODataV3
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {


        }
    }
}
