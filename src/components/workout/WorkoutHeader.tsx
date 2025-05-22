
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkoutHeaderProps {
  title: string;
  description: string;
}

export const WorkoutHeader = ({ title, description }: WorkoutHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-2">
        <Button className="flex items-center gap-1" onClick={() => navigate("/workouts/add")}>
          <Plus className="h-4 w-4" />
          <span>Add Workout</span>
        </Button>
      </div>
    </div>
  );
};
