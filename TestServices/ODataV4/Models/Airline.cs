namespace ODataV4.Models
{
    public class Airline
    {

        #region Properties

        public string AirlineCode { get; set; }

        public string Name { get; set; }

        #endregion

        #region Constructors

        /// <summary>
        /// 
        /// </summary>
        /// <remarks>
        /// RWM: OData needs a parameterless constructor.
        /// </remarks>
        public Airline()
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="airlineCode"></param>
        /// <param name="name"></param>
        public Airline(string airlineCode, string name)
        {
            AirlineCode = airlineCode;
            Name = name;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Clones the object.
        /// </summary>
        /// <returns>Returns a clone of the current object.</returns>
        public Airline Clone()
        {
            var copy = (Airline)MemberwiseClone();
            return copy;
        }

        #endregion

    }

}