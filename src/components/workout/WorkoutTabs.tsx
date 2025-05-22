
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WorkoutList } from "./WorkoutList";
import { Workout } from "@/types";

interface WorkoutTabsProps {
  groupedByMonth: Record<string, Workout[]>;
  sortedMonths: string[];
}

export const WorkoutTabs = ({ groupedByMonth, sortedMonths }: WorkoutTabsProps) => {
  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="list">List View</TabsTrigger>
        <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="space-y-6">
        <WorkoutList
          groupedByMonth={groupedByMonth}
          sortedMonths={sortedMonths}
        />
      </TabsContent>
      
      <TabsContent value="calendar" className="p-0">
        <Card>
          <CardHeader>
            <CardTitle>Workout Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Calendar view will be implemented soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="stats" className="p-0">
        <Card>
          <CardHeader>
            <CardTitle>Workout Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Statistics view will be implemented soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
