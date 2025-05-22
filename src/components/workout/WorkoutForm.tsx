import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutBasicInfo } from "./WorkoutBasicInfo";
import { ExerciseForm, workoutSchema, WorkoutFormValues } from "./ExerciseForm";
import { saveWorkoutToDatabase, WorkoutWithExercises } from "@/services/workout";
import { updateWorkoutInDatabase } from "@/services/workout/updateWorkout";
import { useAuth } from "@/contexts/AuthContext";

interface WorkoutFormProps {
  initialValues?: WorkoutFormValues;
  isEditing?: boolean;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ 
  initialValues,
  isEditing = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 60,
      effortLevel: 7,
      energyExpended: 300,
      date: new Date().toISOString().split("T")[0],
      exercises: [],
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const onSubmit = async (values: WorkoutFormValues) => {
    // Debug: show when submit is triggered
    window.__debug_save_workout_called = true;
    console.log("Save Workout button pressed", values);

    // Fix: Convert null notes to empty string for all exercises
    values.exercises = values.exercises.map(ex => ({
      ...ex,
      notes: ex.notes === null ? "" : ex.notes
    }));

    const formattedDate = values.date.includes('T')
      ? values.date
      : `${values.date}T00:00:00`;

    try {
      toast.info("Submitting workout...");
      console.log("Submitting workout update", { isEditing, values });

      const workoutData: WorkoutWithExercises = {
        id: values.id,
        title: values.title,
        description: values.description,
        duration: values.duration,
        effortLevel: values.effortLevel,
        energyExpended: values.energyExpended,
        date: formattedDate,
        exercises: values.exercises.map(exercise => ({
          name: exercise.name || "",
          sets: exercise.sets || 0,
          reps: exercise.reps || 0,
          weight: exercise.weight || 0,
          notes: exercise.notes,
          restTime: exercise.restTime
        }))
      };

      let workoutId;
      if (isEditing && values.id) {
        const updated = await updateWorkoutInDatabase(values.id, workoutData);
        if (updated) workoutId = values.id;
      } else {
        workoutId = await saveWorkoutToDatabase(workoutData);
      }

      if (workoutId) {
        toast.success(isEditing ? "Workout updated successfully!" : "Workout added successfully!");
        navigate("/workouts");
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout. Please try again.");
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Show validation errors for debugging */}
         
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Workout" : "Workout Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <WorkoutBasicInfo control={form.control} />
            <div className="pt-4">
              <ExerciseForm control={form.control} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t p-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/workouts")}
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="save-workout-btn">
              {isEditing ? "Update Workout" : "Save Workout"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
