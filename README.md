# SmartPaws PawsFeed AI - Landing Page & Web Services

Dự án này là bài làm kiểm tra năng lực chuyên môn (Vòng 2) cho vị trí **Thực tập sinh IT Phát triển Website** tại **HELICORP**.

* **Thương hiệu giả lập:** `SmartPaws` (Chuyên thiết bị thú cưng cao cấp)
* **Sản phẩm:** `PawsFeed AI` (Máy cho ăn thông minh tích hợp camera AI & cảm biến cân nặng)
* **Mô hình triển khai:** Landing Page tối ưu hóa theo mô hình tiếp thị **AIDA (Attention - Interest - Desire - Action)**.

---

## 🚀 Các Tính Năng Nổi Bật (Yêu cầu & Điểm cộng)

### 1. Giao diện & Thẩm mỹ (UI/UX & Responsive)
* **Thiết kế hiện đại:** Phong cách tối giản, sử dụng CSS Modules đóng gói cục bộ, bố cục Bento Grid đặc trưng và kính mờ (Glassmorphism).
* **Responsive:** Hiển thị tối ưu mượt mà trên cả máy tính (Desktop) và điện thoại di động (Mobile).
* **Dark Mode:** Tích hợp bộ chuyển đổi giao diện Sáng/Tối mượt mà sử dụng thuộc tính `data-theme` kết hợp biến CSS toàn cục, lưu trữ trạng thái qua `localStorage`.

### 2. Tối ưu SEO & Hiệu năng (PageSpeed & Technical SEO)
* **SEO Technical:** Khai báo đầy đủ các thẻ meta cơ bản (Title, Description, Open Graph) trực tiếp tại cấu trúc App Router `layout.js` giúp tối ưu hóa SEO tối đa.
* **Tải trang thần tốc:** Landing page được biên dịch dưới dạng **Static HTML (SSG)** giúp tốc độ phản hồi tức thì và đạt điểm Google PageSpeed Insights (Mobile) trên 90 điểm dễ dàng.

### 3. Tương tác E-commerce & Trải nghiệm cao cấp
* **Mini E-commerce:** Hỗ trợ tính năng Yêu thích (Wishlist) và Giỏ hàng (Mini Cart) lưu trữ thông tin trực tiếp bằng `localStorage`.
* **Hiệu ứng Scroll:** Các section xuất hiện mượt mà khi cuộn trang nhờ API `IntersectionObserver` tối ưu hiệu năng.

### 4. Kết nối Webhook & API Route bảo mật (Điểm cộng)
* **Form Validation:** Kiểm tra định dạng dữ liệu (Họ tên, Email, Số điện thoại) ở cả 2 phía: Client-side (hiển thị trực quan) và Server-side (kiểm tra bảo mật trong API Route).
* **Slack Webhook:** Dữ liệu form hợp lệ sẽ được API Route `/api/slack` bảo mật bắn trực tiếp về kênh Slack của bạn (Không lộ Webhook URL phía client).
* **SmartPaws Dev Console (Trực quan hóa):** Tích hợp bảng giám sát log sự kiện thời gian thực (góc dưới bên trái). Giúp người chấm bài dễ dàng theo dõi hành vi cuộn (scroll), nhấp chuột (click) và quy trình hoạt động của API Webhook trực quan mà không cần bật F12 Console.

### 5. Chatbot Tư Vấn AI tích hợp Gemini (Điểm cộng)
* **Gemini Chatbot:** Hộp chat hỗ trợ trực tuyến ở góc dưới bên phải, kết nối trực tiếp với **Gemini API** qua API Route bảo mật `/api/chat`. Trợ lý ảo được thiết lập prompt ngữ cảnh sâu sắc về sản phẩm PawsFeed AI để tự động trả lời tư vấn bằng Tiếng Việt trôi chảy.

---

## 🛠️ Cấu Trúc Thư Mục Dự Án

```
C:\dev\Test_Interview
├── app/
│   ├── api/
│   │   ├── chat/route.js        # API Route gọi Gemini API
│   │   └── slack/route.js       # API Route đẩy dữ liệu về Slack Webhook
│   ├── globals.css              # Reset CSS & Core style
│   ├── layout.js                # Root layout, AppProvider & SEO Metadata
│   ├── page.js                  # Landing Page chính với cấu trúc AIDA
│   └── variables.css            # CSS variables lưu bảng màu Light/Dark
├── components/
│   ├── Accordion.js             # Accordion cho mục câu hỏi FAQ
│   ├── AppContext.js            # Provider quản lý giỏ hàng & wishlist
│   ├── CartDrawer.js            # Ngăn kéo giỏ hàng trượt
│   ├── DevConsole.js            # Bảng điều khiển giám sát hành vi & Webhook
│   ├── Chatbot.js               # Hộp chat tư vấn tích hợp AI
│   ├── Header.js                # Navigation bar cố định
│   ├── Footer.js                # Footer chứa thông tin và disclaimer
│   └── ThemeToggle.js           # Nút chuyển đổi Light/Dark mode
├── public/
│   └── images/
│       └── smart_feeder_hero.jpg # Ảnh sản phẩm gen từ AI
├── .env.example                 # Hướng dẫn tạo tệp biến môi trường
└── package.json                 # Cấu hình các thư viện phụ thuộc
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Nhân bản dự án và cài đặt
Chạy lệnh sau để cài đặt thư viện phụ thuộc:
```bash
npm install --legacy-peer-deps
```

### 2. Cấu hình Biến môi trường (`.env.local`)
Tạo một file `.env.local` ở thư mục gốc của dự án và điền các khóa sau:
```env
# URL Slack Webhook nhận đăng ký (ví dụ: https://hooks.slack.com/services/...)
SLACK_WEBHOOK_URL=your_slack_incoming_webhook_url_here

# Khóa Gemini API tư vấn khách hàng (ví dụ: AIzaSy...)
GEMINI_API_KEY=your_gemini_api_key_here
```
*Lưu ý: Nếu không cấu hình biến môi trường, hệ thống vẫn hoạt động ở chế độ Giả lập (Mock Mode) giúp người chấm bài vẫn có thể trải nghiệm đầy đủ giao diện thành công mà không bị lỗi crash hệ thống.*

### 3. Khởi chạy môi trường phát triển
Chạy lệnh sau để bật server dev:
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

### 4. Build Production
Chạy lệnh sau để tối ưu hóa mã nguồn:
```bash
npm run build
npm run start
```

---

## 🔗 Triển Khai (Deploy)

Dự án đã sẵn sàng 100% để deploy trực tiếp lên **Vercel** chỉ với 1 click:
1. Đẩy dự án lên một repo public trên GitHub của bạn.
2. Kết nối repo đó vào tài khoản Vercel.
3. Thêm 2 biến môi trường `SLACK_WEBHOOK_URL` và `GEMINI_API_KEY` trong phần cài đặt của Vercel (nếu muốn chạy thật).
4. Bấm **Deploy**. Vercel sẽ tự động tối ưu hóa hiệu năng, nén hình ảnh và cấu hình API routes thành Serverless Functions miễn phí.
