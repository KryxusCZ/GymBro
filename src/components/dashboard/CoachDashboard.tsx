import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { AthleteCard } from "./AthleteCard";
import { TotalMetricsCard } from "./TotalMetricsCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface AthleteWithStatus extends User {
  status: "pending" | "active" | "rejected";
}

interface CoachDashboardProps {
  user: User;
  athletes: AthleteWithStatus[];
  onRefresh?: () => void; // optional refresh trigger
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({
  user,
  athletes,
  onRefresh,
}) => {
  const activeAthletes = athletes.filter((a) => a.status === "active");
  const pendingAthletes = athletes.filter((a) => a.status === "pending");

  const handleStatusChange = async (
  athleteId: string,
  newStatus: "active" | "rejected"
) => {
  const { error } = await supabase
    .from("coach_athletes")
    .update({ status: newStatus })
    .eq("coach_id", user.id)
    .eq("athlete_id", athleteId);

  if (error) {
    console.error("❌ Failed to update status:", error);
  } else {
    console.log(`✅ Athlete ${athleteId} updated to ${newStatus}`);
    onRefresh?.(); // Reload data after status change
  }
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coach Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your athletes' progress
          </p>
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            Refresh
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalMetricsCard
          title="Total Athletes"
          value={activeAthletes.length.toString()}
          unit="active"
          icon="users"
        />
        <TotalMetricsCard
          title="Weekly Sessions"
          value="NA"
          unit="tracked"
          icon="calendar"
        />
        <TotalMetricsCard
          title="Team Progress"
          value="NA"
          unit="%"
          icon="trending-up"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Athletes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAthletes.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))}
            {activeAthletes.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No athletes assigned yet. <br />
                Athletes will choose you from their dashboard to appear here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {pendingAthletes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAthletes.map((athlete) => (
                <div
                  key={athlete.id}
                  className="border p-4 rounded-md flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{athlete.name}</p>
                    <p className="text-sm text-muted-foreground">{athlete.email}</p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="success"
                      onClick={() => handleStatusChange(athlete.id, "active")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(athlete.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
