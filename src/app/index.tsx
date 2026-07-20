import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Delivery } from '@/types/delivery';
import { fetchDeliveries } from '@/services/deliveryService';
import { initializeNotifications } from '@/services/notificationService';

export default function HomeScreen() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize app and fetch deliveries
  useEffect(() => {
    const init = async () => {
      try {
        // Setup push notifications
        await initializeNotifications();

        // Fetch delivery data from API/cache
        const data = await fetchDeliveries();
        setDeliveries(data);
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchDeliveries();
      setDeliveries(data);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Get status badge color
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

  // Render delivery item
  const renderDelivery = ({ item }: { item: Delivery }) => (
    <Link href={`/delivery/${item.id}`} asChild>
      <TouchableOpacity style={styles.deliveryCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderTitle}>{item.orderId}</Text>
            <Text style={styles.customerName}>{item.customerName}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.address}>{item.address}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.etaText}>
            ETA: {item.status === 'delivered' ? 'Delivered' : `${item.estimatedTime} min`}
          </Text>
          <Text style={styles.moreText}>{'→'}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Deliveries</Text>
        <Text style={styles.headerSubtitle}>
          {deliveries.filter((d) => d.status !== 'delivered').length} active
        </Text>
      </View>

      <FlatList
        data={deliveries}
        renderItem={renderDelivery}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollIndicatorInsets={{ right: 1 }}
      />

      {/* Floating action button to map view */}
      <Link href="/map" asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>🗺️</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  listContent: {
    padding: 12,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  customerName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  address: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },
  moreText: {
    fontSize: 18,
    color: '#d1d5db',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 24,
  },
});
