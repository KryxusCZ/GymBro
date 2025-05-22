import { User, Goal, Workout, CoachAthleteRelation, Exercise } from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Athlete",
    role: "athlete",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: "2",
    email: "sarah@example.com",
    name: "Sarah Coach",
    role: "coach",
    avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: "3",
    email: "mike@example.com",
    name: "Mike Runner",
    role: "athlete",
    avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: "4",
    email: "lisa@example.com",
    name: "Lisa Lifter",
    role: "athlete",
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg"
  },
];

// Mock Goals
export const mockGoals: Goal[] = [
  {
    id: "1",
    userId: "1",
    title: "Run a 10K",
    description: "Complete a 10K run under 50 minutes",
    targetValue: 50,
    currentValue: 55,
    unit: "minutes",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    category: "endurance",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z"
  },
  {
    id: "2",
    userId: "1",
    title: "Increase Bench Press",
    description: "Bench press 100kg",
    targetValue: 100,
    currentValue: 85,
    unit: "kg",
    startDate: "2023-10-01",
    endDate: "2024-03-31",
    category: "strength",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z"
  },
  {
    id: "3",
    userId: "3",
    title: "Marathon Training",
    description: "Run a full marathon",
    targetValue: 42.2,
    currentValue: 30,
    unit: "km",
    startDate: "2023-10-01",
    endDate: "2024-04-30",
    category: "endurance",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z"
  },
  {
    id: "4",
    userId: "4",
    title: "Weight Loss",
    description: "Lose 10kg before summer",
    targetValue: 10,
    currentValue: 4,
    unit: "kg",
    startDate: "2023-10-01",
    endDate: "2024-05-31",
    category: "weight",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z"
  },
];

// Mock Exercises for Workouts
const chestDayExercises: Exercise[] = [
  { id: "e1", name: "Bench Press", sets: 4, reps: 8, weight: 80 },
  { id: "e2", name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 25 },
  { id: "e3", name: "Cable Flyes", sets: 3, reps: 12, weight: 15 },
  { id: "e4", name: "Dips", sets: 3, reps: 12, weight: 0 }
];

const legDayExercises: Exercise[] = [
  { id: "e5", name: "Squats", sets: 4, reps: 6, weight: 100 },
  { id: "e6", name: "Leg Press", sets: 3, reps: 10, weight: 150 },
  { id: "e7", name: "Lunges", sets: 3, reps: 10, weight: 20 },
  { id: "e8", name: "Calf Raises", sets: 4, reps: 15, weight: 45 }
];

const backDayExercises: Exercise[] = [
  { id: "e9", name: "Deadlifts", sets: 5, reps: 5, weight: 120 },
  { id: "e10", name: "Pull-ups", sets: 4, reps: 8, weight: 0 },
  { id: "e11", name: "Barbell Rows", sets: 3, reps: 10, weight: 60 },
  { id: "e12", name: "Lat Pulldowns", sets: 3, reps: 12, weight: 55 }
];

const shoulderExercises: Exercise[] = [
  { id: "e13", name: "Overhead Press", sets: 4, reps: 8, weight: 45 },
  { id: "e14", name: "Lateral Raises", sets: 3, reps: 12, weight: 10 },
  { id: "e15", name: "Face Pulls", sets: 3, reps: 15, weight: 25 },
];

const armExercises: Exercise[] = [
  { id: "e16", name: "Barbell Curls", sets: 3, reps: 10, weight: 30 },
  { id: "e17", name: "Tricep Pushdowns", sets: 3, reps: 12, weight: 25 },
  { id: "e18", name: "Hammer Curls", sets: 3, reps: 10, weight: 15 },
];

// Mock Workouts
export const mockWorkouts: Workout[] = [
  {
    id: "1",
    userId: "1",
    title: "Chest Day",
    description: "Focus on chest strength and hypertrophy",
    duration: 60,
    energyExpended: 450,
    effortLevel: 8,
    date: "2023-10-15",
    exercises: chestDayExercises,
    createdAt: "2023-10-15T08:00:00Z",
    updatedAt: "2023-10-15T08:30:00Z"
  },
  {
    id: "2",
    userId: "1",
    title: "Leg Day",
    description: "Building lower body strength",
    duration: 75,
    energyExpended: 520,
    effortLevel: 9,
    date: "2023-10-16",
    exercises: legDayExercises,
    createdAt: "2023-10-16T16:00:00Z",
    updatedAt: "2023-10-16T16:45:00Z"
  },
  {
    id: "3",
    userId: "3",
    title: "Back Day",
    description: "Focus on back development and strength",
    duration: 65,
    energyExpended: 480,
    effortLevel: 8,
    date: "2023-10-15",
    exercises: backDayExercises,
    createdAt: "2023-10-15T09:00:00Z",
    updatedAt: "2023-10-15T10:30:00Z"
  },
  {
    id: "4",
    userId: "4",
    title: "Full Body Workout",
    description: "Complete body workout with focus on main muscle groups",
    duration: 90,
    energyExpended: 600,
    effortLevel: 10,
    date: "2023-10-16",
    exercises: [...shoulderExercises, ...armExercises],
    createdAt: "2023-10-16T18:00:00Z",
    updatedAt: "2023-10-16T18:30:00Z"
  },
  {
    id: "5",
    userId: "1",
    title: "Shoulders & Arms",
    description: "Upper body workout targeting shoulders and arms",
    duration: 55,
    energyExpended: 380,
    effortLevel: 7,
    date: "2023-10-18",
    exercises: [...shoulderExercises, ...armExercises],
    createdAt: "2023-10-18T18:00:00Z",
    updatedAt: "2023-10-18T18:40:00Z"
  },
];

// Mock Coach-Athlete Relations
export const mockRelations: CoachAthleteRelation[] = [
  {
    id: "1",
    coachId: "2",
    athleteId: "1",
    status: "active",
    createdAt: "2023-09-01T12:00:00Z",
    updatedAt: "2023-09-01T12:00:00Z"
  },
  {
    id: "2",
    coachId: "2",
    athleteId: "3",
    status: "active",
    createdAt: "2023-09-15T12:00:00Z",
    updatedAt: "2023-09-15T12:00:00Z"
  },
  {
    id: "3",
    coachId: "2",
    athleteId: "4",
    status: "active",
    createdAt: "2023-09-20T12:00:00Z",
    updatedAt: "2023-09-20T12:00:00Z"
  },
];

// Service to get mock data
export const getMockUsers = (): User[] => mockUsers;
export const getMockUserById = (id: string): User | undefined => 
  mockUsers.find(user => user.id === id);

export const getMockGoalsByUserId = (userId: string): Goal[] =>
  mockGoals.filter(goal => goal.userId === userId);

export const getMockWorkoutsByUserId = (userId: string): Workout[] =>
  mockWorkouts.filter(workout => workout.userId === userId);

export const getMockCoachAthletes = (coachId: string): User[] => {
  const athleteIds = mockRelations
    .filter(relation => relation.coachId === coachId && relation.status === "active")
    .map(relation => relation.athleteId);
  
  return mockUsers.filter(user => athleteIds.includes(user.id));
};
