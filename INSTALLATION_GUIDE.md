# Installation & Deployment Guide: GreenRoute

This guide covers local development setup, environment variable configuration, IBM Watsonx/Granite setup, and Docker container deployment.

---

## 💻 1. Local Development Setup

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **OS**: Windows, macOS, or Linux

---

### Step 1: Clone or Navigate to Project
```bash
cd C:\Users\Vinoth\.gemini\antigravity\scratch\greenroute
```

---

### Step 2: Configure & Launch Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Review or update `.env` (a ready-to-run `.env` is already pre-configured with SQLite):
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=greenroute_super_secret_jwt_key_2026_eco
   DATABASE_URL="file:./dev.db"

   # Optional: Live IBM Watsonx credentials
   WATSONX_APIKEY=
   WATSONX_PROJECT_ID=
   WATSONX_URL=https://us-south.ml.cloud.ibm.com
   IBM_GRANITE_MODEL_ID=ibm/granite-13b-chat-v2
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Push SQLite schema and seed mock accounts & historical trips:
   ```bash
   npx prisma db push
   npm run seed
   ```

5. Run automated formula verification tests:
   ```bash
   npx ts-node src/tests/testFormulas.ts
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will start at `http://localhost:5000`.*

---

### Step 3: Configure & Launch Frontend

1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will launch at `http://localhost:5173`.*

---

## 🤖 2. IBM Watsonx AI & Granite Model Configuration

GreenRoute includes a native dual-mode AI engine:
- **Offline / Evaluation Mode (Default)**: Automatically active when `WATSONX_APIKEY` is empty. Emulates IBM Granite 13b responses with mathematical precision, carbon comparisons, and SDG 11/13 guidance.
- **Live IBM Watsonx Mode**: To connect directly to IBM Cloud:
  1. Obtain an API Key from [IBM Cloud IAM](https://cloud.ibm.com/iam/apikeys).
  2. Create a project in [IBM Watsonx.ai](https://dataplatform.cloud.ibm.com/wx/home) and note the Project ID.
  3. Add both values to `backend/.env`:
     ```env
     WATSONX_APIKEY=your_ibm_cloud_api_key
     WATSONX_PROJECT_ID=your_watsonx_project_id
     ```
  4. Restart the backend server. The app will authenticate via IBM IAM OAuth and execute live inferences on `ibm/granite-13b-chat-v2`.

---

## 🐳 3. Docker & Docker Compose Deployment

To deploy the entire multi-container stack in production:

1. Ensure Docker Desktop is installed and running.
2. From the project root (`greenroute/`), run:
   ```bash
   docker-compose up --build -d
   ```
3. Access services:
   - **Frontend Web UI**: `http://localhost:80` (or `http://localhost`)
   - **Backend API**: `http://localhost:5000/api/health`
4. To stop the containers:
   ```bash
   docker-compose down
   ```

---

## 🧪 4. Testing & Verification Checklist

- [x] **Registration & Auth**: Register new user (+50 pts bonus), test Google login, test Admin login.
- [x] **Route Planning**: Search route between any two cities/hubs, inspect 7 modes on Leaflet map.
- [x] **Emission Formula**: Verify `Distance * ModeFactor` (Walking=0, Bicycle=0, Metro=0.04, Bus=0.08, EV=0.05, Ride Share=0.10, Car=0.20).
- [x] **AI Sustainability Score**: Verify 40% Carbon + 30% Cost + 20% Time + 10% Traffic weighted index.
- [x] **Green Rewards**: Log a trip, verify points added according to mode, redeem vouchers, check leaderboard.
- [x] **AI Monthly Reports**: Generate report, export PDF and CSV files.
- [x] **Admin Panel**: Login with `admin@greenroute.eco`, review system metrics, manage users and rewards.
- [x] **Responsible AI**: Test interactive formula simulator and review fairness disclosures.
