// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

