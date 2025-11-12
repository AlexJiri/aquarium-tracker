# 🔧 Fix: Proiect Vercel există deja

## Soluție 1: Folosește proiectul existent (Recomandat)

1. Mergi la: https://vercel.com/dashboard
2. Găsește proiectul **"aquarium-tracker-6wcy"** (sau alt nume similar)
3. Click pe proiect
4. Mergi la **Settings** → **Git**
5. Dacă nu e conectat la GitHub:
   - Click **"Connect Git Repository"**
   - Selectează **AlexJiri/aquarium-tracker**
   - Click **"Connect"**
6. Dacă e deja conectat:
   - Click **"Redeploy"** sau mergi la **Deployments**
   - Click pe ultimul deployment
   - Click **"Redeploy"**

## Soluție 2: Șterge proiectul vechi și creează unul nou

1. Mergi la: https://vercel.com/dashboard
2. Găsește proiectul vechi
3. Click pe **Settings** → scroll jos → **"Delete Project"**
4. Confirmă ștergerea
5. Acum poți crea un proiect nou:
   - Click **"Add New Project"**
   - Selectează **AlexJiri/aquarium-tracker**
   - Click **"Import"**

## Soluție 3: Schimbă numele proiectului

1. Mergi la proiectul existent pe Vercel
2. **Settings** → **General**
3. Schimbă **Project Name** la ce vrei (ex: `aquarium-tracker-main`)
4. Save

## ⚙️ Environment Variables

**IMPORTANT:** După ce ai conectat repository-ul, asigură-te că ai adăugat Environment Variables:

1. Mergi la **Settings** → **Environment Variables**
2. Adaugă (una câte una):

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyAED9lcad241XDwnzfol3Oo_ZRrWf2E1zE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = aquarium-tracker-1875b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = aquarium-tracker-1875b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = aquarium-tracker-1875b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 517589810787
NEXT_PUBLIC_FIREBASE_APP_ID = 1:517589810787:web:702659278d950f41590256
```

3. Selectează **Production**, **Preview**, și **Development** pentru fiecare
4. Click **"Save"** după fiecare

## 🚀 După configurare

1. Mergi la **Deployments**
2. Click **"Redeploy"** pe ultimul deployment
3. Sau așteaptă ca Vercel să detecteze automat push-ul nou

## ✅ Verificare

După deploy, aplicația va fi live la: `https://aquarium-tracker-6wcy.vercel.app` (sau numele tău de proiect)

