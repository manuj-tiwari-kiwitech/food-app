import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword as signIn, createUserWithEmailAndPassword as createUser } from 'firebase/auth';

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
const auth = getAuth(app);

// Function to sign in with email and password
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signIn(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to create a new user with email and password
export const createUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUser(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};