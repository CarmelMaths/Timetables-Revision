document.addEventListener('DOMContentLoaded', () => {
    const timeTablesDiv = document.getElementById('timeTables');
    for (let i = 1; i <= 12; i++) {
        const div = document.createElement('div');
        div.innerHTML = `<input type="checkbox" id="table${i}" value="${i}"> ${i} times table`;
        timeTablesDiv.appendChild(div);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            submitAnswer();
        } else if (event.key === ' ') {
            event.preventDefault(); // Prevent page scroll on space bar
            nextQuestion();
        }
    });
});

function selectAllTables() {
    const checkboxes = document.querySelectorAll('#timeTables input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = document.getElementById('selectAll').checked);
}

let selectedTables = [];
let practiceMode = '';
let currentQuestion = {};
let questionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let timer;

function startPractice() {
    selectedTables = [];
    document.querySelectorAll('#timeTables input[type="checkbox"]:checked').forEach(checkbox => {
        selectedTables.push(parseInt(checkbox.value));
    });
    
    if (selectedTables.length === 0) {
        alert('Please select at least one time table.');
        return;
    }

    practiceMode = document.getElementById('practiceMode').value;
    document.getElementById('settings').style.display = 'none';
    document.getElementById('practiceArea').style.display = 'block';

    correctAnswers = 0;
    wrongAnswers = 0;

    if (practiceMode === 'timed' || practiceMode === 'timedDivision') {
        startTimer();
    }

    generateQuestion();
}

function startTimer() {
    document.getElementById('timer').style.display = 'block';
    let timeLeft = 60;
    document.getElementById('timeLeft').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            endPractice();
        }
    }, 1000);
}

function generateQuestion() {
    const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
    const factor = Math.floor(Math.random() * 12) + 1;
    
    if (practiceMode === 'timed' || practiceMode === 'multipleChoice') {
        currentQuestion = { table, factor, answer: table * factor };
        document.getElementById('questionArea').innerHTML = `${table} x ${factor} = ?`;
    } else if (practiceMode === 'timedDivision' || practiceMode === 'multipleChoiceDivision') {
        currentQuestion = { table, factor, answer: factor };
        document.getElementById('questionArea').innerHTML = `${table * factor} ÷ ${table} = ?`;
    }

    if (practiceMode === 'timed' || practiceMode === 'timedDivision') {
        document.getElementById('answerArea').innerHTML = '<input type="number" id="answer" class="number-input">';
        document.getElementById('answer').focus();
    } else if (practiceMode === 'multipleChoice' || practiceMode === 'multipleChoiceDivision') {
        const choices = [
            currentQuestion.answer,
            currentQuestion.answer + Math.floor(Math.random() * 5) + 1,
            currentQuestion.answer - Math.floor(Math.random() * 5) - 1,
            currentQuestion.answer + Math.floor(Math.random() * 10) - 5
        ];
        choices.sort(() => Math.random() - 0.5);
        document.getElementById('answerArea').innerHTML = choices.map(choice => 
            `<button onclick="selectAnswer(${choice})">${choice}</button>`
        ).join(' ');
    }
}

function selectAnswer(answer) {
    if (answer === currentQuestion.answer) {
        correctAnswers++;
        generateQuestion();
    } else {
        wrongAnswers++;
        alert('Wrong answer! Try again.');
    }
}

function submitAnswer() {
    const answer = parseInt(document.getElementById('answer').value);
    if (answer === currentQuestion.answer) {
        correctAnswers++;
        if (practiceMode === 'timed' || practiceMode === 'timedDivision') {
            generateQuestion();
        } else {
            document.getElementById('questionArea').innerHTML += '<span class="correct-tick">✔</span>';
            alert('Correct!');
        }
    } else {
        wrongAnswers++;
        alert('Wrong answer! Try again.');
    }
}

function nextQuestion() {
    generateQuestion();
}

function endPractice() {
    document.getElementById('practiceArea').style.display = 'none';
    document.getElementById('scoreArea').style.display = 'block';
    document.getElementById('correctAnswers').textContent = `Correct answers: ${correctAnswers}`;
    document.getElementById('wrongAnswers').textContent = `Wrong answers: ${wrongAnswers}`;
}

function returnToMenu() {
    document.getElementById('settings').style.display = 'block';
    document.getElementById('practiceArea').style.display = 'none';
    document.getElementById('scoreArea').style.display = 'none';
    clearInterval(timer);
    document.getElementById('timer').style.display = 'none';
}

