import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Mistake {
  row: number;
  col: number;
  correctWord: string;
  userAnswer: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const {
    words: wordsParam,
    userAnswers: userAnswersParam,
    rows,
    cols,
  } = useLocalSearchParams<{
    words: string;
    userAnswers: string;
    rows: string;
    cols: string;
  }>();

  const words: string[][] = wordsParam ? JSON.parse(wordsParam) : [];
  const userAnswers: string[][] = userAnswersParam
    ? JSON.parse(userAnswersParam)
    : [];
  const numRows = parseInt(rows || "4", 10);
  const numCols = parseInt(cols || "4", 10);

  // Calculate results
  let correct = 0;
  let total = 0;
  const mistakes: Mistake[] = [];

  words.forEach((row, rowIdx) => {
    row.forEach((word, colIdx) => {
      total++;
      const userAnswer = userAnswers[rowIdx]?.[colIdx] || "";
      if (userAnswer.toLowerCase() === word.toLowerCase()) {
        correct++;
      } else {
        mistakes.push({
          row: rowIdx + 1,
          col: colIdx + 1,
          correctWord: word,
          userAnswer: userAnswer || "(empty)",
        });
      }
    });
  });

  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const incorrect = total - correct;

  const handleHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Header */}
        <View style={styles.scoreSection}>
          <Text style={styles.emoji}>🎯</Text>
          <Text style={styles.scoreTitle}>Your Score</Text>
          <Text style={styles.scoreValue}>
            {correct}/{total}
          </Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.correctCard]}>
            <Text style={styles.statIcon}>✓</Text>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={[styles.statValue, styles.correctValue]}>
              {correct}
            </Text>
          </View>
          <View style={[styles.statCard, styles.incorrectCard]}>
            <Text style={styles.statIcon}>✗</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
            <Text style={[styles.statValue, styles.incorrectValue]}>
              {incorrect}
            </Text>
          </View>
        </View>

        {/* Mistakes Review */}
        {mistakes.length > 0 && (
          <View style={styles.mistakesSection}>
            <Text style={styles.mistakesTitle}>Mistakes Review</Text>
            {mistakes.map((mistake, index) => (
              <View key={index} style={styles.mistakeCard}>
                <Text style={styles.mistakePosition}>
                  Row {mistake.row}, Word {mistake.col}
                </Text>
                <View style={styles.mistakeDetails}>
                  <Text style={styles.mistakeUserAnswer}>
                    You wrote:{" "}
                    <Text style={styles.mistakeUserAnswerValue}>
                      "{mistake.userAnswer}"
                    </Text>
                  </Text>
                  <Text style={styles.mistakeCorrect}>
                    Correct:{" "}
                    <Text style={styles.mistakeCorrectValue}>
                      "{mistake.correctWord}"
                    </Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Perfect Score Message */}
        {mistakes.length === 0 && (
          <View style={styles.perfectSection}>
            <Text style={styles.perfectEmoji}>🎉</Text>
            <Text style={styles.perfectText}>Perfect Score!</Text>
            <Text style={styles.perfectSubtext}>
              You remembered all {total} words correctly!
            </Text>
          </View>
        )}

        {/* Home Button */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  scoreTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000",
  },
  percentage: {
    fontSize: 24,
    fontWeight: "600",
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  correctCard: {
    backgroundColor: "#d4edda",
  },
  incorrectCard: {
    backgroundColor: "#f8d7da",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  correctValue: {
    color: "#155724",
  },
  incorrectValue: {
    color: "#721c24",
  },
  mistakesSection: {
    marginBottom: 30,
  },
  mistakesTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  mistakeCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  mistakePosition: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  mistakeDetails: {
    gap: 4,
  },
  mistakeUserAnswer: {
    fontSize: 16,
    color: "#721c24",
  },
  mistakeUserAnswerValue: {
    fontWeight: "600",
  },
  mistakeCorrect: {
    fontSize: 16,
    color: "#155724",
  },
  mistakeCorrectValue: {
    fontWeight: "600",
  },
  perfectSection: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#d4edda",
    borderRadius: 12,
  },
  perfectEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  perfectText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#155724",
  },
  perfectSubtext: {
    fontSize: 16,
    color: "#155724",
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 10,
  },
  homeButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

