import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

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
      <View>
        <Pressable
          style={({ pressed }) => [styles.button]}
          onPress={handleStartSession}
        >
          <Text style={styles.textWhite}>Start a Session</Text>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ marginRight: 43 }}>Select Rows</Text>
          <TextInput
            placeholder="Enter the number of rows"
            keyboardType="numeric"
            value={rows}
            onChangeText={(text) => setRows(text.replace(/[^0-9]/g, ""))}
            style={{
              borderColor: "black",
              borderWidth: 1,
              width: 80, // Set a good width for the TextInput
            }}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "2",
            marginTop: 22,
          }}
        >
          <Text style={{ marginRight: 22 }}>Select Columns</Text>
          <TextInput
            placeholder="Enter the number of columns"
            keyboardType="numeric"
            value={columns}
            onChangeText={(text) => setColumns(text.replace(/[^0-9]/g, ""))}
            style={{
              borderColor: "black",
              borderWidth: 1,
              width: 80,
            }}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "2",
            marginTop: 22,
          }}
        >
          <Text style={{ marginRight: 22 }}>Target</Text>
          <TextInput
            placeholder="Enter the number of columns"
            keyboardType="numeric"
            value={target}
            onChangeText={(text) => setTarget(text.replace(/[^0-9]/g, ""))}
            style={{
              borderColor: "black",
              borderWidth: 1,
              width: 80,
            }}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 22,
          }}
        >
          <Text style={{ marginRight: 22 }}>Practice Timer (min)</Text>
          <TextInput
            placeholder="1"
            keyboardType="numeric"
            value={practiceTimer}
            onChangeText={(text) =>
              setPracticeTimer(text.replace(/[^0-9]/g, ""))
            }
            style={{
              borderColor: "black",
              borderWidth: 1,
              width: 80,
              textAlign: "center",
            }}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 22,
          }}
        >
          <Text style={{ marginRight: 22 }}>Recall Timer (min)</Text>
          <TextInput
            placeholder="2"
            keyboardType="numeric"
            value={recallTimer}
            onChangeText={(text) => setRecallTimer(text.replace(/[^0-9]/g, ""))}
            style={{
              borderColor: "black",
              borderWidth: 1,
              width: 80,
              textAlign: "center",
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "black",
    textDecorationColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 6,
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: "#4CAF50",
  },
  label: {
    fontSize: 16,
  },
  textWhite: {
    color: "white",
  },
});
