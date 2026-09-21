import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import type { AndroidSymbol, SFSymbol } from 'expo-symbols';

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const palette = {
  green: '#16A34A',
  greenDark: '#15803D',
  greenSoft: '#E7F6EC',
  black: '#0C0F0D',
  ink: '#111827',
  white: '#FFFFFF',
  surface: '#F7F8FA',
  border: '#ECEFF1',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  track: '#E5E7EB',
} as const;

const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

const TAB_BAR_HEIGHT = 60;

const cardShadow = {
  shadowColor: '#0C0F0D',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.06,
  shadowRadius: 16,
  elevation: 3,
};

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type Habit = {
  id: string;
  name: string;
  time: string;
  done: boolean;
};

type Priority = 'alta' | 'media' | 'baja';

type Task = {
  id: string;
  title: string;
  tag: string;
  priority: Priority;
  time: string;
  done: boolean;
};

const HABITS: Habit[] = [
  { id: '1', name: 'Meditar', time: '07:00', done: true },
  { id: '2', name: 'Leer 20 min', time: '13:30', done: true },
  { id: '3', name: 'Entrenar', time: '18:00', done: false },
  { id: '4', name: 'Beber 2L de agua', time: 'Todo el día', done: true },
];

const TASKS: Task[] = [
  { id: '1', title: 'Terminar informe mensual', tag: 'Trabajo', priority: 'alta', time: '09:30', done: false },
  { id: '2', title: 'Llamar al dentista', tag: 'Personal', priority: 'media', time: '12:00', done: true },
  { id: '3', title: 'Revisar PR del equipo', tag: 'Trabajo', priority: 'alta', time: '15:00', done: false },
];

const TABS: { key: string; label: string; ios: SFSymbol; android: AndroidSymbol }[] = [
  { key: 'inicio', label: 'Inicio', ios: 'house.fill', android: 'home_filled' },
  { key: 'habitos', label: 'Hábitos', ios: 'checkmark.circle.fill', android: 'check_circle' },
  { key: 'tareas', label: 'Tareas', ios: 'list.bullet', android: 'list_alt' },
  { key: 'perfil', label: 'Perfil', ios: 'person.crop.circle', android: 'account_circle' },
];

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

type AppIconProps = {
  ios: SFSymbol;
  android: AndroidSymbol;
  size?: number;
  color: string;
};

function AppIcon({ ios, android, size = 22, color }: AppIconProps) {
  return (
    <SymbolView
      name={{ ios, android, web: android }}
      size={size}
      tintColor={color}
      fallback={
        <Text style={{ fontSize: size, lineHeight: size, color }}>•</Text>
      }
    />
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function Avatar() {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>DL</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Header + daily summary                                             */
/* ------------------------------------------------------------------ */

function Header() {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerTextWrap}>
        <Text style={styles.greeting}>Hola, David 👋</Text>
        <Text style={styles.subtitle}>Hoy tienes 4 hábitos y 3 tareas</Text>
      </View>
      <Avatar />
    </View>
  );
}

function DailySummary({ done, total, streak }: { done: number; total: number; streak: number }) {
  const progress = total > 0 ? done / total : 0;
  const progressPercent = `${Math.round(progress * 100)}%` as `${number}%`;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTop}>
        <View>
          <Text style={styles.summaryLabel}>Progreso de hoy</Text>
          <Text style={styles.summaryValue}>
            {done} de {total} hábitos
          </Text>
        </View>
        <View style={styles.streakWrap}>
          <AppIcon ios="flame.fill" android="local_fire_department" size={20} color={palette.green} />
          <Text style={styles.streakValue}>{streak} días</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressPercent }]} />
      </View>

      <Text style={styles.summaryCaption}>
        ¡Sigue así! Llevas {Math.round(progress * 100)}% de tus hábitos completados.
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Hábitos de hoy                                                     */
/* ------------------------------------------------------------------ */

