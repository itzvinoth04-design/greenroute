# GreenRoute – Sustainable Transport Planner 🌍🌱

> **AI-Powered Multi-Modal Urban Mobility Platform prioritizing the Planet over pure Speed.**  
> Built for **UN SDG 11 (Sustainable Cities & Communities)**, **SDG 13 (Climate Action)**, and **SDG 7 (Affordable & Clean Energy)**.

---

## 🌟 Overview & Purpose

Standard navigation applications exclusively prioritize the fastest route—even when it routes through high-congestion choke points and drives up vehicular emissions. **GreenRoute** redefines urban navigation by computing exact carbon emissions, monetary costs, travel times, and traffic densities across 7 transit modes, using an **AI Sustainability Engine** and **IBM Granite Foundation Models** to deliver transparent, ranked, eco-friendly recommendations.

---

## 🎯 UN Sustainable Development Goals (SDGs) Alignment

| Goal | Title | Target & Platform Metric |
| :--- | :--- | :--- |
| **PRIMARY SDG 11** | **Sustainable Cities & Communities** | **Target 11.2:** Expand accessible public transit (Metro/Bus) and active micro-mobility (Cycling/Walking), mitigating urban grid congestion. |
| **SECONDARY SDG 13** | **Climate Action** | **Target 13.2:** Quantify CO₂ avoided per passenger-km against a personal fossil car baseline (`0.20 kg/km`), generating verifiable ESG audit reports. |
| **SECONDARY SDG 7** | **Affordable & Clean Energy** | **Target 7.3:** Accelerate clean energy transitions by promoting electrified rail and Electric Vehicles (`0.05 kg/km`). |

---

## 🚀 Key Features

### 1. Multi-Modal Route Planner & Interactive OpenStreetMap / Leaflet Map
- Compare **7 distinct transit modes**: Walking, Bicycle, Metro, Municipal Bus, Electric Vehicle (EV), Ride Share, and Personal Car.
- Interactive Leaflet map rendering colored route polylines, start/destination pins, and live mode comparisons.

### 2. Standardized Carbon Emission Calculator
Calculates exact tailpipe and grid emissions using:
$$\text{CarbonEmission} = \text{Distance (km)} \times \text{EmissionFactor}$$

| Transport Mode | Emission Factor | CO₂ Saved vs ICE Car | Green Points Awarded |
| :--- | :--- | :--- | :--- |
| **Walking** | `0.00 kg/km` | $100\%$ ($0.20\text{ kg/km}$) | **10 pts** |
| **Bicycle** | `0.00 kg/km` | $100\%$ ($0.20\text{ kg/km}$) | **8 pts** |
| **Metro** | `0.04 kg/km` | $80\%$ ($0.16\text{ kg/km}$) | **6 pts** |
| **Electric Vehicle (EV)** | `0.05 kg/km` | $75\%$ ($0.15\text{ kg/km}$) | **4 pts** |
| **Municipal Bus** | `0.08 kg/km` | $60\%$ ($0.12\text{ kg/km}$) | **5 pts** |
| **Ride Share** | `0.10 kg/km` | $50\%$ ($0.10\text{ kg/km}$) | **2 pts** |
| **Personal Car** | `0.20 kg/km` | Baseline | **0 pts** |

### 3. AI Sustainability Scoring Engine
Multi-criteria objective optimization:
$$\text{Sustainability Score} = (0.40 \times S_{\text{Carbon}}) + (0.30 \times S_{\text{Cost}}) + (0.20 \times S_{\text{Time}}) + (0.10 \times S_{\text{Traffic}})$$
- Produces an intuitive **0 to 100 Score** with contextual AI badges: *Best Eco Choice*, *Zero Emission*, *Best Value*, and *Fastest Route*.

