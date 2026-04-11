# 🎬 PhimNapt - Ứng dụng xem phim trực tuyến

Ứng dụng xem phim trực tuyến xây dựng bằng **React + Vite**, hỗ trợ tìm kiếm, phân loại thể loại và phát video.

---

## 🛠️ Yêu cầu hệ thống

Trước khi chạy, hãy đảm bảo máy tính đã cài đặt:

| Công cụ | Phiên bản tối thiểu | Tải về |
|--------|----------------------|--------|
| **Node.js** | >= 18.x | [nodejs.org](https://nodejs.org/) |
| **npm** | >= 9.x (đi kèm Node.js) | — |
| **Git** | Bất kỳ | [git-scm.com](https://git-scm.com/) |

Kiểm tra phiên bản đã cài:
```bash
node -v
npm -v
```

---

## 🚀 Hướng dẫn chạy chương trình

### Bước 1 — Clone dự án về máy

```bash
git clone https://github.com/phatnoname00/PhimNapt.git
cd PhimNapt
```

> Nếu bạn đã có thư mục dự án rồi, bỏ qua bước này.

---

### Bước 2 — Cài đặt các thư viện cần thiết

```bash
npm install
```

> Lệnh này sẽ tải toàn bộ dependencies được khai báo trong `package.json` vào thư mục `node_modules`.

---

### Bước 3 — Chạy ứng dụng ở chế độ phát triển (Development)

```bash
npm run dev
```

Sau khi chạy, terminal sẽ hiển thị địa chỉ truy cập:

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Mở trình duyệt và truy cập: **http://localhost:5173**

---

## 📦 Build sản phẩm (Production)

Để tạo bản build tối ưu cho môi trường production:

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`.

Để xem trước bản build trên máy local:

```bash
npm run preview
```

---

## 📁 Cấu trúc thư mục

```
PhimNapt/
├── public/             # Tài nguyên tĩnh (favicon, ảnh...)
├── src/
│   ├── assets/         # Ảnh, icon dùng trong code
│   ├── components/     # Các component tái sử dụng
│   ├── context/        # React Context (state toàn cục)
│   ├── pages/          # Các trang chính của ứng dụng
│   ├── services/       # Gọi API lấy dữ liệu phim
│   ├── App.jsx         # Component gốc + cấu hình routing
│   └── main.jsx        # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔧 Các lệnh hữu ích

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy ứng dụng ở chế độ development (hot reload) |
| `npm run build` | Build production |
| `npm run preview` | Xem trước bản build |
| `npm run lint` | Kiểm tra lỗi code với ESLint |

---

## ❓ Xử lý lỗi thường gặp

**Lỗi: `npm install` thất bại**
```bash
# Xóa cache npm rồi cài lại
npm cache clean --force
npm install
```

**Lỗi: Port 5173 đã được sử dụng**
```bash
# Chạy trên port khác
npm run dev -- --port 3000
```

**Lỗi: `node_modules` bị lỗi**
```bash
# Xóa và cài lại toàn bộ
rmdir /s /q node_modules
npm install
```

---

## 🌐 Deploy lên Vercel

Dự án đã được cấu hình sẵn cho Vercel (`vercel.json`).

1. Cài Vercel CLI: `npm i -g vercel`
2. Đăng nhập: `vercel login`
3. Deploy: `vercel --prod`

---

## 📤 Hướng dẫn đẩy code lên GitHub

> Repository: [https://github.com/phatnoname00/PhimNapt](https://github.com/phatnoname00/PhimNapt)

### Lần đầu tiên (chưa có remote)

Nếu bạn bắt đầu từ một thư mục mới chưa kết nối GitHub:

```bash
# 1. Khởi tạo git
git init

# 2. Kết nối với repository GitHub
git remote add origin https://github.com/phatnoname00/PhimNapt.git

# 3. Thêm tất cả file vào staging
git add .

# 4. Tạo commit đầu tiên
git commit -m "Initial commit"

# 5. Đẩy lên GitHub (lần đầu)
git push -u origin main
```

---

### Cập nhật code (workflow thường ngày)

Sau khi chỉnh sửa code, dùng các lệnh sau để đẩy lên GitHub:

```bash
# Bước 1 — Xem những file đã thay đổi
git status

# Bước 2 — Thêm tất cả thay đổi vào staging
git add .

# Bước 3 — Tạo commit với mô tả rõ ràng
git commit -m "feat: mô tả thay đổi của bạn"

# Bước 4 — Đẩy lên GitHub
git push
```

> 💡 **Ví dụ commit message tốt:**
> - `feat: thêm admin dashboard`
> - `fix: sửa lỗi redirect sau login`
> - `perf: cải thiện tốc độ tải trang chủ`

---

### Xem lịch sử commit

```bash
# Xem 5 commit gần nhất
git log --oneline -5
```

---

### ⚠️ Lưu ý khi đẩy lần đầu

GitHub yêu cầu xác thực. Có 2 cách:

**Cách 1 — HTTPS (dùng Personal Access Token)**
1. Vào GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Tạo token mới, chọn quyền `repo`
3. Khi git hỏi password → dán token vào thay vì mật khẩu

**Cách 2 — SSH (khuyến nghị)**
```bash
# Tạo SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Dán vào GitHub: Settings → SSH and GPG keys → New SSH key

# Đổi remote sang SSH
git remote set-url origin git@github.com:phatnoname00/PhimNapt.git
```
