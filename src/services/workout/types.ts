import { Exercise } from "@/types";

export interface WorkoutWithExercises {
  id?: string; // <-- add this line for update support
  title: string;
  description?: string;
  duration: number;
  effortLevel: number;
  energyExpended: number;
  date: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    notes?: string;
    restTime?: number;
  }[];
}

export interface WorkoutExercise {
  workout_id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time?: number | null;
  notes?: string | null;
}
