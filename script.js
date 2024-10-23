let students = [];
let totalStudents = 0;

const studentCounter = (() => {
    totalStudents = parseInt(localStorage.getItem('studentCounter')) || 0; // Initialize here
    return () => {
        ++totalStudents;
        localStorage.setItem('studentCounter', totalStudents);
        return totalStudents;
    };
})();

const addNewStudent = () => {
    const name = document.getElementById('nameInput').value;
    const score = parseFloat(document.getElementById('scoreInput').value);

    if (name && !isNaN(score) && score >= 0 && score <= 100) { // Valid score range
        const student = { name, score };
        students.push(student);

        saveToLocalStorage();
        studentCounter();

        console.log(`Added ${name} with a score of ${score}`);

        displayStudents();
        displayStats();
    } else {
        console.log("Please enter a valid name or score between 0 and 100");
    }
};

const reset = () => {
    if (students.length > 0) {
        localStorage.clear();
        totalStudents = 0;
        students = [];
        displayStudents();
        displayStats();
        console.log("All records cleared.");
    }
};

const saveToLocalStorage = () => {
    localStorage.setItem('students', JSON.stringify(students));
    console.log("Saved to local storage");
};

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
};

const averageScore = () => {
    let totalScore = students.reduce((sum, student) => sum + student.score, 0);
    return students.length > 0 ? (totalScore / students.length).toFixed(2) : "0.00";
};

const findHighestScore = () => {
    return students.length > 0 ? Math.max(...students.map(student => student.score)) : "N/A";
};

const findLowestScore = () => {
    return students.length > 0 ? Math.min(...students.map(student => student.score)) : "N/A";
};

const displayStudents = () => {
    const output = document.querySelector('.output p');
    output.innerHTML = `Total Students: ${totalStudents} <br> ${students.map(student => `${student.name}: ${student.score}`).join(', ')}`;
};

const displayStats = () => {
    if (students.length > 0) {
        console.log(`Average Score: ${averageScore()}`);
        console.log(`Highest Score: ${findHighestScore()}`);
        console.log(`Lowest Score: ${findLowestScore()}`);
    } else {
        console.log("No students added yet");
    }
};

const fetchStudentData = async () => {
    try {
        const response = await fetch('data.json');
        const resData = await response.json();

        // Validate fetched student data
        const validFetchedStudents = resData.filter(student => student.name && !isNaN(student.score) && student.score >= 0 && student.score <= 100);
        
        students = [...students, ...validFetchedStudents];

        // Update total students count
        totalStudents += validFetchedStudents.length;
        localStorage.setItem('studentCounter', totalStudents); // Update localStorage too
        
        displayStudents();
        displayStats();
    } catch (error) {
        console.log("Failed to fetch student data.", error);
    }
};

window.onload = () => {
    loadFromLocalStorage();
    fetchStudentData();
};

document.getElementById('btn').addEventListener('click', addNewStudent);
document.getElementById('resetBtn').addEventListener('click', reset);
