import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { WorkoutForm } from "@/components/workout/WorkoutForm";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWorkoutById } from "@/services/workout";
import { WorkoutFormValues } from "@/components/workout/ExerciseForm";
import { Loader2 } from "lucide-react";

const AddWorkout = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [initialValues, setInitialValues] = useState<WorkoutFormValues | undefined>(undefined);
  const [loading, setLoading] = useState(!!id);
  
  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!id) return;
      
      try {
        const workout = await fetchWorkoutById(id);
        if (workout) {
          // Transform workout data to form values format
          setInitialValues({
            id: workout.id,
            title: workout.title,
            description: workout.description || "",
            duration: workout.duration,
            effortLevel: workout.effortLevel,
            energyExpended: workout.energyExpended,
            date: new Date(workout.date).toISOString().split('T')[0],
            exercises: workout.exercises.map(ex => ({
              id: ex.id,
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
              restTime: ex.restTime,
              notes: ex.notes === null ? "" : ex.notes // <-- fix: ensure notes is never null
            }))
          });
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isEditing) {
      fetchWorkout();
    }
  }, [id, isEditing]);

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading workout data...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Workout</h1>
            <p className="text-muted-foreground">Record your weightlifting session</p>
          </div>
        </div>

        <WorkoutForm isEditing={isEditing} initialValues={initialValues} />
      </div>
    </MainLayout>
  );
};

export default AddWorkout;
