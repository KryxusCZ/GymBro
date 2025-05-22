import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveWorkoutToDatabase, WorkoutWithExercises } from "@/services/workout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dumbbell, ArrowRight, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EXERCISES } from "@/lib/exercises"; // ✅ optional, for validation or UI

const WORKOUT_TEMPLATES = {
  push: {
    title: "Push Workout",
    description: "Chest, shoulders, and triceps focused workout",
    duration: 60,
    effortLevel: 8,
    energyExpended: 450,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 60, restTime: 90 },
      { name: "Overhead Tricep Extension", sets: 3, reps: 10, weight: 40, restTime: 90 },
      { name: "Incline Dumbbell Press", sets: 3, reps: 12, weight: 20, restTime: 60 },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, weight: 25, restTime: 60 },
      { name: "Chest Fly", sets: 3, reps: 15, weight: 10, restTime: 45 }
    ]
  },
  pull: {
    title: "Pull Workout",
    description: "Back and biceps focused workout",
    duration: 65,
    effortLevel: 7,
    energyExpended: 420,
    exercises: [
      { name: "Deadlift", sets: 4, reps: 6, weight: 80, restTime: 120 },
      { name: "Pull Ups", sets: 3, reps: 8, weight: 0, restTime: 90 },
      { name: "Barbell Row", sets: 3, reps: 10, weight: 50, restTime: 90 },
      { name: "Face Pulls", sets: 3, reps: 15, weight: 20, restTime: 60 },
      { name: "Bicep Curls", sets: 3, reps: 12, weight: 15, restTime: 60 }
    ]
  },
  legs: {
    title: "Legs Workout",
    description: "Quad, hamstring, and calves focused workout",
    duration: 70,
    effortLevel: 9,
    energyExpended: 500,
    exercises: [
      { name: "Back Squat", sets: 4, reps: 8, weight: 70, restTime: 120 },
      { name: "Romanian Deadlift", sets: 3, reps: 10, weight: 60, restTime: 90 },
      { name: "Leg Press", sets: 3, reps: 12, weight: 100, restTime: 90 },
      { name: "Walking Lunges", sets: 3, reps: 12, weight: 20, restTime: 60 },
      { name: "Calf Raises", sets: 4, reps: 15, weight: 30, restTime: 45 }
    ]
  }
};

export function QuickWorkoutTemplates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState({ push: false, pull: false, legs: false });
  const [savedWorkoutIds, setSavedWorkoutIds] = React.useState({ push: null, pull: null, legs: null });

  const handleQuickWorkout = async (type: "push" | "pull" | "legs") => {
    if (!user) return;
    setIsLoading(prev => ({ ...prev, [type]: true }));

    try {
      const template = WORKOUT_TEMPLATES[type];
      const today = new Date().toISOString();

      const workoutData: WorkoutWithExercises = {
        title: template.title,
        description: template.description,
        duration: template.duration,
        effortLevel: template.effortLevel,
        energyExpended: template.energyExpended,
        date: today,
        exercises: template.exercises.map(ex => ({
          ...ex,
          notes: ""
        }))
      };

      const workoutId = await saveWorkoutToDatabase(workoutData);
      if (workoutId) {
        toast.success(`${template.title} has been added to your workouts!`);
        setSavedWorkoutIds(prev => ({ ...prev, [type]: workoutId }));
        navigate(`/workouts/${workoutId}`);
      }
    } catch (error) {
      console.error("Error creating quick workout:", error);
      toast.error("Failed to create workout. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleEditWorkout = (type: "push" | "pull" | "legs") => {
    const workoutId = savedWorkoutIds[type];
    if (workoutId) {
      navigate(`/workouts/edit/${workoutId}`);
    } else {
      handleQuickWorkout(type).then(() => {
        const newId = savedWorkoutIds[type];
        if (newId) navigate(`/workouts/edit/${newId}`);
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Workouts</CardTitle>
        <CardDescription>
          Start a preset workout routine in one click
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["push", "pull", "legs"] as const).map((type) => (
            <WorkoutTemplateCard
              key={type}
              title={WORKOUT_TEMPLATES[type].title}
              description={WORKOUT_TEMPLATES[type].description}
              exerciseCount={WORKOUT_TEMPLATES[type].exercises.length}
              isLoading={isLoading[type]}
              onClick={() => handleQuickWorkout(type)}
              onEdit={() => handleEditWorkout(type)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface WorkoutTemplateCardProps {
  title: string;
  description: string;
  exerciseCount: number;
  isLoading: boolean;
  onClick: () => void;
  onEdit: () => void;
}

function WorkoutTemplateCard({
  title,
  description,
  exerciseCount,
  isLoading,
  onClick,
  onEdit
}: WorkoutTemplateCardProps) {
  return (
    <Card className="bg-accent/10 hover:bg-accent/30 transition-colors">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="px-1"
              onClick={e => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit this template"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-1"
              onClick={onClick}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <h3 className="text-lg font-medium mt-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="mt-auto text-sm font-medium">
          {exerciseCount} exercises
        </div>
      </CardContent>
    </Card>
  );
}
