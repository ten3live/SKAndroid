import '@/global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStore } from './store';
export default function RootLayout() {
 const {mode}=useStore()
  return (
    <GestureHandlerRootView  style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen  name='index'/>
        <Stack.Screen name='login'/>
        <Stack.Screen name='register'/>
        <Stack.Screen name='forgotpassword'/>
        <Stack.Screen name='resetpassword'/>

        </Stack>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}