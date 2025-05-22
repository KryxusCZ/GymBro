
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Clock, TrendingUp, Users, Calendar } from "lucide-react";

interface TotalMetricsCardProps {
  title: string;
  value: string;
  unit: string;
  icon: "activity" | "clock" | "trending-up" | "users" | "calendar";
}

export const TotalMetricsCard: React.FC<TotalMetricsCardProps> = ({
  title,
  value,
  unit,
  icon,
}) => {
  const IconComponent = {
    activity: Activity,
    clock: Clock,
    "trending-up": TrendingUp,
    users: Users,
    calendar: Calendar,
  }[icon];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline mt-1">
              <h3 className="text-3xl font-bold">{value}</h3>
              <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
          <div className="p-2 bg-fitness-soft rounded-full">
            <IconComponent className="h-6 w-6 text-fitness-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
