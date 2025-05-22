
import React, { useState, useMemo, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayDetail } from "@/components/calendar/DayDetail";
import { CalendarDisplay } from "@/components/calendar/CalendarDisplay";
import { WeeklySummary } from "@/components/calendar/WeeklySummary";
import { UpcomingGoals } from "@/components/calendar/UpcomingGoals";
import { calculateGoalProgress, getUpcomingGoals } from "@/components/calendar/utils";
import { Workout, Goal } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Calendar = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  useEffect(() => {
    const fetchWorkoutsAndGoals = async () => {
      setLoading(true);
      try {
        if (!user) return;
        
        // Fetch workouts
        const { data: workoutData, error: workoutsError } = await supabase
          .from("workouts")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });
          
        if (workoutsError) throw workoutsError;
        
        // Fetch exercises for each workout
        const workoutsWithExercises = await Promise.all(
          (workoutData || []).map(async (workout) => {
            // @ts-ignore - The database has this table but TypeScript doesn't know about it yet
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
        
        setWorkouts(workoutsWithExercises);
        
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
        console.error("Error fetching data for calendar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutsAndGoals();
  }, [user]);
  
  // Get workouts for the selected date
  const selectedDateWorkouts = useMemo(() => {
    const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
    return workouts.filter(workout => {
      // Convert workout date to the same format for comparison
      const workoutDate = format(parseISO(workout.date), "yyyy-MM-dd");
      return workoutDate === formattedSelectedDate;
    });
  }, [selectedDate, workouts]);

  // Get upcoming goals using the utility function
  const upcomingGoals = useMemo(() => getUpcomingGoals(goals), [goals]);
  
  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading calendar data...</span>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">View and manage your scheduled activities</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="month">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="month" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <CalendarDisplay 
                    workouts={workouts} 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="week" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <WeeklySummary />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="day" className="space-y-4">
              <DayDetail date={selectedDate} workouts={selectedDateWorkouts} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <UpcomingGoals 
                upcomingGoals={upcomingGoals}
                calculateGoalProgress={calculateGoalProgress}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
