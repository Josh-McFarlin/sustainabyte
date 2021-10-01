import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLwyTjQ5uXRpjgzeUFD3YIvQbiSZvg-_o",
  authDomain: "fpa-starter.firebaseapp.com",
  projectId: "fpa-starter",
  storageBucket: "fpa-starter.appspot.com",
  messagingSenderId: "878896400667",
  appId: "1:878896400667:web:cb6635f4ceec10a5d72bbe",
};

const client = firebase.initializeApp(firebaseConfig);

export default client;
export const db = firebase.firestore();
export const auth = firebase.auth();
