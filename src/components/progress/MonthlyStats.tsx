
import React from "react";
import { format, subMonths } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Workout } from "@/types";

interface MonthlyStatsProps {
  workouts: Workout[];
}

export const MonthlyStats = ({ workouts }: MonthlyStatsProps) => {
  // Prepare data for the monthly workout chart
  const getMonthlyWorkoutStats = () => {
    const now = new Date();
    const last3Months = Array.from({ length: 3 }, (_, i) => 
      format(subMonths(now, i), 'MMM yyyy')
    ).reverse();
    
    return last3Months.map(monthYear => {
      const [monthName, year] = monthYear.split(' ');
      const date = new Date(`${monthName} 1, ${year}`);
      
      const monthWorkouts = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate.getMonth() === date.getMonth() && 
               workoutDate.getFullYear() === date.getFullYear();
      });
      
      return {
        month: monthName,
        count: monthWorkouts.length,
        energy: monthWorkouts.reduce((sum, workout) => sum + workout.energyExpended, 0),
        duration: monthWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Workout Statistics</CardTitle>
        <CardDescription>
          View your workout frequency and performance over the last few months
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getMonthlyWorkoutStats()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="count" name="Workouts" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="energy" name="Energy (kcal)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
