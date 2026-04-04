// This is a simple utility to fetch weather data from OpenWeatherMap
// You can use your own API key and location

const DEFAULT_CITY = "Tel Aviv";

// Fetch weather from the backend API, not directly from OpenWeatherMap
export async function fetchWeather(city = DEFAULT_CITY) {
  const url = `http://localhost:3001/weather?city=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}
