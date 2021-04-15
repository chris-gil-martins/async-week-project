import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBRMIYrP0ke3F5NvVWHDABl2xot2o4GiPU',
  authDomain: 'async-week-project-d2f88.firebaseapp.com',
  projectId: 'async-week-project-d2f88',
  storageBucket: 'async-week-project-d2f88.appspot.com',
  messagingSenderId: '1017075098607',
  appId: '1:1017075098607:web:49378b691c649e8b84cc1a',
};

const fireApp = firebase.initializeApp(firebaseConfig);

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const fireAuth = fireApp.auth();
export const db = fireApp.firestore();
