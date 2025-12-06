using Microsoft.EntityFrameworkCore;
using ReactCSharpAndDBApp.Data;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Database Configuration ---
// IMPORTANT: Replace {YOUR_PASSWORD} with your actual MySQL root password.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
    "Server=localhost;Port=3306;Database=MyTestDataDb;User=root;Password=Password1!;";

// Add DbContext for MySQL connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString)
);

// --- 2. Razor Pages Configuration ---
// Add services required for Razor Pages (server-side HTML rendering)
builder.Services.AddRazorPages();

var app = builder.Build();

// --- 3. Middleware Configuration ---

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// --- 4. Map Endpoints ---
// Map the Razor Pages endpoints
app.MapRazorPages();

// Minimal API endpoint to return locations as JSON for the client-side React app
app.MapGet("/api/locations", async (AppDbContext db) =>
{
    var list = await db.locations
        .Select(l => new { l.Id, l.Name, l.Latitude, l.Longitude, l.Description })
        .ToListAsync();

    return Results.Json(list);
});

// Fallback for simple home page access
app.MapGet("/", context =>
{
    // Redirect to the Index Razor Page which handles the dynamic content
    context.Response.Redirect("/Index");
    return Task.CompletedTask;
});

app.Run();