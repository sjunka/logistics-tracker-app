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

    // In production, fetch the device push token and send it to your backend:
    //
    //   const token = await Notifications.getExpoPushTokenAsync({
    //     projectId: '<your-eas-project-id>',
    //   });
    //   return token.data;
    //
    // This needs a real EAS project id, so it is skipped in the Expo Go demo.
    // The permission flow above is the part that matters for the walkthrough.
    return 'demo-permissions-granted';
  } catch (error) {
    console.log('Notification init skipped:', error);
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
