import React, { useState, useEffect, useRef } from 'react';
import { Search, Thermometer, Wind, Droplets, Sun } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { searchCities } from './weatherservice';

const MainContent = ({ weather, onSearch, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Debounce search input
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length >= 3) {
                const results = await searchCities(searchTerm);
                setSuggestions(results);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const cityQuery = `${suggestion.name}, ${suggestion.country}`;
        setSearchTerm(suggestion.name);
        onSearch(cityQuery);
        setShowSuggestions(false);
    };

    if (!weather && loading) {
        return (
            <div className="flex-1 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-accent"></div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="flex-1 flex flex-col gap-6 p-1 md:p-0 w-full">
            {/* Search Bar */}
            <div className="relative w-full m-2" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search for cities"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length >= 3 && setShowSuggestions(true)}
                        className="w-full bg-dashboard-card text-white text-sm rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-dashboard-accent/50 placeholder-dashboard-muted"
                    />

                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-muted hover:text-white"
                    >
                        <Search size={18} />
                    </button>
                </form>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dashboard-card border border-dashboard-bg rounded-xl shadow-xl z-50 overflow-hidden">
                        {suggestions.map((city, index) => (
                            <div
                                key={`${city.lat}-${city.lon}-${index}`}
                                onClick={() => handleSuggestionClick(city)}
                                className="px-4 py-3 hover:bg-dashboard-bg cursor-pointer text-sm text-white flex justify-between items-center transition-colors"
                            >
                                <span>{city.name}</span>
                                <span className="text-dashboard-muted text-xs">
                                    {city.state ? `${city.state}, ` : ''}
                                    {city.country}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-center px-8 py-8 md:py-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        {weather.current.city}
                    </h1>
                    <p className="text-dashboard-muted text-sm">
                        Chance of rain: {weather.current.chanceOfRain}%
                    </p>
                    <div className="mt-8">
                        <span className="text-5xl md:text-6xl font-bold text-white">
                            {weather.current.temp}°C
                        </span>
                    </div>
                </div>

                <div className="mt-6 md:mt-0">
                    <WeatherIcon
                        condition={weather.current.condition}
                        size={140}
                        className="drop-shadow-2xl"
                    />
                </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-dashboard-card rounded-[30px] p-6">
                <h3 className="text-dashboard-muted uppercase text-xs font-bold tracking-wider mb-4">
                    Today's Forecast
                </h3>

                <div className="flex justify-between items-center divide-x divide-dashboard-bg/50 overflow-x-auto pb-2 md:pb-0">
                    {weather.hourly.map((hour, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-2 px-4 min-w-20"
                        >
                            <span className="text-dashboard-muted text-xs font-medium whitespace-nowrap">
                                {hour.time}
                            </span>

                            <WeatherIcon condition={hour.condition} size={32} />

                            <span className="text-white text-lg font-bold">{hour.temp}°C</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Air Conditions */}
            <div className="bg-dashboard-card rounded-[30px] p-6 ">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-dashboard-muted uppercase text-xs font-bold tracking-wider">
                        Air Conditions
                    </h3>

                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Real Feel */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-dashboard-muted text-sm">
                            <Thermometer size={16} />
                            <span>Real Feel</span>
                        </div>

                        <span className="text-white text-xl font-bold pl-6">
                            {weather.current.realFeel}°
                        </span>
                    </div>

                    {/* Wind */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-dashboard-muted text-sm">
                            <Wind size={16} />
                            <span>Wind</span>
                        </div>

                        <span className="text-white text-xl font-bold pl-6">
                            {weather.current.windSpeed} km/h
                        </span>
                    </div>

                    {/* Chance of Rain */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-dashboard-muted text-sm">
                            <Droplets size={16} />
                            <span>Chance of rain</span>
                        </div>

                        <span className="text-white text-xl font-bold pl-6">
                            {weather.current.chanceOfRain}%
                        </span>
                    </div>

                    {/* UV Index */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-dashboard-muted text-sm">
                            <Sun size={16} />
                            <span>UV Index</span>
                        </div>

                        <span className="text-white text-xl font-bold pl-6">
                            {weather.current.uvIndex}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;
