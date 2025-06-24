// Añadir una nueva nota con trimestre
function addGrade(userId, subject, grade, date, trimester) {
    return db.collection('users').doc(userId).collection('grades').add({
        subject: subject,
        grade: parseFloat(grade),
        date: new Date(date),
        trimester: parseInt(trimester),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Obtener todas las notas de un usuario con filtrado por trimestre
function getGrades(userId, trimester = 'all') {
    let query = db.collection('users').doc(userId).collection('grades')
        .orderBy('date', 'desc');
    
    if (trimester !== 'all') {
        query = query.where('trimester', '==', parseInt(trimester));
    }
    
    return query.get().then((querySnapshot) => {
        const grades = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            grades.push({
                id: doc.id,
                subject: data.subject,
                grade: data.grade,
                date: data.date.toDate(),
                trimester: data.trimester
            });
        });
        return grades;
    });
}

// Eliminar una nota
function deleteGrade(userId, gradeId) {
    return db.collection('users').doc(userId).collection('grades').doc(gradeId).delete();
}

// Calcular promedios por asignatura y trimestre
function calculateAverages(grades) {
    const averages = {};
    const count = {};

    grades.forEach(grade => {
        const key = `${grade.subject} (T${grade.trimester})`;
        
        if (!averages[key]) {
            averages[key] = 0;
            count[key] = 0;
        }
        averages[key] += grade.grade;
        count[key]++;
    });

    for (const key in averages) {
        averages[key] = (averages[key] / count[key]).toFixed(2);
    }

    return averages;
}