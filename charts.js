let gradesChart = null;

// Función para renderizar el gráfico
function renderGradesChart(grades) {
    const ctx = document.getElementById('gradesChart').getContext('2d');
    
    // Agrupar notas por asignatura
    const subjects = [...new Set(grades.map(grade => grade.subject))];
    const datasets = [];
    
    subjects.forEach(subject => {
        const subjectGrades = grades
            .filter(grade => grade.subject === subject)
            .sort((a, b) => a.date - b.date);
        
        datasets.push({
            label: subject,
            data: subjectGrades.map(grade => grade.grade),
            borderColor: getRandomColor(),
            backgroundColor: 'rgba(0, 0, 0, 0)',
            tension: 0.1,
            fill: false
        });
    });
    
    if (gradesChart) {
        gradesChart.destroy();
    }
    
    gradesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: grades.map(grade => grade.date.toDate().toLocaleDateString()),
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

// Función auxiliar para generar colores aleatorios
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}