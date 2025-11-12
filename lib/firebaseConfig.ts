// Firebase Configuration
// Copy this file's values to .env.local or set them as environment variables

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Validate configuration
export function validateFirebaseConfig() {
  const missing: string[] = [];
  
  if (!firebaseConfig.apiKey) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.authDomain) missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!firebaseConfig.projectId) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!firebaseConfig.storageBucket) missing.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  if (!firebaseConfig.messagingSenderId) missing.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  if (!firebaseConfig.appId) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");
  
  if (missing.length > 0) {
    const error = `
❌ Firebase Configuration Missing!

Please create a .env.local file in the root directory with the following variables:

${missing.map(key => `${key}=your_value_here`).join('\n')}

To get these values:
1. Go to https://console.firebase.google.com/
2. Select your project (or create one)
3. Go to Project Settings (⚙️) > General
4. Scroll to "Your apps" and click the web icon (</>)
5. Copy the config values to .env.local

Example .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
`;
    console.error(error);
    if (typeof window === "undefined") {
      // Server-side: throw error
      throw new Error(`Missing Firebase config: ${missing.join(", ")}`);
    } else {
      // Client-side: show alert
      alert(error);
    }
  }
  
  return missing.length === 0;
}

