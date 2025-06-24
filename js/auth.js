const firebaseConfig = {
  apiKey: "AIzaSyBO2mqJagOuIWpMWE8LZrv1G_QvoEri4M0",
  authDomain: "gestor-notas-ac51f.firebaseapp.com",
  projectId: "gestor-notas-ac51f",
  storageBucket: "gestor-notas-ac51f.appspot.com",
  messagingSenderId: "328382384242",
  appId: "1:328382384242:web:929ff2c3983d210dbb1aeb"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Funciones de autenticación
function registerUser(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
}

function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

function logoutUser() {
    return auth.signOut();
}

// Observador de autenticación
auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
    } else if (!user && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
});