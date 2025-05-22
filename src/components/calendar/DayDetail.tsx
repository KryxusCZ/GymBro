
import React from 'react';
import { format } from 'date-fns';
import { Workout } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface DayDetailProps {
  date: Date;
  workouts: Workout[];
}

export const DayDetail = ({ date, workouts }: DayDetailProps) => {
  const formattedDate = format(date, 'dd MMMM yyyy');
  
  const getWorkoutIcon = (workout: Workout) => {
    // Since we now focus exclusively on weightlifting workouts
    return <Dumbbell className="h-5 w-5" />;
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">{formattedDate}</h2>
      
      {workouts.length === 0 ? (
        <p className="text-muted-foreground">No workouts scheduled for this day.</p>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div key={workout.id} className="flex items-center p-3 rounded-lg bg-card border">
              <div className="mr-3 p-2 rounded-full bg-primary/10">
                {getWorkoutIcon(workout)}
              </div>
              <div className="flex-grow">
                <div className="font-medium">{workout.title}</div>
                <div className="text-sm text-muted-foreground">
                  {workout.duration} min • Weightlifting
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
