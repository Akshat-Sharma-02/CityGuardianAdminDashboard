/**
 * -------------------------------------------------------------
 * Application Configuration & API Keys
 * -------------------------------------------------------------
 * 
 * Use this file to manage all external API keys, third-party 
 * service URLs, and environment-specific toggles. 
 * 
 * To use these variables in your components:
 * 1. import config from '../config';
 * 2. Example: <TileLayer url={config.MAP_TILE_PROVIDER} />
 */

const config = {
  // -----------------------------------------------------------
  // Geolocation & Maps
  // -----------------------------------------------------------
  
  // Default Map Provider (Currently: Google Maps Standard)
  // Options: 
  // - OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // - Google Standard: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
  // - Google Satellite: "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
  MAP_TILE_PROVIDER: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
  
  // Map Attribution Display
  MAP_ATTRIBUTION: "&copy; Google",

  // -----------------------------------------------------------
  // External APIs (Put your 3rd party API Keys here)
  // -----------------------------------------------------------
  
  // Example API Key structure
  // MAPBOX_API_KEY: "pk.eyJ1IjoieW91cm5hbWUiLCJhIjoiY2...etc",
  // WEATHER_API_KEY: "your_weather_api_key_here",
};

export default config;
