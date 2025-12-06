using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ReactCSharpAndDBApp.Data;
using ReactCSharpAndDBApp.Models;

namespace ReactCSharpAndDBApp.Pages
{
    public class IndexModel : PageModel
    {
        private readonly AppDbContext _db;

        public IndexModel(AppDbContext db)
        {
            _db = db;
        }

        public string Message { get; private set; } = "Razor";
        public string Environment { get; private set; } = string.Empty;
        public List<DataRecord> Records { get; private set; } = new();
        public string? ErrorMessage { get; private set; }

        public async Task OnGetAsync()
        {
            Environment = HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Hosting.IWebHostEnvironment)) is Microsoft.AspNetCore.Hosting.IWebHostEnvironment env
                ? env.EnvironmentName
                : "Unknown";

            try
            {
                // Safely attempt to load records from the database. If the DB is unavailable,
                // catch the exception and display a friendly message instead of crashing the app.
                Records = await _db.test_data_records.AsNoTracking().ToListAsync();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                Records = new List<DataRecord>();
            }
        }
    }
}
