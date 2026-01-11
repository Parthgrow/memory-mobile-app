import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWords } from "../data/words";
import { Colors, radius } from "@/constants/theme";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function PracticeScreen() {
  const router = useRouter();
  const { rows, cols, practiceTimer, recallTimer } = useLocalSearchParams<{
    rows: string;
    cols: string;
    practiceTimer: string;
    recallTimer: string;
  }>();

  const numRows = parseInt(rows || "4", 10);
  const numCols = parseInt(cols || "4", 10);
  const timerDuration = parseInt(practiceTimer || "1", 10) * 60; // Convert minutes to seconds

  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);

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
          recallTimer: recallTimer || "2",
        },
      });
    }
  }, [timeRemaining, router, words, numRows, numCols, recallTimer]);

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
        recallTimer: recallTimer || "120",
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
    backgroundColor: Colors.background,
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
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  timer: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  recallButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.md,
  },
  recallButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  progress: {
    fontSize: 16,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  wordText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },
  navButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  navButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});
