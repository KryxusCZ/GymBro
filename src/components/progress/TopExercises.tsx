import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout } from "@/types";
import { formatDistanceToNowStrict, subDays } from "date-fns";
import { cn } from "@/lib/utils";

interface TopExercisesProps {
  workouts: Workout[];
}

interface ExerciseStat {
  name: string;
  maxWeight: number;
  lastWeekMax: number;
}

export const TopExercises: React.FC<TopExercisesProps> = ({ workouts }) => {
  const flattenExercises = workouts.flatMap(workout => {
    return workout.exercises.map(ex => ({
      ...ex,
      date: workout.date
    }));
  });

  const grouped: Record<string, { maxWeight: number; lastWeekMax: number }> = {};
  const oneWeekAgo = subDays(new Date(), 7);

  for (const ex of flattenExercises) {
    const name = ex.name;
    const weight = ex.weight;
    const date = new Date(ex.date);

    if (!grouped[name]) {
      grouped[name] = { maxWeight: 0, lastWeekMax: 0 };
    }

    if (weight > grouped[name].maxWeight) {
      grouped[name].maxWeight = weight;
    }

    if (date > oneWeekAgo && weight > grouped[name].lastWeekMax) {
      grouped[name].lastWeekMax = weight;
    }
  }

  const sorted = Object.entries(grouped)
    .map(([name, stats]) => ({
      name,
      maxWeight: stats.maxWeight,
      lastWeekMax: stats.lastWeekMax
    }))
    .sort((a, b) => b.maxWeight - a.maxWeight)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sorted.map((exercise, i) => {
            const percentChange = exercise.lastWeekMax > 0
              ? ((exercise.maxWeight - exercise.lastWeekMax) / exercise.lastWeekMax) * 100
              : 0;
            return (
              <li key={i} className="flex justify-between items-center">
                <span className="font-medium">{exercise.name}</span>
                <div className="text-sm text-muted-foreground">
                  {exercise.maxWeight} kg max
                  {exercise.lastWeekMax > 0 && (
                    <span className={cn("ml-2 text-xs", percentChange >= 0 ? "text-green-500" : "text-red-500")}> 
                      ({percentChange >= 0 ? "+" : ""}{percentChange.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};
