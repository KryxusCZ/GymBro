import React from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, HelpCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface TopNavbarProps {
  user: User;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ user }) => {
  const { signOut } = useAuth();
  
  const handleSignOut = () => {
    signOut();
  };

  // Get first letter of the name for avatar fallback
  const nameInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 border-b border-border flex items-center px-4 md:px-6 justify-between">
      <div className="flex items-center md:hidden">
        <h1 className="text-lg font-bold text-fitness-primary">SF</h1>
      </div>
      
      <div className="flex-1 md:flex-none"></div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="text-sm text-muted-foreground hidden md:inline-flex"
          size="sm"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
        
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-fitness-primary text-white dark:text-black">
                    {user?.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
