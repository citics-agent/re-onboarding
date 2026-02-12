/**
 * SMART Google Apps Script for Citics Re-Onboarding App
 * 
 * FEATURES:
 * - doGet: Trả về danh sách câu hỏi từ sheet "QuestionBank".
 * - doPost: Nhận kết quả bài thi và lưu vào sheet "Results".
 * 
 * SETUP INSTRUCTIONS:
 * 1. Tạo Google Sheet mới (hoặc dùng file cũ).
 * 2. Đổi tên Sheet 1 thành "Results" (để lưu kết quả).
 * 3. Tạo Sheet 2 tên "QuestionBank" (để chứa câu hỏi).
 *    - Header (Dòng 1): module_id | question | correct_index | option_1 | option_2 | option_3 | ...
 *    - Nhập dữ liệu:
 *      + correct_index: Số thứ tự đáp án đúng (0 là option_1, 1 là option_2...).
 *      + Các cột option phía sau có thể thêm tùy ý bao nhiêu cũng được.
 * 
 * DEPLOYMENT:
 * 1. Copy toàn bộ code này -> Paste vào Script Editor.
 * 2. Bấm "Deploy" -> "New Deployment".
 * 3. Chọn "Web App".
 *    - Execute as: Me
 *    - Who has access: Anyone (quan trọng!)
 * 4. Copy URL mới -> Dán vào file `.env` (VITE_GOOGLE_SCRIPT_URL).
 */

function doGet(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = doc.getSheetByName("QuestionBank"); // BẮT BUỘC PHẢI CÓ SHEET NÀY

        if (!sheet) {
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Sheet QuestionBank not found' }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        var rows = sheet.getDataRange().getValues();
        var headers = rows[0];
        var data = rows.slice(1); // Bỏ header

        // Map dữ liệu thành JSON structure
        // Cấu trúc mong đợi: { "1": [questions...], "2": [questions...] }
        var questionBank = {};

        data.forEach(function (row) {
            if (!row[0]) return; // Bỏ qua dòng trống module_id

            var moduleId = row[0].toString();

            // Tạo object câu hỏi
            var questionObj = {
                id: "q_" + moduleId + "_" + Math.random().toString(36).substr(2, 5), // Tạo ID ngẫu nhiên
                question: row[1],
                // CORRECT LOGIC: 
                // Col C (index 2) = correct_index (User inputs 1, 2, 3...)
                // We need to convert to 0-based index (0, 1, 2...) for the App
                correct: parseInt(row[2]) - 1,
                options: row.slice(3).filter(String) // Lấy từ cột D trở đi
            };

            if (!questionBank[moduleId]) {
                questionBank[moduleId] = [];
            }

            questionBank[moduleId].push(questionObj);
        });

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'data': questionBank }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = doc.getSheetByName("Results"); // Đổi tên sheet cũ thành Results hoặc tạo mới

        // Nếu chưa có sheet Results thì tạo mới (fallback)
        if (!sheet) {
            sheet = doc.insertSheet("Results");
        }

        // Lấy header hiện tại
        var lastColumn = sheet.getLastColumn();
        var headers = [];
        if (lastColumn > 0) {
            headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
        }

        var data = JSON.parse(e.postData.contents);

        // Thêm timestamp
        if (!data.timestamp) {
            data.timestamp = new Date();
        }

        // 1. KIỂM TRA & THÊM CỘT MỚI (Dynamic Columns)
        var keys = Object.keys(data);
        keys.forEach(function (key) {
            if (headers.indexOf(key) === -1) {
                var newColIndex = headers.length + 1;
                sheet.getRange(1, newColIndex).setValue(key);
                headers.push(key);
            }
        });

        // 2. SẮP XẾP DỮ LIỆU
        var newRow = [];
        headers.forEach(function (header) {
            var value = data[header];
            if (Array.isArray(value)) value = value.join(", ");
            newRow.push(value || '');
        });

        // 3. GHI DÒNG MỚI
        sheet.appendRow(newRow);

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'row': sheet.getLastRow() }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}
