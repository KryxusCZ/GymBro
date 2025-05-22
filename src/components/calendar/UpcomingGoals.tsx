
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/types";

interface UpcomingGoalsProps {
  upcomingGoals: Goal[];
  calculateGoalProgress: (goal: { currentValue: number; targetValue: number }) => number;
}

export const UpcomingGoals: React.FC<UpcomingGoalsProps> = ({
  upcomingGoals,
  calculateGoalProgress,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingGoals.length > 0 ? (
            upcomingGoals.map(goal => {
              const daysRemaining = Math.ceil(
                (new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              const progressPercentage = calculateGoalProgress(goal);
              
              return (
                <div key={goal.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{goal.title}</h3>
                    <Badge variant="outline">{goal.category}</Badge>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Progress:</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target:</span>
                      <span>{goal.targetValue} {goal.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due:</span>
                      <span className={daysRemaining <= 3 ? "text-red-500 font-medium" : ""}>
                        {daysRemaining} days
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming goals</p>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Create Goal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
