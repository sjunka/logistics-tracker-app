import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission and get device token for push notifications
export async function initializeNotifications(): Promise<string | null> {
  try {
    // Request notification permissions
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
      const permission = await Notifications.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }
    }

    // Get device token for backend to send push notifications
    // In production: send this token to your backend for push notification delivery
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'cigotracker-demo',
    });

    console.log('Push token:', token.data);
    return token.data;
  } catch (error) {
    console.error('Notification init error:', error);
    return null;
  }
}

// Send local notification (demo purposes)
export async function sendDeliveryNotification(
  title: string,
  body: string,
  delay: number = 2
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      badge: 1,
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delay,
    },
  });
}

// Background task simulation - in production would use TaskManager
export async function setupDeliveryTrackingBackground(): Promise<void> {
  // In production: implement via expo-task-manager for actual background processing
  // For demo: this shows the pattern for production code
  console.log('Background tracking initialized');
}
