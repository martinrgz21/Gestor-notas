// Añadir una nueva nota
function addGrade(userId, subject, grade, date) {
    return db.collection('users').doc(userId).collection('grades').add({
        subject: subject,
        grade: parseFloat(grade),
        date: new Date(date),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Obtener todas las notas de un usuario
function getGrades(userId) {
    return db.collection('users').doc(userId).collection('grades')
        .orderBy('date', 'desc')
        .get()
        .then((querySnapshot) => {
            const grades = [];
            querySnapshot.forEach((doc) => {
                grades.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return grades;
        });
}

// Eliminar una nota
function deleteGrade(userId, gradeId) {
    return db.collection('users').doc(userId).collection('grades').doc(gradeId).delete();
}

// Calcular promedios por asignatura
function calculateAverages(grades) {
    const averages = {};
    const count = {};

    grades.forEach(grade => {
        if (!averages[grade.subject]) {
            averages[grade.subject] = 0;
            count[grade.subject] = 0;
        }
        averages[grade.subject] += grade.grade;
        count[grade.subject]++;
    });

    for (const subject in averages) {
        averages[subject] = (averages[subject] / count[subject]).toFixed(2);
    }

    return averages;
}