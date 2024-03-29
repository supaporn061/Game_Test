var rows = 4;
var columns = 4;
let timerInterval;
let timeElapsed = 0;
let gameStarted = false; 
let turns = 0;
let leaderboard = [];

const imgOrder = [];
const randomNumber = () => Math.floor(Math.random() * 15) + 1;
const randomImages = () => {
    while (imgOrder.length < 15) {
      let randomVal = randomNumber();
      if (!imgOrder.includes(randomVal)) {
        imgOrder.push(randomVal);
      }
    }
    imgOrder.push(16); 
};
randomImages();
console.log(imgOrder);

window.onload = function() {
    createRestartButton();
    createLeaderboardSection();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = imgOrder.shift() + ".png"; 
            tile.addEventListener("click", function() {
                if (!gameStarted) {
                    startTimer();
                    gameStarted = true     
                }
                let currId = this.id;
                let emptyId = findEmptyTile();
                if (canMove(currId, emptyId)) {
                    swapTiles(currId, emptyId);
                    if (checkWin()) {
                        
                        gameStarted = false;
                       
                        updateLeaderboard("Player", timeElapsed); // เพิ่มข้อมูลผู้เล่นใน leaderboard
                        displayLeaderboard(); // แสดง leaderboard
                        alert("Game Over!!");
                        
                        timeElapsed = 0;
                        
                     
                        turns = 0;
                        shuffle();
                        
                    }
                }
            });

            document.getElementById("board").append(tile);
        }
    }
}

function findEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile.src.endsWith("16.png")) { 
                return tile.id;
            }
        }
    }
}

function canMove(currId, emptyId) {
    let currCoords = currId.split("-");
    let emptyCoords = emptyId.split("-");
    let rowDiff = Math.abs(parseInt(currCoords[0]) - parseInt(emptyCoords[0]));
    let colDiff = Math.abs(parseInt(currCoords[1]) - parseInt(emptyCoords[1]));
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function swapTiles(currId, emptyId) {
    let currTile = document.getElementById(currId);
    let emptyTile = document.getElementById(emptyId);

    let tempSrc = currTile.src;
    currTile.src = emptyTile.src;
    emptyTile.src = tempSrc;

    turns++;
    document.getElementById("turns").innerText = `${turns}`;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            timeElapsed++;
            let hours = Math.floor(timeElapsed / 3600);
            let minutes = Math.floor((timeElapsed % 3600) / 60);
            let seconds = timeElapsed % 60;
            document.getElementById("timer").innerText = `Time : ${hours}:${minutes}:${seconds}`;
        }, 1000);
    }
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let correctNum = r * columns + c + 1;
            if (!tile.src.includes(`${correctNum}.png`)) {
                return false;
            }
        }
    }
    return true;
}

function displayImages() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.src = imgOrder.shift() + ".png";
        }
    }
}


function createRestartButton() {
    const button = document.createElement("button");
    button.innerText = "Shuffle";
    button.id = "restartButton";
    button.addEventListener("click", shuffle);
    document.body.appendChild(button);
}

function shuffle() {
    timeElapsed = 0; // รีเซ็ตเวลาที่นับ
    gameStarted = false; // รีเซ็ตสถานะเกม
    turns = 0; // รีเซ็ตจำนวนการเล่น
    document.getElementById("turns").innerText = "0"; // รีเซ็ตแสดงจำนวนการเล่นที่จริง
    randomImages(); // สร้างลำดับภาพใหม่
    displayImages(); // แสดงภาพใหม่บนกระดาน
  


}

function createLeaderboardSection() {
    let leaderboardDiv = document.createElement('div');
    leaderboardDiv.id = 'leaderboard';
    leaderboardDiv.innerHTML = '<h2>Playing Statistics</h2>';
    document.body.appendChild(leaderboardDiv);
}

function updateLeaderboard(name, time) {
    leaderboard.push({ name, time });
    leaderboard.sort((a, b) => a.time - b.time); 
    if (leaderboard.length > 3) {
      leaderboard.pop(); 
    }
}

function displayLeaderboard() {
    let leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.forEach((entry, index) => {
        leaderboardDiv.innerHTML += `<p>${index + 1}. ${entry.name} - ${entry.time} seconds</p>`;
    });
}