
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const WeeklySummary = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Weekly Summary</h2>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="h-32">
            <CardContent className="flex items-center justify-center h-full">
              <span className="text-muted-foreground">Coming soon</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
