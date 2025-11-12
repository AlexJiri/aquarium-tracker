"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProjects, getFertilizers, createFertilizer, updateFertilizer, deleteFertilizer } from "@/lib/firestore";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Project, Fertilizer } from "@/lib/types";

export default function FertilizationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFertilizer, setEditingFertilizer] = useState<Fertilizer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    recommendedDose: "",
    schedule: "",
    targetEffect: "",
  });

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadFertilizers();
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

  async function loadFertilizers() {
    if (!selectedProject) return;
    try {
      const data = await getFertilizers(selectedProject);
      setFertilizers(data);
    } catch (error) {
      console.error("Error loading fertilizers:", error);
    }
  }

  function openDialog(fertilizer?: Fertilizer) {
    if (fertilizer) {
      setEditingFertilizer(fertilizer);
      setFormData({
        name: fertilizer.name,
        recommendedDose: fertilizer.recommendedDose,
        schedule: fertilizer.schedule,
        targetEffect: fertilizer.targetEffect,
      });
    } else {
      setEditingFertilizer(null);
      setFormData({
        name: "",
        recommendedDose: "",
        schedule: "",
        targetEffect: "",
      });
    }
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      const scheduleValue = formData.schedule as "daily" | "weekly" | "biweekly" | "monthly";
      const fertilizerData = {
        ...formData,
        schedule: scheduleValue,
      };
      if (editingFertilizer) {
        await updateFertilizer(editingFertilizer.id, fertilizerData);
      } else {
        await createFertilizer({
          projectId: selectedProject,
          ...fertilizerData,
        });
      }
      setIsDialogOpen(false);
      loadFertilizers();
    } catch (error) {
      console.error("Error saving fertilizer:", error);
      alert("Error saving fertilizer");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this fertilizer?")) return;
    try {
      await deleteFertilizer(id);
      loadFertilizers();
    } catch (error) {
      console.error("Error deleting fertilizer:", error);
      alert("Error deleting fertilizer");
    }
  }

  if (projects.length === 0) {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>No Projects</CardTitle>
            <CardDescription>
              Create a project first to manage fertilizers
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
            <h1 className="text-3xl font-bold">Fertilization</h1>
            <p className="text-muted-foreground">
              Manage your fertilization schedule
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
                <Button onClick={() => openDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Fertilizer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingFertilizer ? "Edit Fertilizer" : "Add Fertilizer"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingFertilizer
                        ? "Update fertilizer details"
                        : "Add a new fertilizer to your schedule"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Solution Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., NPK Booster"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="recommendedDose">Recommended Dose</Label>
                      <Input
                        id="recommendedDose"
                        value={formData.recommendedDose}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recommendedDose: e.target.value,
                          })
                        }
                        placeholder="e.g., 5ml per 50L"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="schedule">When</Label>
                      <select
                        id="schedule"
                        value={formData.schedule}
                        onChange={(e) =>
                          setFormData({ ...formData, schedule: e.target.value })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select schedule</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="targetEffect">Target/Effect</Label>
                      <Input
                        id="targetEffect"
                        value={formData.targetEffect}
                        onChange={(e) =>
                          setFormData({ ...formData, targetEffect: e.target.value })
                        }
                        placeholder="e.g., N, P, K boost"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingFertilizer ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fertilization Schema</CardTitle>
            <CardDescription>
              Your fertilization schedule and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fertilizers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No fertilizers added yet. Click &quot;Add Fertilizer&quot; to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solution</TableHead>
                    <TableHead>Recommended Dose</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead>Target/Effect</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fertilizers.map((fertilizer) => (
                    <TableRow key={fertilizer.id}>
                      <TableCell className="font-medium">
                        {fertilizer.name}
                      </TableCell>
                      <TableCell>{fertilizer.recommendedDose}</TableCell>
                      <TableCell>{fertilizer.schedule}</TableCell>
                      <TableCell>{fertilizer.targetEffect}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDialog(fertilizer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(fertilizer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

