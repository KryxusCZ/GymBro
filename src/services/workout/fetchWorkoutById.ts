
import { supabase } from "@/integrations/supabase/client";
import { Workout, Exercise } from "@/types";
import { toast } from "sonner";

export const fetchWorkoutById = async (id: string): Promise<Workout | null> => {
  try {
    // Fetch the workout
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .select("*")
      .eq("id", id)
      .single();

    if (workoutError) {
      throw workoutError;
    }

    // Fetch the exercises for this workout
    // @ts-ignore - The table exists in the database but TypeScript doesn't know about it yet
    const { data: exercises, error: exercisesError } = await supabase
      .from("workout_exercises")
      .select("*")
      .eq("workout_id", workout.id);

    if (exercisesError) {
      throw exercisesError;
    }

    return {
      id: workout.id,
      userId: workout.user_id,
      title: workout.title,
      description: workout.description || "",
      duration: workout.duration,
      energyExpended: workout.energy_expended,
      effortLevel: workout.effort_level,
      date: workout.date,
      exercises: exercises.map((ex: any): Exercise => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        restTime: ex.rest_time,
        notes: ex.notes
      })),
      createdAt: workout.created_at,
      updatedAt: workout.updated_at
    };
  } catch (error: any) {
    console.error("Error fetching workout:", error);
    toast.error(`Failed to fetch workout: ${error.message}`);
    return null;
  }
};
