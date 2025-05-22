
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { Workout } from "@/types";
import { getWorkoutDates } from "./utils";

interface CalendarDisplayProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  workouts: Workout[];
}

export const CalendarDisplay: React.FC<CalendarDisplayProps> = ({
  selectedDate,
  setSelectedDate,
  workouts,
}) => {
  const [month, setMonth] = useState<Date>(selectedDate);
  const workoutDates = getWorkoutDates(workouts);
  
  // Handle previous month navigation
  const handlePrevMonth = () => {
    const prevMonth = new Date(month);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setMonth(prevMonth);
  };
  
  // Handle next month navigation
  const handleNextMonth = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setMonth(nextMonth);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {format(month, "MMMM yyyy")}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          month={month}
          onMonthChange={setMonth}
          className="rounded-md border"
          modifiers={{
            workout: (day) => workoutDates.some(workoutDate => isSameDay(day, workoutDate))
          }}
          modifiersStyles={{
            workout: {
              fontWeight: "bold",
              textDecoration: "underline",
              backgroundColor: "rgba(155, 135, 245, 0.1)"
            }
          }}
        />
      </CardContent>
    </Card>
  );
};
