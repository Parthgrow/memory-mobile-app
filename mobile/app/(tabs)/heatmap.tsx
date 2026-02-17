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
import { api, HeatmapResponse } from "@/lib/api";

const DAYS = 90;
const COLUMNS = 6; // 30 days → 5 full columns of 7 + 1 partial is awkward, use 6 cols of 5 rows... actually let's do 7 rows (days of week) like GitHub

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getIntensity(score: number | undefined): number {
  if (score === undefined) return 0;
  if (score <= 25) return 1;
  if (score <= 50) return 2;
  if (score <= 75) return 3;
  return 4;
}

const INTENSITY_COLORS = [
  Colors.border,        // 0: no practice
  "#BFDBFE",            // 1: light blue
  "#7BB3F0",            // 2: medium-light
  "#3B82F6",            // 3: medium
  Colors.primary,       // 4: full primary
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface GridCell {
  dateStr: string;
  dayOfWeek: number;
  dayOfMonth: number;
  month: number;
  score: number | undefined;
  isToday: boolean;
}

function buildGrid(scores: Record<string, number>): {
  cells: GridCell[];
  weeks: GridCell[][];
  monthLabels: { label: string; weekIndex: number }[];
} {
  const today = new Date();
  const cells: GridCell[] = [];

  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = toDateString(d);
    cells.push({
      dateStr,
      dayOfWeek: d.getDay(),
      dayOfMonth: d.getDate(),
      month: d.getMonth(),
      score: scores[dateStr],
      isToday: i === 0,
    });
  }

  // Group into weeks (columns). Each week is an array of 7 slots (Sun-Sat).
  const weeks: GridCell[][] = [];
  let currentWeek: GridCell[] = [];

  // Pad the first week with empty slots before the first day
  const firstDay = cells[0].dayOfWeek;
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null as unknown as GridCell);
  }

  for (const cell of cells) {
    if (cell.dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(cell);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Month labels: mark the first week where a new month appears
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    for (const cell of weeks[w]) {
      if (cell && cell.month !== lastMonth) {
        monthLabels.push({ label: MONTH_LABELS[cell.month], weekIndex: w });
        lastMonth = cell.month;
        break;
      }
    }
  }

  return { cells, weeks, monthLabels };
}

export default function HeatmapScreen() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - (DAYS - 1));

    try {
      const res = await api.getHeatmap(toDateString(from), toDateString(today));
      if (res.error || !res.data) {
        setError(res.error || "Failed to load data.");
        return;
      }
      setScores(res.data.scores);
    } catch {
      setError("Failed to load data. Please try again.");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

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
            fetchData().finally(() => setLoading(false));
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { weeks, monthLabels } = buildGrid(scores);
  const practicedDays = Object.keys(scores).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Last {DAYS} Days</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{practicedDays}</Text>
            <Text style={styles.summaryLabel}>Days Practiced</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {practicedDays > 0
                ? Math.round(
                    Object.values(scores).reduce((a, b) => a + b, 0) /
                      practicedDays
                  )
                : "\u2014"}
            </Text>
            <Text style={styles.summaryLabel}>Avg Score</Text>
          </View>
        </View>

        {/* Heatmap grid */}
        <View style={styles.gridContainer}>
          {/* Day labels (rows) */}
          <View style={styles.dayLabels}>
            {DAY_LABELS.map((label, i) => (
              <View key={i} style={styles.dayLabelCell}>
                {i % 2 === 1 ? (
                  <Text style={styles.dayLabelText}>{label}</Text>
                ) : null}
              </View>
            ))}
          </View>

          {/* Grid columns */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Month labels row */}
              <View style={styles.monthRow}>
                {weeks.map((_, w) => {
                  const ml = monthLabels.find((m) => m.weekIndex === w);
                  return (
                    <View key={w} style={styles.monthCell}>
                      {ml ? (
                        <Text style={styles.monthText}>{ml.label}</Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>

              {/* Grid rows */}
              {DAY_LABELS.map((_, rowIdx) => (
                <View key={rowIdx} style={styles.gridRow}>
                  {weeks.map((week, colIdx) => {
                    const cell = week[rowIdx];
                    if (!cell) {
                      return <View key={colIdx} style={styles.cell} />;
                    }
                    const intensity = getIntensity(cell.score);
                    return (
                      <View
                        key={colIdx}
                        style={[
                          styles.cell,
                          { backgroundColor: INTENSITY_COLORS[intensity] },
                          cell.isToday && styles.todayCell,
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendLabel}>Less</Text>
          {INTENSITY_COLORS.map((color, i) => (
            <View
              key={i}
              style={[styles.legendCell, { backgroundColor: color }]}
            />
          ))}
          <Text style={styles.legendLabel}>More</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CELL_SIZE = 16;
const CELL_GAP = 3;

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
    marginBottom: 24,
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
  gridContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dayLabels: {
    marginRight: 6,
    marginTop: CELL_SIZE + CELL_GAP, // offset for month label row
  },
  dayLabelCell: {
    height: CELL_SIZE,
    marginBottom: CELL_GAP,
    justifyContent: "center",
  },
  dayLabelText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  monthRow: {
    flexDirection: "row",
    height: CELL_SIZE,
    marginBottom: CELL_GAP,
  },
  monthCell: {
    width: CELL_SIZE,
    marginRight: CELL_GAP,
    justifyContent: "center",
  },
  monthText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  gridRow: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
    marginRight: CELL_GAP,
    marginBottom: CELL_GAP,
    backgroundColor: "transparent",
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  legendCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginHorizontal: 4,
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
