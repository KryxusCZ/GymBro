import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { WorkoutHeader } from "@/components/workout/WorkoutHeader";
import { WorkoutTabs } from "@/components/workout/WorkoutTabs";
import { QuickWorkoutTemplates } from "@/components/workout/QuickWorkoutTemplates";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Workout } from "@/types";
import { Loader2 } from "lucide-react";

const Workouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from("workouts")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });
          
        if (error) throw error;
        
        // Fetch exercises for each workout
        const workoutsWithExercises = await Promise.all(
          (data || []).map(async (workout) => {
            const { data: exercises } = await supabase
              .from("workout_exercises")
              .select("*")
              .eq("workout_id", workout.id);
            return {
              ...workout,
              workout_exercises: exercises || [],
              exercises: exercises || [],
            };
          })
        );
        
        setWorkouts((workoutsWithExercises || []).map(w => ({
          id: w.id,
          userId: w.user_id,
          title: w.title,
          description: w.description || "",
          duration: w.duration,
          energyExpended: w.energy_expended,
          effortLevel: w.effort_level ?? 0,
          date: w.date,
          exercises: w.workout_exercises || [],
          workout_exercises: w.workout_exercises || [],
          createdAt: w.created_at,
          updatedAt: w.updated_at,
        })));
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  // Group workouts by month
  const groupedByMonth = workouts.reduce((acc, workout) => {
    const month = new Date(workout.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(workout);
    return acc;
  }, {} as Record<string, typeof workouts>);
  
  // Sort months chronologically (newest first)
  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading workouts...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <WorkoutHeader 
        title="Workouts" 
        description="Track and manage your weightlifting workouts"
      />
      
      <div className="mb-6">
        <QuickWorkoutTemplates />
      </div>
      
      <WorkoutTabs 
        groupedByMonth={groupedByMonth} 
        sortedMonths={sortedMonths}
      />
    </MainLayout>
  );
};

export default Workouts;
