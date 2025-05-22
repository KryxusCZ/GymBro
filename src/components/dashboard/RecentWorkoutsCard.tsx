import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout } from "@/types";
import { Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import React from "react";
import { Plus } from "lucide-react";

interface RecentWorkoutsCardProps {
  workouts: Workout[];
  limit?: number;
  hideActions?: boolean; // new prop
}

export function RecentWorkoutsCard({ workouts, limit, hideActions }: RecentWorkoutsCardProps) {
  const navigate = useNavigate();
  
  // Apply limit if provided
  const displayWorkouts = limit ? workouts.slice(0, limit) : workouts;

  const getWorkoutIcon = (workout: Workout) => {
    // Since we now focus exclusively on weightlifting workouts
    return <Dumbbell className="h-5 w-5" />;
  };

  const sortedWorkouts = () => {
    return [...displayWorkouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <p className="text-muted-foreground">No recent workouts.</p>
      <Button variant="link" onClick={() => navigate("/workouts/add")}>
        Add Workout
      </Button>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your most recent activities</CardDescription>
        </div>
        {!hideActions && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => navigate("/workouts/add")}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => navigate("/workouts")}
            >
              View All
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-2">
        {workouts.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-3">
            {sortedWorkouts().map((workout) => (
              <div
                key={workout.id}
                className="flex items-center p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => navigate(`/workouts/${workout.id}`)}
              >
                <div className="mr-3 p-2 rounded-full bg-primary/10">
                  {getWorkoutIcon(workout)}
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{workout.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(workout.date), "MMM d, yyyy")} • Weightlifting
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{workout.duration} min</div>
                  <div className="text-xs text-muted-foreground">
                    {workout.energyExpended} kcal
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
