import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// console.log('Firebase Config Check:', {
//   apiKey: import.meta.env.VITE_APP_API_KEY ? 'Set' : 'Missing',
//   authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN ? 'Set' : 'Missing',
//   projectId: import.meta.env.VITE_APP_PROJECT_ID ? 'Set' : 'Missing',
//   storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET ? 'Set' : 'Missing',
//   messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID ? 'Set' : 'Missing',
//   appId: import.meta.env.VITE_APP_APP_ID ? 'Set' : 'Missing',
// });

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID
};

// Validating the required fields
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  console.error('Missing Firebase configuration fields:', missingFields);
  throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
}

// Initialize Firebase
let app;
let auth;


// for debugging
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export default app;
export { auth };