# Stockify Backend API 🖥️

Dịch vụ backend của ứng dụng Stockify được xây dựng bằng NestJS, cung cấp REST API cho hệ thống quản lý danh sách theo dõi, đồng bộ hóa danh mục chứng khoán và quản trị hệ thống.

---

## 🛠️ Tính Năng Chính

- **Hệ thống xác thực & Watchlist**: Đăng nhập, đăng ký và quản lý danh sách các mã cổ phiếu cần theo dõi (Watchlist) của người dùng.
- **Đồng bộ hóa dữ liệu**: Gọi API đến ML microservice để đồng bộ hóa:
  - Danh sách công ty chứng khoán (`stock-companies`).
  - Danh sách mã cổ phiếu và phân loại sàn (HOSE, HNX, UPCOM, VN30, CW, ETF...).
  - Dữ liệu ngành theo tiêu chuẩn ICB (phân cấp 4 cấp độ) và bản đồ liên kết cổ phiếu - ngành.
  - Giá lịch sử cổ phiếu và các chỉ số thị trường (`VNINDEX`, `VN30`...).
- **Kiến trúc Clean Code**:
  - Kế thừa lớp cơ sở chung (`BaseCRUDService`) để giảm thiểu trùng lặp mã CRUD cho TypeORM.
  - Tuyệt đối loại bỏ các endpoint trùng lặp hoặc không sử dụng (như gom nhóm xử lý quote tại route `/stocks/:symbol/quote` có cơ chế tự động fallback thông minh).
- **Giám sát & Tracing**: Tích hợp OpenTelemetry cho việc trace log hiệu suất và đo lường CPU/Memory thực tế của server (`/health/monitoring`).

---

## 📂 Cấu Trúc Thư Mục src/

```
src/
├── app.module.ts       # Module gốc của ứng dụng
├── main.ts             # Điểm khởi chạy ứng dụng (bootstrap)
├── setup.ts            # Các cấu hình middleware chung
├── configs/            # Các file cấu hình hệ thống (App, Database)
├── modules/            # Các Module chức năng
│   ├── auth/           # Xác thực người dùng (JWT)
│   ├── user/           # Quản lý tài khoản
│   ├── stocks/         # Quản lý thông tin cổ phiếu & giá lịch sử
│   ├── stock-companies/# Quản lý công ty niêm yết
│   ├── watchlist/      # Quản lý danh mục theo dõi của người dùng
│   ├── ml/             # Proxy kết nối với FastAPI AI microservice
│   └── health/         # Healthcheck & Thu thập hiệu năng giám sát
├── shared/             # Các decorator, guard, helper dùng chung
└── tracing.ts          # Cấu hình OpenTelemetry
```

---

## ⚙️ Cấu Hình Môi Trường (.env)

Tạo file `.env` tại thư mục `/backend` dựa theo file `.env.example`:

```env
PORT=3001
SERVICE_NAME=stockfify-backend
NODE_ENV=development

# Cấu hình Database SQL Server
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourPassword
DB_DATABASE=stockify

# JWT Secret
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=30d

# Địa chỉ FastAPI Machine Learning Service
ML_SERVICE_URL=http://localhost:8000
```

---

## 🚀 Lệnh Khởi Chạy

### 1. Cài đặt dependencies:
```bash
yarn install
```

### 2. Chạy ở chế độ Development (Watch mode):
```bash
yarn run start:dev
```

### 3. Build mã nguồn và chạy Production:
```bash
yarn run build
yarn run start:prod
```

### 4. Định dạng và kiểm tra lỗi mã nguồn (Linting):
```bash
# Định dạng tự động
yarn format

# Kiểm tra cú pháp & Clean Code
yarn run lint
```
