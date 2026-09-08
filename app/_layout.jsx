import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    <SafeScreen>
      <ClerkProvider 
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <Slot />
      </ClerkProvider>
    </SafeScreen>
  );
}
