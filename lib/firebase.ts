import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig, validateFirebaseConfig } from "./firebaseConfig";

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;

// Validate config before initializing
try {
  validateFirebaseConfig();
} catch (error) {
  // Config validation failed - will show error message
  console.error("Firebase configuration error:", error);
}

if (typeof window !== "undefined") {
  // Client-side
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      throw error;
    }
  } else {
    app = getApps()[0];
  }
  
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === "unimplemented") {
      console.warn("The current browser does not support all of the features required for persistence.");
    }
  });
} else {
  // Server-side: create minimal instances
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      throw error;
    }
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
}

export { db, storage, auth };
export default app;

