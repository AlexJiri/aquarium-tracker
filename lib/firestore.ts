import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Project,
  Device,
  Target,
  Fertilizer,
  Log,
  Action,
  Photo,
  Measurement,
  DoseLog,
  WaterChange,
  Reminder,
} from "./types";

// Projects
export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.().toISOString() || doc.data().createdAt,
  })) as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate?.().toISOString() || docSnap.data().createdAt,
  } as Project;
}

export async function createProject(data: Omit<Project, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, data);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// Devices
export async function getDevices(projectId: string): Promise<Device[]> {
  const q = query(
    collection(db, "devices"),
    where("projectId", "==", projectId),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Device[];
}

export async function createDevice(data: Omit<Device, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "devices"), data);
  return docRef.id;
}

export async function updateDevice(id: string, data: Partial<Device>): Promise<void> {
  const docRef = doc(db, "devices", id);
  await updateDoc(docRef, data);
}

export async function deleteDevice(id: string): Promise<void> {
  await deleteDoc(doc(db, "devices", id));
}

// Targets
export async function getTargets(projectId: string): Promise<Target[]> {
  const q = query(
    collection(db, "targets"),
    where("projectId", "==", projectId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Target[];
}

export async function createTarget(data: Omit<Target, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "targets"), data);
  return docRef.id;
}

export async function updateTarget(id: string, data: Partial<Target>): Promise<void> {
  const docRef = doc(db, "targets", id);
  await updateDoc(docRef, data);
}

export async function deleteTarget(id: string): Promise<void> {
  await deleteDoc(doc(db, "targets", id));
}

// Fertilizers
export async function getFertilizers(projectId: string): Promise<Fertilizer[]> {
  const q = query(
    collection(db, "fertilizers"),
    where("projectId", "==", projectId),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Fertilizer[];
}

export async function createFertilizer(data: Omit<Fertilizer, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "fertilizers"), data);
  return docRef.id;
}

export async function updateFertilizer(id: string, data: Partial<Fertilizer>): Promise<void> {
  const docRef = doc(db, "fertilizers", id);
  await updateDoc(docRef, data);
}

export async function deleteFertilizer(id: string): Promise<void> {
  await deleteDoc(doc(db, "fertilizers", id));
}

// Logs
export async function getLogs(
  projectId: string,
  constraints?: QueryConstraint[]
): Promise<Log[]> {
  const constraintsList = [
    where("projectId", "==", projectId),
    orderBy("date", "desc"),
    ...(constraints || []),
  ];
  const q = query(collection(db, "logs"), ...constraintsList);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString() || doc.data().date,
  })) as Log[];
}

export async function createLog(data: Omit<Log, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "logs"), {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
}

export async function updateLog(id: string, data: Partial<Log>): Promise<void> {
  const docRef = doc(db, "logs", id);
  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = Timestamp.fromDate(new Date(data.date));
  }
  await updateDoc(docRef, updateData);
}

export async function deleteLog(id: string): Promise<void> {
  await deleteDoc(doc(db, "logs", id));
}

// Actions
export async function getActions(
  projectId: string,
  constraints?: QueryConstraint[]
): Promise<Action[]> {
  const constraintsList = [
    where("projectId", "==", projectId),
    orderBy("date", "desc"),
    ...(constraints || []),
  ];
  const q = query(collection(db, "actions"), ...constraintsList);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString() || doc.data().date,
  })) as Action[];
}

export async function createAction(data: Omit<Action, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "actions"), {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
}

export async function updateAction(id: string, data: Partial<Action>): Promise<void> {
  const docRef = doc(db, "actions", id);
  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = Timestamp.fromDate(new Date(data.date));
  }
  await updateDoc(docRef, updateData);
}

export async function deleteAction(id: string): Promise<void> {
  await deleteDoc(doc(db, "actions", id));
}

// Photos
export async function getPhotos(projectId: string): Promise<Photo[]> {
  const q = query(
    collection(db, "photos"),
    where("projectId", "==", projectId),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString() || doc.data().date,
  })) as Photo[];
}

export async function createPhoto(data: Omit<Photo, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "photos"), {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
}

