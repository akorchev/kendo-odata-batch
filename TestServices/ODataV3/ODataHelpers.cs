#if ODATAV3
using Microsoft.Data.OData;
#else
using Microsoft.OData.Core;
#endif

namespace TestServices
{
    /// <summary>
    /// A set of useful correctly formatted OData errors.
    /// </summary>
    public static class ODataErrors
    {
        public static ODataError EntityNotFound(string entityName)
        {
            return new ODataError()
            {
                Message = $"Cannot find {entityName}",
#if ODATAV3
                MessageLanguage = "en-US",
#endif
                ErrorCode = "Entity Not Found"
            };
        }

        public static ODataError DeletingLinkNotSupported(string navigation)
        {
            return new ODataError()
            {
                Message = $"Deleting a '{navigation}' link is not supported.",
#if ODATAV3
                MessageLanguage = "en-US",
#endif
                ErrorCode = "Deleting link failed."
            };
        }

        public static ODataError CreatingLinkNotSupported(string navigation)
        {
            return new ODataError()
            {
                Message = $"Creating a '{navigation}' link is not supported.",
#if ODATAV3
                MessageLanguage = "en-US",
#endif
                ErrorCode = "Creating link failed."
            };
        }
    }
}