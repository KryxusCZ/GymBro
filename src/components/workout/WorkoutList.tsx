import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell, Clock, Flame, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Workout } from "@/types";
import { useNavigate } from "react-router-dom";

interface WorkoutListProps {
  groupedByMonth: Record<string, Workout[]>;
  sortedMonths: string[];
}

export const WorkoutList = ({ groupedByMonth, sortedMonths }: WorkoutListProps) => {
  const navigate = useNavigate();

  if (sortedMonths.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No workouts found</p>
        <Button onClick={() => navigate("/workouts/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add Your First Workout
        </Button>
      </Card>
    );
  }

  return (
    <>
      {sortedMonths.map(month => (
        <div key={month}>
          <h2 className="text-xl font-semibold mb-4">{month}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedByMonth[month].map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
          <Separator className="my-6" />
        </div>
      ))}
    </>
  );
};

interface WorkoutCardProps {
  workout: Workout;
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const navigate = useNavigate();
  // Use workout_exercises if available, otherwise default to []
  const exercises = workout.workout_exercises ?? [];

  return (
    <Card 
      className="hover:bg-muted/30 transition-colors cursor-pointer" 
      onClick={() => navigate(`/workouts/${workout.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{workout.title}</CardTitle>
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Weightlifting
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(workout.date).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
            <Dumbbell className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Effort Level</span>
            <span className="font-bold text-lg">
              {typeof workout.effortLevel === "number" ? workout.effortLevel : "N/A"}
              <span className="font-medium"> / 10</span>
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
            <Clock className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Duration</span>
            <span className="font-medium">{workout.duration} min</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
            <Flame className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Energy</span>
            <span className="font-medium">{workout.energyExpended} kcal</span>
          </div>
        </div>
        
        {exercises.length > 0 && (
          <p className="text-sm mt-2">
            <span className="font-medium">{exercises.length} exercises</span>
          </p>
        )}
        
        {workout.description && (
          <p className="text-sm line-clamp-2 mt-2">{workout.description}</p>
        )}
      </CardContent>
      <CardFooter className="pt-1">
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={e => {
            e.stopPropagation();
            navigate(`/workouts/${workout.id}`);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
