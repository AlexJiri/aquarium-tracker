# Aquarium Tracker

A cloud-based aquarium management and tracking web application built with Next.js, TypeScript, TailwindCSS, and Firebase. Deployable 100% free on Vercel with Firebase Free Tier backend.

## Features

- **Authentication** (optional Google Sign-in)
- **Projects Management** - Create and manage multiple aquarium projects with dimensions and volume tracking
- **Device Control** - Manage lamps, filters, CO₂ systems, and heaters with tunable properties (intensity, RGB channels)
- **Fertilization Schema** - Editable table for fertilization solutions with recommended doses, schedules, and target effects
- **Daily/Weekly Checklists** - Task management for fertilization, water changes, pruning, CO₂ checks, etc.
- **Data Logging** - Track measured values (NO₃, PO₄, K, Fe, etc.) with date/time stamps
- **Chart Visualization** - Recharts-powered graphs showing parameter evolution over time
- **Targets Management** - Define desired parameter ranges (NO₃, PO₄, Fe, etc.) with in-range/out-of-range indicators
- **Photo Gallery** - Upload and manage aquarium photos with Firebase Storage
- **Dashboard** - Overview of latest measurements, upcoming tasks, and lighting summary
- **Timeline View** - Day/Week/Month views with progress tracking
- **Light/Dark Theme** - Toggle between light and dark modes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Firebase (Firestore, Storage, optional Auth)
- **Deployment**: Vercel (free tier)

## Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier)
- Vercel account (for deployment)

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable the following services:
   - **Firestore Database** (Create database in test mode for development)
   - **Storage** (Start in test mode)
   - **Authentication** (optional - enable Google provider if you want sign-in)

4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click the web icon (`</>`)
   - Register your app and copy the Firebase configuration object

5. Set up Firestore Security Rules (for production):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

6. Set up Storage Security Rules (for production):
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /photos/{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## Local Development Setup

1. **Clone the repository** (or use the existing project)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Preload example data** (optional):
   After creating your first project, you can preload the Dennerle fertilization schema by making a POST request to `/api/preload` or manually adding the fertilizers through the UI.

## Preloading Example Data

The app includes a preload function for the Dennerle fertilization schema. To use it:

1. Make sure you have at least one project created
2. Call the preload API endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/preload
   ```

Or manually add the following fertilizers through the Fertilization page:
- **NPK Booster**: 5ml per 50L, Daily, N/P/K boost
- **Scaper's Green**: 5ml per 50L, Daily, Iron/trace elements
- **V30**: 5ml per 50L, Weekly, Vitamins
- **E15**: 5ml per 50L, Weekly, Enzymes

## Deployment to Vercel

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (same as `.env.local`)
   - Click "Deploy"

3. **Configure Firebase for production**:
   - Update Firebase Authentication authorized domains to include your Vercel domain
   - Update Firestore and Storage security rules for production use

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── planner/           # Planner/Timeline page
│   ├── fertilization/     # Fertilization schema page
│   ├── measurements/      # Measurements and charts page
│   ├── lighting/          # Device management page
│   ├── photos/            # Photo gallery page
│   └── settings/          # Settings and projects page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── nav.tsx           # Navigation component
│   ├── layout.tsx        # Layout wrapper
│   └── theme-toggle.tsx  # Theme switcher
├── lib/                  # Utility functions
│   ├── firebase.ts       # Firebase initialization
│   ├── firestore.ts      # Firestore operations
│   ├── storage.ts        # Storage operations
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## Data Model

### Firestore Collections

- **projects**: `{ id, name, createdAt, description, dimensions }`
- **devices**: `{ id, projectId, type, name, settings }`
- **targets**: `{ id, projectId, param, min, max, unit }`
- **fertilizers**: `{ id, projectId, name, recommendedDose, schedule, targetEffect }`
- **logs**: `{ id, projectId, fertilizerId?, type, param?, value?, unit?, date, notes }`
- **actions**: `{ id, projectId, type, date, done, notes }`
- **photos**: `{ id, projectId, url, date, notes }`

## Features in Detail

### Offline Support
Firestore persistence is enabled, allowing the app to work offline and sync when connection is restored.

### Free Tier Limits
- **Firebase Free Tier**: 50K reads/day, 20K writes/day, 1GB storage
- **Vercel Free Tier**: Unlimited bandwidth, 100GB storage
- The app is optimized to stay within these limits for personal use

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for aquarium enthusiasts

