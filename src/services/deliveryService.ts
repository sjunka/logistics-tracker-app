import AsyncStorage from '@react-native-async-storage/async-storage';
import { Delivery } from '@/types/delivery';

// Mock delivery data - simulates REST API response
const mockDeliveries: Delivery[] = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    customerName: 'John Smith',
    address: '123 Main St, City Center',
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'in_transit',
    estimatedTime: 15,
    currentLat: 40.7100,
    currentLng: -74.0100,
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    customerName: 'Sarah Johnson',
    address: '456 Park Ave, Downtown',
    latitude: 40.7505,
    longitude: -73.9680,
    status: 'in_transit',
    estimatedTime: 25,
    currentLat: 40.7400,
    currentLng: -73.9700,
  },
  {
    id: '3',
    orderId: 'ORD-2024-003',
    customerName: 'Mike Davis',
    address: '789 5th Ave, Midtown',
    latitude: 40.7614,
    longitude: -73.9776,
    status: 'pending',
    estimatedTime: 45,
    currentLat: 40.7500,
    currentLng: -73.9500,
  },
  {
    id: '4',
    orderId: 'ORD-2024-004',
    customerName: 'Emma Wilson',
    address: '321 Broadway, Theater District',
    latitude: 40.7489,
    longitude: -73.9680,
    status: 'delivered',
    estimatedTime: 0,
    currentLat: 40.7489,
    currentLng: -73.9680,
  },
];

// Simulates fetching deliveries from backend API
export async function fetchDeliveries(): Promise<Delivery[]> {
  try {
    // Try to get cached data first (offline capability)
    const cached = await AsyncStorage.getItem('deliveries');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.log('Cache read error:', error);
  }

  // In production: const response = await fetch('https://api.cigo.com/deliveries');
  // For demo: return mock data
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  // Cache for offline access
  await AsyncStorage.setItem('deliveries', JSON.stringify(mockDeliveries)).catch(
    () => {}
  );

  return mockDeliveries;
}

// Simulates real-time location update from delivery driver
export function simulateLocationUpdate(delivery: Delivery): Delivery {
  if (delivery.status === 'delivered') return delivery;

  // Move towards destination with slight randomness
  const latStep = (delivery.latitude - (delivery.currentLat || delivery.latitude)) * 0.3;
  const lngStep = (delivery.longitude - (delivery.currentLng || delivery.longitude)) * 0.3;

  return {
    ...delivery,
    currentLat: (delivery.currentLat || delivery.latitude) + latStep + (Math.random() - 0.5) * 0.001,
    currentLng: (delivery.currentLng || delivery.longitude) + lngStep + (Math.random() - 0.5) * 0.001,
  };
}
