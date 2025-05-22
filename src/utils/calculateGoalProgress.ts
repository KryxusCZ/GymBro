/* import { Goal, Workout } from "@/types";

/**
 * Calculate progress for a goal based on workouts.
 * Automatically computes progress if the goal has an exercise_name.
 * Falls back to manual currentValue otherwise.
 */
/*export function calculateGoalProgress(goal: Goal, workouts?: Workout[]): number {
    if (goal.exercise_name && workouts?.length) {
        let maxWeight = 0;

        workouts.forEach((workout) => {
            workout.exercises.forEach((exercise) => {
                if (exercise.name === goal.exercise_name) {
                    maxWeight = Math.max(maxWeight, exercise.weight);
                }
            });
        });

        return Math.min(100, Math.max(0, (maxWeight / goal.targetValue) * 100));
    }

    // Fallback to manually entered progress
    return Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));
}
*/