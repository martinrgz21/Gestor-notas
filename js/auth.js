const firebaseConfig = {
  apiKey: "AIzaSyBO2mqJagOuIWpMWE8LZrv1G_QvoEri4M0",
  authDomain: "gestor-notas-ac51f.firebaseapp.com",
  projectId: "gestor-notas-ac51f",
  storageBucket: "gestor-notas-ac51f.firebasestorage.app",
  messagingSenderId: "328382384242",
  appId: "1:328382384242:web:929ff2c3983d210dbb1aeb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Rest of your auth.js code remains exactly the same