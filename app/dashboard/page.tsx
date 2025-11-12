"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects, getLogs, getActions } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import { Activity, Calendar, Droplets, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Project, Log, Action } from "@/lib/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [latestLogs, setLatestLogs] = useState<Log[]>([]);
  const [upcomingActions, setUpcomingActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedProject]);

  async function loadData() {
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
      
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0].id);
      }

      if (selectedProject) {
        const [logsData, actionsData] = await Promise.all([
          getLogs(selectedProject),
          getActions(selectedProject),
        ]);
        
        setLatestLogs(logsData.slice(0, 5));
        
        const today = new Date();
        const upcoming = actionsData
          .filter((a) => !a.done && new Date(a.date) >= today)
          .slice(0, 5);
        setUpcomingActions(upcoming);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (projects.length === 0) {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Aquarium Tracker</CardTitle>
            <CardDescription>
              Get started by creating your first project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings">
              <Button>Create Project</Button>
            </Link>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const currentProject = projects.find((p) => p.id === selectedProject);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your aquarium projects
            </p>
          </div>
          {projects.length > 1 && (
            <select
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {currentProject && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Latest Measurements
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestLogs.filter((l) => l.type === "measurement").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recent measurements logged
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Tasks
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {upcomingActions.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tasks to complete
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Fertilization
                  </CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Link href="/fertilization">
                    <Button variant="link" className="p-0 h-auto">
                      View Schedule
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lighting</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Link href="/lighting">
                    <Button variant="link" className="p-0 h-auto">
                      Manage Devices
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Measurements</CardTitle>
                  <CardDescription>
                    Recent parameter measurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {latestLogs.filter((l) => l.type === "measurement").length ===
                  0 ? (
                    <p className="text-sm text-muted-foreground">
                      No measurements yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {latestLogs
                        .filter((l) => l.type === "measurement")
                        .map((log) => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>
                              {log.param}: {log.value} {log.unit}
                            </span>
                            <span className="text-muted-foreground">
                              {formatDate(log.date)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                  <Link href="/measurements" className="mt-4 block">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>Actions to complete</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingActions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No upcoming tasks
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {upcomingActions.map((action) => (
                        <div
                          key={action.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{action.type}</span>
                          <span className="text-muted-foreground">
                            {formatDate(action.date)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link href="/planner" className="mt-4 block">
                    <Button variant="outline" size="sm">
                      View Planner
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

