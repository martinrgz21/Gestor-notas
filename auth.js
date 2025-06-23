// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBO2mqJagOuIWpMWE8LZrv1G_QvoEri4M0",
  authDomain: "gestor-notas-ac51f.firebaseapp.com",
  projectId: "gestor-notas-ac51f",
  storageBucket: "gestor-notas-ac51f.firebasestorage.app",
  messagingSenderId: "328382384242",
  appId: "1:328382384242:web:929ff2c3983d210dbb1aeb"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Función para registrar usuario
function registerUser(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Crear documento de usuario en Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
}

// Función para iniciar sesión
function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

// Función para cerrar sesión
function logoutUser() {
    return auth.signOut();
}

// Observador de estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuario logueado, redirigir a dashboard
        if (window.location.pathname !== '/dashboard.html') {
            window.location.href = 'dashboard.html';
        }
    } else {
        // Usuario no logueado, redirigir a index
        if (window.location.pathname !== '/index.html') {
            window.location.href = 'index.html';
        }
    }
});