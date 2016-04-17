using System;

namespace ODataV3.Models
{

    /// <summary>
    /// 
    /// </summary>
    public class Product
    {

        #region Properties

        public int ID { get; set; }

        public string Name { get; set;  }

        public string Description { get; set; }

        public DateTime ReleaseDate { get; set; }

        public DateTime? DiscontinuedDate { get; set; }

        public decimal Rating { get; set; }

        public decimal Price { get; set; }

        #endregion

        #region Constructors

        /// <summary>
        /// 
        /// </summary>
        /// <remarks>
        /// RWM: OData needs a parameterless constructor.
        /// </remarks>
        public Product()
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <param name="releaseDate"></param>
        /// <param name="discontinuedDate"></param>
        /// <param name="rating"></param>
        /// <param name="price"></param>
        public Product(int id, string name, string description, DateTime releaseDate, DateTime? discontinuedDate, decimal rating, decimal price)
        {
            ID = id;
            Name = name;
            Description = description;
            ReleaseDate = releaseDate;
            DiscontinuedDate = discontinuedDate;
            Rating = rating;
            Price = price;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Clones the object.
        /// </summary>
        /// <returns>Returns a clone of the current object.</returns>
        public Product Clone()
        {
            var copy = (Product)MemberwiseClone();
            return copy;
        }

        #endregion

    }

}