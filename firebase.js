// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import { initializeApp } from "firebase/app"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, getReactNativePersistence } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIoVo1PNAJIiP8G5WEv91cjpx9KCos7pI",
  authDomain: "ezwc-usm.firebaseapp.com",
  projectId: "ezwc-usm",
  storageBucket: "ezwc-usm.appspot.com",
  messagingSenderId: "907467523648",
  appId: "1:907467523648:web:2e445396016d170dc241a5"
};

// const app = initializeApp(firebaseConfig);
// export const auth = app.auth();

const FIREBASE_APP  = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);