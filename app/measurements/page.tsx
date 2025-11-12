"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getProjects, getLogs, getTargets, createLog, deleteLog } from "@/lib/firestore";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import type { Project, Log, Target } from "@/lib/types";

export default function MeasurementsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [selectedParam, setSelectedParam] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    param: "",
    value: "",
    unit: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

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

  async function loadData() {
    if (!selectedProject) return;
    try {
      const [logsData, targetsData] = await Promise.all([
        getLogs(selectedProject),
        getTargets(selectedProject),
      ]);
      setLogs(logsData.filter((l) => l.type === "measurement"));
      setTargets(targetsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await createLog({
        projectId: selectedProject,
        type: "measurement",
        param: formData.param,
        value: parseFloat(formData.value),
        unit: formData.unit,
        date: formData.date,
        notes: formData.notes || undefined,
      });
      setIsDialogOpen(false);
      setFormData({
        param: "",
        value: "",
        unit: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      loadData();
    } catch (error) {
      console.error("Error creating log:", error);
      alert("Error creating measurement");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this measurement?")) return;
    try {
      await deleteLog(id);
      loadData();
    } catch (error) {
      console.error("Error deleting log:", error);
      alert("Error deleting measurement");
    }
  }

  function getChartData() {
    const filteredLogs =
      selectedParam === "all"
        ? logs
        : logs.filter((l) => l.param === selectedParam);

    const grouped = filteredLogs.reduce((acc, log) => {
      const key = log.param || "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        date: formatDate(log.date),
        value: log.value,
        unit: log.unit,
      });
      return acc;
    }, {} as Record<string, any[]>);

    const params = Object.keys(grouped);
    if (params.length === 0) return [];

    const maxLength = Math.max(...params.map((p) => grouped[p].length));
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const entry: any = {};
      params.forEach((param) => {
        if (grouped[param][i]) {
          entry.date = grouped[param][i].date;
          entry[param] = grouped[param][i].value;
        }
      });
      if (entry.date) result.push(entry);
    }

    return result;
  }

  const chartData = getChartData();
  const uniqueParams = Array.from(new Set(logs.map((l) => l.param).filter(Boolean)));

  if (projects.length === 0) {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>No Projects</CardTitle>
            <CardDescription>
              Create a project first to log measurements
            </CardDescription>
          </CardHeader>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Measurements</h1>
            <p className="text-muted-foreground">
              Track and visualize parameter measurements
            </p>
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
                  New Measurement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>New Measurement</DialogTitle>
                    <DialogDescription>
                      Log a new parameter measurement
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="param">Parameter</Label>
                      <Input
                        id="param"
                        value={formData.param}
                        onChange={(e) =>
                          setFormData({ ...formData, param: e.target.value })
                        }
                        placeholder="e.g., NO₃, PO₄, K, Fe"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="value">Value</Label>
                        <Input
                          id="value"
                          type="number"
                          step="0.01"
                          value={formData.value}
                          onChange={(e) =>
                            setFormData({ ...formData, value: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          value={formData.unit}
                          onChange={(e) =>
                            setFormData({ ...formData, unit: e.target.value })
                          }
                          placeholder="e.g., mg/L, ppm"
                          required
                        />
                      </div>
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
                    <Button type="submit">Log Measurement</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="targets">Targets</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Parameter Evolution</CardTitle>
                    <CardDescription>
                      Track parameter changes over time
                    </CardDescription>
                  </div>
                  {uniqueParams.length > 0 && (
                    <Select value={selectedParam} onValueChange={setSelectedParam}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Parameters</SelectItem>
                        {uniqueParams.map((param) => (
                          <SelectItem key={param} value={param}>
                            {param}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">
                      No measurement data available
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {uniqueParams.map((param, index) => {
                        const colors = [
                          "#8884d8",
                          "#82ca9d",
                          "#ffc658",
                          "#ff7300",
                          "#00ff00",
                        ];
                        return (
                          <Line
                            key={param}
                            type="monotone"
                            dataKey={param}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Measurement History</CardTitle>
                <CardDescription>All logged measurements</CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No measurements logged yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <div className="font-medium">
                            {log.param}: {log.value} {log.unit}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateTime(log.date)}
                          </div>
                          {log.notes && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {log.notes}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(log.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Target Ranges</CardTitle>
                <CardDescription>
                  Define desired parameter ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {targets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No targets defined. Go to Settings to add targets.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {targets.map((target) => {
                      const latestLog = logs
                        .filter((l) => l.param === target.param)
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                        )[0];
                      const inRange =
                        latestLog &&
                        latestLog.value !== undefined &&
                        latestLog.value >= target.min &&
                        latestLog.value <= target.max;

                      return (
                        <div
                          key={target.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <div className="font-medium">{target.param}</div>
                            <div className="text-sm text-muted-foreground">
                              Target: {target.min} - {target.max} {target.unit}
                            </div>
                            {latestLog && (
                              <div className="text-sm">
                                Latest: {latestLog.value} {latestLog.unit}
                                {inRange ? (
                                  <span className="text-green-500 ml-2">✓ In range</span>
                                ) : (
                                  <span className="text-red-500 ml-2">✗ Out of range</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

