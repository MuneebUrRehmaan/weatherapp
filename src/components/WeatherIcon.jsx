import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudSun } from 'lucide-react';

const WeatherIcon = ({ condition, className = "", size = 24 }) => {
  const normalizedCondition = condition.toLowerCase();

  if (normalizedCondition.includes('storm')) {
    return <CloudLightning size={size} className={`text-yellow-400 ${className}`} />;
  }
  if (normalizedCondition.includes('rain')) {
    return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
  }
  if (normalizedCondition.includes('snow')) {
    return <Snowflake size={size} className={`text-cyan-200 ${className}`} />;
  }
  if (normalizedCondition.includes('partly')) {
    return <CloudSun size={size} className={`text-orange-300 ${className}`} />;
  }
  if (normalizedCondition.includes('cloud')) {
    return <Cloud size={size} className={`text-gray-300 ${className}`} />;
  }

  // Default to sunny
  return <Sun size={size} className={`text-yellow-400 ${className}`} />;
};

export default WeatherIcon;
