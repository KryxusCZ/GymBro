
import { z } from "zod";

// Define validation schema for energy calculation inputs
export const EnergyCalculationSchema = z.object({
  weight: z.number().positive().min(30).max(250),
  duration: z.number().positive().min(1).max(600),
  activityType: z.string().min(1),
  intensityLevel: z.number().min(1).max(10),
});

// MET (Metabolic Equivalent of Task) values for different activities
const MET_VALUES: Record<string, number> = {
  "running": 9.8,
  "cycling": 7.5,
  "swimming": 8.3,
  "weightlifting": 5.0,
  "walking": 3.5,
  "hiit": 8.0,
  "yoga": 2.5,
  "pilates": 3.0,
  "basketball": 6.5,
  "soccer": 7.0,
  "tennis": 7.3,
  "default": 4.0, // Default value for activities not in the list
};

/**
 * Calculate energy expenditure in kcal based on activity parameters
 * Formula: Energy (kcal) = MET * weight (kg) * duration (hours)
 * With intensity adjustment: MET * (1 + (intensityLevel - 5) / 10)
 */
export const calculateEnergyExpenditure = (
  weight: number,
  duration: number, // in minutes
  activityType: string,
  intensityLevel: number // scale of 1-10
): number => {
  try {
    // Validate input parameters
    EnergyCalculationSchema.parse({
      weight,
      duration,
      activityType,
      intensityLevel,
    });

    // Get MET value for the activity (or default if not found)
    const baseMet = MET_VALUES[activityType.toLowerCase()] || MET_VALUES.default;
    
    // Adjust MET based on intensity (±50% range based on intensity level)
    const intensityAdjustment = 1 + (intensityLevel - 5) / 10;
    const adjustedMet = baseMet * intensityAdjustment;
    
    // Calculate energy expenditure: MET * weight (kg) * duration (hours)
    const durationInHours = duration / 60;
    const energyExpended = adjustedMet * weight * durationInHours;
    
    // Round to nearest integer
    return Math.round(energyExpended);
  } catch (error) {
    console.error("Energy calculation error:", error);
    return 0;
  }
};

/**
 * Calculate effort score based on intensity and duration
 * Scale: 1-100
 */
export const calculateEffortScore = (
  duration: number,
  intensityLevel: number
): number => {
  // Base score from intensity (scale 1-10 to 10-100)
  const baseScore = intensityLevel * 10;
  
  // Duration factor (diminishing returns after 60 minutes)
  const durationFactor = duration < 60 
    ? duration / 60 
    : 1 + Math.log10(duration / 60);
  
  // Calculate score with diminishing returns for very long workouts
  const score = baseScore * durationFactor;
  
  // Cap at 100 and round to nearest integer
  return Math.min(100, Math.round(score));
};
