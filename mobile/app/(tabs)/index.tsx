import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { Colors, radius } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const [rows, setRows] = useState("1");
  const [columns, setColumns] = useState("1");
  const [target, setTarget] = useState("1");
  const [practiceTimer, setPracticeTimer] = useState("1");
  const [recallTimer, setRecallTimer] = useState("2");

  const showToast = (type: string, text: string) => {
    Toast.show({
      type: type,
      text1: text,
    });
  };

  const handleStartSession = () => {
    const numRows = parseInt(rows, 10);
    const numCols = parseInt(columns, 10);
    if (isNaN(numRows) || isNaN(numCols)) {
      showToast("error", "Rows and columns cannot be empty");
      return;
    }

    router.push({
      pathname: "/practice",
      params: {
        rows: numRows,
        cols: numCols,
        practiceTimer: practiceTimer,
        recallTimer: recallTimer,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Pressable style={styles.button} onPress={handleStartSession}>
          <Text style={styles.buttonText}>Start a Session</Text>
        </Pressable>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Select Rows</Text>
          <TextInput
            placeholder="Enter the number of rows"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            value={rows}
            onChangeText={(text) => setRows(text.replace(/[^0-9]/g, ""))}
            style={styles.input}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Select Columns</Text>
          <TextInput
            placeholder="Enter the number of columns"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            value={columns}
            onChangeText={(text) => setColumns(text.replace(/[^0-9]/g, ""))}
            style={styles.input}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Target</Text>
          <TextInput
            placeholder="Enter target"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            value={target}
            onChangeText={(text) => setTarget(text.replace(/[^0-9]/g, ""))}
            style={styles.input}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Practice Timer (min)</Text>
          <TextInput
            placeholder="1"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            value={practiceTimer}
            onChangeText={(text) =>
              setPracticeTimer(text.replace(/[^0-9]/g, ""))
            }
            style={[styles.input, styles.inputCenter]}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Recall Timer (min)</Text>
          <TextInput
            placeholder="2"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            value={recallTimer}
            onChangeText={(text) => setRecallTimer(text.replace(/[^0-9]/g, ""))}
            style={[styles.input, styles.inputCenter]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    marginBottom: 32,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: 16,
    minWidth: 140,
  },
  input: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    width: 100,
    backgroundColor: Colors.background,
  },
  inputCenter: {
    textAlign: "center",
  },
});
