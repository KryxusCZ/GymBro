
import React from "react";
import { Workout } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EnergyExpenditureChartProps {
  workouts: Workout[];
}

export const EnergyExpenditureChart: React.FC<EnergyExpenditureChartProps> = ({ workouts }) => {
  // Process data for the chart
  const processChartData = () => {
    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group workouts by date and sum energy expenditure
    const groupedData: Record<string, { date: string; energy: number }> = {};

    sortedWorkouts.forEach((workout) => {
      if (!groupedData[workout.date]) {
        groupedData[workout.date] = {
          date: workout.date,
          energy: 0,
        };
      }
      groupedData[workout.date].energy += workout.energyExpended;
    });

    // Convert to array and format dates for display
    return Object.values(groupedData).map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      energy: item.energy,
    }));
  };

  const chartData = processChartData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chartData.length > 0 ? (
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            unit=" kcal"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #eee",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number) => [`${value} kcal`, "Energy"]}
          />
          <Bar
            dataKey="energy"
            fill="#8B5CF6"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No workout data available</p>
        </div>
      )}
    </ResponsiveContainer>
  );
};
