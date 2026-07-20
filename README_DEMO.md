# Cigo Tracker Demo App

A modern React Native delivery tracking application built with Expo, demonstrating key features required for a last-mile delivery platform.

## Features Demonstrated

### Core Delivery Management
- **Live Delivery List** - Real-time display of active deliveries with status tracking
- **Real-time Location Updates** - Simulated GPS tracking with smooth location transitions
- **Interactive Map View** - Google Maps integration showing delivery locations and driver positions
- **Delivery Details** - Comprehensive delivery information with current GPS coordinates

### Mobile-Specific Capabilities
- **Push Notifications** - Expo notifications setup with proper permission handling
- **Offline Data** - AsyncStorage for caching deliveries when offline
- **Background Location Tracking** - Foundation for continuous GPS tracking (pattern shown)
- **Native Platform Support** - iOS and Android ready

### Professional Development Patterns
- **TypeScript** - Full type safety across the application
- **REST API Integration** - Mock API service showing production patterns
- **State Management** - Clean React hooks with local state
- **Responsive UI** - Mobile-first design that works on all screen sizes
- **Performance Optimized** - React Compiler enabled for faster rendering

## Project Structure

```
src/
├── app/                          # Expo Router app directory
│   ├── _layout.tsx              # Root navigation stack
│   ├── index.tsx                # Home screen - deliveries list
│   ├── map.tsx                  # Map view with real-time tracking
│   └── delivery/[id].tsx        # Delivery detail screen
├── types/
│   └── delivery.ts              # TypeScript types for deliveries
├── services/
│   ├── deliveryService.ts       # API calls & data management
│   └── notificationService.ts   # Push notification setup
```

## Running the App

### Prerequisites
```bash
npm install
```

### Development
```bash
# Start Expo development server
npm start

# Run on iOS simulator (requires Xcode)
npm run ios

# Run on Android emulator (requires Android Studio)
npm run android

# Run on web (experimental)
npm run web
```

### Using Expo Go
1. Install [Expo Go](https://expo.dev/tools/expo-go) app on your phone
2. Run `npm start`
3. Scan the QR code with your device

## Key Technologies

- **React Native 0.86** - Cross-platform mobile framework
- **Expo 57** - Development platform & managed services
- **Expo Router** - File-based routing (like Next.js)
- **React Native Maps 1.28** - Native mapping
- **Expo Location** - GPS and location services
- **Expo Notifications** - Push notifications
- **AsyncStorage** - Offline data persistence
- **TypeScript 6** - Type safety

## Features Walkthrough

### 1. **Home Screen**
- Lists all active deliveries
- Shows status (pending, in_transit, delivered)
- Displays estimated delivery times
- Pull-to-refresh for updates
- Tap to view delivery details

### 2. **Real-time Map**
- Shows all delivery destinations
- Red markers for current driver locations
- Color-coded by delivery status
- Live tracking simulation (updates every 2 seconds)
- Legend showing status meanings

### 3. **Delivery Details**
- Full delivery information
- Current GPS coordinates
- Interactive map preview
- Delivery timeline/status progression
- Quick link back to map view

### 4. **Offline Support**
- Deliveries cached in AsyncStorage
- App works without internet
- Automatic sync when connection restores

### 5. **Notifications**
- Permission handling
- Demo notification triggers
- Background task setup pattern

## Code Quality

- ✅ **TypeScript strict mode** - Type-safe throughout
- ✅ **Commented code** - Clear explanation of complex logic
- ✅ **Error handling** - Graceful failures with fallbacks
- ✅ **Performance** - React Compiler for optimization
- ✅ **Accessibility** - Proper touch targets and contrast

## Interview Highlights

This demo showcases:

1. **Mobile Architecture** - Proper Expo Router setup with typed routes
2. **Real-time Features** - Simulated GPS tracking and live updates
3. **Native Capabilities** - Maps, location, notifications integration
4. **State Management** - Clean React hooks patterns
5. **Data Persistence** - Offline-first design
6. **Production Ready** - Error handling, permissions, types
7. **Code Quality** - Well-commented, professional structure

## Sample Data

The app includes 4 sample deliveries:
1. John Smith - Downtown (in transit)
2. Sarah Johnson - Park Area (in transit)  
3. Mike Davis - Midtown (pending)
4. Emma Wilson - Theater District (delivered)

Real GPS coordinates are NYC landmarks for map reference.

## Next Steps for Production

- Replace mock API with real backend endpoints
- Implement actual GPS tracking with background services
- Add authentication and authorization
- Set up real push notification service
- Add delivery proof (photo/signature)
- Implement payment processing
- Add customer communication features

## Notes

- Maps require Google Maps API key in `app.json`
- Notifications need Firebase setup for production
- Background location requires special permissions on iOS 13+
- Always request permissions before accessing device features

---

Built as a demonstration of React Native best practices for delivery/logistics applications.
