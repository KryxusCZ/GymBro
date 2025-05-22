import React from "react";
import { Exercise } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { EXERCISES } from "@/lib/exercises";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, Control } from "react-hook-form";
import { z } from "zod";

// Define schema for an exercise
export const exerciseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Exercise name is required"),
  sets: z.coerce.number().min(1, "At least 1 set is required"),
  reps: z.coerce.number().min(1, "At least 1 rep is required"),
  weight: z.coerce.number().min(0, "Weight must be 0 or higher"),
  restTime: z.coerce.number().optional(),
  notes: z.string().default(""), // <-- make notes required but default to ""
});

export const workoutSchema = z.object({
  id: z.string().optional(), // <-- add this line
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  effortLevel: z.coerce.number().min(1, "Effort level must be between 1-10").max(10, "Effort level must be between 1-10"),
  energyExpended: z.coerce.number().min(1, "Energy expenditure must be at least 1 kcal"),
  date: z.string().min(1, "Please select a date"),
  exercises: z.array(exerciseSchema)
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;

interface ExerciseFormProps {
  control: Control<WorkoutFormValues>;
}

export const ExerciseForm: React.FC<ExerciseFormProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Exercises</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "", sets: 3, reps: 10, weight: 0, notes: "" })} // <-- ensure notes is always initialized
        >
          Add Exercise
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">No exercises added yet.</p>
            <p className="text-sm text-muted-foreground mb-4">Add your first exercise to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 py-2 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Exercise {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`exercises.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Name</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exercise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EXERCISES.map((exercise) => (
                            <SelectItem key={exercise} value={exercise}>
                              {exercise}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={control}
                    name={`exercises.${index}.sets`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sets</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`exercises.${index}.reps`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reps</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`exercises.${index}.weight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
