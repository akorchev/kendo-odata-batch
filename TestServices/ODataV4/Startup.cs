using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(ODataV4.Startup))]

namespace ODataV4
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
