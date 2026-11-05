export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
}

export const CITIES: City[] = [
  { id: 'ha-noi', name: 'Hà Nội', latitude: 21.0285, longitude: 105.8542, region: 'Miền Bắc' },
  { id: 'hai-phong', name: 'Hải Phòng', latitude: 20.8449, longitude: 106.6881, region: 'Miền Bắc' },
  { id: 'hue', name: 'Huế', latitude: 16.4637, longitude: 107.5909, region: 'Miền Trung' },
  { id: 'da-nang', name: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022, region: 'Miền Trung' },
  { id: 'nha-trang', name: 'Nha Trang', latitude: 12.2388, longitude: 109.1967, region: 'Miền Trung' },
  { id: 'da-lat', name: 'Đà Lạt', latitude: 11.9404, longitude: 108.4583, region: 'Tây Nguyên' },
  { id: 'tp-hcm', name: 'TP. Hồ Chí Minh', latitude: 10.8231, longitude: 106.6297, region: 'Miền Nam' },
  { id: 'can-tho', name: 'Cần Thơ', latitude: 10.0452, longitude: 105.7469, region: 'Miền Nam' },
];

export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
