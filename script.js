let students = [];
let totalStudents = 0;

const studentCounter = (() => {
    return () => {
        totalStudents = parseInt(localStorage.getItem('studentCounter')) || 0;
        ++totalStudents;
        localStorage.setItem('studentCounter', totalStudents);
        return totalStudents;
    }
})();

const addNewStudent = () => {
    const name = document.getElementById('nameInput').value;
    const score = parseFloat(document.getElementById('scoreInput').value);

    if(name && !isNaN(score) && score >= 0){
        const student = { name, score };
        students.push(student);

        saveToLocalStorage();
        studentCounter();

        console.log(`Added ${name} with a score of ${score}`);

        displayStudents();
        displayStats();
    } else {
        console.log("Please enter a valid name or score");
    }
}

const reset = () => {
    if(students.length > 0){
        localStorage.clear();
        totalStudents = 0;
        students = [];
        displayStudents();
        displayStats();
        console.log("All records cleared.");
    }
}

const saveToLocalStorage = () => {
    localStorage.setItem('students', JSON.stringify(students));
    console.log("Saved to local storage");
}

const loadFromLocalStorage = () => {
    const storedStudents = localStorage.getItem('students');
    const storedCount = localStorage.getItem('studentCounter');
    
    if (storedStudents) {
        students = JSON.parse(storedStudents);
    }
    if (storedCount) {
        totalStudents = parseInt(storedCount);
    }
    displayStudents();
    displayStats();
}

const averageScore = () => {
    let totalScore = students.reduce((sum, student) => sum + student.score, 0);
    return (totalScore / students.length).toFixed(2);
}

const findHighestScore = () => {
    return Math.max(...students.map(student => student.score));
}

const findLowestScore = () => {
    return Math.min(...students.map(student => student.score));
}

const displayStudents = () => {
    const output = document.querySelector('.output p');
    output.innerHTML = `Total Students: ${totalStudents} <br> Name: ${students.map(student => `${student.name}: ${student.score}`).join(', ')} <br/>`;
}

const displayStats = () => {
    if(students.length > 0){
        console.log(`Average Score: ${averageScore()}`);
        console.log(`Highest Score: ${findHighestScore()}`);
        console.log(`Lowest Score: ${findLowestScore()}`);
    } else {
        console.log("No students added yet");
    }
}

const fetchStudentData = async () => {
    try {
        const response = await fetch('data.json');
        const resData = await response.json();
        
        students = [...students, ...resData];

        displayStudents();
        displayStats();
    } catch (error) {
        console.log("Failed to fetch student data.", error);
    }
}

window.onload = () => {
    loadFromLocalStorage();
    fetchStudentData();
};

document.getElementById('btn').addEventListener('click', addNewStudent);
document.getElementById('resetBtn').addEventListener('click', reset);
