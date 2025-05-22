
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const NotificationsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="workout-reminders">Workout Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders about upcoming workouts
                  </p>
                </div>
                <Switch id="workout-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="goal-updates">Goal Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your goal progress
                  </p>
                </div>
                <Switch id="goal-updates" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="coach-messages">Coach Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when coaches send you messages
                  </p>
                </div>
                <Switch id="coach-messages" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="news-updates">News & Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive news and updates about new features
                  </p>
                </div>
                <Switch id="news-updates" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Push Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-workout-reminders">Workout Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications for workouts
                  </p>
                </div>
                <Switch id="push-workout-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-goal-updates">Goal Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications about goal progress
                  </p>
                </div>
                <Switch id="push-goal-updates" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
