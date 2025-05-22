import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Award } from "lucide-react";
import { Goal, Workout } from "@/types";
import { getActiveGoals, getGoalProgress, getGoalCurrentValue } from "@/components/calendar/utils";

interface GoalsListProps {
  goals: Goal[];
  workouts: Workout[]; // ✅ You need to pass workouts into this component
}

export const GoalsList = ({ goals, workouts }: GoalsListProps) => {
  const navigate = useNavigate();

  const activeGoals = getActiveGoals(goals, workouts);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Goals</CardTitle>
          <CardDescription>
            Track your progress toward your fitness goals
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/goals')}
        >
          View All Goals
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {activeGoals.length > 0 ? (
          <div className="space-y-6">
            {activeGoals.map(goal => {
              const computedCurrentValue = getGoalCurrentValue(goal, workouts);
              const progressPercent = getGoalProgress(goal, workouts);
              const daysRemaining = Math.ceil(
                (new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={goal.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">{goal.title}</h3>
                    </div>
                    {goal.exercise_name && (
                      <span className="text-xs px-2 py-1 bg-accent rounded-full">
                        {goal.exercise_name}
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{computedCurrentValue} {goal.unit}</span>
                      <span>{goal.targetValue} {goal.unit}</span>
                    </div>
                    <Progress value={progressPercent} />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(progressPercent)}% complete</span>
                    <span className={daysRemaining <= 7 ? "text-amber-500 font-medium" : ""}>
                      {daysRemaining} days remaining
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You don't have any active goals right now.</p>
            <Button onClick={() => navigate('/goals/add')}>Create a Goal</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
