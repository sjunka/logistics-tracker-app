import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Delivery } from '@/types/delivery';
import { fetchDeliveries } from '@/services/deliveryService';

export default function DeliveryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);

  // Load delivery details
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDeliveries();
        const found = data.find((d) => d.id === id);
        setDelivery(found || null);
      } catch (error) {
        console.error('Detail load error:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Delivery not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
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

  return (
    <ScrollView style={styles.container}>
      {/* Map preview of delivery location */}
      <MapView
        style={styles.miniMap}
        initialRegion={{
          latitude: delivery.latitude,
          longitude: delivery.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker
          coordinate={{
            latitude: delivery.latitude,
            longitude: delivery.longitude,
          }}
          title={delivery.orderId}
          description={delivery.address}
        />
      </MapView>

      {/* Delivery info card */}
      <View style={styles.infoCard}>
        {/* Order ID */}
        <View style={styles.section}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value}>{delivery.orderId}</Text>
        </View>

        {/* Status badge */}
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(delivery.status) },
            ]}
          >
            <Text style={styles.statusText}>{delivery.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Customer info */}
        <View style={styles.section}>
          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value}>{delivery.customerName}</Text>
        </View>

        {/* Delivery address */}
        <View style={styles.section}>
          <Text style={styles.label}>Delivery Address</Text>
          <Text style={styles.value}>{delivery.address}</Text>
        </View>

        {/* Estimated time */}
        <View style={styles.section}>
          <Text style={styles.label}>Estimated Time</Text>
          <Text style={styles.value}>
            {delivery.status === 'delivered'
              ? 'Delivered'
              : `${delivery.estimatedTime} minutes`}
          </Text>
        </View>

        {/* Current location (if in transit) */}
        {delivery.currentLat && delivery.currentLng && (
          <View style={styles.section}>
            <Text style={styles.label}>Current Location</Text>
            <Text style={styles.gpsText}>
              📍 {delivery.currentLat.toFixed(4)}, {delivery.currentLng.toFixed(4)}
            </Text>
          </View>
        )}

        {/* Timeline / status info */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.label}>Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.dotActive]}>
                <Text style={styles.dotIcon}>✓</Text>
              </View>
              <Text style={styles.timelineText}>Order Placed</Text>
            </View>
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  delivery.status !== 'pending' && styles.dotActive,
                ]}
              >
                <Text style={styles.dotIcon}>
                  {delivery.status !== 'pending' ? '✓' : '•'}
                </Text>
              </View>
              <Text style={styles.timelineText}>Out for Delivery</Text>
            </View>
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  delivery.status === 'delivered' && styles.dotActive,
                ]}
              >
                <Text style={styles.dotIcon}>
                  {delivery.status === 'delivered' ? '✓' : '•'}
                </Text>
              </View>
              <Text style={styles.timelineText}>Delivered</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/map')}
        >
          <Text style={styles.actionButtonText}>🗺️ View on Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>← Back to Deliveries</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniMap: {
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  lastSection: {
    marginBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  gpsText: {
    fontSize: 14,
    color: '#3b82f6',
    fontFamily: 'Courier',
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dotActive: {
    backgroundColor: '#10b981',
  },
  dotIcon: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  timelineText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 2,
  },
  actions: {
    padding: 12,
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
