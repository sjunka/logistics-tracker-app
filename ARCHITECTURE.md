# Cigo Tracker Architecture

## App Structure

```
cigotrackerdemo/
├── src/
│   ├── app/                          # Expo Router screens
│   │   ├── _layout.tsx              # Navigation stack (3 routes)
│   │   ├── index.tsx                # HOME: Delivery list
│   │   ├── map.tsx                  # MAP: Live tracking view
│   │   └── delivery/[id].tsx        # DETAILS: Single delivery info
│   │
│   ├── services/                     # Business logic
│   │   ├── deliveryService.ts       # REST API + AsyncStorage
│   │   └── notificationService.ts   # Push notifications
│   │
│   ├── types/                        # TypeScript definitions
│   │   └── delivery.ts              # Delivery & TrackingUpdate types
│   │
│   └── components/                   # Reusable UI (not used, could extend)
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── app.json                          # Expo configuration
└── README_DEMO.md                    # User guide
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      HOME SCREEN                             │
│                   (index.tsx)                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Fetch deliveries on mount                          │   │
│  │ • Display list with status badges                    │   │
│  │ • Show "X active" counter                            │   │
│  │ • Pull-to-refresh handler                            │   │
│  │ • Navigation buttons                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│         ↓                                        ↓             │
│    [Tap item]                               [Tap FAB]        │
│         ↓                                        ↓             │
└─────────────────────────────────────────────────────────────┘
        ↓                                          ↓
┌─────────────────────┐                  ┌──────────────────┐
│  DETAIL SCREEN      │                  │   MAP SCREEN     │
│  (delivery/[id].tsx)│                  │  (map.tsx)       │
│                     │                  │                  │
│ • Mini map preview  │                  │ • Full map view  │
│ • Order info        │←─────────────────→ • Real-time GPS  │
│ • Customer name     │                  │ • Location update│
│ • Address           │                  │ • Live simulation│
│ • Status timeline   │                  │ • Legend         │
│ • GPS coordinates   │                  │ • Tracking toggle│
└─────────────────────┘                  └──────────────────┘
        ↑                                          ↑
        └──────────────────────────────────────────┘
                  [Both link back to HOME]
```

## Service Architecture

### DeliveryService
```
├── Mock Data (4 sample deliveries)
│   └── Mock API response pattern
│
├── fetchDeliveries()
│   ├── Read cache (AsyncStorage)
│   ├── If cached → return immediately
│   ├── Else → simulate network delay
│   ├── Cache new data
│   └── Return deliveries
│
└── simulateLocationUpdate(delivery)
    ├── Skip if already delivered
    ├── Calculate movement toward destination
    ├── Add realistic randomness
    └── Return updated location
```

### NotificationService
```
├── initializeNotifications()
│   ├── Request permissions
│   ├── Get device push token (for backend)
│   └── Register notification handler
│
├── sendDeliveryNotification(title, body, delay)
│   ├── Schedule local notification
│   ├── Set with badge + sound
│   └── Trigger after N seconds
│
└── setupDeliveryTrackingBackground()
    └── Pattern for production background tasks
```

## Real-time Tracking Flow

```
MAP SCREEN MOUNTS
      ↓
useEffect runs
      ↓
setInterval(2 seconds)
      ↓
simulateLocationUpdate() for each delivery
      ↓
Update state with new coordinates
      ↓
MapView re-renders
      ↓
Marker positions update smoothly
      ↓
Continue until [Stop] or screen leaves
```

## State Management Pattern

**Home Screen:**
- `deliveries: Delivery[]` - list of all deliveries
- `loading: boolean` - initial load state
- `refreshing: boolean` - pull-to-refresh state

**Map Screen:**
- `deliveries: Delivery[]` - same delivery list
- `loading: boolean` - initial map load
- `tracking: boolean` - pause/resume simulation

**Detail Screen:**
- `delivery: Delivery | null` - single delivery
- `loading: boolean` - detail fetch

**Service State:**
- AsyncStorage - persistent delivery cache
- Local variables in functions

## Offline Architecture

```
┌─────────────────────────────────┐
│   fetchDeliveries() called      │
├─────────────────────────────────┤
│ 1. Try AsyncStorage.getItem()   │
│    ├─ SUCCESS → return cached   │
│    └─ FAIL    → continue        │
│                                 │
│ 2. Fetch from (mock) API        │
│    ├─ SUCCESS → cache result    │
│    └─ FAIL    → return null     │
│                                 │
│ 3. Display data (cached/new)    │
└─────────────────────────────────┘
```

## Type Safety

All screens and services are fully typed:

```typescript
// Delivery object structure
interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  estimatedTime: number;
  currentLat?: number;
  currentLng?: number;
}

// Component props are typed
// Service returns are typed
// Event handlers are typed
```

## Notifications Flow

```
App Startup
    ↓
initializeNotifications()
    ├─ Request permissions
    ├─ Get push token for server
    └─ Register handler
         ↓
    [Ready to receive notifications]
         ↓
sendDeliveryNotification()
    ├─ Schedule trigger
    ├─ Add badge
    ├─ Set sound
    └─ Display to user
```

## Performance Optimizations

1. **React Compiler** - automatic optimization
2. **Lazy component loading** - Expo Router handles this
3. **Efficient state updates** - targeted setState calls
4. **AsyncStorage caching** - avoid repeated API calls
5. **Controlled re-renders** - minimal component tree

## Interview Talking Points

1. **Real-time tracking** - GPS simulation shows production pattern
2. **Offline-first** - AsyncStorage demonstrates resilience
3. **Proper types** - TypeScript strict mode throughout
4. **Clean architecture** - separation of concerns (services, types, screens)
5. **Error handling** - graceful fallbacks and error states
6. **Mobile patterns** - native capabilities (maps, notifications, location)
7. **User experience** - smooth animations, responsive design
8. **Production ready** - permission handling, error boundaries

## Scalability Notes

To handle 1000s of deliveries:
- Add pagination to list screen
- Implement clustering on map
- Use web workers for calculations
- Optimize AsyncStorage queries
- Add filtering/search
- Implement real WebSocket for actual tracking
