import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ProgressRing } from "@/components/progress-ring";
import { RoutineCard } from "@/components/routine-card";
import { Screen } from "@/components/screen";
import { completionRatio, dueToday } from "@/data/routines";
import { toggleRoutine, useRoutines } from "@/data/routine-store";
import { useTheme } from "@/theme";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function TodayScreen() {
  const { colors, spacing, radius, text, shadows } = useTheme();
  const all = useRoutines();

  const today = dueToday(all);
  const done = today.filter((routine) => routine.doneToday).length;
  const ratio = completionRatio(today);
  const remaining = today.length - done;
  const now = new Date();

  const message =
    today.length === 0
      ? "Your day is clear. Make room for something that restores you."
      : remaining === 0
        ? "Everything planned for today is complete. Let the rest of the day be light."
        : remaining === 1
          ? "One small promise left for today."
          : `${remaining} small promises left for today.`;

  const header = (
    <View
      style={{
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
        gap: spacing.xl,
      }}
    >
      <View style={styles.pageHeader}>
        <View style={styles.titleBlock}>
          <Text style={[text.micro, { color: colors.inkFaint }]}>
            {formatDate(now)}
          </Text>
          <Text style={[text.title, { color: colors.ink }]}>
            {greetingFor(now.getHours())}
          </Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.avatarLabel, { color: colors.accent }]}>RT</Text>
        </View>
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
        <View style={styles.heroCopy}>
          <View style={styles.heroEyebrow}>
            <Ionicons name="sparkles" size={14} color={colors.onHeroMuted} />
            <Text style={[text.micro, { color: colors.onHeroMuted }]}>
              Your daily rhythm
            </Text>
          </View>
          <Text
            style={[text.heading, styles.heroTitle, { color: colors.onHero }]}
          >
            {message}
          </Text>
          <Text style={[text.meta, { color: colors.onHeroMuted }]}>
            {today.length === 0
              ? "Nothing scheduled"
              : `${done} of ${today.length} complete`}
          </Text>
        </View>

        <ProgressRing
          progress={ratio}
          size={96}
          strokeWidth={9}
          color={colors.onHero}
          trackColor="rgba(255,255,255,0.18)"
        >
          <View style={styles.ringLabel}>
            <Text style={[styles.ringValue, { color: colors.onHero }]}>
              {today.length === 0 ? "—" : Math.round(ratio * 100)}
            </Text>
            <Text style={[styles.ringUnit, { color: colors.onHeroMuted }]}>
              %
            </Text>
          </View>
        </ProgressRing>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={[text.heading, { color: colors.ink }]}>
            Today&apos;s rituals
          </Text>
          <Text style={[text.meta, { color: colors.inkMuted }]}>
            Move gently, one at a time
          </Text>
        </View>
        <View
          style={[styles.countBadge, { backgroundColor: colors.accentSoft }]}
        >
          <Text style={[styles.countText, { color: colors.accent }]}>
            {today.length}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={today}
        keyExtractor={(routine) => routine.id}
        renderItem={({ item, index }) => (
          <RoutineCard routine={item} index={index} onToggle={toggleRoutine} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="leaf-outline"
            title="A quiet day"
            message="No rituals are scheduled. Enjoy the extra space."
          />
        }
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  hero: {
    minHeight: 188,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    overflow: "hidden",
  },
  heroCopy: {
    flex: 1,
    gap: 10,
  },
  heroEyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  heroTitle: {
    fontSize: 21,
    lineHeight: 28,
  },
  ringLabel: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  ringValue: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },
  ringUnit: {
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countBadge: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 13,
    fontWeight: "800",
  },
});
