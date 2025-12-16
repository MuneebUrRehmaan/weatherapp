import React, { useEffect, useState, useCallback } from 'react';
import MainContent from './components/MainContent.jsx';
import WeeklyForecast from './components/WeeklyForecast';
import {fetchWeatherData} from './components/weatherservice.js'

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Karachi');

  const loadWeather = useCallback(async (searchCity) => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(searchCity);
      setWeatherData(data);
    } catch (error) {
      console.error("Failed to load weather data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(city);
  }, []); // Initial load only

  const handleSearch = (newCity) => {
    setCity(newCity);
    loadWeather(newCity);
  };

  return (
    <div className="min-h-screen bg-img  flex flex-col lg:flex-row p-4 gap-6 overflow-hidden">
      {/* Sidebar */}
      {/* <Sidebar className="hidden lg:flex w-24 shrink-0" /> */}
      
      {/* Mobile Navbar */}
      {/* <div className="lg:hidden bg-dashboard-card p-4 rounded-xl flex justify-between items-center text-white">
        <span className="font-bold text-xl">Weather</span>
        <div className="text-xs text-dashboard-muted">Dashboard</div>
      </div> */}

      <div className="flex flex-1 flex-col lg:flex-row gap-6 overflow-hidden h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto lg:overflow-visible">
          <MainContent 
            weather={weatherData} 
            onSearch={handleSearch} 
            loading={loading}
          />
        </div>

        {/* Weekly Forecast */}
        <div className="w-full lg:w-[350px] shrink-0 h-full">
          {loading ? (
            <div className="bg-dashboard-card/90 rounded-[30px] p-6 h-full flex items-center justify-center">
              <span className="text-dashboard-muted">Loading forecast...</span>
            </div>
          ) : (
            weatherData && <WeeklyForecast forecast={weatherData.daily} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
