# Ghid de Testare - Aquarium Tracker

## Pasul 1: Configurare Firebase

### 1.1 Creează un proiect Firebase

1. Mergi la [Firebase Console](https://console.firebase.google.com/)
2. Click pe "Add project" sau "Create a project"
3. Introdu un nume pentru proiect (ex: "aquarium-tracker")
4. Continuă prin wizard-ul de setup

### 1.2 Activează serviciile necesare

#### Firestore Database
1. În Firebase Console, mergi la "Firestore Database"
2. Click "Create database"
3. Alege "Start in test mode" (pentru testare)
4. Alege o locație (ex: europe-west)
5. Click "Enable"

#### Storage
1. Mergi la "Storage"
2. Click "Get started"
3. Alege "Start in test mode"
4. Click "Next" și "Done"

#### Authentication (Opțional)
1. Mergi la "Authentication"
2. Click "Get started"
3. Activează "Google" provider dacă vrei sign-in
4. Salvează configurația

### 1.3 Obține configurația Firebase

1. Mergi la "Project Settings" (⚙️ icon)
2. Scroll jos la "Your apps"
3. Click pe iconul web (`</>`)
4. Dacă nu ai o app, click "Register app"
5. Copiază valorile din obiectul de configurare

### 1.4 Creează fișierul .env.local

1. În root-ul proiectului, creează un fișier `.env.local`
2. Copiază conținutul din `.env.local.example`
3. Completează cu valorile tale din Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Pasul 2: Instalează dependențele

```bash
npm install
```

## Pasul 3: Rulează aplicația

```bash
npm run dev
```

Aplicația va rula la: **http://localhost:3000**

## Pasul 4: Testează funcționalitățile

### 4.1 Prima rulare - Seed Data

1. Deschide http://localhost:3000
2. Mergi la pagina "Settings"
3. Click pe butonul "Preload Example Data"
4. Aceasta va crea:
   - Proiectul "Aquarium"
   - Lampă Chihiros WRGB II Pro 60
   - 4 targets (NO3, PO4, K, Fe)
   - 4 fertilizante Dennerle

### 4.2 Testează Dashboard

1. Mergi la "Dashboard"
2. Ar trebui să vezi:
   - Latest measurements
   - Upcoming tasks
   - Quick links

### 4.3 Testează Projects & Settings

1. Mergi la "Settings"
2. Creează un proiect nou
3. Editează un proiect existent
4. Adaugă targets noi

### 4.4 Testează Fertilization

1. Mergi la "Fertilization"
2. Vezi tabelul cu fertilizante Dennerle
3. Adaugă un fertilizant nou
4. Editează unul existent

### 4.5 Testează Measurements

1. Mergi la "Measurements"
2. Click "New Measurement"
3. Adaugă o măsurătoare (ex: NO3 = 15 ppm)
4. Vezi chart-ul cu evoluția
5. Filtrează după parametru

### 4.6 Testează Planner

1. Mergi la "Planner"
2. Testează view-urile: Day, Week, Month, Year
3. Adaugă o acțiune nouă
4. Marchează ca "done"
5. Navighează între date

### 4.7 Testează Lighting

1. Mergi la "Lighting"
2. Vezi lampa Chihiros
3. Ajustează intensitatea cu slider-ul
4. Adaugă un device nou

### 4.8 Testează Photos

1. Mergi la "Photos"
2. Click "Upload Photo"
3. Selectează o imagine (max 5MB)
4. Vezi imaginea în grid

### 4.9 Testează Authentication (dacă e activat)

1. Click pe "Sign In" în navbar
2. Conectează-te cu Google
3. Vezi numele tău în navbar

### 4.10 Testează Theme Toggle

1. Click pe iconul de theme (lună/soare) în navbar
2. Schimbă între light/dark mode

## Pasul 5: Verifică în Firebase Console

### Firestore
1. Mergi la Firestore Database în Firebase Console
2. Ar trebui să vezi colecțiile:
   - `projects`
   - `devices`
   - `targets`
   - `fertilizers`
   - `logs` (legacy)
   - `measurements`
   - `doseLogs`
   - `waterChanges`
   - `actions`
   - `photos`
   - `reminders`

### Storage
1. Mergi la Storage
2. Ar trebui să vezi folderul `photos/` cu imaginile uploadate

## Probleme comune

### Eroare: "Firebase: Error (auth/api-key-not-valid)"
- Verifică că ai copiat corect API key-ul în `.env.local`
- Asigură-te că ai restartat serverul după ce ai adăugat `.env.local`

### Eroare: "Missing or insufficient permissions"
- Verifică Firestore Rules - pentru testare, folosește:
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

### Aplicația nu se încarcă
- Verifică că ai rulat `npm install`
- Verifică că ai creat `.env.local` cu valorile corecte
- Verifică consola browser-ului pentru erori
- Verifică terminalul pentru erori de compilare

### Nu văd datele seed
- Mergi la Settings și click "Preload Example Data"
- Verifică în Firebase Console că datele au fost create

## Testare offline

1. Deschide aplicația
2. Deschide DevTools > Network
3. Simulează offline (Network tab > Throttling > Offline)
4. Aplicația ar trebui să funcționeze cu datele cache-uite
5. Când revii online, datele se sincronizează automat

## Next Steps

După testare, poți:
1. Actualiza Firestore Rules pentru producție
2. Actualiza Storage Rules pentru producție
3. Deploy pe Vercel (vezi README.md)

