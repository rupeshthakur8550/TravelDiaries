
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "traveldiaries-a3d00.firebaseapp.com",
  projectId: "traveldiaries-a3d00",
  storageBucket: "traveldiaries-a3d00.appspot.com",
  messagingSenderId: "159919311974",
  appId: "1:159919311974:web:761bb688dbac77be1831a7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

