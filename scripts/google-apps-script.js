/**
 * Google Apps Script for Citics Re-Onboarding App
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code into Code.gs.
 * 4. Save and click "Deploy" > "New Deployment".
 * 5. Select type: "Web app".
 * 6. Set "Execute as": "Me".
 * 7. Set "Who has access": "Anyone".
 * 8. Click "Deploy" and copy the Web App URL.
 * 9. Paste the URL into your .env file as VITE_GOOGLE_SCRIPT_URL.
 */

function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    try {
        var data = JSON.parse(e.postData.contents);
        var timestamp = new Date();

        // Define columns mapping based on your data structure
        // Columns: Timestamp | Name | Phone | AgentID | Role | Score
        var rowData = [
            timestamp,
            data.name || '',
            data.phone || '', // Using phone as unique ID if needed
            data.agentId || '',
            data.role || '',
            data.score || 0,
            data.status || 'Completed'
        ];

        sheet.appendRow(rowData);

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
