# Google Location Visualizer

Visualize your location history from Google Maps Timeline data in your browser.

Why did I build this? Previous tools don't work with the new JSON format Google now exports your data in. And I wanted some nice filters and a small (<800 lines of code), public, and privacy-respecting codebase.

![Screenshot of the location view](<./images/locations.png>)

## Features

- Filter by date/time
- Click on map marker to open detail popup
- Click on item in time list to move to location

## Instructions

1. **Export Your Data**:
   - Android: Go to Settings > Location > Location Services > Timeline > Export Timeline Data.
   - iOS: Open Google Maps > Your Timeline > Location And Privacy Settings > Export Timeline Data.
   - Web: Visit [Google Takeout](https://takeout.google.com/), select Location History, export once, then download and extract the ZIP file. Ensure cloud sync is enabled.

2. **Open Your Timeline.json File**: 
   - Use the file upload button to select your `Timeline.json` file. This file contains your Google location data. **Note:** Your data is processed locally in your browser and is not transmitted to any servers.

1. **Select a Date**: 
   - After uploading, use the date picker to choose a specific date for which you want to visualize the location data.

2. **Interact with the Map**: 
   - Click on any map marker to view detailed information about that location.
   - Use the time list to navigate directly to specific locations on the map.

## Uses

-   [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js)
-   [Shadcn UI](https://ui.shadcn.com)
-   [TailwindCSS](https://tailwindcss.com/)
-   [Vite](https://vitejs.dev/)
-   [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)
-   [SWC](https://swc.rs/)

## License

Apache-2.0