import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Colors, radius } from "@/constants/theme";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    Toast.show({ type: "success", text1: "Logged out successfully" });
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <Text style={styles.email}>{user?.email ?? "—"}</Text>

      <Pressable
        style={styles.linkButton}
        onPress={() => Linking.openURL("https://memory-mobile-app.vercel.app/privacy-policy")}
      >
        <Text style={styles.linkText}>Privacy Policy</Text>
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => Linking.openURL("https://memory-mobile-app.vercel.app/contact")}
      >
        <Text style={styles.linkText}>Contact Developer</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    paddingTop: 60,
    padding: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  email: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 40,
  },
  linkButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    marginBottom: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary,
  },
  logoutButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: radius.sm,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
