import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Delivery } from '@/types/delivery';
import { fetchDeliveries, simulateLocationUpdate } from '@/services/deliveryService';

// NYC bounds for initial map view
const INITIAL_REGION = {
  latitude: 40.7489,
  longitude: -73.9680,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(true);

  // Load deliveries and start real-time simulation
  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchDeliveries();
        setDeliveries(data);
      } catch (error) {
        console.error('Map load error:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Simulate real-time location updates
  useEffect(() => {
    if (!tracking) return;

    const interval = setInterval(() => {
      setDeliveries((prev) =>
        prev.map((delivery) => simulateLocationUpdate(delivery))
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [tracking]);

  // Get marker color based on delivery status
  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#10b981';
      case 'in_transit':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map showing delivery locations in real-time */}
      {/* Default provider = Apple Maps on iOS, Google on Android.
          Both render without an API key, so the map works out of the box. */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Render markers for each delivery destination */}
        {deliveries.map((delivery) => (
          <Marker
            key={delivery.id}
            coordinate={{
              latitude: delivery.latitude,
              longitude: delivery.longitude,
            }}
            title={delivery.orderId}
            description={delivery.address}
            pinColor={getMarkerColor(delivery.status)}
          />
        ))}

        {/* Render current driver location (simulated) */}
        {deliveries
          .filter((d) => d.status === 'in_transit' && d.currentLat)
          .map((delivery) => (
            <Marker
              key={`driver-${delivery.id}`}
              coordinate={{
                latitude: delivery.currentLat!,
                longitude: delivery.currentLng!,
              }}
              title={`${delivery.orderId} - Driver`}
              description="Live location"
              pinColor="#ef4444"
            />
          ))}
      </MapView>

      {/* Control buttons overlay */}
      <View style={styles.controls}>
        {/* Toggle real-time tracking */}
        <TouchableOpacity
          style={[styles.button, tracking && styles.buttonActive]}
          onPress={() => setTracking(!tracking)}
        >
          <Text style={styles.buttonText}>
            {tracking ? '🔴 Live' : '⏸️ Paused'}
          </Text>
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Map legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendPin, { backgroundColor: '#3b82f6' }]} />
          <Text style={styles.legendText}>In Transit</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendPin, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Pending</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendPin, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Delivered</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 16,
    left: 16,
    gap: 8,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonActive: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendPin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});
