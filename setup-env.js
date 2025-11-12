// Script pentru a crea .env.local cu datele Firebase
const fs = require('fs');
const path = require('path');

const envContent = `# Firebase Configuration
# Generated automatically - DO NOT commit this file to git

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAED9lcad241XDwnzfol3Oo_ZRrWf2E1zE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aquarium-tracker-1875b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aquarium-tracker-1875b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aquarium-tracker-1875b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=517589810787
NEXT_PUBLIC_FIREBASE_APP_ID=1:517589810787:web:702659278d950f41590256
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully!');
  console.log('📝 Firebase configuration added.');
  console.log('\n🚀 Next steps:');
  console.log('1. Restart your dev server (Ctrl+C then npm run dev)');
  console.log('2. Open http://localhost:3000');
  console.log('3. Go to Settings and click "Preload Example Data"');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  process.exit(1);
}

