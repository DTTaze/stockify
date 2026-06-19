# Stockify Frontend Dashboard 📊

Giao diện người dùng của ứng dụng Stockify được xây dựng bằng Next.js (App Router), mang lại giao diện trực quan, trực quan hóa dữ liệu hiệu năng cao cho việc theo dõi, tìm kiếm và phân tích giá chứng khoán.

---

## ✨ Các Chức Năng Chính

- **Dashboard người dùng**:
  - Xem tổng quan thị trường chứng khoán trong ngày.
  - Tìm kiếm mã cổ phiếu, xem biểu đồ giá (Recharts) hỗ trợ phân tích các khoảng thời gian (1D, 1W, 1M, 3M, 6M, 1Y).
  - Hiển thị chỉ báo kỹ thuật cơ bản và khối lượng giao dịch trực quan.
  - Xem kết quả dự báo giá cổ phiếu trong tương lai từ AI (cho ngày mai, 3 ngày, 7 ngày và 14 ngày tới).
- **Watchlist (Danh mục theo dõi)**: Người dùng có thể thêm/xóa mã cổ phiếu quan tâm và xem biến động giá thời gian thực.
- **Admin System Monitoring (Trang Giám Sát Admin)**:
  - Hiển thị hiệu suất CPU, Memory tiêu thụ thực tế.
  - Biểu đồ lịch sử hiệu năng hệ thống qua React Query.
  - Danh sách Log hệ thống thời gian thực (Log levels: Info, Warning).
- **Type Safety**: Tích hợp chặt chẽ TypeScript cho tất cả luồng dữ liệu API (ví dụ như cấu trúc kiểu `MonitoringData`), giảm thiểu lỗi runtime.

---

## 📂 Cấu Trúc Thư Mục src/

```
src/
├── app/                # Các trang chính (App Router)
│   ├── (auth)/         # Đăng nhập, Đăng ký
│   ├── admin/          # Quản trị hệ thống & Giám sát CPU/Memory
│   ├── user/           # Dashboard theo dõi cổ phiếu & Watchlist
│   └── page.tsx        # Trang chủ landing page giới thiệu
├── components/         # Các thành phần giao diện dùng chung (Shadcn/UI, Radix)
├── constants/          # Định nghĩa hằng số API, Auth, Ticker
├── helpers/            # Tiện ích bổ trợ xử lý lỗi, định dạng số
├── hooks/              # Custom React Hooks
├── lib/                # Cấu hình thư viện ngoài (React Query, Utils)
├── providers/          # React Query Provider bọc ứng dụng
├── queries/            # Khai báo React Query Hooks, Functions & Keys
├── services/           # Định nghĩa các phương thức gọi API qua Axios
├── store/              # State Management (Zustand)
└── types/              # Định nghĩa kiểu dữ liệu TypeScript
```

---

## ⚙️ Cấu Môi Trường (.env)

Tạo file `.env` tại thư mục `/frontend`:

```env
# Địa chỉ URL của Backend API Server
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🚀 Khởi Chạy

### 1. Cài đặt dependencies:
```bash
yarn install
```

### 2. Chạy ở chế độ phát triển (Development):
```bash
yarn dev
```

### 3. Build mã nguồn tối ưu cho Production:
```bash
yarn build
yarn start
```

### 4. Kiểm tra mã nguồn (Linting) & Định dạng (Formatting):
```bash
# Kiểm tra định dạng & cú pháp
yarn lint

# Tự động sửa lỗi định dạng
yarn format
```
