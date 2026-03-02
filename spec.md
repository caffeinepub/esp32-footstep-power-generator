# Specification

## Summary
**Goal:** Update the default ESP32 IP address used in the frontend polling hook.

**Planned changes:**
- Change the default ESP32 polling URL constant in `useESP32Connection.ts` from `http://192.168.4.1/data` to `http://192.168.43.148/data`

**User-visible outcome:** On first load (with no saved URL in localStorage), the app automatically polls `http://192.168.43.148/data` and the Settings panel pre-fills with that address.
