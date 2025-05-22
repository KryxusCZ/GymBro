import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User, Workout, Goal } from "@/types";
import { RecentWorkoutsCard } from "./RecentWorkoutsCard";
import { GoalProgressCard } from "./GoalProgressCard";
import { getActiveGoals } from "@/components/calendar/utils";
import { Loader2 } from "lucide-react";

export const AthleteProgressPage: React.FC = () => {
  const { athleteId } = useParams<{ athleteId: string }>();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthleteData = async () => {
      setLoading(true);
      const { data: athleteData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", athleteId)
        .single();

      const { data: workoutsData } = await supabase
        .from("workouts")
        .select("*, workout_exercises(*)")
        .eq("user_id", athleteId)
        .order("date", { ascending: false });

      const { data: goalsData } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", athleteId);

      setAthlete(athleteData);
      setWorkouts(workoutsData || []);
      setGoals(goalsData || []);
      setLoading(false);
    };

    if (athleteId) fetchAthleteData();
  }, [athleteId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
        <span>Loading...</span>
      </div>
    );
  if (!athlete) return <div className="text-center py-10">Athlete not found.</div>;

  const activeGoals = getActiveGoals(goals, workouts);

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-6 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{athlete.name}'s Dashboard</h1>
          <p className="text-muted-foreground">Track goals and recent workout progress</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                {activeGoals.slice(0, 3).map((goal) => (
                  <GoalProgressCard key={goal.id} goal={goal} workouts={workouts} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No active goals found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentWorkoutsCard workouts={workouts} limit={5} hideActions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
