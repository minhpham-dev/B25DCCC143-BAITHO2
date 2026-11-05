import type { City } from './cities';

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  max: number;
  min: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    time: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export const buildUrl = (city: City) => {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'Asia/Ho_Chi_Minh',
    forecast_days: '7',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
};

export const fetchWeather = async (city: City, signal?: AbortSignal): Promise<WeatherData> => {
  const res = await fetch(buildUrl(city), { signal });
  if (!res.ok) throw new Error(`Máy chủ trả về mã lỗi ${res.status}`);
  const json = (await res.json()) as OpenMeteoResponse;
  if (!json.current || !json.daily) throw new Error('Dữ liệu trả về không hợp lệ');

  return {
    current: {
      temperature: json.current.temperature_2m,
      humidity: json.current.relative_humidity_2m,
      windSpeed: json.current.wind_speed_10m,
      weatherCode: json.current.weather_code,
      time: json.current.time,
    },
    daily: json.daily.time.map((date, i) => ({
      date,
      weatherCode: json.daily.weather_code[i],
      max: json.daily.temperature_2m_max[i],
      min: json.daily.temperature_2m_min[i],
    })),
  };
};

export interface WeatherInfo {
  label: string;
  icon: string;
  theme: string;
}

export const describeWeather = (code: number): WeatherInfo => {
  if (code === 0) return { label: 'Trời quang', icon: '☀️', theme: 'sunny' };
  if (code === 1) return { label: 'Ít mây', icon: '🌤️', theme: 'sunny' };
  if (code === 2) return { label: 'Mây rải rác', icon: '⛅', theme: 'cloudy' };
  if (code === 3) return { label: 'Nhiều mây', icon: '☁️', theme: 'cloudy' };
  if (code === 45 || code === 48) return { label: 'Sương mù', icon: '🌫️', theme: 'foggy' };
  if (code >= 51 && code <= 57) return { label: 'Mưa phùn', icon: '🌦️', theme: 'rainy' };
  if (code >= 61 && code <= 65) return { label: 'Mưa', icon: '🌧️', theme: 'rainy' };
  if (code === 66 || code === 67) return { label: 'Mưa lạnh', icon: '🌨️', theme: 'rainy' };
  if (code >= 71 && code <= 77) return { label: 'Tuyết', icon: '❄️', theme: 'snowy' };
  if (code >= 80 && code <= 82) return { label: 'Mưa rào', icon: '🌦️', theme: 'rainy' };
  if (code === 85 || code === 86) return { label: 'Mưa tuyết', icon: '🌨️', theme: 'snowy' };
  if (code >= 95) return { label: 'Dông', icon: '⛈️', theme: 'stormy' };
  return { label: 'Không xác định', icon: '🌡️', theme: 'default' };
};

export const DEFAULT_THEME = 'default';

export const toFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;

export const formatTemp = (value: number, unit: 'C' | 'F') =>
  `${Math.round(unit === 'F' ? toFahrenheit(value) : value)}°`;

export const WEEKDAYS = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export const parseDate = (iso: string) => new Date(`${iso}T00:00:00`);

export const formatWeekday = (iso: string, index: number) =>
  index === 0 ? 'Hôm nay' : WEEKDAYS[parseDate(iso).getDay()];

export const formatShortDate = (iso: string) => {
  const d = parseDate(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const formatUpdatedAt = (iso: string) => {
  const [date, time = ''] = iso.split('T');
  const d = parseDate(date);
  return `${WEEKDAYS[d.getDay()]}, ${formatShortDate(date)} ${time}`.trim();
};
