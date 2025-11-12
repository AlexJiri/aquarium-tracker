import {
  getProjects,
  getDevices,
  getTargets,
  getFertilizers,
  getMeasurements,
  getDoseLogs,
  getWaterChanges,
  getActions,
  getPhotos,
  getReminders,
  createProject,
  createDevice,
  createTarget,
  createFertilizer,
  createMeasurement,
  createDoseLog,
  createWaterChange,
  createAction,
  createPhoto,
  createReminder,
} from "./firestore";
import type {
  Project,
  Device,
  Target,
  Fertilizer,
  Measurement,
  DoseLog,
  WaterChange,
  Action,
  Photo,
  Reminder,
} from "./types";

export interface ExportData {
  project: Project;
  devices: Device[];
  targets: Target[];
  fertilizers: Fertilizer[];
  measurements: Measurement[];
  doseLogs: DoseLog[];
  waterChanges: WaterChange[];
  actions: Action[];
  photos: Photo[];
  reminders: Reminder[];
  exportedAt: string;
}

export async function exportProject(projectId: string): Promise<ExportData> {
  const [
    projects,
    devices,
    targets,
    fertilizers,
    measurements,
    doseLogs,
    waterChanges,
    actions,
    photos,
    reminders,
  ] = await Promise.all([
    getProjects(),
    getDevices(projectId),
    getTargets(projectId),
    getFertilizers(projectId),
    getMeasurements(projectId),
    getDoseLogs(projectId),
    getWaterChanges(projectId),
    getActions(projectId),
    getPhotos(projectId),
    getReminders(projectId),
  ]);

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  return {
    project,
    devices,
    targets,
    fertilizers,
    measurements,
    doseLogs,
    waterChanges,
    actions,
    photos,
    reminders,
    exportedAt: new Date().toISOString(),
  };
}

export async function downloadExport(projectId: string): Promise<void> {
  const data = await exportProject(projectId);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aquarium-export-${projectId}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importProject(
  data: ExportData,
  replaceExisting: boolean = false
): Promise<string> {
  // Create or find project
  let projectId: string;
  const existingProjects = await getProjects();
  const existingProject = existingProjects.find((p) => p.name === data.project.name);

  if (existingProject && replaceExisting) {
    projectId = existingProject.id;
    // Delete existing data if replacing
    const [
      existingDevices,
      existingTargets,
      existingFertilizers,
      existingMeasurements,
      existingDoseLogs,
      existingWaterChanges,
      existingActions,
      existingPhotos,
      existingReminders,
    ] = await Promise.all([
      getDevices(projectId),
      getTargets(projectId),
      getFertilizers(projectId),
      getMeasurements(projectId),
      getDoseLogs(projectId),
      getWaterChanges(projectId),
      getActions(projectId),
      getPhotos(projectId),
      getReminders(projectId),
    ]);

    const { deleteDevice, deleteTarget, deleteFertilizer, deleteMeasurement, deleteDoseLog, deleteWaterChange, deleteAction, deletePhoto, deleteReminder } = await import("./firestore");

    await Promise.all([
      ...existingDevices.map((d) => deleteDevice(d.id)),
      ...existingTargets.map((t) => deleteTarget(t.id)),
      ...existingFertilizers.map((f) => deleteFertilizer(f.id)),
      ...existingMeasurements.map((m) => deleteMeasurement(m.id)),
      ...existingDoseLogs.map((d) => deleteDoseLog(d.id)),
      ...existingWaterChanges.map((w) => deleteWaterChange(w.id)),
      ...existingActions.map((a) => deleteAction(a.id)),
      ...existingPhotos.map((p) => deletePhoto(p.id)),
      ...existingReminders.map((r) => deleteReminder(r.id)),
    ]);
  } else if (existingProject && !replaceExisting) {
    throw new Error("Project with this name already exists. Use replace mode to overwrite.");
  } else {
    // Create new project
    projectId = await createProject({
      name: data.project.name,
      description: data.project.description,
      createdAt: new Date().toISOString(),
    });
  }

  // Import all data
  await Promise.all([
    ...data.devices.map((d) => {
      const { id, createdAt, ...deviceData } = d;
      return createDevice({
        ...deviceData,
        projectId,
        createdAt: createdAt,
      });
    }),
    ...data.targets.map((t) => createTarget({ ...t, projectId })),
    ...data.fertilizers.map((f) => createFertilizer({ ...f, projectId })),
    ...data.measurements.map((m) => createMeasurement({ ...m, projectId })),
    ...data.doseLogs.map((d) => createDoseLog({ ...d, projectId })),
    ...data.waterChanges.map((w) => createWaterChange({ ...w, projectId })),
    ...data.actions.map((a) => createAction({ ...a, projectId })),
    ...data.photos.map((p) => createPhoto({ ...p, projectId })),
    ...data.reminders.map((r) => createReminder({ ...r, projectId })),
  ]);

  return projectId;
}

export async function importFromFile(file: File, replaceExisting: boolean = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as ExportData;
        const projectId = await importProject(data, replaceExisting);
        resolve(projectId);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

