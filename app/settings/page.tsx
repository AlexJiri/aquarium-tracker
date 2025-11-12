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
import { getProjects, createProject, updateProject, deleteProject, getTargets, createTarget, updateTarget, deleteTarget } from "@/lib/firestore";
import { preloadDennerleData } from "@/lib/preload-data";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project, Target } from "@/lib/types";

export default function SettingsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTargetDialogOpen, setIsTargetDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    length: "",
    width: "",
    height: "",
    volume: "",
  });
  const [targetFormData, setTargetFormData] = useState({
    param: "",
    min: "",
    max: "",
    unit: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadTargets();
    }
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
    } finally {
      setLoading(false);
    }
  }

  async function loadTargets() {
    if (!selectedProject) return;
    try {
      const data = await getTargets(selectedProject);
      setTargets(data);
    } catch (error) {
      console.error("Error loading targets:", error);
    }
  }

  function openDialog(project?: Project) {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || "",
        length: project.dimensions?.length?.toString() || "",
        width: project.dimensions?.width?.toString() || "",
        height: project.dimensions?.height?.toString() || "",
        volume: project.dimensions?.volume?.toString() || "",
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: "",
        description: "",
        length: "",
        width: "",
        height: "",
        volume: "",
      });
    }
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const dimensions = {
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        volume: formData.volume ? parseFloat(formData.volume) : undefined,
      };

      if (editingProject) {
        await updateProject(editingProject.id, {
          name: formData.name,
          description: formData.description || undefined,
          dimensions: Object.keys(dimensions).length > 0 ? dimensions : undefined,
        });
      } else {
        await createProject({
          name: formData.name,
          description: formData.description || undefined,
          dimensions: Object.keys(dimensions).length > 0 ? dimensions : undefined,
          createdAt: new Date().toISOString(),
        });
      }
      setIsDialogOpen(false);
      loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    }
  }

  function openTargetDialog(target?: Target) {
    if (target) {
      setEditingTarget(target);
      setTargetFormData({
        param: target.param,
        min: target.min.toString(),
        max: target.max.toString(),
        unit: target.unit,
      });
    } else {
      setEditingTarget(null);
      setTargetFormData({
        param: "",
        min: "",
        max: "",
        unit: "",
      });
    }
    setIsTargetDialogOpen(true);
  }

  async function handleTargetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      if (editingTarget) {
        await updateTarget(editingTarget.id, {
          param: targetFormData.param,
          min: parseFloat(targetFormData.min),
          max: parseFloat(targetFormData.max),
          unit: targetFormData.unit,
        });
      } else {
        await createTarget({
          projectId: selectedProject,
          param: targetFormData.param,
          min: parseFloat(targetFormData.min),
          max: parseFloat(targetFormData.max),
          unit: targetFormData.unit,
        });
      }
      setIsTargetDialogOpen(false);
      loadTargets();
    } catch (error) {
      console.error("Error saving target:", error);
      alert("Error saving target");
    }
  }

  async function handleTargetDelete(id: string) {
    if (!confirm("Are you sure you want to delete this target?")) return;
    try {
      await deleteTarget(id);
      loadTargets();
    } catch (error) {
      console.error("Error deleting target:", error);
      alert("Error deleting target");
    }
  }

  async function handlePreload() {
    if (!confirm("This will create an 'Aquarium' project with Dennerle fertilization schema. Continue?")) return;
    try {
      await preloadDennerleData();
      alert("Example data preloaded successfully! Refresh the page to see it.");
      loadProjects();
    } catch (error) {
      console.error("Error preloading data:", error);
      alert("Error preloading data. Make sure you have Firebase configured correctly.");
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your projects and targets</p>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="targets">Targets</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Projects</h2>
                <p className="text-muted-foreground">Manage your aquarium projects</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePreload}>
                  Preload Example Data
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? "Edit Project" : "New Project"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProject
                      ? "Update project details"
                      : "Create a new aquarium project"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={formData.length}
                        onChange={(e) =>
                          setFormData({ ...formData, length: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={formData.width}
                        onChange={(e) =>
                          setFormData({ ...formData, width: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) =>
                          setFormData({ ...formData, height: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="volume">Volume (L)</Label>
                      <Input
                        id="volume"
                        type="number"
                        value={formData.volume}
                        onChange={(e) =>
                          setFormData({ ...formData, volume: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingProject ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      Created {formatDate(project.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {project.description}
                      </p>
                    )}
                    {project.dimensions && (
                      <div className="text-sm space-y-1 mb-4">
                        {project.dimensions.length && (
                          <p>Length: {project.dimensions.length} cm</p>
                        )}
                        {project.dimensions.width && (
                          <p>Width: {project.dimensions.width} cm</p>
                        )}
                        {project.dimensions.height && (
                          <p>Height: {project.dimensions.height} cm</p>
                        )}
                        {project.dimensions.volume && (
                          <p>Volume: {project.dimensions.volume} L</p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog(project)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="targets" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Targets</h2>
                <p className="text-muted-foreground">
                  Define desired parameter ranges
                </p>
              </div>
              {projects.length > 0 && (
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
                  <Dialog open={isTargetDialogOpen} onOpenChange={setIsTargetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => openTargetDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Target
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleTargetSubmit}>
                        <DialogHeader>
                          <DialogTitle>
                            {editingTarget ? "Edit Target" : "New Target"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingTarget
                              ? "Update target range"
                              : "Define a new parameter target range"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="target-param">Parameter</Label>
                            <Input
                              id="target-param"
                              value={targetFormData.param}
                              onChange={(e) =>
                                setTargetFormData({
                                  ...targetFormData,
                                  param: e.target.value,
                                })
                              }
                              placeholder="e.g., NO₃, PO₄, K, Fe"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="target-min">Min</Label>
                              <Input
                                id="target-min"
                                type="number"
                                step="0.01"
                                value={targetFormData.min}
                                onChange={(e) =>
                                  setTargetFormData({
                                    ...targetFormData,
                                    min: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="target-max">Max</Label>
                              <Input
                                id="target-max"
                                type="number"
                                step="0.01"
                                value={targetFormData.max}
                                onChange={(e) =>
                                  setTargetFormData({
                                    ...targetFormData,
                                    max: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="target-unit">Unit</Label>
                            <Input
                              id="target-unit"
                              value={targetFormData.unit}
                              onChange={(e) =>
                                setTargetFormData({
                                  ...targetFormData,
                                  unit: e.target.value,
                                })
                              }
                              placeholder="e.g., mg/L, ppm"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">
                            {editingTarget ? "Update" : "Create"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            {projects.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">
                    Create a project first to manage targets
                  </p>
                </CardContent>
              </Card>
            ) : targets.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">
                    No targets defined. Click "New Target" to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {targets.map((target) => (
                  <Card key={target.id}>
                    <CardHeader>
                      <CardTitle>{target.param}</CardTitle>
                      <CardDescription>
                        Target range: {target.min} - {target.max} {target.unit}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTargetDialog(target)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleTargetDelete(target.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

