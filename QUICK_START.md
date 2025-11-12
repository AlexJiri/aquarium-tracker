# 🚀 Quick Start - Aquarium Tracker

## ✅ Configurația Firebase este gata!

Fișierul `.env.local` a fost creat cu datele tale Firebase.

## 📋 Pași următori:

### 1. Restart serverul de development

Dacă serverul rulează, oprește-l (Ctrl+C) și rulează din nou:

```bash
npm run dev
```

### 2. Deschide aplicația

Mergi la: **http://localhost:3000**

### 3. Preload date demo

1. Mergi la pagina **Settings**
2. Click pe butonul **"Preload Example Data"**
3. Aceasta va crea:
   - ✅ Proiectul "Aquarium"
   - ✅ Lampă Chihiros WRGB II Pro 60
   - ✅ 4 targets (NO3, PO4, K, Fe)
   - ✅ 4 fertilizante Dennerle

### 4. Activează Firestore și Storage în Firebase Console

#### Firestore Database
1. Mergi la: https://console.firebase.google.com/project/aquarium-tracker-1875b/firestore
2. Click **"Create database"**
3. Alege **"Start in test mode"**
4. Alege locația: `europe-west` (sau cea mai apropiată)
5. Click **"Enable"**

#### Storage
1. Mergi la: https://console.firebase.google.com/project/aquarium-tracker-1875b/storage
2. Click **"Get started"**
3. Alege **"Start in test mode"**
4. Click **"Next"** și **"Done"**

### 5. Testează aplicația

- ✅ **Dashboard** - vezi overview-ul
- ✅ **Fertilization** - vezi tabelul Dennerle
- ✅ **Measurements** - adaugă măsurători
- ✅ **Planner** - testează Day/Week/Month/Year
- ✅ **Lighting** - ajustează lampa
- ✅ **Photos** - upload imagini

## 🔧 Dacă vezi erori:

### Eroare: "Firebase: Error (auth/invalid-api-key)"
- ✅ Verifică că ai restartat serverul după crearea `.env.local`
- ✅ Verifică că `.env.local` există în root-ul proiectului

### Eroare: "Missing or insufficient permissions"
- Mergi la Firestore Rules și folosește (pentru testare):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 📤 Deploy pe Vercel (când ești gata)

1. **Push pe GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/aquarium-tracker.git
git push -u origin main
```

2. **Deploy pe Vercel:**
   - Mergi la https://vercel.com
   - Import GitHub repository
   - Adaugă Environment Variables (aceleași ca în `.env.local`)
   - Deploy!

## 🎉 Gata!

Aplicația ar trebui să funcționeze acum perfect!

