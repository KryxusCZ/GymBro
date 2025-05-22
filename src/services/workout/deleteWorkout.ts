
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const deleteWorkout = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error deleting workout:", error);
    toast.error(`Failed to delete workout: ${error.message}`);
    return false;
  }
};
