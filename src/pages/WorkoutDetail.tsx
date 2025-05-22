import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, Dumbbell, Flame, Edit, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Workout, Exercise } from "@/types";
import { toast } from "sonner";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWorkoutById, deleteWorkout } from "@/services/workout";
import { useAuth } from "@/contexts/AuthContext";

const WorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) return;
      try {
        const data = await fetchWorkoutById(id);
        setWorkout(data);
      } catch (error) {
        console.error("Error fetching workout:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadWorkout();
    }
  }, [id, user]);

  const handleDeleteWorkout = async () => {
    if (!id) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this workout?");
    if (!confirmed) return;
    
    try {
      const success = await deleteWorkout(id);
      if (success) {
        toast.success("Workout deleted successfully");
        navigate("/workouts");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading workout...</span>
        </div>
      </MainLayout>
    );
  }

  if (!workout) {
    return (
      <MainLayout user={user}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Workout not found</h2>
          <Button onClick={() => navigate("/workouts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Workouts
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-2" 
            onClick={() => navigate("/workouts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workouts
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{workout.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {format(new Date(workout.date), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Weightlifting
              </Badge>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <Clock className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-lg font-medium">{workout.duration} min</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <Dumbbell className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Effort Level</span>
                <span className="text-lg font-medium">{workout.effortLevel}/10</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <Flame className="h-6 w-6 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Energy</span>
                <span className="text-lg font-medium">{workout.energyExpended} kcal</span>
              </div>
            </div>
            
            {workout.description && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{workout.description}</p>
                </div>
              </>
            )}
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Exercises</h3>
              {workout.exercises.length > 0 ? (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exercise</TableHead>
                        <TableHead className="text-right">Sets</TableHead>
                        <TableHead className="text-right">Reps</TableHead>
                        <TableHead className="text-right">Weight (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workout.exercises.map((exercise: Exercise) => (
                        <TableRow key={exercise.id}>
                          <TableCell className="font-medium">{exercise.name}</TableCell>
                          <TableCell className="text-right">{exercise.sets}</TableCell>
                          <TableCell className="text-right">{exercise.reps}</TableCell>
                          <TableCell className="text-right">{exercise.weight}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <p className="text-muted-foreground">No exercises recorded for this workout.</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{format(new Date(workout.createdAt), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p>{format(new Date(workout.updatedAt), "MMMM d, yyyy")}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 border-t p-6">
            <Button variant="outline" className="text-red-600 hover:bg-red-100 hover:text-red-700" onClick={handleDeleteWorkout}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => navigate(`/workouts/edit/${workout.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WorkoutDetail;
