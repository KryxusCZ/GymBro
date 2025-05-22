import React from "react";
import { Progress } from "@/components/ui/progress";
import { Goal, Workout } from "@/types";
import { getGoalProgress, getGoalCurrentValue } from "@/components/calendar/utils";

interface GoalProgressCardProps {
  goal: Goal;
  workouts?: Workout[];

  
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, workouts = [] }) => {
  // Compute current value and progress from workouts
  console.log("workouts in GoalProgressCard:", workouts);
  const computedCurrentValue = getGoalCurrentValue(goal, workouts);
  const progressPercentage = getGoalProgress(goal, workouts);

  return (
    <div
      className="space-y-2 hover:bg-accent p-2 rounded-lg cursor-pointer border"
      onClick={() => window.location.href = `/goals/${goal.id}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium">{goal.title}</h4>
          {goal.exercise_name && (
            <p className="text-xs text-muted-foreground">{goal.exercise_name}</p>
          )}
        </div>
        <div className="text-xs">
          <span className="font-medium">{computedCurrentValue.toFixed(1)}</span>
          <span className="text-muted-foreground"> / {goal.targetValue} {goal.unit}</span>
        </div>
      </div>

      <div className="relative pt-1">
        <Progress value={progressPercentage} className="h-3" />
        <div className="flex items-center text-xs mt-1 justify-between">
          <span className="text-primary font-medium">{Math.round(progressPercentage)}%</span>
          <span className="text-muted-foreground">
            {computedCurrentValue < goal.targetValue ? (
              <span>Remaining: {(goal.targetValue - computedCurrentValue).toFixed(1)} {goal.unit}</span>
            ) : (
              <span>Completed!</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
