import { Goal, Workout } from "@/types";
import { isSameDay } from "date-fns";

// Helper to get all exercises from a workout (handles both workout_exercises and exercises)
function getAllExercisesFromWorkout(workout: Workout): any[] {
  // @ts-ignore
  if (Array.isArray((workout as any).exercises)) {
    // @ts-ignore
    return (workout as any).exercises;
  }
  // @ts-ignore
  if (Array.isArray((workout as any).workout_exercises)) {
    // @ts-ignore
    return (workout as any).workout_exercises;
  }
  return [];
}

// Always use this for current value (highest value from workouts, fallback to manual)
export const getGoalCurrentValue = (goal: Goal, workouts: Workout[]): number => {
  if (!goal.exercise_name || workouts.length === 0) return goal.currentValue;

  // Gather all exercises for the goal's exercise_name within the date range
  const relevantWorkouts = workouts.filter(w =>
    new Date(w.date) >= new Date(goal.startDate) &&
    new Date(w.date) <= new Date(goal.endDate)
  );

  // Flatten all exercises from all workouts
  const allExercises = relevantWorkouts.flatMap(getAllExercisesFromWorkout);

  // Filter for matching exercise name (case-insensitive, trimmed)
  const matching = allExercises.filter(
    ex => ex.name && ex.name.trim().toLowerCase() === goal.exercise_name.trim().toLowerCase()
  );

  if (matching.length === 0) return goal.currentValue;

  // Find the highest weight
  const maxWeight = Math.max(...matching.map(ex => Number(ex.weight) || 0));
  return maxWeight;
};

// Progress from baseline (start value) to target, but if you want progress from 0 to max, use this:
export const getGoalProgress = (goal: Goal, workouts: Workout[]): number => {
  const current = getGoalCurrentValue(goal, workouts);
  return Math.min(100, Math.max(0, (current / goal.targetValue) * 100));
};

// Alias for backward compatibility
export const calculateGoalProgress = getGoalProgress;

// Filter workouts for a specific date
export const getWorkoutsForDate = (workouts: Workout[], date: Date | undefined): Workout[] => {
  if (!date) return [];

  return workouts.filter(workout =>
    date && isSameDay(new Date(workout.date), date)
  );
};

// Get upcoming goals that end within the next 30 days
export const getUpcomingGoals = (goals: Goal[]): Goal[] => {
  return goals.filter(goal => {
    const endDate = new Date(goal.endDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return endDate >= today && endDate <= thirtyDaysFromNow;
  }).sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
};

// Get workout dates for the calendar
export const getWorkoutDates = (workouts: Workout[]): Date[] => {
  return workouts.map(workout => new Date(workout.date));
};

export const getActiveGoals = (goals: Goal[], workouts: Workout[]): Goal[] => {
  const now = new Date();
  return goals.filter(goal => {
    const endDate = new Date(goal.endDate);
    const progress = getGoalProgress(goal, workouts);
    return endDate >= now && progress < 100;
  });
};
