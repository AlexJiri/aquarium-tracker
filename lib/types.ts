export type ID = string; // Firestore doc id
export type ISODate = string; // ISO8601

export type Project = {
  id: ID;
  name: string; // e.g., "Aquarium"
  description?: string;
  createdAt: ISODate;
};

export type Device = {
  id: ID;
  projectId: ID;
  type: "lamp" | "filter" | "co2" | "other";
  name: string; // "Chihiros WRGB II Pro 60"
  settings?: {
    brand?: string;
    model?: string;
    intensityPercent?: number; // 0..100
    channels?: { W?: number; R?: number; G?: number; B?: number }; // 0..100
  };
  createdAt: ISODate;
};

export type TargetParam =
  | "NO3" | "PO4" | "K" | "Fe" | "pH" | "KH" | "GH" | "Temp" | "CO2" | "LightIntensity";

export type Target = {
  id: ID;
  projectId: ID;
  param: TargetParam;
  min?: number;
  max?: number;
  unit: string; // "ppm", "°dKH", "°dGH", "pH", "°C", "%"
  notes?: string;
};

export type Fertilizer = {
  id: ID;
  projectId: ID;
  name: string; // "Dennerle NPK Booster"
  type: "macro" | "micro" | "iron" | "other";
  recommendedDose: string; // "1–1.5 ml/day"
  schedule: "daily" | "weekly" | "biweekly" | "monthly";
  targetEffect: string; // "NO3 10–20 ppm, PO4 0.5–1 ppm, K 10–15 ppm"
};

export type DoseLog = {
  id: ID;
  projectId: ID;
  fertilizerId: ID;
  date: ISODate;
  amountMl: number;
  notes?: string;
};

export type Measurement = {
  id: ID;
  projectId: ID;
  param: TargetParam;
  value: number;
  unit: string; // "ppm", etc.
  date: ISODate;
  notes?: string;
};

export type WaterChange = {
  id: ID;
  projectId: ID;
  date: ISODate;
  percent: number; // 0..100
  notes?: string;
};

export type ActionType =
  | "fertilization" | "waterChange" | "pruning" | "glassCleaning"
  | "filterMaintenance" | "co2Check" | "lightingAdjust" | "other";

export type Action = {
  id: ID;
  projectId: ID;
  type: ActionType;
  date: ISODate;
  done: boolean;
  notes?: string;
};

export type Photo = {
  id: ID;
  projectId: ID;
  url: string; // Firebase Storage public URL
  date: ISODate;
  notes?: string;
};

export type Reminder = {
  id: ID;
  projectId: ID;
  title: string; // e.g., "Daily fertilization"
  cadence: "daily" | "weekly" | "biweekly" | "monthly" | "custom";
  nextDueDate: ISODate;
  lastDoneDate?: ISODate;
  checklist?: string[]; // e.g., ["NPK", "Scaper's Green"]
};

// Legacy Log type for backward compatibility (can be removed later)
export type Log = {
  id: ID;
  projectId: ID;
  fertilizerId?: string;
  type: "measurement" | "action" | "note";
  param?: string;
  value?: number;
  unit?: string;
  date: ISODate;
  notes?: string;
};
