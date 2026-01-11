import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, radius } from "@/constants/theme";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function RecallScreen() {
  const router = useRouter();
  const {
    words: wordsParam,
    rows,
    cols,
    recallTimer,
  } = useLocalSearchParams<{
    words: string;
    rows: string;
    cols: string;
    recallTimer: string;
  }>();

  const words: string[][] = wordsParam ? JSON.parse(wordsParam) : [];
  const numRows = parseInt(rows || "4", 10);
  const numCols = parseInt(cols || "4", 10);
  const timerDuration = parseInt(recallTimer || "2", 10) * 60; // Convert minutes to seconds

  const [userAnswers, setUserAnswers] = useState<string[][]>(() =>
    Array.from({ length: numRows }, () => Array(numCols).fill(""))
  );
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isComplete, setIsComplete] = useState(false);

  const currentRowWords = words[currentRowIndex] || [];
  const currentRowAnswers = userAnswers[currentRowIndex] || [];

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    words.forEach((row, rowIdx) => {
      row.forEach((word, colIdx) => {
        total++;
        const userAnswer = userAnswers[rowIdx]?.[colIdx] || "";
        if (userAnswer.toLowerCase() === word.toLowerCase()) {
          correct++;
        }
      });
    });
    return { correct, total };
  };

  const { correct, total } = calculateScore();

  // Countdown timer
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete]);

  const handleInputChange = (colIndex: number, text: string) => {
    setUserAnswers((prev) => {
      const updated = prev.map((row) => [...row]);
      updated[currentRowIndex][colIndex] = text;
      return updated;
    });
  };

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

  const handleComplete = () => {
    setIsComplete(true);
  };

  const handleSeeResults = () => {
    router.push({
      pathname: "/results" as const,
      params: {
        words: wordsParam,
        userAnswers: JSON.stringify(userAnswers),
        rows: rows,
        cols: cols,
      },
    } as any);
  };

  const isFirstRow = currentRowIndex === 0;
  const isLastRow = currentRowIndex === numRows - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isComplete ? "Results" : "Recall"}
        </Text>
        {isComplete ? (
          <Text style={styles.score}>
            {correct}/{total}
          </Text>
        ) : (
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
        )}
        {isComplete ? (
          <Pressable style={styles.actionButton} onPress={handleSeeResults}>
            <Text style={styles.actionButtonText}>See Results</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.actionButton} onPress={handleComplete}>
            <Text style={styles.actionButtonText}>Complete</Text>
          </Pressable>
        )}
      </View>

      {/* Progress indicator */}
      <Text style={styles.progress}>
        Row {currentRowIndex + 1} of {numRows}
      </Text>

      {/* Words/Inputs display */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.wordsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {currentRowWords.map((word, index) => {
          const userAnswer = currentRowAnswers[index] || "";
          const isCorrect = userAnswer.toLowerCase() === word.toLowerCase();

          if (isComplete) {
            // Inline Results Mode
            return (
              <View
                key={index}
                style={[
                  styles.resultBox,
                  isCorrect ? styles.correctBox : styles.incorrectBox,
                ]}
              >
                <Text
                  style={[
                    styles.userAnswerText,
                    isCorrect ? styles.correctText : styles.incorrectText,
                  ]}
                >
                  {userAnswer || "(empty)"}
                </Text>
                {!isCorrect && (
                  <Text style={styles.correctAnswerText}>✓ {word}</Text>
                )}
              </View>
            );
          }

          // Input Mode
          return (
            <TextInput
              key={index}
              style={styles.inputBox}
              value={userAnswer}
              onChangeText={(text) => handleInputChange(index, text)}
              placeholder={`Word ${index + 1}`}
              placeholderTextColor={Colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
            />
          );
        })}
      </ScrollView>

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
  score: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.md,
  },
  actionButtonText: {
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
  scrollContainer: {
    flex: 1,
  },
  wordsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 12,
    flexGrow: 1,
  },
  inputBox: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: "500",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  correctBox: {
    backgroundColor: Colors.background,
    borderColor: Colors.success,
    borderWidth: 2,
  },
  incorrectBox: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 2,
  },
  userAnswerText: {
    fontSize: 18,
    fontWeight: "500",
  },
  correctText: {
    color: Colors.success,
  },
  incorrectText: {
    color: Colors.textSecondary,
  },
  correctAnswerText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 4,
    fontWeight: "500",
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
