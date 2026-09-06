# Complete Guide: Hosting GreenRoute 24/7 in the Cloud (Vercel + Cloud Backend)

> 💡 **Why doesn't it work if you only host the frontend on Vercel while your backend runs on localhost?**  
> If the frontend connects to `http://localhost:5000/api`, it tries to find the backend on the visitor's device. When your computer is shut down or someone visits from their phone, `localhost:5000` does not exist for them!  
>  
> To make GreenRoute work **anywhere in the world, 24/7, even when your computer is completely turned off**, you must host both the frontend and backend in the cloud.

Below are the two easiest and most reliable free hosting setups.

---

## 🏆 Method 1: The Recommended Production Stack (Vercel + Render)
*Frontend on **Vercel** (Global Edge CDN) + Backend on **Render** (Free 24/7 Node.js cloud server).*

### Part A: Push Code to GitHub
1. Open terminal in the project root:
   ```bash
   cd C:\Users\Vinoth\.gemini\antigravity\scratch\greenroute
   ```
2. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial GreenRoute release with Tamil Nadu routing and Vercel configs"
   ```
3. Create a new repository on [GitHub](https://github.com/new) named `greenroute`.
4. Push your repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/greenroute.git
   git push -u origin main
   ```

---

### Part B: Deploy the Backend to Render (Free)
1. Go to [Render.com](https://render.com) and sign up / log in with your GitHub account.
2. Click **"New +"** &rarr; select **"Web Service"**.
3. Select your `greenroute` GitHub repository.
4. Configure the settings:
   - **Name:** `greenroute-api`
   - **Region:** Singapore or Frankfurt (or closest to your users)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:**
     ```bash
     npm install && npx prisma db push && npm run seed && npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: `greenroute_super_secret_jwt_key_2026_eco`
   - `DATABASE_URL`: `file:./dev.db`
   - *(Optional)* `WATSONX_APIKEY`: your IBM Watsonx key
   - *(Optional)* `WATSONX_PROJECT_ID`: your IBM Watsonx project ID
6. Click **"Create Web Service"**.
7. In 2–3 minutes, Render will provide your public backend URL, for example:  
   `https://greenroute-api.onrender.com`
8. Verify it works by opening: `https://greenroute-api.onrender.com/api/health` in your browser. It will output `{"status": "healthy"}`.

---

### Part C: Deploy the Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Import your `greenroute` repository.
4. In the configuration screen:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click *Edit* and select **`frontend`**
5. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://greenroute-api.onrender.com/api` *(replace with your actual Render URL from Part B, ending with `/api`)*
6. Click **"Deploy"**.
7. In ~1 minute, your site will be live at `https://greenroute.vercel.app` (or your chosen project name)!

---

## ⚡ Method 2: All-in-One Fullstack Deployment on Vercel
*Deploy both Frontend and Backend together in one single Vercel project.*

The project already includes pre-configured:
- Root [`vercel.json`](file:///C:/Users/Vinoth/.gemini/antigravity/scratch/greenroute/vercel.json)
- Serverless entrypoint [`api/index.ts`](file:///C:/Users/Vinoth/.gemini/antigravity/scratch/greenroute/api/index.ts)
- Auto `/tmp/dev.db` writable database cloner in [`backend/src/database/db.ts`](file:///C:/Users/Vinoth/.gemini/antigravity/scratch/greenroute/backend/src/database/db.ts)

### Steps:
1. Push the code to GitHub as shown in Part A.
2. In Vercel, click **"Add New Project"** and import the `greenroute` repo.
3. Keep **Root Directory** as `./` (the root).
4. Vercel will automatically read `vercel.json` and build the frontend to `frontend/dist` while mounting `/api` to the serverless function.
5. In **Environment Variables**, add:
   - `JWT_SECRET`: `greenroute_super_secret_jwt_key_2026_eco`
   - `NODE_ENV`: `production`
6. Click **"Deploy"**.

---

## 🧪 Post-Deployment Verification Checklist

Once deployed:
1. Open your live Vercel URL on your mobile phone or another computer (with your development laptop turned off).
2. Go to **Route Planner** &rarr; type **Perambur** to **Chennai Central** &rarr; verify the Leaflet map and sustainability scores load.
3. Open **AI Assistant** &rarr; ask *"Why should I choose Metro?"* &rarr; verify IBM Granite answers.
4. Click **Instant Demo Login** (`alex@greenroute.eco`) &rarr; log a trip &rarr; confirm green points are awarded.
5. Go to **Reports** &rarr; test **Export PDF** and **Export CSV**.
6. Access the **Admin Panel** (`admin@greenroute.eco`) &rarr; confirm KPI metrics and user lists display.
