import React, { useState, useEffect } from "react";
import { AthleteDashboard } from "@/components/dashboard/AthleteDashboard";
import { CoachDashboard } from "@/components/dashboard/CoachDashboard";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserWorkouts } from "@/services/workout";
import { Goal, Workout, User } from "@/types";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [athletes, setAthletes] = useState<User[]>([]);

  const isCoach = user?.role === "coach";

 const fetchAthletes = async () => {
  if (!user?.id) return;

  // Step 1: Get all relations for this coach
  const { data: relations, error: linksError } = await supabase
    .from("coach_athletes")
    .select("athlete_id, status")
    .eq("coach_id", user.id)
    .in("status", ["pending", "active"]);

  if (linksError) {
    console.error("❌ Error fetching athlete links:", linksError);
    setAthletes([]);
    return;
  }

  if (!relations || relations.length === 0) {
    setAthletes([]);
    return;
  }

  const athleteIds = relations.map(r => r.athlete_id);
  const statusMap = Object.fromEntries(relations.map(r => [r.athlete_id, r.status]));

  // Step 2: Fetch profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, role, email")
    .in("id", athleteIds);

  if (profilesError) {
    console.error("❌ Error fetching athlete profiles:", profilesError);
    setAthletes([]);
    return;
  }

  // Step 3: Combine profile + status
  const athleteWithStatus = profiles.map(profile => ({
    ...profile,
    status: statusMap[profile.id] ?? "pending", // fallback
  }));

  setAthletes(athleteWithStatus);
};



  // Fetch workouts, goals (for athletes) and athletes (for coaches)
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        if (isCoach) {
          await fetchAthletes();
        } else {
          const userWorkouts = await fetchUserWorkouts();
          setWorkouts(userWorkouts);

          const { data: goalsData, error: goalsError } = await supabase
            .from("goals")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (goalsError) throw goalsError;

          if (goalsData) {
            const transformedGoals: Goal[] = goalsData.map((item) => ({
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
              updatedAt: item.updated_at,
            }));

            setGoals(transformedGoals);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      {isCoach ? (
        <CoachDashboard user={user} athletes={athletes} onRefresh={fetchAthletes} />
      ) : (
        <AthleteDashboard user={user} goals={goals} workouts={workouts} />
      )}
    </MainLayout>
  );
};

export default Index;
