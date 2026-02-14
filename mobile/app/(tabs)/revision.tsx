import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

export default function RevisionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is a revision screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
