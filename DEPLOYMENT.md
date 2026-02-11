# Deployment Instructions - Phase 1

## Prerequisites
1.  A GitHub account.
2.  A [Render](https://render.com) account.
3.  A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (Free Tier).

## 1. Database Setup
1.  Log in to MongoDB Atlas.
2.  Create a new Cluster (Free/Shared).
3.  Create a Database User (Username/Password).
4.  Allow IP Access (0.0.0.0/0 for initial testing, or specific Render IPs).
5.  Get the Connection String (driver: Node.js):
    `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`

## 2. Codebase Setup
1.  Push this entire `UFD` folder to a new GitHub repository.

## 3. Render Deployment
1.  Log in to Render Dashboard.
2.  Click **New +** -> **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will detect `render.yaml`.
5.  **IMPORTANT**: You must provide the `MONGO_URI` environment variable for the `scam-deducer-backend` service.
    *   Since `render.yaml` doesn't include secrets, you might need to add it in the Dashboard after the Blueprint is created, or during the setup wizard if prompted.
6.  Click **Apply**.

## 4. Verification
1.  Wait for both services to deploy.
2.  Open the **Frontend URL** (provided by Render).
3.  Allow Camera permissions.
4.  Scan a QR code.
5.  Check the verdict.

## Troubleshooting
*   **Backend Error**: Check Render logs for "MongoDB Connected". If failed, check your IP whitelist in Atlas.
*   **Frontend Error**: If "Analysis failed", ensure `VITE_API_URL` is correctly set to the Backend URL (Render Blueprint should handle this via `fromService`, but verify).
