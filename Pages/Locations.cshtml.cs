using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ReactCSharpAndDBApp.Data;
using ReactCSharpAndDBApp.Models;

namespace ReactCSharpAndDBApp.Pages
{
    public class LocationsModel : PageModel
    {
        private readonly AppDbContext _db;

        public LocationsModel(AppDbContext db)
        {
            _db = db;
        }

        public List<Location> Locations { get; private set; } = new();
        public string? ErrorMessage { get; private set; }

        public async Task OnGetAsync()
        {
            try
            {
                Locations = await _db.locations.AsNoTracking().ToListAsync();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                Locations = new List<Location>();
            }
        }
    }
}