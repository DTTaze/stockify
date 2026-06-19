# Stockify AI/ML Microservice 🧠🐍

Dịch vụ học máy và thu thập dữ liệu chứng khoán của ứng dụng Stockify được xây dựng bằng Python (FastAPI). Module này chịu trách nhiệm thu thập thông tin thời gian thực và huấn luyện mô hình dự đoán xu hướng giá cổ phiếu.

---

## 🛠️ Các Chức Năng Chính

- **Thu thập dữ liệu chứng khoán (Data Crawling)**: 
  - Tích hợp thư viện `vnstock3` để lấy thông tin các sàn HOSE, HNX, UPCOM.
  - Hỗ trợ cơ chế tự động chuyển nguồn dữ liệu (fallback) thông minh giữa nguồn **VCI** (Vietcap) và **KBS** (KB Securities) để đảm bảo độ tin cậy.
- **Tối ưu hóa tốc độ & Caching**:
  - Lưu cache danh sách cổ phiếu phân nhóm (`grouped_symbols_cache.json`) định kỳ (12 giờ) nhằm tránh vượt quá giới hạn lượt gọi (Rate Limit) của các nhà cung cấp dữ liệu.
- **Phân loại ngành ICB**: Cung cấp cấu trúc ngành tài chính ICB và phân phối mã cổ phiếu tương ứng.
- **Dự đoán giá cổ phiếu LSTM**:
  - Mô hình mạng neural hồi quy LSTM được xây dựng bằng TensorFlow/Keras.
  - Cung cấp dự báo giá đóng cửa của các cổ phiếu hỗ trợ cho các mốc thời gian tiếp theo (ngày mai, 3 ngày, 7 ngày, 14 ngày).

---

## 📂 Cấu Trúc Thư Mục

```
ml/
├── src/                    # Mã nguồn Python
│   ├── data_management/    # API quản lý đồng bộ dữ liệu
│   ├── model_management/   # API huấn luyện và quản lý mô hình AI
│   ├── prediction/         # API dự đoán giá cổ phiếu
│   ├── models/             # Định nghĩa mô hình LSTM, train & predict
│   │   ├── lstm_model.py
│   │   ├── train.py
│   │   └── predict.py
│   ├── utils/              # Các hàm tiện ích bổ trợ
│   └── vn_stock/           # Tích hợp vnstock3, xử lý dữ liệu đầu vào
├── saved_models/           # Các mô hình LSTM đã huấn luyện (.keras)
├── requirements.txt        # Thư viện phụ thuộc Python
└── README.md               # File tài liệu hướng dẫn này
```

---

## ⚙️ Hướng Dẫn Thiết Lập & Chạy Dịch Vụ

Khuyến nghị sử dụng Python **3.10** hoặc **3.11**.

### 1. Tạo và kích hoạt môi trường ảo (Virtual Environment)
Trên Windows (PowerShell):
```powershell
python -m venv venv
& ".\venv\Scripts\Activate.ps1"
```

Trên macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Cài đặt các thư viện cần thiết
```bash
pip install -U pip
pip install -r requirements.txt
```

### 3. Chạy FastAPI Server (Development)
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```
Sau khi chạy, tài liệu hướng dẫn API tự động sẽ có tại: `http://localhost:8000/docs`.

---

## 🤖 Huấn Luyện & Sử Dụng Mô Hình AI Thủ Công

Bạn có thể chạy trực tiếp các module Python từ thư mục gốc của module `/ml`:

### 1. Chuẩn bị dữ liệu và tiền xử lý:
```bash
python -m src.data_management.preprocessing
```

### 2. Tiến hành huấn luyện mô hình LSTM:
```bash
python -m src.models.train
```

### 3. Thực hiện dự đoán giá:
```bash
python -m src.models.predict
```
Các file mô hình sau huấn luyện sẽ được xuất vào thư mục `/saved_models/`.
