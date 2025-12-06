# AI Agent Instructions for ReactCSharpAndDBApp

## Project Overview
This is a **.NET 10 ASP.NET Core** web application combining a React frontend with a C# backend and database layer. The project is in early development stages with a minimal baseline setup.

## Architecture & Key Components

### Current Structure
- **`Program.cs`**: Application entry point using minimal APIs pattern. Handles WebApplication configuration and endpoint routing.
- **`appsettings.json`** / **`appsettings.Development.json`**: Configuration for logging and runtime settings. Development profile enables detailed logging.
- **`launchSettings.json`**: Defines HTTPS (port 7041) and HTTP (port 5062) run configurations with auto-browser launch in Development mode.
- **`.csproj`**: Configured for .NET 10.0 with nullable reference types (`<Nullable>enable</Nullable>`) and implicit usings enabled.

### Expected Architecture Pattern
This project is expected to expand with:
1. **API Controllers/Endpoints** in `Program.cs` or dedicated controller directories
2. **Data Models** (domain entities for database mapping)
3. **Database Layer** (likely using Entity Framework Core given C# + DB emphasis)
4. **React Frontend** (likely as a SPA in a separate `ClientApp` or `wwwroot` folder)

## Key Conventions & Patterns

### Minimal APIs Pattern
This codebase uses ASP.NET Core's **minimal APIs** style (favored in .NET 6+). Add new endpoints directly in `Program.cs` or extracted to extension methods:
```csharp
app.MapGet("/api/resource", handler).Produces<ResourceDto>();
app.MapPost("/api/resource", handler).Accepts("application/json");
```

### Configuration Management
- Development-specific settings override base `appsettings.json` 
- Environment variables set via `launchSettings.json` ASPNETCORE_ENVIRONMENT determines loaded profile
- Access config in handlers via dependency injection: `IConfiguration`

### Logging
Default log level is "Information" with ASP.NET Core framework logs suppressed to "Warning". Use `ILogger<T>` for structured logging.

## Build & Run Commands

### Run Development Server
```powershell
dotnet run
```
Launches with HTTPS on 7041 and HTTP on 5062, auto-opening browser.

### Build Project
```powershell
dotnet build
```

### Run Tests (when added)
```powershell
dotnet test
```

### Restore Dependencies
```powershell
dotnet restore
```

## Critical Patterns & Integration Points

### Entity Framework Core Integration (Expected)
When adding database support:
- Define `DbContext` class inheriting from `DbContext`
- Register via `builder.Services.AddDbContext<YourContext>()`
- Use migrations: `dotnet ef migrations add MigrationName` → `dotnet ef database update`

### React Frontend Integration
- React app should be built and deployed to `wwwroot` folder for static serving
- Backend API endpoints should be prefixed with `/api/` to avoid conflicts with SPA routing
- CORS middleware may need configuration if frontend runs on different port during development

### Dependency Injection
ASP.NET Core's built-in DI container is used. Register services in `Program.cs`:
```csharp
builder.Services.AddScoped<IMyService, MyService>();
builder.Services.AddSingleton<ISingletonService, SingletonService>();
```

## Developer Workflow Notes

- **Hot Reload**: `dotnet watch` enables file-watching during development
- **Port Conflicts**: If ports 5062/7041 are in use, modify `launchSettings.json`
- **Nullable Reference Types**: Enabled by default; be explicit with `?` on potentially null values
- **Implicit Usings**: Common namespaces auto-imported (e.g., `System`, `System.Linq`); check `.csproj` for details

## When Adding New Features

1. **New API Endpoints**: Add to `Program.cs` or create controller files in an `Controllers` folder
2. **Database Entities**: Create `Models` folder; define entities and register in `DbContext`
3. **Business Logic**: Create `Services` folder for reusable logic; register in DI container
4. **React Components**: Organize in `ClientApp/src/components` or similar; ensure API calls target `/api/` base path

---

**Last Updated**: December 2025 | **Framework**: .NET 10, ASP.NET Core | **Target**: React + C# + Database
