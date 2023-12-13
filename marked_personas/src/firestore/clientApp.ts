import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBjg3X4Sx0frY9IR6Z3CTDhDIQSsRQiMwg",
  authDomain: "marked-personas.firebaseapp.com",
  databaseURL: "https://marked-personas-default-rtdb.firebaseio.com",
  projectId: "marked-personas",
  storageBucket: "marked-personas.appspot.com",
  messagingSenderId: "722313661263",
  appId: "1:722313661263:web:cb22dbbdbb929b9462533a",
  measurementId: "G-2DT8LPPE63",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
