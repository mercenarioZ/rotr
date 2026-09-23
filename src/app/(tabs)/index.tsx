import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { AgendaCard } from "@/components/agenda-card";
import { EmptyState } from "@/components/empty-state";
import { ProgressRing } from "@/components/progress-ring";
import { QuickTaskComposer } from "@/components/quick-task-composer";
import { Screen } from "@/components/screen";
import { demoUser } from "@/data/routines";
import {
  createManualTask,
  setTaskCompletion,
  useAgenda,
} from "@/data/routine-store";
import { useTheme } from "@/theme";
import type { AgendaItem } from "@/types/routine";

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

/**
 * Sinks completed items to the bottom so what is still open stays in view.
 * Both groups keep the order the store returned, so ticking an item moves it
 * to the end of the finished block instead of shuffling its neighbours.
 */
function pendingFirst(items: AgendaItem[]): AgendaItem[] {
  const open: AgendaItem[] = [];
  const finished: AgendaItem[] = [];
  for (const item of items) {
    (item.task.completed ? finished : open).push(item);
  }
  return [...open, ...finished];
}

export default function TodayScreen() {
  const { colors, spacing, radius, text, shadows } = useTheme();
  const agenda = useAgenda();
  const done = agenda.filter(({ task }) => task.completed).length;
  const ratio = agenda.length === 0 ? 0 : done / agenda.length;
  const remaining = agenda.length - done;
  const ordered = pendingFirst(agenda);
  const now = new Date();

  const message =
    agenda.length === 0
      ? "Your agenda is clear. Make room for something that restores you."
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
            {`${greetingFor(now.getHours())}, ${demoUser.displayName.split(" ")[0]}`}
          </Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.avatarLabel, { color: colors.accent }]}>
            {demoUser.initials}
          </Text>
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
              Today&apos;s agenda
            </Text>
          </View>
          <Text
            style={[text.heading, styles.heroTitle, { color: colors.onHero }]}
          >
            {message}
          </Text>
          <Text style={[text.meta, { color: colors.onHeroMuted }]}>
            {agenda.length === 0
              ? "Nothing scheduled"
              : `${done} of ${agenda.length} complete`}
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
              {agenda.length === 0 ? "—" : Math.round(ratio * 100)}
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
            Today&apos;s agenda
          </Text>
          <Text style={[text.meta, { color: colors.inkMuted }]}>
            Routines and one-off tasks
          </Text>
        </View>
        <View
          style={[styles.countBadge, { backgroundColor: colors.accentSoft }]}
        >
          <Text style={[styles.countText, { color: colors.accent }]}>
            {agenda.length}
          </Text>
        </View>
      </View>

      <QuickTaskComposer onCreate={(title) => createManualTask({ title })} />
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={ordered}
        keyExtractor={({ task }) => task.id}
        renderItem={({ item, index }) => (
          <AgendaCard item={item} index={index} onToggle={setTaskCompletion} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="leaf-outline"
            title="A quiet day"
            message="No tasks are scheduled. Add a one-off item or enjoy the extra space."
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
