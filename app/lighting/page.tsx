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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProjects, getDevices, createDevice, updateDevice, deleteDevice } from "@/lib/firestore";
import { Plus, Edit, Trash2, Lightbulb } from "lucide-react";
import type { Project, Device } from "@/lib/types";

export default function LightingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    type: "lamp" as Device["type"],
    name: "",
    intensity: "50",
    W: "0",
    R: "0",
    G: "0",
    B: "0",
  });

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadDevices();
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

  async function loadDevices() {
    if (!selectedProject) return;
    try {
      const data = await getDevices(selectedProject);
      setDevices(data);
    } catch (error) {
      console.error("Error loading devices:", error);
    }
  }

  function openDialog(device?: Device) {
    if (device) {
      setEditingDevice(device);
      const settings = device.settings || {};
      const channels = settings.channels || {};
      setFormData({
        type: device.type,
        name: device.name,
        intensity: settings.intensityPercent?.toString() || "50",
        W: channels.W?.toString() || "0",
        R: channels.R?.toString() || "0",
        G: channels.G?.toString() || "0",
        B: channels.B?.toString() || "0",
      });
    } else {
      setEditingDevice(null);
      setFormData({
        type: "lamp",
        name: "",
        intensity: "50",
        W: "0",
        R: "0",
        G: "0",
        B: "0",
      });
    }
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      const settings: Device["settings"] = {
        intensityPercent: parseFloat(formData.intensity),
      };

      if (formData.type === "lamp") {
        settings.channels = {
          W: parseFloat(formData.W),
          R: parseFloat(formData.R),
          G: parseFloat(formData.G),
          B: parseFloat(formData.B),
        };
      }

      if (editingDevice) {
        await updateDevice(editingDevice.id, {
          name: formData.name,
          settings,
        });
      } else {
        await createDevice({
          projectId: selectedProject,
          type: formData.type,
          name: formData.name,
          settings,
        });
      }
      setIsDialogOpen(false);
      loadDevices();
    } catch (error) {
      console.error("Error saving device:", error);
      alert("Error saving device");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      await deleteDevice(id);
      loadDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("Error deleting device");
    }
  }

  async function updateDeviceSettings(id: string, settings: Partial<Device["settings"]>) {
    try {
      const device = devices.find((d) => d.id === id);
      if (!device) return;
      await updateDevice(id, {
        settings: { ...(device.settings || {}), ...settings },
      });
      loadDevices();
    } catch (error) {
      console.error("Error updating device settings:", error);
    }
  }

  if (projects.length === 0) {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>No Projects</CardTitle>
            <CardDescription>
              Create a project first to manage devices
            </CardDescription>
          </CardHeader>
        </Card>
      </Layout>
    );
  }

  const lamps = devices.filter((d) => d.type === "lamp");
  const otherDevices = devices.filter((d) => d.type !== "lamp");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lighting & Devices</h1>
            <p className="text-muted-foreground">
              Manage your aquarium devices and lighting
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
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingDevice ? "Edit Device" : "Add Device"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingDevice
                        ? "Update device settings"
                        : "Add a new device to your aquarium"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Device Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) =>
                          setFormData({ ...formData, type: v as Device["type"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lamp">Lamp</SelectItem>
                          <SelectItem value="filter">Filter</SelectItem>
                          <SelectItem value="co2">CO₂</SelectItem>
                          <SelectItem value="heater">Heater</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                      <Label htmlFor="intensity">Intensity (%)</Label>
                      <Input
                        id="intensity"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.intensity}
                        onChange={(e) =>
                          setFormData({ ...formData, intensity: e.target.value })
                        }
                      />
                    </div>
                    {formData.type === "lamp" && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="W">White Channel</Label>
                          <Input
                            id="W"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.W}
                            onChange={(e) =>
                              setFormData({ ...formData, W: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="R">Red Channel</Label>
                          <Input
                            id="R"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.R}
                            onChange={(e) =>
                              setFormData({ ...formData, R: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="G">Green Channel</Label>
                          <Input
                            id="G"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.G}
                            onChange={(e) =>
                              setFormData({ ...formData, G: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="B">Blue Channel</Label>
                          <Input
                            id="B"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.B}
                            onChange={(e) =>
                              setFormData({ ...formData, B: e.target.value })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingDevice ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {lamps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Lighting Summary
              </CardTitle>
              <CardDescription>
                Current lighting configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lamps.map((lamp) => (
                  <Card key={lamp.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{lamp.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Intensity</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={lamp.settings?.intensityPercent || 0}
                            onChange={(e) =>
                              updateDeviceSettings(lamp.id, {
                                intensityPercent: parseInt(e.target.value),
                              })
                            }
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12">
                            {lamp.settings?.intensityPercent || 0}%
                          </span>
                        </div>
                      </div>
                      {lamp.settings?.channels?.W !== undefined && (
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <div className="font-medium">W</div>
                            <div>{lamp.settings?.channels?.W || 0}%</div>
                          </div>
                          <div>
                            <div className="font-medium">R</div>
                            <div>{lamp.settings?.channels?.R || 0}%</div>
                          </div>
                          <div>
                            <div className="font-medium">G</div>
                            <div>{lamp.settings?.channels?.G || 0}%</div>
                          </div>
                          <div>
                            <div className="font-medium">B</div>
                            <div>{lamp.settings?.channels?.B || 0}%</div>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(lamp)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(lamp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Devices</CardTitle>
            <CardDescription>Manage all your aquarium devices</CardDescription>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No devices added yet. Click &quot;Add Device&quot; to get started.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {devices.map((device) => (
                  <Card key={device.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {device.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {device.settings?.intensityPercent !== undefined && (
                        <div className="mb-4">
                          <div className="text-sm text-muted-foreground mb-1">
                            Intensity
                          </div>
                          <div className="text-2xl font-bold">
                            {device.settings?.intensityPercent}%
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(device)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(device.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

