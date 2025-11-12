import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadPhoto(
  file: File,
  projectId: string
): Promise<string> {
  const timestamp = Date.now();
  const fileName = `${projectId}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, `photos/${fileName}`);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function deletePhotoFromStorage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting photo from storage:", error);
  }
}