function HabitCard({ habit, onToggle }: { habit: Habit; onToggle: (id: string) => void }) {
  return (
    <Pressable
      onPress={() => onToggle(habit.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: habit.done }}
      accessibilityLabel={habit.name}
      style={[styles.habitCard, habit.done && styles.habitCardDone]}>
      <View style={[styles.habitCheck, habit.done && styles.habitCheckDone]}>
        {habit.done ? (
          <AppIcon ios="checkmark" android="check" size={18} color={palette.white} />
        ) : null}
      </View>
      <Text style={styles.habitName}>{habit.name}</Text>
      <Text style={styles.habitTime}>{habit.time}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/*  Tareas prioritarias                                                */
/* ------------------------------------------------------------------ */

const PRIORITY_COLOR: Record<Priority, string> = {
  alta: palette.black,
  media: palette.green,
  baja: palette.textMuted,
};

const PRIORITY_LABEL: Record<Priority, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

function TaskCard({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  return (
    <View style={styles.taskCard}>
      <View style={[styles.priorityBar, { backgroundColor: PRIORITY_COLOR[task.priority] }]} />

      <View style={styles.taskBody}>
        <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
        <View style={styles.taskMeta}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{task.tag}</Text>
          </View>
          <View style={styles.priorityTag}>
            <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLOR[task.priority] }]} />
            <Text style={styles.priorityText}>{PRIORITY_LABEL[task.priority]}</Text>
          </View>
          <Text style={styles.taskTime}>{task.time}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => onToggle(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        accessibilityLabel={`Marcar ${task.title}`}
        style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
        {task.done ? (
          <AppIcon ios="checkmark" android="check" size={18} color={palette.white} />
        ) : null}
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  FAB + Bottom tab bar                                               */
/* ------------------------------------------------------------------ */

function FloatingActionButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Añadir elemento"
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <AppIcon ios="plus" android="add" size={26} color={palette.white} />
    </Pressable>
  );
}

function BottomTabBar({
  active,
  onChange,
  bottomInset,
}: {
  active: string;
  onChange: (key: string) => void;
  bottomInset: number;
}) {
  return (
    <View style={[styles.tabBar, { paddingBottom: bottomInset }]}>
      {TABS.map((tab) => {
        const focused = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            style={styles.tabItem}>
            <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
              <AppIcon
                ios={tab.ios}
                android={tab.android}
                size={22}
                color={focused ? palette.green : palette.textMuted}
              />
            </View>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen                                                             */
/* ------------------------------------------------------------------ */

export default function HomeScreen() {
  const [habits, setHabits] = useState(HABITS);
  const [tasks, setTasks] = useState(TASKS);
  const [activeTab, setActiveTab] = useState('inicio');

  const doneHabits = habits.filter((h) => h.done).length;

  const toggleHabit = (id: string) =>
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <Header />

        <DailySummary done={doneHabits} total={habits.length} streak={7} />

        <SectionHeader title="Hábitos de Hoy" action="Ver todos" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.habitsRow}>
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} />
          ))}
        </ScrollView>

        <SectionHeader title="Tareas Prioritarias" action="Ver todas" />

        <View style={styles.tasksList}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </View>
      </ScrollView>

      <FloatingActionButton onPress={() => {}} />
      <BottomTabBar active={activeTab} onChange={setActiveTab} bottomInset={0} />
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: TAB_BAR_HEIGHT + 104,
    gap: 20,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.black,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: palette.textSecondary,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: palette.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  avatarText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '700',
  },

  /* Daily summary */
  summaryCard: {
    backgroundColor: palette.black,
    borderRadius: radius.lg,
    padding: 20,
    gap: 16,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  summaryValue: {
    color: palette.white,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  streakWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(22, 163, 74, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  streakValue: {
    color: palette.green,
    fontSize: 15,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.green,
  },
  summaryCaption: {
    color: palette.textMuted,
    fontSize: 13,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.black,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.green,
  },

  /* Habits */
  habitsRow: {
    gap: 12,
    paddingRight: 20,
  },
  habitCard: {
    width: 152,
    borderRadius: radius.lg,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    gap: 14,
    ...cardShadow,
  },
  habitCardDone: {
    borderColor: palette.greenSoft,
    backgroundColor: '#FBFDFB',
  },
  habitCheck: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCheckDone: {
    backgroundColor: palette.green,
    borderColor: palette.green,
  },
  habitName: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.black,
  },
  habitTime: {
    fontSize: 12,
    color: palette.textMuted,
  },

  /* Tasks */
  tasksList: {
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 16,
    paddingRight: 16,
    overflow: 'hidden',
    ...cardShadow,
  },
  priorityBar: {
    width: 4,
    alignSelf: 'stretch',
    marginRight: 14,
  },
  taskBody: {
    flex: 1,
    gap: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.ink,
  },
  taskTitleDone: {
    color: palette.textMuted,
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: palette.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tagText: {
    color: palette.greenDark,
    fontSize: 12,
    fontWeight: '600',
  },
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  taskTime: {
    fontSize: 12,
    color: palette.textMuted,
  },
  taskCheck: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  taskCheckDone: {
    backgroundColor: palette.green,
    borderColor: palette.green,
  },

  /* FAB */
  fab: {
    position: 'absolute',
    right: 20,
    bottom: TAB_BAR_HEIGHT + 24,
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: palette.green,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },

  /* Tab bar */
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIconWrap: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tabIconWrapActive: {
    backgroundColor: palette.greenSoft,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: palette.textMuted,
  },
  tabLabelActive: {
    color: palette.green,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.85,
  },
});
