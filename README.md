# SocialPrediction: Nền tảng dự đoán phi tập trung trên blockchain Sui

## Hướng dẫn cài đặt và chạy dự án

Dưới đây là các bước để clone dự án từ GitHub và chạy dự án trên Visual Studio Code.

### Yêu cầu hệ thống

- Node.js (Phiên bản 18.x hoặc cao hơn)
- npm (Phiên bản 9.x hoặc cao hơn)
- Visual Studio Code
- Git

### 1. Clone dự án từ GitHub

```bash
# Clone repository
git clone https://github.com/your-username/social-prediction.git

# Di chuyển vào thư mục dự án
cd social-prediction
```

### 2. Cài đặt các dependencies

```bash
# Cài đặt các dependencies của dự án
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc của dự án:

```bash
# Tạo file .env từ mẫu
cp .env.example .env
```

Mở file `.env` và cấu hình các biến môi trường cần thiết:

```
# Môi trường Sui (testnet, devnet, hoặc mainnet)
SUI_NETWORK=testnet

# ID của package đã triển khai trên Sui
SUI_PACKAGE_ID=your_package_id

# API Keys cho các nền tảng xã hội (nếu có)
GITHUB_API_KEY=your_github_api_key
LINKEDIN_API_KEY=your_linkedin_api_key
FARCASTER_API_KEY=your_farcaster_api_key
DISCORD_API_KEY=your_discord_api_key
```

### 4. Chạy dự án trong môi trường phát triển

```bash
# Chạy ứng dụng ở chế độ development
npm run dev
```

Ứng dụng sẽ khởi chạy tại `http://localhost:5000`. Server backend Express sẽ chạy cùng cổng với ứng dụng frontend Vite.

### 5. Cấu hình VS Code

Để có trải nghiệm phát triển tốt nhất với VS Code, hãy cài đặt các extension sau:

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense

Tạo file cấu hình VS Code (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### 6. Cấu trúc thư mục dự án

Dự án được tổ chức với cấu trúc như sau:

```
social-prediction/
├── client/                  # Frontend code
│   ├── src/                 # Mã nguồn frontend
│   │   ├── components/      # React components
│   │   ├── contexts/        # Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Thư viện và utilities
│   │   ├── pages/           # Các trang của ứng dụng
│   │   ├── App.tsx          # Component chính của ứng dụng
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
│
├── server/                  # Backend code
│   ├── move/                # Smart contracts viết bằng Move
│   ├── index.ts             # Entry point của server
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Logic lưu trữ dữ liệu
│   └── vite.ts              # Cấu hình Vite cho server
│
├── shared/                  # Shared code giữa frontend và backend
│   └── schema.ts            # Schema định nghĩa dữ liệu
│
├── .env                     # Biến môi trường
├── .env.example             # Mẫu cho biến môi trường
├── package.json             # Dependencies và scripts
├── tsconfig.json            # Cấu hình TypeScript
└── vite.config.ts           # Cấu hình Vite
```

### 7. Triển khai Smart Contract trên Sui

Để triển khai các smart contract Move trên mạng Sui:

1. Cài đặt Sui CLI:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
```

2. Di chuyển vào thư mục chứa smart contract:
```bash
cd server/move
```

3. Biên dịch và xuất package:
```bash
sui move build
```

4. Triển khai lên Sui Testnet:
```bash
sui client publish --gas-budget 200000000
```

5. Cập nhật ID package vào file `.env` của bạn.

### 8. Xây dựng ứng dụng cho môi trường production

```bash
# Build ứng dụng cho production
npm run build

# Chạy ứng dụng ở chế độ production
npm start
```

### 9. Khắc phục sự cố thông thường

1. **Vấn đề kết nối với blockchain Sui**:
   - Kiểm tra SUI_NETWORK và SUI_PACKAGE_ID trong file .env
   - Đảm bảo ví Sui của bạn đang kết nối với đúng mạng (testnet/devnet)

2. **Lỗi "Module not found"**:
   - Chạy `npm install` để cài đặt lại các dependencies
   - Kiểm tra đường dẫn import trong code có chính xác không

3. **Server không khởi động**:
   - Kiểm tra port 5000 đã được sử dụng bởi ứng dụng khác chưa
   - Chạy `npx kill-port 5000` để giải phóng port

4. **Smart Contract không hoạt động**:
   - Kiểm tra SUI_PACKAGE_ID trong file .env
   - Xác minh rằng bạn có đủ gas để thực hiện các giao dịch

---

## Dành cho nhà phát triển

### API Endpoints

- `GET /api/markets`: Lấy danh sách tất cả thị trường
- `GET /api/markets/:id`: Lấy thông tin chi tiết của một thị trường
- `POST /api/markets`: Tạo thị trường mới
- `GET /api/predictions`: Lấy danh sách dự đoán (có thể lọc theo marketId và walletAddress)
- `POST /api/predictions`: Tạo dự đoán mới
- `GET /api/social-trends`: Lấy xu hướng mạng xã hội
- `GET /api/users/:walletAddress`: Lấy thông tin người dùng
- `GET /api/top-predictors`: Lấy danh sách người dự đoán hàng đầu

### Quy trình phát triển

1. Tạo nhánh mới từ `main` khi làm việc trên tính năng mới
2. Sử dụng quy ước đặt tên commit: `feat: mô tả` hoặc `fix: mô tả`
3. Tạo Pull Request để merge vào nhánh `main`

---

Nếu bạn gặp vấn đề trong quá trình cài đặt hoặc chạy dự án, vui lòng tạo issue trên GitHub repository hoặc liên hệ với đội phát triển.