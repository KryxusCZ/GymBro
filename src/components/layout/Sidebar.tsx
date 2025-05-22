
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Activity, 
  Target, 
  Dumbbell, 
  Calendar, 
  Settings, 
  Users 
} from "lucide-react";
import { User, UserRole } from "@/types";

interface SidebarProps {
  user: User;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const isCoach = user.role === "coach";
  const location = useLocation();

  const athleteNavItems: NavItem[] = [
    { name: "Dashboard", path: "/", icon: BarChart },
    { name: "Progress", path: "/progress", icon: Activity },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Workouts", path: "/workouts", icon: Dumbbell },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const coachNavItems: NavItem[] = [
    { name: "Dashboard", path: "/", icon: BarChart },
    { name: "Athletes", path: "/athletes", icon: Users },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Workouts", path: "/workouts", icon: Dumbbell },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const navItems = isCoach ? coachNavItems : athleteNavItems;

  return (
    <aside className="w-16 md:w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
      <div className="p-4">
        <div className="hidden md:block">
          <h2 className="text-xl font-bold text-fitness-primary">GymBro</h2>
          <p className="text-sm text-muted-foreground">
            {isCoach ? "Coach Dashboard" : "Athlete Dashboard"}
          </p>
        </div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sidebar-foreground rounded-md transition-colors ${
                    isActive 
                      ? "bg-sidebar-accent text-fitness-primary font-medium" 
                      : "hover:bg-sidebar-accent"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-fitness-primary" : "text-muted-foreground"}`} />
                  <span className="ml-3 hidden md:block">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
