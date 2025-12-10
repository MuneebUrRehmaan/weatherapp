const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

/* Map OWM weather codes → type-safe string values */
const mapCondition = (id, cloudiness) => {
  if (id >= 200 && id < 300) return "Storm";
  if (id >= 300 && id < 600) return "Rainy";
  if (id >= 600 && id < 700) return "Snowy";
  if (id >= 700 && id < 800) return "Cloudy";
  if (id === 800) return "Sunny";
  if (id > 800) return cloudiness > 50 ? "Cloudy" : "Partly Cloudy";

  return "Sunny";
};

/* Autocomplete City Search */
export const searchCities = async (query) => {
  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) return [];

    return await response.json();
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

/* Fetch Weather + Forecast */
export const fetchWeatherData = async (city) => {
  try {
    // ---- Current Weather ----
    const weatherRes = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!weatherRes.ok) throw new Error("City not found");

    const weatherData = await weatherRes.json();

    // ---- Forecast Weather ----
    const forecastRes = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!forecastRes.ok) throw new Error("Forecast not found");

    const forecastData = await forecastRes.json();

    // ---- Normalize Current Condition ----
    const condition = mapCondition(
      weatherData.weather[0].id,
      weatherData.clouds.all
    );

    // ---- Hourly Forecast (Next 24 hours) ----
    const hourly = forecastData.list.slice(0, 8).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      }),
      temp: Math.round(item.main.temp),
      condition: mapCondition(item.weather[0].id, item.clouds.all),
    }));

    // ---- Daily Forecast Grouping ----
    const dailyMap = new Map();

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!dailyMap.has(dayName)) {
        dailyMap.set(dayName, {
          high: item.main.temp_max,
          low: item.main.temp_min,
          conditionId: item.weather[0].id,
          cloudiness: item.clouds.all,
        });
      } else {
        const entry = dailyMap.get(dayName);
        entry.high = Math.max(entry.high, item.main.temp_max);
        entry.low = Math.min(entry.low, item.main.temp_min);
      }
    });

    const daily = Array.from(dailyMap.entries()).map(([day, data]) => ({
      day,
      high: Math.round(data.high),
      low: Math.round(data.low),
      condition: mapCondition(data.conditionId, data.cloudiness),
    })).slice(0, 7);

    // ---- Extra Stats ----
    const uvIndex = Math.round((100 - weatherData.clouds.all) / 10);
    const chanceOfRain = Math.round((forecastData.list[0].pop || 0) * 100);

    return {
      current: {
        city: weatherData.name,
        temp: Math.round(weatherData.main.temp),
        condition,
        chanceOfRain,
        realFeel: Math.round(weatherData.main.feels_like),
        windSpeed: Math.round(weatherData.wind.speed * 3.6),
        uvIndex: uvIndex > 0 ? uvIndex : 1,
      },
      hourly,
      daily,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
