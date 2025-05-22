
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Workout, Goal } from "@/types";
import { User } from "@/types";

interface ProgressData {
  workouts: Workout[];
  goals: Goal[];
  loading: boolean;
}

export const useProgressData = (user: User | null): ProgressData => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch workouts
        const { data: workoutData, error: workoutsError } = await supabase
          .from("workouts")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });
          
        if (workoutsError) throw workoutsError;
        
        // Transform workouts data to match the Workout type
        if (workoutData) {
          const transformedWorkouts: Workout[] = await Promise.all(
            workoutData.map(async (workout) => {
              // Fetch exercises for each workout
              const { data: exercises } = await supabase
                .from("workout_exercises")
                .select("*")
                .eq("workout_id", workout.id);
              
              return {
                id: workout.id,
                userId: workout.user_id,
                title: workout.title,
                description: workout.description || "",
                duration: workout.duration,
                energyExpended: workout.energy_expended,
                effortLevel: workout.effort_level,
                date: workout.date,
                exercises: exercises || [],
                createdAt: workout.created_at,
                updatedAt: workout.updated_at
              };
            })
          );
          
          setWorkouts(transformedWorkouts);
        }
        
        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from("goals")
          .select("*")
          .eq("user_id", user.id)
          .order("end_date", { ascending: true });
          
        if (goalsError) throw goalsError;
        
        if (goalsData) {
          const transformedGoals: Goal[] = goalsData.map(item => ({
            id: item.id,
            userId: item.user_id,
            title: item.title,
            description: item.description || "",
            targetValue: item.target_value,
            currentValue: item.current_value,
            unit: item.unit,
            startDate: item.start_date,
            endDate: item.end_date,
            category: item.category as any,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));
          
          setGoals(transformedGoals);
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { workouts, goals, loading };
};
