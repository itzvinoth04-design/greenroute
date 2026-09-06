function t(i){const e=i.toLowerCase();return e.includes("metro")||e.includes("subway")||e.includes("train")?`**IBM Granite Analysis:**
Choosing **Metro** reduces carbon emissions by approximately **80%** compared to a single-occupancy fossil car (0.04 kg CO₂/km vs 0.20 kg CO₂/km). Metro avoids surface street congestion, providing predictable arrival times while supporting **SDG 11 (Sustainable Cities)**.`:e.includes("bus")||e.includes("public transit")?`**IBM Granite Rationale:**
Opting for the **Municipal Bus** (0.08 kg CO₂/km) achieves a **60% emission reduction** over private cars. It offers the most economical per-kilometer fare for urban commuters.`:e.includes("walk")||e.includes("cycle")||e.includes("bike")||e.includes("bicycle")?`**IBM Granite Recommendation:**
Active micro-mobility (Walking and Cycling) produces **0.00 kg CO₂/km** — 100% emission-free! It earns the maximum Green Points (10 pts) and promotes urban health aligned with SDG 11 & SDG 13.`:e.includes("score")||e.includes("formula")||e.includes("calculate")?`**IBM Granite System Specification:**
GreenRoute evaluates transit modes using our Multi-Criteria Sustainability Utility Index:

$$\\text{Score} = 40\\% \\times C_{score} + 30\\% \\times M_{score} + 20\\% \\times T_{score} + 10\\% \\times D_{score}$$

- **40% Carbon Efficiency** (lower emissions = higher score)
- **30% Cost Affordability**
- **20% Travel Time**
- **10% Traffic Density Mitigation**`:e.includes("sdg")||e.includes("goal")||e.includes("un")?`**IBM Granite SDG Mapping:**
GreenRoute addresses three United Nations Sustainable Development Goals:
1. **SDG 11 (Sustainable Cities & Communities):** Target 11.2 - safe, affordable, accessible public transport.
2. **SDG 13 (Climate Action):** Target 13.2 - measuring and reducing greenhouse gas emissions.
3. **SDG 7 (Affordable & Clean Energy):** Target 7.3 - doubling the global rate of energy efficiency via EV & electrified rail.`:`**IBM Granite Mobility Assistant:**
Every switch from a personal fossil vehicle to electrified transit (Metro/EV) or active transit (Cycling/Walking) prevents between 0.12 kg to 0.20 kg of greenhouse gas emissions per passenger-kilometer. Plan your route on the map above to earn Green Points for verified emission reductions!`}export{t as emulateClientGraniteResponse};
