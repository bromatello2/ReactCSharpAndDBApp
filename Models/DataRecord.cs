using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactCSharpAndDBApp.Models
{
    // This model will map to a table named 'DataRecords' in MySQL
    public class DataRecord
    {
        // Primary Key
        [Key] 
        public int Id { get; set; }

        // A simple string field
        [Column(TypeName = "varchar(100)")]
        public string Name { get; set; } = string.Empty;

        // A date/time field
        public DateTime BirthDate { get; set; }
    }
}