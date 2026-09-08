import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import SafeScreen from "../../components/SafeScreen";
import { COLORS } from "../../constants/colors";

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/sign-in");
          },
        },
      ]
    );
  };

  return (
    <SafeScreen>
      <View style={{ flex: 1, padding: 20, backgroundColor: COLORS.background }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 30, color: COLORS.text, textAlign: "center" }}>
          Profile
        </Text>

        {/* <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, color: COLORS.text }}>Name</Text>
          <Text style={{ fontSize: 16, color: COLORS.textLight }}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View> */}

        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, color: COLORS.text }}>Email</Text>
          <Text style={{ fontSize: 16, color: COLORS.textLight }}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 12, marginBottom: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, color: COLORS.text }}>Account Created</Text>
          <Text style={{ fontSize: 16, color: COLORS.textLight }}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: COLORS.primary,
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "600" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
};

export default ProfileScreen;