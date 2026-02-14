import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { api, DailyScore } from "@/lib/api";

interface DayEntry {
  label: string;
  isToday: boolean;
  score: number | null;
}

function formatDate(date: Date, isToday: boolean): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const label = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  return isToday ? `${label} (Today)` : label;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ReflectionScreen() {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    setError(null);

    const today = new Date();
    const days: { date: Date; dateStr: string; isToday: boolean }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push({ date: d, dateStr: toDateString(d), isToday: i === 0 });
    }

    try {
      const results = await Promise.all(
        days.map((day) => api.getDailyScore(day.dateStr))
      );

      const newEntries: DayEntry[] = days.map((day, idx) => {
        const res = results[idx];
        const score =
          res.error || !res.data ? null : (res.data as DailyScore).highestScore;
        return {
          label: formatDate(day.date, day.isToday),
          isToday: day.isToday,
          score,
        };
      });

      setEntries(newEntries);
    } catch {
      setError("Failed to load scores. Please try again.");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchScores().finally(() => setLoading(false));
  }, [fetchScores]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchScores();
    setRefreshing(false);
  }, [fetchScores]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchScores().finally(() => setLoading(false));
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Past 7 Days</Text>

        {(() => {
          const practiced = entries.filter((e) => e.score !== null);
          const count = practiced.length;
          const avg =
            count > 0
              ? Math.round(
                  practiced.reduce((sum, e) => sum + e.score!, 0) / entries.length
                )
              : null;

          return (
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {avg !== null ? avg : "\u2014"}
                </Text>
                <Text style={styles.summaryLabel}>Avg Score</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {count}/{entries.length}
                </Text>
                <Text style={styles.summaryLabel}>Days Practiced</Text>
              </View>
            </View>
          );
        })()}

        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={[styles.headerCell, styles.scoreCell]}>Score</Text>
          </View>

          {entries.map((entry, idx) => (
            <View
              key={idx}
              style={[
                styles.row,
                idx < entries.length - 1 && styles.rowBorder,
              ]}
            >
              <Text style={styles.dateCell}>{entry.label}</Text>
              {entry.score !== null ? (
                <Text style={[styles.scoreValue, styles.scoreCell]}>
                  {entry.score}
                </Text>
              ) : (
                <Text style={[styles.scoreMuted, styles.scoreCell]}>&mdash;</Text>
              )}
            </View>
          ))}
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
  center: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  scrollContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: Colors.background,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  table: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.border,
  },
  headerCell: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dateCell: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  scoreCell: {
    textAlign: "right",
  },
  scoreValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
  scoreMuted: {
    flex: 1,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
