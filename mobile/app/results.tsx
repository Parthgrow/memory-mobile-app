import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, radius } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { authStorage } from "@/lib/auth";

interface Mistake {
  row: number;
  col: number;
  correctWord: string;
  userAnswer: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
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

  // Save score when component mounts (after calculation)
  useEffect(() => {
    if (isAuthenticated && total > 0) {
      saveScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const saveScore = async () => {
    if (saving) return;
    
    setSaving(true);
    setSaveError(null);
    
    try {
      const token = await authStorage.getToken();
      if (!token) {
        setSaveError('Not authenticated');
        return;
      }
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001';

      console.log("API_URL being called:", `${API_URL}/api/scores`);      
      const response = await fetch(`${API_URL}/api/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: correct }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSaveError(data.error || 'Failed to save score');
      }
    } catch (error) {
      setSaveError('Failed to save score');
      console.error('Score save error:', error);
    } finally {
      setSaving(false);
    }
  };

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
    backgroundColor: Colors.background,
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
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: "400",
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  percentage: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: 16,
    alignItems: "center",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  correctCard: {
    borderColor: Colors.success,
    borderWidth: 2,
  },
  incorrectCard: {
    borderColor: Colors.border,
    borderWidth: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: "400",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "500",
  },
  correctValue: {
    color: Colors.success,
  },
  incorrectValue: {
    color: Colors.textSecondary,
  },
  mistakesSection: {
    marginBottom: 30,
  },
  mistakesTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  mistakeCard: {
    backgroundColor: Colors.background,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mistakePosition: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  mistakeDetails: {
    gap: 4,
  },
  mistakeUserAnswer: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  mistakeUserAnswerValue: {
    fontWeight: "500",
  },
  mistakeCorrect: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  mistakeCorrectValue: {
    fontWeight: "500",
  },
  perfectSection: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  perfectEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  perfectText: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.success,
  },
  perfectSubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 10,
  },
  homeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});

