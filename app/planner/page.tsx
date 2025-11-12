"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getProjects, getActions, createAction, updateAction, deleteAction } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import { Plus, CheckCircle2, Circle } from "lucide-react";
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, format, eachMonthOfInterval } from "date-fns";
import type { Project, Action } from "@/lib/types";

export default function PlannerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [view, setView] = useState<"day" | "week" | "month" | "year">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadActions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, currentDate, view]);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0].id);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  }

  async function loadActions() {
    if (!selectedProject) return;
    try {
      const data = await getActions(selectedProject);
      setActions(data);
    } catch (error) {
      console.error("Error loading actions:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await createAction({
        projectId: selectedProject,
        type: formData.type,
        date: formData.date,
        done: false,
        notes: formData.notes || undefined,
      });
      setIsDialogOpen(false);
      setFormData({
        type: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      loadActions();
    } catch (error) {
      console.error("Error creating action:", error);
      alert("Error creating action");
    }
  }

  async function toggleDone(id: string, done: boolean) {
    try {
      await updateAction(id, { done });
      loadActions();
    } catch (error) {
      console.error("Error updating action:", error);
    }
  }

  function getDateRange() {
    switch (view) {
      case "day":
        return [currentDate];
      case "week":
        const weekStart = startOfWeek(currentDate);
        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      case "month":
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const days = [];
        for (let d = monthStart; d <= monthEnd; d = addDays(d, 1)) {
          days.push(d);
        }
        return days;
      case "year":
        const yearStart = startOfYear(currentDate);
        const yearEnd = endOfYear(currentDate);
        return eachMonthOfInterval({ start: yearStart, end: yearEnd });
      default:
        return [];
    }
  }

  function getActionsForMonth(month: Date) {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    return actions.filter((a) => {
      const actionDate = new Date(a.date);
      return actionDate >= monthStart && actionDate <= monthEnd;
    });
  }

  function getActionsForDate(date: Date) {
    return actions.filter((a) => isSameDay(new Date(a.date), date));
  }

  const dateRange = getDateRange();
  const currentProject = projects.find((p) => p.id === selectedProject);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Planner</h1>
            <p className="text-muted-foreground">Manage your tasks and schedule</p>
          </div>
          <div className="flex gap-2">
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription>Add a new task to your schedule</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Task Type</Label>
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        placeholder="e.g., Water change, Pruning, CO₂ check"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>

          <TabsContent value={view} className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (view === "day") newDate.setDate(newDate.getDate() - 1);
                  else if (view === "week") newDate.setDate(newDate.getDate() - 7);
                  else if (view === "month") newDate.setMonth(newDate.getMonth() - 1);
                  else if (view === "year") newDate.setFullYear(newDate.getFullYear() - 1);
                  setCurrentDate(newDate);
                }}
              >
                Previous
              </Button>
              <h2 className="text-xl font-semibold">
                {view === "day" && format(currentDate, "MMMM d, yyyy")}
                {view === "week" && `Week of ${format(startOfWeek(currentDate), "MMM d")}`}
                {view === "month" && format(currentDate, "MMMM yyyy")}
                {view === "year" && format(currentDate, "yyyy")}
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (view === "day") newDate.setDate(newDate.getDate() + 1);
                  else if (view === "week") newDate.setDate(newDate.getDate() + 7);
                  else if (view === "month") newDate.setMonth(newDate.getMonth() + 1);
                  else if (view === "year") newDate.setFullYear(newDate.getFullYear() + 1);
                  setCurrentDate(newDate);
                }}
              >
                Next
              </Button>
            </div>

            {view === "day" && (
              <Card>
                <CardHeader>
                  <CardTitle>{format(currentDate, "EEEE, MMMM d, yyyy")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getActionsForDate(currentDate).map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleDone(action.id, !action.done)}
                          >
                            {action.done ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          <span className={action.done ? "line-through text-muted-foreground" : ""}>
                            {action.type}
                          </span>
                        </div>
                        {action.notes && (
                          <span className="text-sm text-muted-foreground">
                            {action.notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {view === "week" && (
              <div className="grid grid-cols-7 gap-2">
                {dateRange.map((date) => {
                  const dayActions = getActionsForDate(date);
                  return (
                    <Card key={date.toISOString()}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          {format(date, "EEE")}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {format(date, "MMM d")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {dayActions.map((action) => (
                            <div
                              key={action.id}
                              className="flex items-center gap-1 text-xs"
                            >
                              <button
                                onClick={() => toggleDone(action.id, !action.done)}
                              >
                                {action.done ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Circle className="h-3 w-3 text-muted-foreground" />
                                )}
                              </button>
                              <span className={action.done ? "line-through" : ""}>
                                {action.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {view === "month" && (
              <div className="grid grid-cols-7 gap-2">
                {dateRange.map((date) => {
                  const dayActions = getActionsForDate(date);
                  return (
                    <Card key={date.toISOString()} className="min-h-[100px]">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-xs">
                          {format(date, "d")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="space-y-1">
                          {dayActions.slice(0, 3).map((action) => (
                            <div
                              key={action.id}
                              className="flex items-center gap-1 text-xs"
                            >
                              <button
                                onClick={() => toggleDone(action.id, !action.done)}
                              >
                                {action.done ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Circle className="h-3 w-3 text-muted-foreground" />
                                )}
                              </button>
                              <span className={action.done ? "line-through" : ""}>
                                {action.type}
                              </span>
                            </div>
                          ))}
                          {dayActions.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{dayActions.length - 3} more
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {view === "year" && (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {dateRange.map((month) => {
                  const monthActions = getActionsForMonth(month);
                  const completedCount = monthActions.filter((a) => a.done).length;
                  const totalCount = monthActions.length;
                  return (
                    <Card key={month.toISOString()}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {format(month, "MMMM")}
                        </CardTitle>
                        <CardDescription>
                          {totalCount} task{totalCount !== 1 ? "s" : ""} • {completedCount} completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {monthActions.slice(0, 5).map((action) => (
                            <div
                              key={action.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <button
                                onClick={() => toggleDone(action.id, !action.done)}
                              >
                                {action.done ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className={action.done ? "line-through text-muted-foreground" : ""}>
                                  {action.type}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(action.date)}
                                </div>
                              </div>
                            </div>
                          ))}
                          {monthActions.length > 5 && (
                            <div className="text-xs text-muted-foreground pt-2">
                              +{monthActions.length - 5} more
                            </div>
                          )}
                          {monthActions.length === 0 && (
                            <div className="text-sm text-muted-foreground text-center py-4">
                              No tasks this month
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

