import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal, User, Workout, CoachAthleteRelation, UserRole } from "@/types";
import { GoalProgressCard } from "./GoalProgressCard";
import { RecentWorkoutsCard } from "./RecentWorkoutsCard";
import { EnergyExpenditureChart } from "./EnergyExpenditureChart";
import { TotalMetricsCard } from "./TotalMetricsCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getActiveGoals, getGoalProgress, getGoalCurrentValue } from "@/components/calendar/utils";

interface AthleteDashboardProps {
  user: User;
  goals: Goal[];
  workouts: Workout[];
}

export const AthleteDashboard: React.FC<AthleteDashboardProps> = ({
  user,
  goals,
  workouts,
}) => {
  const navigate = useNavigate();

  const [coaches, setCoaches] = useState<User[]>([]); // List of available coaches
  const [selectedCoach, setSelectedCoach] = useState<string>("");

  useEffect(() => {
    // Fetch coaches that are available for selection
    const fetchCoaches = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, avatar_url, role") // Ensure these columns exist in profiles table
        .eq("role", "coach"); // Only fetch coaches

      if (error) {
        console.error("Error loading coaches:", error);
        toast.error("Failed to load coaches.");
        return;
      }

      if (data) {
        const mappedCoaches: User[] = data.map((coach: any) => ({
          id: coach.id,
          name: coach.name,
          email: coach.email,
          role: coach.role as UserRole,
          avatarUrl: coach.avatar_url,
        }));

        setCoaches(mappedCoaches);
      }
    };

    fetchCoaches();
  }, []);

  const handleAssignCoach = async () => {
    if (!selectedCoach) return;

    // Create a new relationship in the coach_athletes table
    const { error } = await supabase
      .from("coach_athletes")
      .insert([
        {
          coach_id: selectedCoach,
          athlete_id: user.id,
          status: "pending", // Set the initial status to "pending"
        },
      ]);

    if (error) {
      console.error("Error assigning coach:", error);
      toast.error("Failed to assign coach.");
    } else {
      toast.success("Coach assigned successfully!");
    }
  };

  const totalEnergy = workouts.reduce((sum, w) => sum + w.energyExpended, 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const avgEffort =
    workouts.length > 0
      ? workouts.reduce((sum, w) => sum + w.effortLevel, 0) / workouts.length
      : 0;
  const activeGoals = getActiveGoals(goals, workouts);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name || "Athlete"}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your fitness progress
        </p>
      </div>

      {/* --- Choose Coach --- */}
      {user.role === "athlete" && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Coach</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <select
              className="p-2 border rounded-md w-full sm:w-auto"
              style={{ color: "#000" }}
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
            >
              <option value="" style={{ color: "#000" }}>-- select coach --</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id} style={{ color: "#000" }}>
                  {coach.name}
                </option>
              ))}
            </select>
            <Button onClick={handleAssignCoach} disabled={!selectedCoach}>
              Confirm Coach
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalMetricsCard
          title="Total Energy"
          value={`${totalEnergy.toLocaleString()}`}
          unit="kcal"
          icon="activity"
        />
        <TotalMetricsCard
          title="Training Time"
          value={`${Math.round(totalDuration / 60)}`}
          unit="hours"
          icon="clock"
        />
        <TotalMetricsCard
          title="Avg Effort"
          value={`${avgEffort.toFixed(1)}`}
          unit="/10"
          icon="trending-up"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Energy Expenditure</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/workouts/add")}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <EnergyExpenditureChart workouts={workouts} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Goal Progress</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/goals/add")}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.slice(0, 3).map((goal) => (
                <GoalProgressCard key={goal.id} goal={goal} workouts={workouts} />
              ))}
              {activeGoals.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No active goals. Set a new goal to track your progress.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      <div>
        <RecentWorkoutsCard workouts={workouts} limit={5} />
      </div>
    </div>
  );
};
