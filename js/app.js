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
    if (document.getElementById('addGradeForm')) {
        const addGradeForm = document.getElementById('addGradeForm');
        const averagesList = document.getElementById('averagesList');
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Configurar fecha por defecto como hoy
        document.getElementById('date').valueAsDate = new Date();
        
        addGradeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subject = document.getElementById('subject').value;
            const grade = document.getElementById('grade').value;
            const date = document.getElementById('date').value;
            const trimester = document.getElementById('trimester').value;
            const user = auth.currentUser;
            
            addGrade(user.uid, subject, grade, date, trimester)
                .then(() => {
                    showAlert('Nota añadida correctamente', 'success');
                    addGradeForm.reset();
                    document.getElementById('date').valueAsDate = new Date();
                    loadGradesAndStats(user.uid, currentTrimesterFilter);
                })
                .catch(error => {
                    console.error("Error adding grade: ", error);
                    showAlert('Error al añadir la nota', 'danger');
                });
        });
        
        logoutBtn.addEventListener('click', () => {
            logoutUser().catch(error => {
                console.error("Logout error: ", error);
            });
        });
        
        auth.onAuthStateChanged(user => {
            if (user) {
                setupTrimesterFilters(user.uid);
                loadGradesAndStats(user.uid, currentTrimesterFilter);
            }
        });
        
        function loadGradesAndStats(userId, trimester = 'all') {
            getGrades(userId, trimester)
                .then(grades => {
                    if (grades.length === 0) {
                        averagesList.innerHTML = '<li class="list-group-item text-center text-muted">No hay notas registradas</li>';
                        if (gradesChart) gradesChart.destroy();
                        return;
                    }
                    
                    renderGradesChart(grades);
                    updateAveragesList(grades);
                })
                .catch(error => {
                    console.error("Error loading grades: ", error);
                    showAlert('Error al cargar las notas', 'danger');
                });
        }
        
        function updateAveragesList(grades) {
            const averages = calculateAverages(grades);
            averagesList.innerHTML = '';
            
            if (Object.keys(averages).length === 0) {
                averagesList.innerHTML = '<li class="list-group-item text-center text-muted">No hay datos para mostrar</li>';
                return;
            }
            
            for (const [subject, average] of Object.entries(averages)) {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                
                const trimester = subject.match(/T(\d)\)$/)[1];
                listItem.innerHTML = `
                    <div>
                        <span class="fw-bold">${subject.replace(/ \(T\d\)$/, '')}</span>
                        <small class="text-muted ms-2">Trimestre ${trimester}</small>
                    </div>
                    <span class="badge" style="background-color: ${getColorForTrimester(parseInt(trimester))}">
                        ${average}
                    </span>
                `;
                averagesList.appendChild(listItem);
            }
        }
        
        function showAlert(message, type) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
            alert.style.zIndex = '1000';
            alert.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.body.appendChild(alert);
            
            setTimeout(() => {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 150);
            }, 3000);
        }
    }
});