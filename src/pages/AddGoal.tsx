
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { GoalForm } from "@/components/goals/GoalForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { calculateGoalProgress } from "@/components/calendar/utils";


const AddGoal = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [initialValues, setInitialValues] = useState<any>(undefined);
  const [loading, setLoading] = useState(!!id);

  const isEditing = Boolean(id);

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
          // Transform goal data to form values format
          setInitialValues({
            title: data.title,
            description: data.description || "",
            exercise_name: data.exercise_name || "", // <- use this instead of category
            targetValue: data.target_value,
            currentValue: data.current_value,
            unit: data.unit,
            endDate: new Date(data.end_date).toISOString().split('T')[0],
          });

        }
      } catch (error) {
        console.error("Error fetching goal:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isEditing) {
      fetchGoal();
    }
  }, [id, isEditing]);

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading goal data...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Goal</h1>
            <p className="text-muted-foreground">Set and track your fitness goals</p>
          </div>
        </div>

        <GoalForm isEditing={isEditing} initialValues={initialValues} goalId={id} />
      </div>
    </MainLayout>
  );
};

export default AddGoal;
