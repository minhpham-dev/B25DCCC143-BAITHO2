import type { City } from '../cities';
import { normalize } from '../cities';

interface Props {
  cities: City[];
  selectedId: string | null;
  favorites: string[];
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (city: City) => void;
  onToggleFavorite: (id: string) => void;
}

export function CityList({
  cities,
  selectedId,
  favorites,
  query,
  onQueryChange,
  onSelect,
  onToggleFavorite,
}: Props) {
  const needle = normalize(query);
  const filtered = needle
    ? cities.filter((c) => normalize(c.name).includes(needle) || normalize(c.region).includes(needle))
    : cities;
  const sorted = [...filtered].sort(
    (a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)),
  );

  return (
    <aside className="city-panel" aria-label="Danh sách thành phố">
      <div className="city-panel__header">
        <h1 className="app-title">Thời tiết Việt Nam</h1>
        <p className="app-subtitle">8 thành phố · Open-Meteo</p>
      </div>

      <label className="search">
        <span className="search__icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          placeholder="Tìm thành phố (vd: da nang)"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Tìm thành phố"
        />
      </label>

      {sorted.length === 0 ? (
        <p className="city-list__empty">Không tìm thấy thành phố nào khớp “{query}”.</p>
      ) : (
        <ul className="city-list">
          {sorted.map((city) => {
            const isActive = city.id === selectedId;
            const isFavorite = favorites.includes(city.id);
            return (
              <li key={city.id}>
                <div className={`city-item${isActive ? ' city-item--active' : ''}`}>
                  <button
                    type="button"
                    className="city-item__main"
                    onClick={() => onSelect(city)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="city-item__name">{city.name}</span>
                    <span className="city-item__region">{city.region}</span>
                  </button>
                  <button
                    type="button"
                    className={`city-item__fav${isFavorite ? ' is-favorite' : ''}`}
                    onClick={() => onToggleFavorite(city.id)}
                    aria-label={isFavorite ? `Bỏ yêu thích ${city.name}` : `Yêu thích ${city.name}`}
                    aria-pressed={isFavorite}
                  >
                    {isFavorite ? '★' : '☆'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
