let gradesChart = null;
let currentTrimesterFilter = 'all';

// Función para renderizar el gráfico
function renderGradesChart(grades) {
    const ctx = document.getElementById('gradesChart').getContext('2d');
    
    // Agrupar por asignatura y trimestre
    const datasets = [];
    const subjects = [...new Set(grades.map(grade => grade.subject))];
    const trimesters = [1, 2, 3];
    
    subjects.forEach(subject => {
        trimesters.forEach(trimester => {
            const trimesterGrades = grades
                .filter(grade => grade.subject === subject && grade.trimester === trimester)
                .sort((a, b) => a.date - b.date);
            
            if (trimesterGrades.length > 0) {
                datasets.push({
                    label: `${subject} (T${trimester})`,
                    data: trimesterGrades.map(grade => ({
                        x: formatDate(grade.date),
                        y: grade.grade
                    })),
                    borderColor: getColorForTrimester(trimester),
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 5,
                    pointHoverRadius: 7
                });
            }
        });
    });
    
    if (gradesChart) {
        gradesChart.destroy();
    }
    
    gradesChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Nota',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

function getColorForTrimester(trimester) {
    const colors = {
        1: '#3498db', // Azul para T1
        2: '#2ecc71', // Verde para T2
        3: '#e74c3c'  // Rojo para T3
    };
    return colors[trimester] || '#3498db';
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función para filtrar por trimestre
function setupTrimesterFilters(userId) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTrimesterFilter = this.dataset.trimester;
            loadGradesAndStats(userId, currentTrimesterFilter);
        });
    });
}