import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WorkoutWithExercises, WorkoutExercise } from "./types";

export const saveWorkoutToDatabase = async (workout: WorkoutWithExercises): Promise<string | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Step 1: Insert the workout
    const { data: workoutData, error: workoutError } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        title: workout.title,
        description: workout.description || null,
        duration: workout.duration,
        effort_level: workout.effortLevel,
        energy_expended: workout.energyExpended,
        date: workout.date,
        category: "weightlifting"
      })
      .select("id")
      .single();

    if (workoutError) {
      throw workoutError;
    }

    if (!workoutData) {
      throw new Error("Failed to create workout");
    }

    // Step 2: Insert all exercises for this workout
    if (workout.exercises.length > 0) {
      const exercises = workout.exercises.map(exercise => ({
        workout_id: workoutData.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        rest_time: exercise.restTime || null,
        notes: exercise.notes || null
      }));

      // Use the dynamic version of the API to bypass TypeScript's type checking
      // @ts-ignore - The table exists in the database but TypeScript doesn't know about it yet
      const { error: exercisesError } = await supabase
        .from("workout_exercises")
        .insert(exercises);

      if (exercisesError) {
        throw exercisesError;
      }

      // --- Update goals.current_value if needed ---
      for (const exercise of workout.exercises) {
        // Find a matching goal for this user and exercise name
        const { data: goal, error: goalError } = await supabase
          .from("goals")
          .select("id,current_value")
          .eq("user_id", user.id)
          .eq("exercise_name", exercise.name)
          .single();

        if (!goalError && goal) {
          // Only update if the new weight is higher than the current_value
          if (Number(exercise.weight) > Number(goal.current_value)) {
            await supabase
              .from("goals")
              .update({ current_value: exercise.weight, updated_at: new Date().toISOString() })
              .eq("id", goal.id);
          }
        }
      }
      // --- end update goals.current_value ---
    }

    return workoutData.id;
  } catch (error: any) {
    console.error("Error saving workout:", error);
    toast.error(`Failed to save workout: ${error.message}`);
    return null;
  }
};
