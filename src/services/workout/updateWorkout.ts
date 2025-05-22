import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WorkoutWithExercises } from "./types";

export const updateWorkoutInDatabase = async (
  id: string,
  workout: WorkoutWithExercises
): Promise<boolean> => {
  try {
    // Update the workout main data
    const { error: workoutError } = await supabase
      .from("workouts")
      .update({
        title: workout.title,
        description: workout.description || null,
        duration: workout.duration,
        effort_level: workout.effortLevel,
        energy_expended: workout.energyExpended,
        date: workout.date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (workoutError) throw workoutError;

    // Remove all existing exercises for this workout
    const { error: deleteError } = await supabase
      .from("workout_exercises")
      .delete()
      .eq("workout_id", id);

    if (deleteError) throw deleteError;

    // Insert new exercises
    if (workout.exercises.length > 0) {
      const exercises = workout.exercises.map(exercise => ({
        workout_id: id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        rest_time: exercise.restTime || null,
        notes: exercise.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error: exercisesError } = await supabase
        .from("workout_exercises")
        .insert(exercises);

      if (exercisesError) throw exercisesError;

      // --- Update goals.current_value if needed ---
      // Get the user_id for this workout (fetch from workouts table)
      const { data: workoutRow, error: workoutFetchError } = await supabase
        .from("workouts")
        .select("user_id")
        .eq("id", id)
        .single();

      if (!workoutFetchError && workoutRow) {
        const userId = workoutRow.user_id;
        for (const exercise of workout.exercises) {
          const { data: goal, error: goalError } = await supabase
            .from("goals")
            .select("id,current_value")
            .eq("user_id", userId)
            .eq("exercise_name", exercise.name)
            .single();

          if (!goalError && goal) {
            if (Number(exercise.weight) > Number(goal.current_value)) {
              await supabase
                .from("goals")
                .update({ current_value: exercise.weight, updated_at: new Date().toISOString() })
                .eq("id", goal.id);
            }
          }
        }
      }
      // --- end update goals.current_value ---
    }

    return true;
  } catch (error: any) {
    console.error("Error updating workout:", error);
    toast.error(`Failed to update workout: ${error.message}`);
    return false;
  }
};
