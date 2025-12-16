import React from 'react';
import WeatherIcon from './WeatherIcon';

const WeeklyForecast = ({ forecast }) => {
  return (
    <div className="bg-dashboard-card/90 rounded px-6 py-5 h-full flex flex-col">
      <h3 className="text-dashboard-muted uppercase text-xs font-bold tracking-wider mb-6">
        Weekly Forecast
      </h3>

      <div className="flex flex-col gap-6 lg:gap-14 overflow-y-auto">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-dashboard-muted text-sm font-medium w-16">
              {day.day}
            </span>

            <div className="flex items-center gap-3 flex-1">
              <WeatherIcon condition={day.condition} size={24} />
              <span className="text-white text-lg font-mediu">{day.condition}</span>
            </div>

            <div className="text-white text-sm font-semibold">
              <span className="mr-1">{day.high}</span>
              <span className="text-dashboard-muted">/{day.low}</span>
            </div>
          </div>
        ))}

        {forecast.length === 0 && (
          <div className="text-center text-dashboard-muted text-sm py-10">
            Loading forecast...
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyForecast;
