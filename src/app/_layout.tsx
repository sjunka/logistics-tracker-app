import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#111827',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 16,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="map"
        options={{
          title: 'Delivery Map',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="delivery/[id]"
        options={{
          title: 'Delivery Details',
        }}
      />
    </Stack>
  );
}
