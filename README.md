# Stockify 📈

**Stockify** là ứng dụng theo dõi, phân loại và dự đoán giá cổ phiếu trên thị trường chứng khoán Việt Nam sử dụng học máy (LSTM). Hệ thống tích hợp dữ liệu thời gian thực từ thư viện `vnstock3` và cung cấp giao diện trực quan cho nhà đầu tư.

---

## 🏗️ Kiến Trúc Hệ Thống

Stockify được xây dựng theo kiến trúc Microservices gồm 3 thành phần chính:

```
[ Frontend: Next.js ] <--- (REST API) ---> [ Backend: NestJS ] <--- (REST API) ---> [ ML Service: FastAPI ]
                                                   |                                         |
                                            (TypeORM DB Sync)                          (Data Crawling)
                                                   |                                         |
                                           [ SQL Server DB ]                         [ vnstock3 (VCI/KBS) ]
```

1. **Frontend (Next.js)**: Dashboard người dùng hiển thị thông tin giá, chỉ số thị trường, biểu đồ kỹ thuật và các dự báo từ AI.
2. **Backend (NestJS)**: Cung cấp API quản lý danh sách theo dõi (Watchlist), người dùng, lịch sử giá đồng bộ từ DB, và proxy các truy vấn đến ML Service.
3. **ML Service (FastAPI)**: Crawl dữ liệu chứng khoán thời gian thực thông qua thư viện `vnstock3` (từ nguồn VCI/KBS), cung cấp mô hình dự đoán LSTM cho các mã cổ phiếu nổi bật.

---

## 📁 Cấu Trúc Dự Án

```
stockify/
├── backend/            # NestJS Backend API
├── frontend/           # Next.js Web Dashboard
├── ml/                 # Python FastAPI & AI/ML Models
├── dev.ps1             # PowerShell script khởi chạy toàn bộ dịch vụ dev
└── format.ps1          # PowerShell script định dạng mã nguồn (format)
```

---

## ⚡ Hướng Dẫn Khởi Chạy Nhanh (Development Mode)

### Điều kiện tiên quyết:
- **Node.js** (v18+) & **Yarn** / **npm**
- **Python** (v3.10+)
- **SQL Server** (hoặc cấu hình kết nối DB trong `backend/.env`)

### Cách 1: Sử dụng Script tự động (PowerShell)
Khởi chạy toàn bộ 3 dịch vụ đồng thời chỉ với 1 câu lệnh duy nhất:
```powershell
./dev.ps1
```

### Cách 2: Chạy thủ công từng module

#### 1. Khởi động ML Microservice (FastAPI):
```bash
cd ml
pip install -r requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Khởi động Backend (NestJS):
```bash
cd backend
yarn install
# Cấu hình file .env dựa trên .env.example
yarn run start:dev
```

#### 3. Khởi động Frontend (Next.js):
```bash
cd frontend
yarn install
# Cấu hình file .env
yarn dev
```

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS
- **State & Data fetching**: React Query, Zustand, Axios
- **Visualization**: Recharts, Lucide Icons
- **UI Components**: Shadcn/UI, Radix UI

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: TypeORM với Microsoft SQL Server (mssql)
- **HTTP Toolkit**: Axios, OpenTelemetry (Tracing)

### AI / ML Module
- **Microservice Framework**: FastAPI
- **Stock API**: `vnstock3` (đồng bộ dữ liệu từ VCI, KBS)
- **Data Science**: Pandas, NumPy, Scikit-learn
- **Machine Learning**: TensorFlow / Keras (LSTM)
- **Web Server**: Uvicorn

---

## 🔒 Bản Quyền & Giấy Phép
Dự án được cấp phép theo tiêu chuẩn **MIT License**.
