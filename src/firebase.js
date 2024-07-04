import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCzX_8kWvcDrgD1GGdGHD0k5xL5rfJJmyc",
  authDomain: "meal-app-12ad0.firebaseapp.com",
  projectId: "meal-app-12ad0",
  storageBucket: "meal-app-12ad0.appspot.com",
  messagingSenderId: "653605513109",
  appId: "1:653605513109:web:3300665b74bfbf6ff7389c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();