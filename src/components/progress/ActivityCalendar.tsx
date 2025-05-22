
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Workout } from "@/types";

interface ActivityCalendarProps {
  workouts: Workout[];
}

export const ActivityCalendar = ({ workouts }: ActivityCalendarProps) => {
  // Prepare workout activity data for the calendar chart
  const getWorkoutActivityData = () => {
    const startDate = startOfMonth(subMonths(new Date(), 1));
    const endDate = endOfMonth(new Date());
    
    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
    
    return daysInterval.map(date => {
      const dayWorkouts = workouts.filter(workout => 
        isSameDay(new Date(workout.date), date)
      );
      
      return {
        date: format(date, 'MMM dd'),
        count: dayWorkouts.length,
        energy: dayWorkouts.reduce((sum, workout) => sum + workout.energyExpended, 0),
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          View your workout activity over the past 60 days
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getWorkoutActivityData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="energy" name="Energy (kcal)" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
