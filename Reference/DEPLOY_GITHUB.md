# Hướng dẫn Deploy lên GitHub Pages

Để đưa ứng dụng lên mạng, hãy làm theo các bước sau trong Terminal:

### 1. Cài đặt công cụ deploy
Chạy lệnh này để cài gói `gh-pages`:
```bash
npm install gh-pages --save-dev
```

### 2. Chuẩn bị Git (Nếu chưa làm)
Nếu thư mục dự án chưa kết nối với GitHub, hãy làm như sau:
1.  Tạo một Repository mới trên GitHub (đặt tên ví dụ: `re-onboarding-app`).
2.  Chạy các lệnh sau trong Terminal của VS Code:
    ```bash
    git init
    git add .
    git commit -m "First commit"
    git branch -M main
    git remote add origin https://github.com/USERNAME/re-onboarding-app.git
    # (Thay USERNAME bằng tên GitHub của ông)
    git push -u origin main
    ```

### 3. Deploy
Chạy lệnh sau để build và đẩy code lên nhánh `gh-pages`:
```bash
npm run deploy
```

### 4. Kiểm tra kết quả
*   Vào GitHub Repo > **Settings** > **Pages**.
*   Đợi vài phút, GitHub sẽ cung cấp link (thường là `https://USERNAME.github.io/re-onboarding-app/`).
*   Truy cập link đó để xem thành quả!

> **Lưu ý**: Nếu trang bị trắng trơn, hãy kiểm tra lại file `vite.config.js` xem đã có dòng `base: './'` chưa (tôi đã thêm rồi).

### 🔧 Xử lý lỗi thường gặp

**Lỗi `EPERM: operation not permitted` khi cài đặt:**
Nếu ông gặp lỗi này khi chạy `npm install`, hãy chạy lệnh sau để sửa quyền truy cập (yêu cầu mật khẩu máy):
```bash
sudo chown -R 501:20 "/Users/jaydenpham/.npm"
```
Sau đó chạy lại lệnh cài đặt.
