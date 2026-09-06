# IBM Bob Usage Documentation & Engineering Evidence

**Project:** GreenRoute – Sustainable Transport Planner  
**SDGs:** SDG 11 (Sustainable Cities), SDG 13 (Climate Action), SDG 7 (Clean Energy)  
**Date:** September 2026  
**Evidence Type:** Architectural Design Prompts & Model Integration Records

---

## 1. Interaction Overview & Prompts

### Query 1: Sustainability Route Ranking Criteria
- **User / Developer Prompt to IBM Bob:**
  > *"How should GreenRoute rank multi-modal transportation options to prioritize sustainability while remaining realistic and user-friendly for urban commuters?"*
- **IBM Bob Consultation & Recommendations:**
  - Emphasized that pure carbon minimization can lead to impractical recommendations (e.g., suggesting a 35 km walking commute).
  - Recommended a **Normalized Multi-Criteria Utility Model** balancing environmental impact, financial cost, transit time, and real-time traffic friction.
  - Advised establishing a weighted index:
    - **40% Carbon Impact** (highest weight to drive eco-friendly behavior)
    - **30% Monetary Cost** (accessibility and economic equity)
    - **20% Travel Time** (practical feasibility)
    - **10% Traffic Density** (systemic urban congestion reduction)
  - Recommended displaying an intuitive **Sustainability Score (0 to 100)** to gamify user choices.

---

### Query 2: Carbon Emission Estimation Suggestions
- **User / Developer Prompt to IBM Bob:**
  > *"What standardized emission factors (kg CO₂ / passenger-km) should be used across urban transport modes (Walking, Bicycle, Metro, Bus, Electric Vehicle, Ride Share, Personal Car) for clear public transparency?"*
- **IBM Bob Consultation & Recommendations:**
  - Recommended adopting well-accepted empirical averages per passenger-kilometer aligned with urban transit lifecycle data:
    - **Walking:** `0.00 kg CO₂/km` (Zero active transport footprint)
    - **Bicycle:** `0.00 kg CO₂/km` (Zero active transport footprint)
    - **Metro / Rapid Rail:** `0.04 kg CO₂/km` (High-density electrified mass transit)
    - **Electric Vehicle (EV):** `0.05 kg CO₂/km` (Grid average lifecycle footprint)
    - **Municipal Bus:** `0.08 kg CO₂/km` (Average municipal fleet load factor)
    - **Ride Share:** `0.10 kg CO₂/km` (Carpool/hybrid fleet with deadhead compensation)
    - **Personal ICE Car:** `0.20 kg CO₂/km` (Single-occupancy benchmark vehicle)
  - Suggested calculating emission savings relative to the Personal Car baseline to quantify positive climate impact in real-time.

---

### Query 3: AI Recommendation Engine Improvements
- **User / Developer Prompt to IBM Bob:**
  > *"How can IBM Granite and Watsonx AI be integrated into GreenRoute to give users clear, context-aware explanations rather than black-box scores?"*
- **IBM Bob Consultation & Recommendations:**
  - Recommended using IBM Granite Foundation Models (e.g., `ibm/granite-13b-chat-v2` or `ibm/granite-34b-code-instruct`) to generate natural language rationales for recommended routes.
  - Formulated few-shot prompt templates that ingest:
    - Route parameters (Origin, Destination, Distance)
    - Comparative emissions and cost differences
    - Mode trade-offs (e.g., *"Metro saves 80% CO₂ compared to a car with only a 7-minute variance"*).
  - Recommended contextual tags such as **"Best Eco Choice"**, **"Best Value"**, and **"Fastest Green Route"** to ease decision paralysis.

---

### Query 4: Application of Bob Suggestions to Sustainability Scoring System
- **Engineering Implementation in GreenRoute:**
  1. **Normalized Scoring Engine (`backend/src/services/scoringEngine.ts`):**
     Implemented the exact multi-criteria formula proposed by IBM Bob:
     $$\text{Sustainability Score} = (0.40 \times S_{\text{carbon}}) + (0.30 \times S_{\text{cost}}) + (0.20 \times S_{\text{time}}) + (0.10 \times S_{\text{traffic}})$$
  2. **Emission Calculation Engine (`backend/src/services/emissionCalculator.ts`):**
     Embedded Bob's exact emission coefficients and carbon savings metrics:
     $$\Delta \text{CO}_2 = \text{Emission}_{\text{car}} - \text{Emission}_{\text{chosen\_mode}}$$
  3. **Granite AI Assistant Service (`backend/src/services/ibmGraniteService.ts`):**
     Integrated Watsonx SDK / REST API calling IBM Granite with structured prompt templates, temperature controls, and conversational memory.
  4. **Responsible AI & Algorithmic Transparency (`frontend/src/pages/ResponsibleAIPage.tsx`):**
     Exposed the scoring formula and weighting rationale directly in the UI so users can audit the AI recommendation criteria.

---

## 2. Summary of Impact

By implementing IBM Bob's recommendations:
- Commuters receive clear, balanced route alternatives that are realistically usable.
- Every metric has an empirical, auditable foundation aligned with **SDG 11, 13, and 7**.
- The AI layer provides transparent, educational explanations that foster long-term sustainable habits.
