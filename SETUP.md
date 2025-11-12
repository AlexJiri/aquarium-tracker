# Setup Rapid - Aquarium Tracker

## ⚡ Setup în 3 pași

### 1. Creează proiectul Firebase (5 minute)

1. Mergi la: https://console.firebase.google.com/
2. Click **"Add project"** sau **"Create a project"**
3. Introdu un nume (ex: `aquarium-tracker`)
4. Continuă prin wizard (poți sări peste Google Analytics pentru testare)

### 2. Activează serviciile

#### Firestore Database
- Mergi la **Firestore Database** în meniul din stânga
- Click **"Create database"**
- Alege **"Start in test mode"** (pentru testare rapidă)
- Alege o locație (ex: `europe-west`)
- Click **"Enable"**

#### Storage
- Mergi la **Storage** în meniul din stânga
- Click **"Get started"**
- Alege **"Start in test mode"**
- Click **"Next"** și **"Done"**

#### Authentication (Opțional)
- Mergi la **Authentication**
- Click **"Get started"**
- Dacă vrei Google Sign-In, activează **"Google"** provider
- Salvează

### 3. Obține configurația și creează .env.local

1. În Firebase Console, mergi la **⚙️ Project Settings**
2. Scroll jos la secțiunea **"Your apps"**
3. Dacă nu ai o app web, click pe iconul **`</>`** (Web)
4. Dă-i un nume (ex: "Aquarium Tracker") și click **"Register app"**
5. **Copiază valorile** din obiectul de configurare

6. În root-ul proiectului tău, creează fișierul **`.env.local`**:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (copiază din Firebase)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important:** Înlocuiește valorile cu cele din Firebase Console!

### 4. Rulează aplicația

```bash
npm run dev
```

Deschide: **http://localhost:3000**

### 5. Preload date demo

1. Mergi la pagina **Settings**
2. Click pe butonul **"Preload Example Data"**
3. Aceasta va crea:
   - Proiectul "Aquarium"
   - Lampă Chihiros WRGB II Pro 60
   - 4 targets (NO3, PO4, K, Fe)
   - 4 fertilizante Dennerle

## ✅ Verificare

Dacă vezi eroarea `Firebase: Error (auth/invalid-api-key)`:
- Verifică că ai creat `.env.local` (nu `.env`)
- Verifică că ai copiat corect toate valorile
- **Restart serverul** după ce ai creat/modificat `.env.local`:
  ```bash
  # Oprește serverul (Ctrl+C) și rulează din nou:
  npm run dev
  ```

## 📝 Exemplu .env.local complet

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC7xYz9AbCdEfGhIjKlMnOpQrStUvWxYz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aquarium-tracker-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aquarium-tracker-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aquarium-tracker-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321
NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321:web:abc123def456
```

**Notă:** Valorile de mai sus sunt exemple - folosește valorile tale din Firebase!

## 🔒 Firestore Rules (pentru testare)

În Firebase Console > Firestore Database > Rules, folosește:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Doar pentru testare!
    }
  }
}
```

Click **"Publish"** după ce ai modificat.

## 🎉 Gata!

Aplicația ar trebui să funcționeze acum. Explorează toate paginile și testează funcționalitățile!

