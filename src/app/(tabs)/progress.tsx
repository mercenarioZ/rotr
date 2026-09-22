import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ProgressRing } from "@/components/progress-ring";
import { Screen } from "@/components/screen";
import { WeekChart } from "@/components/week-chart";
import { weeklyProgress } from "@/data/routines";
import { useRoutines } from "@/data/routine-store";
import { useTheme } from "@/theme";

export default function ProgressScreen() {
  const { colors, spacing, radius, text, shadows } = useTheme();
  const all = useRoutines();

  const weekTotal = weeklyProgress.reduce((sum, day) => sum + day.total, 0);
  const weekDone = weeklyProgress.reduce((sum, day) => sum + day.completed, 0);
  const weekRatio = weekTotal === 0 ? 0 : weekDone / weekTotal;
  const bestStreak = all.reduce(
    (max, routine) => Math.max(max, routine.streakCount),
    0,
  );
  const activeCount = all.filter((routine) => routine.active).length;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xxxl,
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Text style={[text.micro, { color: colors.inkFaint }]}>
            Your momentum
          </Text>
          <Text style={[text.title, { color: colors.ink }]}>
            A week in rhythm
          </Text>
          <Text style={[text.body, { color: colors.inkMuted }]}>
            Progress lives in the return, not the perfect streak.
          </Text>
        </View>

        <LinearGradient
          colors={[colors.heroAlt, colors.hero]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.hero,
            { borderRadius: radius.xxl, padding: spacing.xl },
            shadows.raised,
          ]}
        >
          <ProgressRing
            progress={weekRatio}
            size={110}
            strokeWidth={10}
            color={colors.onHero}
            trackColor="rgba(255,255,255,0.18)"
          >
            <View style={styles.rateLabel}>
              <Text style={[styles.rateValue, { color: colors.onHero }]}>
                {Math.round(weekRatio * 100)}%
              </Text>
              <Text style={[styles.rateUnit, { color: colors.onHeroMuted }]}>
                complete
              </Text>
            </View>
          </ProgressRing>

          <View style={styles.heroCopy}>
            <Text style={[text.micro, { color: colors.onHeroMuted }]}>
              Weekly pace
            </Text>
            <Text style={[styles.heroMetric, { color: colors.onHero }]}>
              {weekDone}
            </Text>
            <Text style={[text.body, { color: colors.onHeroMuted }]}>
              of {weekTotal} planned moments kept
            </Text>
          </View>
        </LinearGradient>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.line,
              borderRadius: radius.xl,
              padding: spacing.lg,
            },
            shadows.card,
          ]}
        >
          <View style={styles.cardHeading}>
            <View>
              <Text style={[text.heading, { color: colors.ink }]}>
                Daily consistency
              </Text>
              <Text style={[text.meta, { color: colors.inkMuted }]}>
                Last seven days
              </Text>
            </View>
            <View
              style={[styles.legendDot, { backgroundColor: colors.accent }]}
            />
          </View>
          <WeekChart days={weeklyProgress} />
        </View>

        <View style={styles.statsRow}>
          <View
            style={[
              styles.stat,
              {
                backgroundColor: colors.streakSoft,
                borderRadius: radius.xl,
                padding: spacing.lg,
              },
            ]}
          >
            <View style={styles.statTop}>
              <Ionicons name="flame" size={17} color={colors.streak} />
              <Text style={[text.micro, { color: colors.streak }]}>
                Best streak
              </Text>
            </View>
            <Text style={[styles.statValue, { color: colors.ink }]}>
              {bestStreak}
            </Text>
            <Text style={[text.meta, { color: colors.inkMuted }]}>
              days in a row
            </Text>
          </View>

          <View
            style={[
              styles.stat,
              {
                backgroundColor: colors.accentSoft,
                borderRadius: radius.xl,
                padding: spacing.lg,
              },
            ]}
          >
            <View style={styles.statTop}>
              <Ionicons name="leaf" size={17} color={colors.accent} />
              <Text style={[text.micro, { color: colors.accent }]}>
                In motion
              </Text>
            </View>
            <Text style={[styles.statValue, { color: colors.ink }]}>
              {activeCount}
            </Text>
            <Text style={[text.meta, { color: colors.inkMuted }]}>
              active rituals
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: 7,
  },
  hero: {
    minHeight: 194,
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  heroCopy: {
    flex: 1,
  },
  heroMetric: {
    marginTop: 2,
    fontSize: 46,
    lineHeight: 50,
    fontWeight: "800",
    letterSpacing: -1.8,
  },
  rateLabel: {
    alignItems: "center",
  },
  rateValue: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  rateUnit: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  chartCard: {
    borderWidth: StyleSheet.hairlineWidth,
    gap: 22,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  stat: {
    flex: 1,
    minHeight: 144,
    justifyContent: "space-between",
  },
  statTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  statValue: {
    fontSize: 37,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
});
