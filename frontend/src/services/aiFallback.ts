export function emulateClientGraniteResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('metro') || lower.includes('subway') || lower.includes('train')) {
    return `**IBM Granite Analysis:**\nChoosing **Metro** reduces carbon emissions by approximately **80%** compared to a single-occupancy fossil car (0.04 kg CO₂/km vs 0.20 kg CO₂/km). Metro avoids surface street congestion, providing predictable arrival times while supporting **SDG 11 (Sustainable Cities)**.`;
  }
  if (lower.includes('bus') || lower.includes('public transit')) {
    return `**IBM Granite Rationale:**\nOpting for the **Municipal Bus** (0.08 kg CO₂/km) achieves a **60% emission reduction** over private cars. It offers the most economical per-kilometer fare for urban commuters.`;
  }
  if (lower.includes('walk') || lower.includes('cycle') || lower.includes('bike') || lower.includes('bicycle')) {
    return `**IBM Granite Recommendation:**\nActive micro-mobility (Walking and Cycling) produces **0.00 kg CO₂/km** — 100% emission-free! It earns the maximum Green Points (10 pts) and promotes urban health aligned with SDG 11 & SDG 13.`;
  }
  if (lower.includes('score') || lower.includes('formula') || lower.includes('calculate')) {
    return `**IBM Granite System Specification:**\nGreenRoute evaluates transit modes using our Multi-Criteria Sustainability Utility Index:\n\n$$\\text{Score} = 40\\% \\times C_{score} + 30\\% \\times M_{score} + 20\\% \\times T_{score} + 10\\% \\times D_{score}$$\n\n- **40% Carbon Efficiency** (lower emissions = higher score)\n- **30% Cost Affordability**\n- **20% Travel Time**\n- **10% Traffic Density Mitigation**`;
  }
  if (lower.includes('sdg') || lower.includes('goal') || lower.includes('un')) {
    return `**IBM Granite SDG Mapping:**\nGreenRoute addresses three United Nations Sustainable Development Goals:\n1. **SDG 11 (Sustainable Cities & Communities):** Target 11.2 - safe, affordable, accessible public transport.\n2. **SDG 13 (Climate Action):** Target 13.2 - measuring and reducing greenhouse gas emissions.\n3. **SDG 7 (Affordable & Clean Energy):** Target 7.3 - doubling the global rate of energy efficiency via EV & electrified rail.`;
  }

  return `**IBM Granite Mobility Assistant:**\nEvery switch from a personal fossil vehicle to electrified transit (Metro/EV) or active transit (Cycling/Walking) prevents between 0.12 kg to 0.20 kg of greenhouse gas emissions per passenger-kilometer. Plan your route on the map above to earn Green Points for verified emission reductions!`;
}
