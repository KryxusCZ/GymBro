import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Dumbbell, Target, Calendar, Flame } from "lucide-react";
import { useProgressData } from "@/hooks/useProgressData";
import { StatCard } from "@/components/progress/StatCard";
import { MonthlyStats } from "@/components/progress/MonthlyStats";
import { GoalsList } from "@/components/progress/GoalsList";
import { ActivityCalendar } from "@/components/progress/ActivityCalendar";
import { getActiveGoals, getGoalProgress, getGoalCurrentValue } from "@/components/calendar/utils";
import { format, parseISO } from "date-fns";
import { TopExercises } from "@/components/progress/TopExercises"; // <- You'll need to create this

const ProgressPage = () => {
  const { user } = useAuth();
  const { workouts, goals, loading } = useProgressData(user);

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading progress data...</span>
        </div>
      </MainLayout>
    );
  }

  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

  const thisMonthWorkouts = workouts.filter(
    workout => new Date(workout.date).getMonth() === thisMonth
  );

  const lastMonthWorkouts = workouts.filter(
    workout => new Date(workout.date).getMonth() === lastMonth
  );

  const totalEnergy = thisMonthWorkouts.reduce(
    (sum, workout) => sum + workout.energyExpended, 0
  );

  const lastMonthEnergy = lastMonthWorkouts.reduce(
    (sum, workout) => sum + workout.energyExpended, 0
  );

  const energyDelta = totalEnergy - lastMonthEnergy;
  const workoutDelta = thisMonthWorkouts.length - lastMonthWorkouts.length;

  const activeGoals = getActiveGoals(goals, workouts);

  return (
    <MainLayout user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground">
          View your fitness journey progress and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Dumbbell}
          title="Total Workouts"
          value={workouts.length}
          subtitle={`${workoutDelta >= 0 ? '+' : ''}${workoutDelta} vs last month`}
        />

        <StatCard
          icon={Target}
          title="Active Goals"
          value={activeGoals.length}
          subtitle={activeGoals.length > 0 ?
            `${Math.round(
              activeGoals.reduce((sum, goal) => sum + getGoalProgress(goal, workouts), 0) / activeGoals.length
            )}% avg completion` :
            'No active goals'}
        />


        <StatCard
          icon={Flame}
          title="This Month"
          value={thisMonthWorkouts.length}
          subtitle={`${totalEnergy.toLocaleString()} kcal (${energyDelta >= 0 ? '+' : ''}${energyDelta} vs last month)`}
        />
      </div>

      <Tabs defaultValue="stats" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="goals">Goal Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity Calendar</TabsTrigger>
          <TabsTrigger value="top">Top Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <MonthlyStats workouts={workouts} />
        </TabsContent>

        <TabsContent value="goals">
          <GoalsList goals={goals} workouts={workouts} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityCalendar workouts={workouts} />
        </TabsContent>

        <TabsContent value="top">
          <TopExercises workouts={workouts} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ProgressPage;
