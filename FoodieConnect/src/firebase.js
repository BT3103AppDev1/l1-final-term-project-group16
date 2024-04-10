// firebase.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAsYIIIbxgiFq4tZ-ddcNPGRazu_qZrg6Q",
  authDomain: "bt3103-grp14fp.firebaseapp.com",
  projectId: "bt3103-grp14fp",
  storageBucket: "bt3103-grp14fp.appspot.com",
  messagingSenderId: "81911533733",
  appId: "1:81911533733:web:e554c624488919865afd4c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a Firestore instance
const db = firebase.firestore();

export { firebase, db }; // Export both firebase and db
export default firebase;