export async function deletePhoto(id: string): Promise<void> {
  await deleteDoc(doc(db, "photos", id));
}

// Measurements
export async function getMeasurements(
  projectId: string,
  constraints?: QueryConstraint[]
): Promise<Measurement[]> {
  const constraintsList = [
    where("projectId", "==", projectId),
    orderBy("date", "desc"),
    ...(constraints || []),
  ];
  const q = query(collection(db, "measurements"), ...constraintsList);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString() || doc.data().date,
  })) as Measurement[];
}

export async function createMeasurement(data: Omit<Measurement, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "measurements"), {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
}

export async function updateMeasurement(id: string, data: Partial<Measurement>): Promise<void> {
  const docRef = doc(db, "measurements", id);
  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = Timestamp.fromDate(new Date(data.date));
  }
  await updateDoc(docRef, updateData);
}

export async function deleteMeasurement(id: string): Promise<void> {
  await deleteDoc(doc(db, "measurements", id));
}

// DoseLogs
export async function getDoseLogs(
  projectId: string,
  constraints?: QueryConstraint[]
): Promise<DoseLog[]> {
  const constraintsList = [
    where("projectId", "==", projectId),
    orderBy("date", "desc"),
    ...(constraints || []),
  ];
  const q = query(collection(db, "doseLogs"), ...constraintsList);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString() || doc.data().date,
  })) as DoseLog[];
}

export async function createDoseLog(data: Omit<DoseLog, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "doseLogs"), {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
}

export async function updateDoseLog(id: string, data: Partial<DoseLog>): Promise<void> {
  const docRef = doc(db, "doseLogs", id);
  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = Timestamp.fromDate(new Date(data.date));
  }
  await updateDoc(docRef, updateData);
}

export async function deleteDoseLog(id: string): Promise<void> {
  await deleteDoc(doc(db, "doseLogs", id));
}

// WaterChanges
export async function getWaterChanges(
  projectId: string,
  constraints?: QueryConstraint[]
): Promise<WaterChange[]> {
  const constraintsList = [
    where("projectId", "==", projectId),
    orderBy("date", "desc"),
    ...(constraints || []),
  ];
  const q = query(collection(db, "waterChanges"), ...constraintsList);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString() || doc.data().date,
  })) as WaterChange[];
}

export async function createWaterChange(data: Omit<WaterChange, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "waterChanges"), {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
  });
  return docRef.id;
}

export async function updateWaterChange(id: string, data: Partial<WaterChange>): Promise<void> {
  const docRef = doc(db, "waterChanges", id);
  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = Timestamp.fromDate(new Date(data.date));
  }
  await updateDoc(docRef, updateData);
}

export async function deleteWaterChange(id: string): Promise<void> {
  await deleteDoc(doc(db, "waterChanges", id));
}

// Reminders
export async function getReminders(projectId: string): Promise<Reminder[]> {
  const q = query(
    collection(db, "reminders"),
    where("projectId", "==", projectId),
    orderBy("nextDueDate")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    nextDueDate: doc.data().nextDueDate?.toDate?.().toISOString() || doc.data().nextDueDate,
    lastDoneDate: doc.data().lastDoneDate?.toDate?.().toISOString() || doc.data().lastDoneDate,
  })) as Reminder[];
}

export async function createReminder(data: Omit<Reminder, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "reminders"), {
    ...data,
    nextDueDate: Timestamp.fromDate(new Date(data.nextDueDate)),
    lastDoneDate: data.lastDoneDate ? Timestamp.fromDate(new Date(data.lastDoneDate)) : undefined,
  });
  return docRef.id;
}

export async function updateReminder(id: string, data: Partial<Reminder>): Promise<void> {
  const docRef = doc(db, "reminders", id);
  const updateData: any = { ...data };
  if (data.nextDueDate) {
    updateData.nextDueDate = Timestamp.fromDate(new Date(data.nextDueDate));
  }
  if (data.lastDoneDate) {
    updateData.lastDoneDate = Timestamp.fromDate(new Date(data.lastDoneDate));
  }
  await updateDoc(docRef, updateData);
}

export async function deleteReminder(id: string): Promise<void> {
  await deleteDoc(doc(db, "reminders", id));
}

