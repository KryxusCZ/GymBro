import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EXERCISES as AVAILABLE_EXERCISES } from "@/lib/exercises";

// Updated schema with currentValue removed
const goalFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  exercise_name: z.string().min(1, "Please select an exercise"),
  targetValue: z.coerce.number().positive("Target value must be positive"),
  unit: z.string().min(1, "Unit is required"),
  endDate: z.string().refine(val => new Date(val) > new Date(), {
    message: "End date must be in the future",
  }),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  isEditing?: boolean;
  initialValues?: Partial<GoalFormValues>;
  goalId?: string;
}

export const GoalForm: React.FC<GoalFormProps> = ({ isEditing = false, initialValues, goalId }) => {
  const navigate = useNavigate();

  const defaultValues: Partial<GoalFormValues> = initialValues || {
    title: "",
    description: "",
    exercise_name: "",
    targetValue: 0,
    unit: "kg",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: GoalFormValues) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        toast.error("You must be logged in to create a goal");
        return;
      }

      const goalData = {
        ...data,
        user_id: user.id,
        start_date: new Date().toISOString(),
        end_date: new Date(data.endDate).toISOString(),
      };

      let response;

      if (isEditing && goalId) {
        response = await supabase
          .from("goals")
          .update({
            title: data.title,
            description: data.description || "",
            exercise_name: data.exercise_name,
            target_value: data.targetValue,
            unit: data.unit,
            end_date: new Date(data.endDate).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", goalId);
      } else {
        response = await supabase
          .from("goals")
          .insert({
            title: data.title,
            description: data.description || "",
            exercise_name: data.exercise_name,
            target_value: data.targetValue,
            unit: data.unit,
            user_id: user.id,
            end_date: new Date(data.endDate).toISOString(),
          });
      }

      if (response.error) throw response.error;

      toast.success(isEditing ? "Goal updated successfully!" : "Goal created successfully!");
      navigate("/goals");
    } catch (error) {
      console.error("Error saving goal:", error);
      toast.error("Failed to save goal. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bench Press 100 kg" {...field} />
              </FormControl>
              <FormDescription>Give your goal a clear, specific title</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exercise_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tracked Exercise</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise to track" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AVAILABLE_EXERCISES.map((exercise) => (
                    <SelectItem key={exercise} value={exercise}>
                      {exercise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>This goal will auto-update based on this exercise.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="More details about your goal..."
                  rows={3}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="kg, lbs, minutes, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/goals")}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update" : "Create"} Goal</Button>
        </div>
      </form>
    </Form>
  );
};
