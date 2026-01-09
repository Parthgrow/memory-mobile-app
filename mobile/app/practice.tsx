import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWords } from "./data/words";

const TIMER_DURATION = 60; // seconds

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function PracticeScreen() {
  const router = useRouter();
  const { rows, cols } = useLocalSearchParams<{ rows: string; cols: string }>();

  const numRows = parseInt(rows || "4", 10);
  const numCols = parseInt(cols || "4", 10);

  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);

  // Generate words grid once on mount
  const words = useMemo(() => getWords(numRows, numCols), [numRows, numCols]);

  const currentRowWords = words[currentRowIndex] || [];

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-redirect when time is up
  useEffect(() => {
    if (timeRemaining === 0) {
      router.push({
        pathname: "/recall",
        params: {
          words: JSON.stringify(words),
          rows: numRows.toString(),
          cols: numCols.toString(),
        },
      });
    }
  }, [timeRemaining, router, words, numRows, numCols]);

  const handlePrevious = () => {
    if (currentRowIndex > 0) {
      setCurrentRowIndex(currentRowIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentRowIndex < numRows - 1) {
      setCurrentRowIndex(currentRowIndex + 1);
    }
  };

  const handleRecall = () => {
    router.push({
      pathname: "/recall",
      params: {
        words: JSON.stringify(words),
        rows: numRows.toString(),
        cols: numCols.toString(),
      },
    });
  };

  const isFirstRow = currentRowIndex === 0;
  const isLastRow = currentRowIndex === numRows - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Memorize</Text>
        <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
        <Pressable style={styles.recallButton} onPress={handleRecall}>
          <Text style={styles.recallButtonText}>Recall</Text>
        </Pressable>
      </View>

      {/* Progress indicator */}
      <Text style={styles.progress}>
        Row {currentRowIndex + 1} of {numRows}
      </Text>

      {/* Words display */}
      <View style={styles.wordsContainer}>
        {currentRowWords.map((word, index) => (
          <View key={index} style={styles.wordBox}>
            <Text style={styles.wordText}>{word}</Text>
          </View>
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <Pressable
          style={[styles.navButton, isFirstRow && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={isFirstRow}
        >
          <Text
            style={[
              styles.navButtonText,
              isFirstRow && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, isLastRow && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={isLastRow}
        >
          <Text
            style={[
              styles.navButtonText,
              isLastRow && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  timer: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  recallButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  recallButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  progress: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  wordsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 12,
  },
  wordBox: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  wordText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  navButtonDisabled: {
    backgroundColor: "#ccc",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: "#999",
  },
});
