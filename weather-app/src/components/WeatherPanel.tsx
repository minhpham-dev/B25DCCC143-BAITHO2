import type { City } from '../cities';
import {
  describeWeather,
  formatShortDate,
  formatTemp,
  formatUpdatedAt,
  formatWeekday,
} from '../weather';
import type { WeatherData } from '../weather';

type Status = 'idle' | 'loading' | 'error' | 'success';

interface Props {
  city: City | null;
  status: Status;
  data: WeatherData | null;
  error: string | null;
  unit: 'C' | 'F';
  onUnitChange: (unit: 'C' | 'F') => void;
  onRetry: () => void;
}

export function WeatherPanel({ city, status, data, error, unit, onUnitChange, onRetry }: Props) {
  if (!city) {
    return (
      <main className="weather-panel">
        <EmptyState />
      </main>
    );
  }

  return (
    <main className="weather-panel">
      <header className="weather-panel__header">
        <div>
          <h2 className="weather-panel__city">{city.name}</h2>
          <p className="weather-panel__region">{city.region}</p>
        </div>
        <UnitToggle unit={unit} onUnitChange={onUnitChange} />
      </header>

      {status === 'loading' && <LoadingState city={city} unit={unit} />}
      {status === 'error' && <ErrorState message={error} onRetry={onRetry} />}
      {status === 'success' && data && <WeatherContent data={data} unit={unit} />}
    </main>
  );
}

function UnitToggle({ unit, onUnitChange }: { unit: 'C' | 'F'; onUnitChange: (u: 'C' | 'F') => void }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Đơn vị nhiệt độ">
      {(['C', 'F'] as const).map((u) => (
        <button
          key={u}
          type="button"
          className={`unit-toggle__btn${unit === u ? ' is-active' : ''}`}
          onClick={() => onUnitChange(u)}
          aria-pressed={unit === u}
        >
          °{u}
        </button>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="state state--empty">
      <div className="state__icon" aria-hidden="true">
        🗺️
      </div>
      <h2>Chọn một thành phố</h2>
      <p>
        Chọn thành phố ở danh sách bên trái (hoặc phía trên) để xem thời tiết hiện tại và dự báo 7 ngày.
      </p>
    </div>
  );
}

function LoadingState({ city, unit }: { city: City; unit: 'C' | 'F' }) {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <h2>Đang tải thời tiết {city.name}…</h2>
      <div className="skeleton-grid" aria-hidden="true">
        <div className="skeleton skeleton--big" />
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
      <p className="state__hint">Đơn vị đang dùng: °{unit}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon" aria-hidden="true">
        ⚠️
      </div>
      <h2>Không tải được dữ liệu thời tiết</h2>
      <p>{message ?? 'Đã có lỗi không xác định. Vui lòng kiểm tra kết nối mạng.'}</p>
      <button type="button" className="btn-retry" onClick={onRetry}>
        Thử lại
      </button>
    </div>
  );
}

function WeatherContent({ data, unit }: { data: WeatherData; unit: 'C' | 'F' }) {
  const info = describeWeather(data.current.weatherCode);

  return (
    <div className="weather-content">
      <section className={`current-card current-card--${info.theme}`} aria-label="Thời tiết hiện tại">
        <div className="current-card__top">
          <span className="current-card__icon" aria-hidden="true">
            {info.icon}
          </span>
          <div className="current-card__temp">
            {formatTemp(data.current.temperature, unit)}
            <span className="current-card__unit">°{unit}</span>
          </div>
        </div>
        <p className="current-card__desc">{info.label}</p>
        <dl className="current-card__stats">
          <div>
            <dt>💧 Độ ẩm</dt>
            <dd>{data.current.humidity}%</dd>
          </div>
          <div>
            <dt>🌬️ Gió</dt>
            <dd>{Math.round(data.current.windSpeed)} km/h</dd>
          </div>
        </dl>
        <p className="current-card__updated">Cập nhật: {formatUpdatedAt(data.current.time)}</p>
      </section>

      <section className="forecast" aria-label="Dự báo 7 ngày">
        <h3 className="forecast__title">Dự báo 7 ngày</h3>
        <ul className="forecast__list">
          {data.daily.map((day, i) => {
            const dayInfo = describeWeather(day.weatherCode);
            return (
              <li key={day.date} className="forecast__item">
                <div className="forecast__day">
                  <span className="forecast__weekday">{formatWeekday(day.date, i)}</span>
                  <span className="forecast__date">{formatShortDate(day.date)}</span>
                </div>
                <span className="forecast__icon" title={dayInfo.label} aria-label={dayInfo.label}>
                  {dayInfo.icon}
                </span>
                <div className="forecast__temps">
                  <span className="forecast__max">{formatTemp(day.max, unit)}</span>
                  <span className="forecast__min">{formatTemp(day.min, unit)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
