# Netlify Governance & Limitations

## 1. Free Tier Limits (Gói Miễn Phí)
Netlify rất hào phóng, nhưng vẫn có giới hạn cần lưu ý:

- **Build Minutes**: 300 phút/tháng.
  - Mỗi lần ông push code lên GitHub, Netlify sẽ mất khoảng 1-2 phút để build.
  - Nghĩa là ông có thể push khoảng **150-200 lần/tháng** thoải mái. Nếu team đông người push liên tục thì có thể chạm mốc này.
- **Bandwidth**: 100GB/tháng.
  - Với text/ảnh cơ bản thì thoải mái cho ~50.000 - 100.000 lượt truy cập.
  - **Lưu ý**: Nếu ông up video trực tiếp lên host (file .mp4 nặng), băng thông sẽ hết rất nhanh. **Giải pháp**: Luôn up video lên YouTube/Vimeo và nhúng link (như module hiện tại đang làm).

## 2. Environment Variables (Bảo Mật)
- File `.env` chứa các bí mật (như link Google Script) **KHÔNG ĐƯỢC** push lên GitHub (vì lý do bảo mật, nhất là nếu repo public).
- Khi đổi link API hoặc thêm key mới, ông PHẢI vào **Netlify Dashboard -> Site settings -> Environment variables** để cập nhật thủ công. Sau đó cần **Redeploy** lại web để nhận biến mới.

## 3. Instant Rollbacks (Tính năng cứu cánh)
- Nếu lỡ push code lỗi làm sập web:
  - Vào Netlify -> Deploys.
  - Chọn một bản deploy cũ (màu xanh lá cây) -> Click **"Publish deploy"**.
  - Web sẽ quay lại trạng thái cũ ngay lập tức (trong vòng 1 giây). Không cần revert git vội.

## 4. Custom Domain (Tên miền riêng)
- Hiện tại đang dùng `citics-agent.netlify.app`.
- Nếu sau này muốn dùng `training.citics.vn`:
  - Vào Domain Management trong Netlify.
  - Add domain -> Netlify sẽ cấp DNS record để ông cấu hình bên nhà cung cấp tên miền (Mắt Bão, Nhân Hòa, v.v.).

## 5. Form Handling
- Netlify có tính năng **Netlify Forms** rất xịn (tự lưu data khi người dùng submit form HTML thuần), nhưng bản Free chỉ cho 100 submissions/tháng.
- **Hiện tại App mình dùng Google Apps Script để lưu data**, nên KHÔNG bị giới hạn bởi cái này. Cứ dùng Google Sheets tẹt ga.
