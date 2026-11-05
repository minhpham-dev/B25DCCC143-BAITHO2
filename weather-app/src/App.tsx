import { useCallback, useEffect, useRef, useState } from 'react';
import { CITIES } from './cities';
import type { City } from './cities';
import { CityList } from './components/CityList';
import { WeatherPanel } from './components/WeatherPanel';
import { usePersistentState } from './hooks/usePersistentState';
import { DEFAULT_THEME, describeWeather, fetchWeather } from './weather';
import type { WeatherData } from './weather';
import './App.css';

type Status = 'idle' | 'loading' | 'error' | 'success';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = usePersistentState<'C' | 'F'>('weather-unit', 'C');
  const [favorites, setFavorites] = usePersistentState<string[]>('weather-favorites', []);
  const [query, setQuery] = useState('');
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback((city: City) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setStatus('loading');
    setData(null);
    setError(null);

    fetchWeather(city, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || (err instanceof DOMException && err.name === 'AbortError')) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        setStatus('error');
      });
  }, []);

  useEffect(() => () => requestRef.current?.abort(), []);

  const handleSelect = (city: City) => {
    setSelectedCity(city);
    load(city);
  };

  const handleRetry = () => {
    if (selectedCity) load(selectedCity);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const theme =
    status === 'success' && data ? describeWeather(data.current.weatherCode).theme : DEFAULT_THEME;

  return (
    <div className={`app theme-${theme}${selectedCity ? '' : ' app--no-selection'}`}>
      <div className="app__inner">
        <CityList
          cities={CITIES}
          selectedId={selectedCity?.id ?? null}
          favorites={favorites}
          query={query}
          onQueryChange={setQuery}
          onSelect={handleSelect}
          onToggleFavorite={toggleFavorite}
        />
        <WeatherPanel
          city={selectedCity}
          status={status}
          data={data}
          error={error}
          unit={unit}
          onUnitChange={setUnit}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}
