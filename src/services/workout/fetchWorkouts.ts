
import { supabase } from "@/integrations/supabase/client";
import { Workout, Exercise } from "@/types";
import { toast } from "sonner";

export const fetchUserWorkouts = async (): Promise<Workout[]> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch workouts
    const { data: workouts, error: workoutsError } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (workoutsError) {
      throw workoutsError;
    }

    // For each workout, fetch its exercises
    const workoutsWithExercises = await Promise.all(
      workouts.map(async (workout) => {
        // @ts-ignore - The table exists in the database but TypeScript doesn't know about it yet
        const { data: exercises, error: exercisesError } = await supabase
          .from("workout_exercises")
          .select("*")
          .eq("workout_id", workout.id);

        if (exercisesError) {
          console.error("Error fetching exercises:", exercisesError);
          return {
            id: workout.id,
            userId: workout.user_id,
            title: workout.title,
            description: workout.description || "",
            duration: workout.duration,
            energyExpended: workout.energy_expended,
            effortLevel: workout.effort_level,
            date: workout.date,
            exercises: [],
            createdAt: workout.created_at,
            updatedAt: workout.updated_at
          };
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
      })
    );

    return workoutsWithExercises;
  } catch (error: any) {
    console.error("Error fetching workouts:", error);
    toast.error(`Failed to fetch workouts: ${error.message}`);
    return [];
  }
};
