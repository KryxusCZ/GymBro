import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Goal, Workout } from "@/types";
import { Loader2, Edit, ArrowLeft, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateGoalProgress } from "@/components/calendar/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const GoalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("goals")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          const goalData: Goal = {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            description: data.description || "",
            targetValue: data.target_value,
            currentValue: data.current_value,
            unit: data.unit,
            startDate: data.start_date,
            endDate: data.end_date,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            exercise_name: data.exercise_name,
          };
          setGoal(goalData);

          // ✅ Fetch workouts for this user
          const { data: workoutData, error: workoutError } = await supabase
            .from("workouts")
            .select("*")  // ✅ just get the JSON field
            .eq("user_id", data.user_id);

          if (workoutError) {
            console.error("Failed to fetch workouts:", workoutError);
          } else if (workoutData) {
            const mapped = workoutData.map((w: any) => ({
              id: w.id,
              userId: w.user_id,
              title: w.title,
              description: w.description || "",
              duration: w.duration,
              energyExpended: w.energy_expended,
              effortLevel: w.effort_level,
              date: w.date,
              exercises: w.workout_exercises || [],
              workout_exercises: w.workout_exercises || [],
              createdAt: w.created_at,
              updatedAt: w.updated_at,
            }));
            setWorkouts(mapped);
          }
        }
      } catch (error) {
        console.error("Error fetching goal:", error);
        toast.error("Failed to load goal details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  const handleUpdateProgress = async (newValue: number) => {
    if (!goal) return;

    try {
      const { error } = await supabase
        .from("goals")
        .update({ current_value: newValue, updated_at: new Date().toISOString() })
        .eq("id", goal.id);

      if (error) throw error;

      setGoal({
        ...goal,
        currentValue: newValue,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Progress updated successfully!");
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress.");
    }
  };

  const handleDelete = async () => {
    if (!goal) return;

    try {
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goal.id);

      if (error) throw error;

      toast.success("Goal deleted successfully!");
      navigate("/goals");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading goal details...</span>
        </div>
      </MainLayout>
    );
  }

  if (!goal) {
    return (
      <MainLayout user={user}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl mb-4">Goal not found</h2>
          <Button onClick={() => navigate("/goals")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>
        </div>
      </MainLayout>
    );
  }

  const progressPercentage = calculateGoalProgress(goal, workouts);
  const daysRemaining = Math.ceil(
    (new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysRemaining < 0;
  const isCompleted = progressPercentage >= 100;

  return (
    <MainLayout user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/goals")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/goals/edit/${goal.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{goal.title}</CardTitle>
              </div>
              <div
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  isCompleted
                    ? "bg-green-100 text-green-800"
                    : isExpired
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {isCompleted ? "Completed" : isExpired ? "Expired" : "Active"}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {goal.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p>{goal.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Progress</h3>
              <div className="mb-2">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span>{goal.currentValue} {goal.unit}</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
                <span>{goal.targetValue} {goal.unit}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Time Frame</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Start Date:</span>
                    <span className="text-sm font-medium">
                      {new Date(goal.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">End Date:</span>
                    <span className="text-sm font-medium">
                      {new Date(goal.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Days Remaining:</span>
                    <span
                      className={`text-sm font-medium ${
                        daysRemaining <= 3 && daysRemaining > 0
                          ? "text-amber-600"
                          : daysRemaining <= 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Optional manual progress input */}
              {/* 
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Update Progress</h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="any"
                    defaultValue={goal.currentValue}
                    id="progress-input"
                    className="max-w-40"
                  />
                  <span className="flex items-center">{goal.unit}</span>
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById("progress-input") as HTMLInputElement;
                      if (input) {
                        handleUpdateProgress(parseFloat(input.value));
                      }
                    }}
                  >
                    Update
                  </Button>
                </div>
              </div>
              */}
            </div>
          </CardContent>

          <CardFooter className="text-sm text-muted-foreground">
            Last updated: {new Date(goal.updatedAt).toLocaleString()}
          </CardFooter>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default GoalDetail;
