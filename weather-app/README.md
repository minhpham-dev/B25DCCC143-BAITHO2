# Thời tiết Việt Nam (React + TypeScript)

Ứng dụng xem thời tiết 8 thành phố Việt Nam, dữ liệu từ [Open-Meteo](https://open-meteo.com/en/docs) (miễn phí, không cần API key).

## Chạy ứng dụng

```bash
cd weather-app
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## Tính năng

- Danh sách 8 thành phố, thành phố đang chọn được làm nổi bật (YC1).
- Thời tiết hiện tại: biểu tượng, mô tả, nhiệt độ, độ ẩm, tốc độ gió, thời điểm cập nhật (YC2).
- Dự báo 7 ngày: thứ, ngày, biểu tượng, nhiệt độ cao nhất/thấp nhất (YC3).
- Trạng thái chưa chọn, đang tải, lỗi kèm nút **Thử lại** (YC4).
- Đổi °C/°F không gọi lại API (chỉ tính lại khi render, YC5).
- Responsive: từ 768px bố cục 2 cột, nhỏ hơn xếp dọc (YC6).
- Nâng cao: tìm thành phố không phân biệt dấu, thành phố yêu thích lưu `localStorage`, đổi màu nền theo thời tiết, TypeScript.

## Cấu trúc

```
src/
  cities.ts                    # 8 thành phố + hàm normalize (bỏ dấu)
  weather.ts                   # gọi API, parse dữ liệu, mã thời tiết, định dạng
  hooks/usePersistentState.ts  # state lưu localStorage
  components/CityList.tsx      # danh sách, tìm kiếm, yêu thích
  components/WeatherPanel.tsx  # hiện tại, dự báo, trạng thái
  App.tsx                      # điều phối state, fetch, đổi đơn vị
```
