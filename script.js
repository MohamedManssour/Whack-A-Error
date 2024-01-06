const gameContainer = document.querySelector('.container');
const allMoleItems = document.querySelectorAll('.item');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let gameActive = false, gameInterval, countDownInterval, countDown = 20, score = 0;

const timeCount = document.getElementById('time-count');
const scoreCount = document.getElementById('score-count');

gameContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('mole-clicked') && gameActive){
        score++;
        scoreCount.innerHTML = score;
        const bushElem = e.target.parentElement.previousElementSibling;
        let textEl = document.createElement('span');
        textEl.setAttribute('class', 'whack-text');
        textEl.innerHTML = "whack";
        bushElem.appendChild(textEl);
        setTimeout(() => {
            textEl.remove();
        }, 300);
    }
});

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(countDownInterval);
    gameActive = false;
    stopButton.disabled = true;
    startButton.disabled = false;
    timeCount.innerHTML = "0";
    scoreCount.innerHTML = "0";
    countDown = 20;
    score = 0;
}

function startGame() {
    if (!gameActive) {
        gameActive = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        score = 0; // Reset score
        scoreCount.innerHTML = score;
        countDown = 20; // Reset countDown
        timeCount.innerHTML = countDown;

        countDownInterval = setInterval(() => {
            timeCount.innerHTML = countDown;
            if (countDown > 0) {
                countDown--;
            } else {
                clearInterval(countDownInterval);
                clearInterval(gameInterval);
                endGame();
            }
        }, 1000);

        gameInterval = setInterval(() => {
            showMole();
        }, 600);
    }
}

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', resetGame);

function showMole() {
    if (countDown <= 0) {
        return; // Do not show new moles if the game has ended
    }
    let moleToAppear = allMoleItems[getRandomValue()].querySelector('.mole');
    moleToAppear.classList.add('mole-appear');
    setTimeout(() => {
        moleToAppear.classList.remove('mole-appear');
    }, 1000);
}

function getRandomValue() {
    let rand = Math.random() * allMoleItems.length;
    return Math.floor(rand);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(countDownInterval);
    gameActive = false;
    stopButton.disabled = true;
    startButton.disabled = false;

    let playAgain = confirm("Your score is " + score + ". Would you like to add your name to the leaderboard?");
    if (playAgain) {
        let userName = prompt("Enter your name:");
        if (userName) {
            console.log("Adding score to leaderboard:", userName, score); // Debug log
            addScoreToLocalStorage(userName, score);
            updateLeaderboardDisplay();
        }
    } else {
        resetGame();
    }

    timeCount.innerHTML = "20"; // Reset time to initial value
    scoreCount.innerHTML = "0";
    countDown = 20;
    score = 0;
}

function addScoreToLocalStorage(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: name, score: score });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function updateLeaderboardDisplay() {
    let leaderboardList = document.getElementById('leaderboardList');
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    leaderboard.sort((a, b) => b.score - a.score);

    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        let newScore = document.createElement('li');
        newScore.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(newScore);
    });
    console.log("Leaderboard updated"); // Debug log
}

document.addEventListener('DOMContentLoaded', updateLeaderboardDisplay);
