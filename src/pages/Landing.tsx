import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, BarChart3, Award, Users } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            <h1 className="font-bold text-2xl">GymBro</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/auth?register=1">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Track Your Fitness Journey
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
              GymBro helps you monitor your progress, set goals, and
              achieve your fitness dreams with beautiful analytics and
              personalized insights.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/auth?register=1">
                <Button size="lg" className="h-12 px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Dumbbell className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Workout Tracking</h3>
                <p className="text-muted-foreground">
                  Log your workouts with minimal effort. One-tap tracking for
                  your favorite exercises.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Detailed Analytics
                </h3>
                <p className="text-muted-foreground">
                  Visualize your progress with beautiful charts and metrics.
                  Track strength, endurance, and more.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Goal Setting</h3>
                <p className="text-muted-foreground">
                  Set and track your fitness goals. Get notifications when you
                  hit milestones.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  For Coaches & Athletes
                </h2>
                <p className="text-lg text-muted-foreground">
                  Whether you're an athlete tracking your own progress or a
                  coach monitoring multiple trainees, GymBro offers
                  powerful tools for everyone.
                </p>
                <div className="flex items-center py-2">
                  <div className="p-2 bg-primary/10 rounded-full mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">Dual-perspective design</p>
                </div>
                <div className="flex items-center py-2">
                  <div className="p-2 bg-primary/10 rounded-full mr-4">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">Comprehensive progress dashboard</p>
                </div>
                <div className="flex items-center py-2">
                  <div className="p-2 bg-primary/10 rounded-full mr-4">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">
                    AI-powered workout recommendations
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 bg-muted/50 rounded-lg p-8 shadow-sm">
                <div className="aspect-video bg-muted rounded flex items-center justify-center">
                  <p className="text-muted-foreground">
                    App Screenshot Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Start Your Fitness Journey Today
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/90">
              Join thousands of users who are achieving their fitness goals with
              GymBro's powerful tracking and analytics tools.
            </p>
            <Link to="/auth?register=1">
              <Button
                variant="secondary"
                size="lg"
                className="h-12 px-8"
              >
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Dumbbell className="h-5 w-5" />
            <span className="font-bold">GymBro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 GymBro . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
