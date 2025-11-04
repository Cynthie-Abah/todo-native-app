import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const convex = new ConvexReactClient('https://graceful-cormorant-481.convex.cloud');

export default function RootLayout() {

  return(
    <ConvexProvider client={convex}>
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
       </Stack>
      </GestureHandlerRootView>
       
    </SafeAreaProvider>
    </ConvexProvider>
    );
}
