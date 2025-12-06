/**
 * @file: locations.js
 * @description: The main Locations React application component, converted to pure JavaScript 
 * (using React.createElement) to comply with Content Security Policy (CSP).
 */

// Shorthand for React.createElement for cleaner code
const e = React.createElement;

// Simple Card Component for a single location (JSX converted to e())
const LocationCard = ({ location }) => {
    return e('div', { className: "bg-white p-4 shadow-lg rounded-xl transition hover:shadow-2xl" },
        e('h3', { className: "text-xl font-semibold text-indigo-700" }, location.name),
        e('p', { className: "text-gray-600 mt-1" }, `Coordinates: ${location.coordinates}`),
        e('button', { className: "mt-3 bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600 transition duration-150" },
            "View Map"
        )
    );
};

// Define the main React component (JSX converted to e())
const LocationsApp = () => {
    // State to hold location data fetched from server
    const [locations, setLocations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Load locations from the backend API on mount
    React.useEffect(() => {
        let mounted = true;
        fetch('/api/locations')
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText || 'Fetch error');
                return res.json();
            })
            .then((data) => {
                if (!mounted) return;
                // Ensure data items are normalized for the UI
                const normalized = data.map(d => {
                    // Build a human-readable coordinates string if lat/lon present
                    let coordinates = '';
                    const lat = d.latitude;
                    const lon = d.longitude;
                    if (lat !== null && lat !== undefined && lon !== null && lon !== undefined) {
                        // Format to 4 decimal places for readability
                        try {
                            const latNum = Number(lat);
                            const lonNum = Number(lon);
                            coordinates = `${latNum.toFixed(4)}, ${lonNum.toFixed(4)}`;
                        } catch (e) {
                            coordinates = `${lat}, ${lon}`;
                        }
                    } else {
                        coordinates = 'N/A';
                    }

                    return {
                        id: d.id,
                        name: d.name,
                        latitude: d.latitude,
                        longitude: d.longitude,
                        description: d.description,
                        coordinates: coordinates
                    };
                });
                setLocations(normalized);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err.message || String(err));
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => { mounted = false; };
    }, []);

    // Render loading, error, or the grid of location cards
    return e('div', { className: "p-8 max-w-6xl mx-auto" },
        e('h1', { className: "text-4xl font-extrabold text-gray-800 mb-6 border-b-2 pb-2" }, "Global Locations Dashboard"),
        e('p', { className: "text-gray-600 mb-8" }, "This is a fully interactive React component hosted within the ASP.NET Core application."),

        loading ? e('div', { className: "text-center p-8" }, 'Loading locations...') :
        (error ? e('div', { className: "text-red-600 p-4" }, `Error loading locations: ${error}`) :
            (locations.length === 0 ? e('p', null, 'No locations available.') :
                e('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
                    locations.map(location => e(LocationCard, { key: location.id, location: location }))
                )
            )
        ),

        e('div', { className: "mt-10 p-4 border-l-4 border-indigo-400 bg-indigo-50 text-indigo-800 rounded-lg" },
            e('p', { className: "font-medium" }, "Next Step:"),
            e('p', { className: "text-sm" }, "This UI now fetches real location data from the server API at /api/locations.")
        )
    );
};

// Find the root element and render the application
const domContainer = document.querySelector('#locations_root');
if (domContainer) {
    // Use createRoot for React 18+ compatibility
    const root = ReactDOM.createRoot(domContainer);
    root.render(
        e(React.StrictMode, null,
            e(LocationsApp, null)
        )
    );
} else {
    console.error("Could not find the root element with ID 'locations_root'.");
}