### 4. IBM Granite AI Assistant (`ibm/granite-13b-chat-v2`)
- Conversational assistant embedded across the app (floating widget & full-screen portal).
- Explains route recommendations, decodes sustainability formulas, offers eco commute tips, and analyzes multi-modal trade-offs.
- Seamless dual-mode architecture: connects to live **IBM Watsonx.ai** or activates the built-in deterministic Granite emulator when offline or testing without API keys.

### 5. Eco Insights Dashboard & Visual Analytics
- Visualized using **Recharts**:
  - Monthly CO₂ reduction trend (Area chart)
  - Transport mode frequency distribution (Bar chart)
  - Composite sustainability score history (Line chart)
  - Equivalent urban trees planted calculation.

### 6. Green Rewards & Community Leaderboard
- Gamified points accumulation for every sustainable journey.
- Redeemable rewards vault: Transit passes, Tree planting certificates, Sustainable cafe vouchers, and Clean Air Badges.
- Live community leaderboard ranking commuters by verified carbon savings.

### 7. AI Monthly Sustainability Report Generator
- Aggregates trips, carbon prevented, and generates personalized improvement tips via IBM Granite.
- **Instant Export to PDF** (formal branded document) and **CSV** for ESG accounting.

### 8. Admin Panel & User Governance
- Administrative dashboard tracking: Total Users, Total Trips, Cumulative CO₂ Avoided, and Active Users.
- Moderate users, promote/demote roles, manage reward inventory, and audit system reports.

### 9. Responsible AI & Algorithmic Transparency
- Discloses the 4 pillars: **Fairness** (no provider kickbacks), **Transparency** (interactive real-time formula simulator), **Privacy** (ephemeral location handling), and **Ethics** (environment-first ranking).

---

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, React Router v6, Recharts, Leaflet, Canvas Confetti.
- **Backend:** Node.js, Express.js, TypeScript, JWT Authentication, Bcrypt.js, jsPDF.
- **Database & ORM:** SQLite 3, Prisma ORM (`prisma/schema.prisma`).
- **AI Layer:** IBM Watsonx AI Integration, IBM Granite Model API (`ibm/granite-13b-chat-v2`).
- **Containerization:** Docker, Docker Compose, Nginx.

---

## 📂 Project Structure

```
greenroute/
├── .bob/
│   └── bob_usage.md               # Evidence of IBM Bob prompts & scoring implementation
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema (User, Trip, Reward, Report, etc.)
│   ├── src/
│   │   ├── config/                # Emission constants, weights, transport definitions
│   │   ├── controllers/           # Auth, Route, Trip, Reward, Report, Admin, AI
│   │   ├── middleware/            # JWT verification & Admin authorization guards
│   │   ├── routes/                # Express API endpoints (/api/...)
│   │   ├── services/              # Scoring engine, emission calc, IBM Granite, PDF/CSV
│   │   ├── database/              # Prisma client & seed script
│   │   ├── tests/                 # Formula verification test suite
│   │   └── server.ts              # Express main server
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/            # Navbar, Footer, MapView, ChatWidget, ProtectedRoute
│   │   ├── context/               # AuthContext, ThemeContext (Dark/Light mode)
│   │   ├── pages/                 # 12 complete responsive pages
│   │   ├── services/              # Axios API client
│   │   ├── types/                 # Shared TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── Docker/
│   └── nginx.conf                 # Nginx reverse proxy configuration
├── docker-compose.yml             # Full-stack container orchestration
├── INSTALLATION_GUIDE.md          # Step-by-step setup guide
└── README.md
```

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Pre-Seeded Data |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@greenroute.eco` | `Admin@12345` | Admin console access, 850 pts |
| **Eco Commuter** | `alex@greenroute.eco` | `Green@12345` | 380 pts, 6 historical trips, August 2026 report |
| **Eco Commuter 2**| `priya@greenroute.eco` | `Green@12345` | 540 pts, Metro enthusiast |

*(You can also register a new account anytime to receive a **+50 Welcome Points Bonus**, or use Google Sign-In).*

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
# Running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

### 4. Running via Docker Compose
```bash
docker-compose up --build
# App available at http://localhost:80
```
