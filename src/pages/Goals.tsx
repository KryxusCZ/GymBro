import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Goal, Workout } from "@/types";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { getActiveGoals, getGoalProgress, getGoalCurrentValue } from "@/components/calendar/utils";

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoalsAndWorkouts = async () => {
      if (!user) return;

      try {
        const [{ data: goalsData, error: goalsError }, { data: workoutsData, error: workoutsError }] = await Promise.all([
          supabase.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("workouts").select("*, workout_exercises!fk_workout_id(*)").eq("user_id", user.id)
        ]);

        if (goalsError) throw goalsError;
        if (workoutsError) throw workoutsError;

        const transformedGoals: Goal[] = (goalsData || []).map(item => ({
          id: item.id,
          userId: item.user_id,
          title: item.title,
          description: item.description || "",
          targetValue: item.target_value,
          currentValue: item.current_value,
          unit: item.unit,
          startDate: item.start_date,
          endDate: item.end_date,
          exercise_name: item.exercise_name,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));

        setGoals(transformedGoals);
        setWorkouts((workoutsData || []).map(w => ({
          id: w.id,
          userId: w.user_id,
          title: w.title,
          description: w.description || "",
          duration: w.duration,
          energyExpended: w.energy_expended,
          effortLevel: w.effort_level ?? 0,
          date: w.date,
          exercises: Array.isArray(w.workout_exercises) ? [...w.workout_exercises] : [],
          workout_exercises: Array.isArray(w.workout_exercises) ? w.workout_exercises : [],
          createdAt: w.created_at,
          updatedAt: w.updated_at,
        })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalsAndWorkouts();
  }, [user]);

  const activeGoals = getActiveGoals(goals, workouts);
  const completedGoals = goals.filter(goal => getGoalProgress(goal, workouts) >= 100);
  const expiredGoals = goals.filter(goal => {
    const endDate = new Date(goal.endDate);
    const progress = getGoalProgress(goal, workouts);
    return endDate < new Date() && progress < 100;
  });

  const renderGoalList = (goalsToRender: Goal[]) => {
    if (goalsToRender.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No goals found in this category.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/goals/add")}>
            <Plus className="mr-2 h-4 w-4" /> Create Goal
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goalsToRender.map(goal => {
          const progressPercentage = getGoalProgress(goal, workouts);
          const currentValue = getGoalCurrentValue(goal, workouts);
          const daysRemaining = Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <Card key={goal.id} className="overflow-hidden">
              <div className="h-2" style={{
                width: `${progressPercentage}%`,
                backgroundColor: progressPercentage >= 100
                  ? 'var(--success)'
                  : daysRemaining < 0
                    ? 'var(--destructive)'
                    : 'var(--primary)'
              }}></div>
              <CardHeader>
                <CardTitle className="flex justify-between items-start text-base">
                  <span className="line-clamp-2">{goal.title}</span>
                  {goal.exercise_name && (
                    <span className="text-xs font-normal bg-muted px-2 py-1 rounded-md">
                      {goal.exercise_name}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="font-medium">{currentValue} / {goal.targetValue} {goal.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Due:</span>
                    <span className={`font-medium ${
                      daysRemaining <= 3 && daysRemaining > 0
                        ? "text-amber-600"
                        : daysRemaining <= 0
                          ? "text-red-600"
                          : ""
                    }`}>
                      {daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/goals/${goal.id}`)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading goals...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-muted-foreground">Track and manage your fitness goals</p>
        </div>
        <Button className="flex items-center gap-1" onClick={() => navigate("/goals/add")}>
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredGoals.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="p-0">
          {renderGoalList(activeGoals)}
        </TabsContent>
        <TabsContent value="completed" className="p-0">
          {renderGoalList(completedGoals)}
        </TabsContent>
        <TabsContent value="expired" className="p-0">
          {renderGoalList(expiredGoals)}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Goals;
