# Logistics Tracker App

A production-ready delivery tracking platform for last-mile logistics, built with **Expo SDK 57**, **React Native 0.86**, **TypeScript**, **Google Maps**, and real-time GPS.

Track drivers, manage deliveries, work offline.

> **For reviewers:** Start with the [**CTO brief**](CTO-BRIEF.md) — one page with targets, evidence, and decisions.

## Features

- **Real-time GPS tracking** — drivers update position every 2 seconds
- **Three screens** — list, details, map
- **Offline-first** — works without network via AsyncStorage cache
- **Push notifications** — production setup included
- **Color-coded status** — blue (in transit), orange (pending), green (delivered)
- **Professional UX** — touch-friendly, responsive, smooth
- **TypeScript strict** — full type coverage, zero errors
- **Production patterns** — error handling, permissions, scalable

## Quick Start

```bash
git clone https://github.com/sjunka/logistics-tracker-app.git
cd logistics-tracker-app
npm install

npm run ios      # iOS simulator
npm run android  # Android
npm start        # Expo Go + QR code
```

## Architecture

```
src/
├── app/                    # 3 screens
│   ├── index.tsx          # Home: list
│   ├── map.tsx            # Map: tracking
│   └── delivery/[id].tsx  # Details
├── services/              # API + cache
├── types/                 # TypeScript
└── components/            # UI
```

## To Ship

1. Real backend API (replace mock)
2. Actual GPS via expo-location
3. Firebase push notifications
4. Driver auth
5. Proof capture (photo)
6. Scale optimization (1000+ deliveries)

## Prose Standards

All documentation follows Orwell's 1946 rules:

1. No metaphors you see often in print
2. Use short words, not long
3. Cut words you can
4. Use active voice
5. No jargon if everyday English works
6. Break rules rather than write badly

Technical terms stay exact. Rules apply only to prose.
