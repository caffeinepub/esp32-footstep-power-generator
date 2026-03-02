# Specification

## Summary
**Goal:** Build a web app that connects to an ESP32 footstep power generator via WiFi, displays live sensor data on a futuristic dark dashboard, shows live charts, and persists lifetime stats to both localStorage and a backend canister.

**Planned changes:**
- Backend Motoko actor storing lifetime stats (totalFootsteps, totalEnergyGenerated, totalRuntime) as stable variables with `getLifetimeStats` query and `updateLifetimeStats` update methods
- WiFi connectivity service that polls a configurable ESP32 IP (default: `http://192.168.4.1/data`) via HTTP GET every 1 second, tracks ONLINE/OFFLINE state, and auto-retries with exponential backoff
- Dashboard screen showing footstep count, current power (W), battery % with charging animation, voltage, current, total energy generated/used, ONLINE/OFFLINE badge, animated foot icon on new steps, and power flow animation when power > 0
- Graph screen with four live-updating line charts (Power vs Time, Steps vs Time, Battery vs Time, Energy vs Time) each showing a rolling window of 60 data points, built with Recharts
- Lifetime stats synced to localStorage on every update and to the backend canister every 30 seconds; on load, merge localStorage and backend values taking the maximum of each field
- Settings panel in the header to view/edit and save the ESP32 URL to localStorage, taking effect on the next poll
- Dark futuristic UI theme: near-black background, neon/glow card borders in blue (#00BFFF), cyan (#00FFFF), and green (#39FF14), large bold metrics, smooth CSS transitions, bottom navigation bar with Dashboard and Graph tabs, fully mobile-optimized (375px+)

**User-visible outcome:** Users can open the app on a mobile or desktop browser, connect it to their ESP32 footstep generator, view live power/step/battery metrics with animations, explore live charts, configure the device IP from a settings panel, and have their lifetime totals automatically saved and restored across sessions.
