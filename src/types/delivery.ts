// Delivery order types for tracking system
export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  estimatedTime: number; // minutes
  currentLat?: number;
  currentLng?: number;
}

export interface TrackingUpdate {
  deliveryId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}
