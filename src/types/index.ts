
export type UserRole = "athlete" | "coach";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate: string;
 // category?: "strength" | "endurance" | "flexibility" | "weight" | "other"; // optional if you're removing it
  exercise_name: string; // <- Add this line
  createdAt: string;
  updatedAt: string;
}


export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime?: number; // in seconds
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}


export interface Workout {
  id: string;
  userId: string;
  title: string;
  description: string;
  duration: number; // in minutes
  energyExpended: number; // in kcal
  effortLevel: number; // scale of 1-10
  date: string;
  workout_exercises?: WorkoutExercise[]; 
  createdAt: string;
  updatedAt: string;
}

export interface CoachAthleteRelation {
  id: string;
  coachId: string;
  athleteId: string;
  status: "pending" | "active" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface EnergyCalculationParams {
  weight: number; // in kg
  duration: number; // in minutes
  activityType: string;
  intensityLevel: number; // scale of 1-10
}
