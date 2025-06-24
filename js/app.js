document.addEventListener('DOMContentLoaded', function() {
    // Página de inicio
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        const registerLink = document.getElementById('registerLink');
        const errorMessage = document.getElementById('errorMessage');
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            loginUser(email, password)
                .catch(error => {
                    errorMessage.textContent = error.message;
                    errorMessage.classList.remove('d-none');
                });
        });
        
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            registerUser(email, password)
                .then(() => {
                    errorMessage.textContent = '¡Registro exitoso! Ahora inicia sesión.';
                    errorMessage.classList.remove('d-none', 'alert-danger');
                    errorMessage.classList.add('alert-success');
                })
                .catch(error => {
                    errorMessage.textContent = error.message;
                    errorMessage.classList.remove('d-none', 'alert-success');
                    errorMessage.classList.add('alert-danger');
                });
        });
    }

    // Dashboard
    if (document.getElementById('logoutBtn')) {
        // Tu código del dashboard aquí (sin cambios en la lógica)
    }
});