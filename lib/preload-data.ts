import { createProject, createDevice, createTarget, createFertilizer } from "./firestore";
import type { Project, Device, Target, Fertilizer } from "./types";

export async function preloadDefaultData() {
  try {
    // Check if projects already exist
    const { getProjects } = await import("./firestore");
    const existingProjects = await getProjects();
    if (existingProjects.length > 0) {
      console.log("Projects already exist, skipping seed data");
      return null;
    }

    // Create the default "Aquarium" project
    const projectId = await createProject({
      name: "Aquarium",
      description: "Main tank",
      createdAt: new Date().toISOString(),
    });

    // Create Chihiros WRGB II Pro 60 lamp
    await createDevice({
      projectId,
      type: "lamp",
      name: "Chihiros WRGB II Pro 60",
      settings: {
        brand: "Chihiros",
        model: "WRGB II Pro 60",
        intensityPercent: 70,
        channels: { W: 50, R: 90, G: 65, B: 70 },
      },
    });

    // Create targets
    const targets: Omit<Target, "id">[] = [
      { projectId, param: "NO3", min: 10, max: 20, unit: "ppm" },
      { projectId, param: "PO4", min: 0.5, max: 1.0, unit: "ppm" },
      { projectId, param: "K", min: 10, max: 15, unit: "ppm" },
      { projectId, param: "Fe", min: 0.05, max: 0.1, unit: "ppm" },
    ];

    for (const target of targets) {
      await createTarget(target);
    }

    // Create Dennerle fertilizers
    const fertilizers: Omit<Fertilizer, "id">[] = [
      {
        projectId,
        name: "Dennerle NPK Booster",
        type: "macro",
        recommendedDose: "1–1.5 ml/day",
        schedule: "daily",
        targetEffect: "NO3 10–20 ppm, PO4 0.5–1 ppm, K 10–15 ppm",
      },
      {
        projectId,
        name: "Dennerle Scaper's Green",
        type: "micro",
        recommendedDose: "0.5 ml/day",
        schedule: "daily",
        targetEffect: "Fe ≈ 0.05 ppm, trace elements",
      },
      {
        projectId,
        name: "Dennerle V30 Complete",
        type: "micro",
        recommendedDose: "3 ml/week",
        schedule: "weekly",
        targetEffect: "Replenish micro/trace after water change",
      },
      {
        projectId,
        name: "Dennerle E15 FerActiv",
        type: "iron",
        recommendedDose: "½ tablet / 2 weeks",
        schedule: "biweekly",
        targetEffect: "Iron boost for red plants",
      },
    ];

    for (const fertilizer of fertilizers) {
      await createFertilizer(fertilizer);
    }

    console.log("Preloaded default data successfully!");
    return projectId;
  } catch (error) {
    console.error("Error preloading data:", error);
    throw error;
  }
}

// Legacy function name for backward compatibility
export async function preloadDennerleData() {
  return preloadDefaultData();
}
