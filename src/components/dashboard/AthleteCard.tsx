import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AthleteCardProps {
  athlete: User;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({ athlete }) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-2 w-full"></div>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full overflow-hidden mb-4 bg-muted">
          {athlete.avatarUrl ? (
            <img
              src={athlete.avatarUrl}
              alt={athlete.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center avatar-fallback-text text-xl">
              {athlete.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="font-medium">{athlete.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">Last active: Today</p>
        <Button
          className="w-full"
          variant="outline"
          asChild
        >
          {/* Updated route for coach to view athlete's progress */}
          <Link to={`/coach/athletes/${athlete.id}`}>View Progress</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
