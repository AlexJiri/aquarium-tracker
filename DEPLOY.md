# 🚀 Deploy pe Vercel - Ghid Complet

## 📋 Pași pentru deploy online

### 1. Inițializează Git (dacă nu ai făcut-o deja)

```bash
git init
git add .
git commit -m "Initial commit - Aquarium Tracker"
```

### 2. Creează repository pe GitHub

1. Mergi la: https://github.com/new
2. Numește repository-ul: `aquarium-tracker` (sau alt nume)
3. **NU** bifeaza "Initialize with README" (avem deja)
4. Click **"Create repository"**

### 3. Push codul pe GitHub

**Înlocuiește `<username>` cu username-ul tău GitHub:**

```bash
git remote add origin https://github.com/<username>/aquarium-tracker.git
git branch -M main
git push -u origin main
```

**Exemplu:**
```bash
git remote add origin https://github.com/alexj/aquarium-tracker.git
git branch -M main
git push -u origin main
```

### 4. Deploy pe Vercel

1. **Mergi la:** https://vercel.com
2. **Sign in** cu GitHub (sau creează cont)
3. Click **"Add New Project"** sau **"Import Project"**
4. **Selectează repository-ul** `aquarium-tracker`
5. Click **"Import"**

### 5. Configurează Environment Variables pe Vercel

În pasul de configurare, scroll jos la **"Environment Variables"** și adaugă:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyAED9lcad241XDwnzfol3Oo_ZRrWf2E1zE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = aquarium-tracker-1875b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = aquarium-tracker-1875b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = aquarium-tracker-1875b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 517589810787
NEXT_PUBLIC_FIREBASE_APP_ID = 1:517589810787:web:702659278d950f41590256
```

**Important:** 
- Fiecare variabilă pe o linie separată
- Fără spații în jurul `=`
- Click **"Add"** pentru fiecare

### 6. Deploy!

1. Click **"Deploy"**
2. Așteaptă ~2-3 minute
3. Când e gata, vei primi un link: `https://aquarium-tracker-xxx.vercel.app`

### 7. Configurează Firebase pentru domeniul Vercel

1. Mergi la: https://console.firebase.google.com/project/aquarium-tracker-1875b/authentication/settings
2. Scroll jos la **"Authorized domains"**
3. Click **"Add domain"**
4. Adaugă domeniul tău Vercel (ex: `aquarium-tracker-xxx.vercel.app`)
5. Click **"Add"**

## ✅ Gata!

Aplicația ta este acum live la: `https://aquarium-tracker-xxx.vercel.app`

## 🔄 Update-uri viitoare

Când faci modificări:

```bash
git add .
git commit -m "Update description"
git push
```

Vercel va redeploy automat! 🎉

## 📝 Note importante

- **Nu push `.env.local`** - este deja în `.gitignore`
- **Environment Variables** trebuie setate manual pe Vercel
- **Firestore Rules** - asigură-te că sunt configurate corect pentru producție
- **Storage Rules** - la fel, configurează pentru producție

## 🔒 Firestore Rules pentru producție

În Firebase Console > Firestore > Rules, folosește:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allow read/write for authenticated users
      allow read, write: if request.auth != null;
      
      // SAU pentru testare (mai permisiv):
      // allow read, write: if true;
    }
  }
}
```

## 🎯 Custom Domain (Opțional)

Dacă vrei un domeniu personal:

1. În Vercel Dashboard > Settings > Domains
2. Adaugă domeniul tău
3. Urmează instrucțiunile pentru DNS

