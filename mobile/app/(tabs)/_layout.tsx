import { Tabs } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, radius } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { clearAllAsyncStorage } from "@/lib/auth";
import Toast from "react-native-toast-message";

function HeaderRight() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    Toast.show({
      type: "success",
      text1: "Logged out successfully",
    });
  };

  const handleClearStorage = async () => {
    await clearAllAsyncStorage();
    Toast.show({
      type: "success",
      text1: "All AsyncStorage cleared",
    });
  };

  return (
    <View style={headerStyles.container}>
      {/* <Pressable style={headerStyles.button} onPress={handleClearStorage}>
        <Text style={headerStyles.buttonText}>Clear Storage</Text>
      </Pressable> */}
      <Pressable
        style={[headerStyles.button, headerStyles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={[headerStyles.buttonText, headerStyles.logoutButtonText]}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: Colors.border,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  logoutButtonText: {
    color: "#FFFFFF",
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontWeight: "500",
        },
        headerRight: () => <HeaderRight />,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Reflection",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="heatmap"
        options={{
          title: "Heatmap",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="revision"
        options={{
          title: "Revision",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="arrow.clockwise" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
