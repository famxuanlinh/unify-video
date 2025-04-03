export const MapConfig = Object.freeze({
  GOOGLE_MAP_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '',
  HERE_MAP_API_KEY: process.env.NEXT_PUBLIC_HERE_MAP_API_KEY,
  DEFAULT_CENTER: {
    lat: 10,
    lng: 10
  }
});
