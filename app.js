document.addEventListener('DOMContentLoaded', function() {
    // Página de inicio de sesión
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
            
            if (!email || !password) {
                errorMessage.textContent = 'Por favor ingresa email y contraseña';
                errorMessage.classList.remove('d-none');
                return;
            }
            
            registerUser(email, password)
                .then(() => {
                    errorMessage.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
                    errorMessage.classList.remove('d-none');
                    errorMessage.classList.remove('alert-danger');
                    errorMessage.classList.add('alert-success');
                })
                .catch(error => {
                    errorMessage.textContent = error.message;
                    errorMessage.classList.remove('d-none');
                    errorMessage.classList.remove('alert-success');
                    errorMessage.classList.add('alert-danger');
                });
        });
    }
    
    // Dashboard
    if (document.getElementById('logoutBtn')) {
        const logoutBtn = document.getElementById('logoutBtn');
        const addGradeForm = document.getElementById('addGradeForm');
        const gradesTable = document.getElementById('gradesTable');
        const averagesList = document.getElementById('averagesList');
        
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
        
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Cargar notas al iniciar
                loadGrades(user.uid);
                
                // Añadir nueva nota
                addGradeForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const subject = document.getElementById('subject').value;
                    const grade = document.getElementById('grade').value;
                    const date = document.getElementById('date').value;
                    
                    addGrade(user.uid, subject, grade, date)
                        .then(() => {
                            addGradeForm.reset();
                            loadGrades(user.uid);
                        })
                        .catch(error => {
                            alert('Error al guardar la nota: ' + error.message);
                        });
                });
            }
        });
        
        // Función para cargar notas
        function loadGrades(userId) {
            getGrades(userId)
                .then(grades => {
                    // Renderizar tabla
                    renderGradesTable(grades);
                    
                    // Calcular y mostrar promedios
                    const averages = calculateAverages(grades);
                    renderAverages(averages);
                    
                    // Renderizar gráfico
                    renderGradesChart(grades);
                });
        }
        
        // Función para renderizar la tabla de notas
        function renderGradesTable(grades) {
            gradesTable.innerHTML = '';
            
            grades.forEach(grade => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${grade.subject}</td>
                    <td>${grade.grade}</td>
                    <td>${grade.date.toDate().toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${grade.id}">
                            Eliminar
                        </button>
                    </td>
                `;
                
                gradesTable.appendChild(row);
            });
            
            // Agregar event listeners a los botones de eliminar
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const gradeId = e.target.getAttribute('data-id');
                    deleteGrade(auth.currentUser.uid, gradeId)
                        .then(() => loadGrades(auth.currentUser.uid))
                        .catch(error => alert('Error al eliminar: ' + error.message));
                });
            });
        }
        
        // Función para renderizar promedios
        function renderAverages(averages) {
            averagesList.innerHTML = '';
            
            for (const subject in averages) {
                const item = document.createElement('li');
                item.className = 'list-group-item d-flex justify-content-between align-items-center';
                item.innerHTML = `
                    ${subject}
                    <span class="badge bg-primary rounded-pill">${averages[subject]}</span>
                `;
                averagesList.appendChild(item);
            }
        }
    }
});