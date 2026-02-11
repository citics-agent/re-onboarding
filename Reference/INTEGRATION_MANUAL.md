# Google Sheet Integration Setup Guide

Follow these steps to connect your **Re-Onboarding App** to a Google Sheet for data collection.

## 1. Create the Google Sheet
1.  Go to [sheets.new](https://sheets.new) to create a new spreadsheet.
2.  Name it: `Citics Re-Onboarding Data 2026`.
3.  Add the following headers to **Row 1**:
    *   **A1**: `Timestamp`
    *   **B1**: `Name`
    *   **C1**: `Phone`
    *   **D1**: `AgentID`
    *   **E1**: `Role`
    *   **F1**: `Score`
    *   **G1**: `Status`

## 2. Deploy the Apps Script
1.  In your Google Sheet, go to **Extensions > Apps Script**.
2.  Delete any code in the `Code.gs` file.
3.  Copy the code from your local file:  
    `re-onboarding-app/scripts/google-apps-script.js`
4.  Paste it into the Apps Script editor.
5.  Click the **Save** icon (floppy disk).
6.  Click **Deploy** (blue button top right) > **New deployment**.
7.  **IMPORTANT SETTINGS**:
    *   **Select type**: Click the gear icon > **Web app**.
    *   **Description**: `v1`
    *   **Execute as**: `Me` (your email).
    *   **Who has access**: `Anyone` (Crucial for the app to post data without login).
8.  Click **Deploy**.
9.  **Authorized Access**: It will ask for permissions. Click **Review permissions** -> Choose account -> **Advanced** -> **Go to (Unsafe)** -> **Allow**.
10. Copy the **Web App URL** provided.

## 3. Connect to App
1.  In your project folder `re-onboarding-app`, duplicate `.env.example` and rename it to `.env`.
2.  Open `.env` and paste your URL:
    ```env
    VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_LONG_ID_HERE/exec
    ```
3.  Restart your dev server:
    ```bash
    cd re-onboarding-app
    npm run dev
    ```

## 4. Verify Integration
1.  Open the app in your browser.
2.  Go through the flow until you hit "Success".
3.  Check your Google Sheet. A new row should appear with the data!
