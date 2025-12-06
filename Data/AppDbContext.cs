using Microsoft.EntityFrameworkCore;
using ReactCSharpAndDBApp.Models;

namespace ReactCSharpAndDBApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // A DbSet represents a collection of DataRecord objects that can be queried from the database.
        public DbSet<DataRecord> test_data_records { get; set; } = default!;

        // Locations table mapping
        public DbSet<ReactCSharpAndDBApp.Models.Location> locations { get; set; } = default!;
    }
}