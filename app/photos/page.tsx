"use client";

import { useEffect, useState, useRef } from "react";
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
// Using img tag for external Firebase Storage URLs
import { getProjects, getPhotos, createPhoto, deletePhoto } from "@/lib/firestore";
import { uploadPhoto, deletePhotoFromStorage } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Upload } from "lucide-react";
import type { Project, Photo } from "@/lib/types";

export default function PhotosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadPhotos();
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

  async function loadPhotos() {
    if (!selectedProject) return;
    try {
      const data = await getPhotos(selectedProject);
      setPhotos(data);
    } catch (error) {
      console.error("Error loading photos:", error);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || !selectedFile) return;

    setUploading(true);
    try {
      const url = await uploadPhoto(selectedFile, selectedProject);
      await createPhoto({
        projectId: selectedProject,
        url,
        date: formData.date,
        notes: formData.notes || undefined,
      });
      setIsDialogOpen(false);
      setSelectedFile(null);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      loadPhotos();
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error uploading photo");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photo: Photo) {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deletePhotoFromStorage(photo.url);
      await deletePhoto(photo.id);
      loadPhotos();
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Error deleting photo");
    }
  }

  if (projects.length === 0) {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>No Projects</CardTitle>
            <CardDescription>
              Create a project first to upload photos
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
            <h1 className="text-3xl font-bold">Photos</h1>
            <p className="text-muted-foreground">
              Upload and manage aquarium photos
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
                  Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Upload Photo</DialogTitle>
                    <DialogDescription>
                      Upload a photo of your aquarium
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="file">Photo</Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        required
                      />
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {selectedFile.name}
                        </p>
                      )}
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
                    <Button type="submit" disabled={uploading || !selectedFile}>
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {photos.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">
                No photos uploaded yet. Click &quot;Upload Photo&quot; to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <Card key={photo.id}>
                <CardContent className="p-0">
                  <div className="relative aspect-video w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.notes || "Aquarium photo"}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      {formatDate(photo.date)}
                    </div>
                    {photo.notes && (
                      <p className="text-sm mb-3">{photo.notes}</p>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(photo)}
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
      </div>
    </Layout>
  );
}

