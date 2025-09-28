// Game data and state management
const gameData = [
    { id: 'snake', name: 'Snake Game', icon: '🐍', plays: 1250, highScore: 0 },
    { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: '⭕', plays: 980, highScore: 0 },
    { id: 'flappy-bird', name: 'Flappy Bird', icon: '🐦', plays: 1100, highScore: 0 },
    { id: 'tetris', name: 'Tetris', icon: '🧩', plays: 850, highScore: 0 },
    { id: 'pong', name: 'Pong', icon: '🏓', plays: 720, highScore: 0 },
    { id: 'breakout', name: 'Breakout', icon: '🧱', plays: 650, highScore: 0 },
    { id: 'memory', name: 'Memory Game', icon: '🧠', plays: 580, highScore: 0 },
    { id: 'maze', name: 'Maze Runner', icon: '🌀', plays: 490, highScore: 0 },
    { id: 'puzzle', name: '2048', icon: '🔢', plays: 420, highScore: 0 },
    { id: 'space', name: 'Space Invaders', icon: '👾', plays: 380, highScore: 0 }
];

let currentUser = null;
let currentGame = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    renderGames();
    setupEventListeners();
});

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('gameHubUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateLoginButton();
    }
    
    const savedGames = localStorage.getItem('gameHubData');
    if (savedGames) {
        const saved = JSON.parse(savedGames);
        gameData.forEach((game, index) => {
            if (saved[index]) {
                game.plays = saved[index].plays || game.plays;
                game.highScore = saved[index].highScore || 0;
            }
        });
    }
}

// Save game data
function saveGameData() {
    localStorage.setItem('gameHubData', JSON.stringify(gameData));
}

// Update login button text
function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        loginBtn.textContent = `👤 ${currentUser.username}`;
        loginBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => openModal('loginModal');
    }
}

// Render games on page
function renderGames() {
    const sortedGames = [...gameData].sort((a, b) => b.plays - a.plays);
    const topGames = sortedGames.slice(0, 3);
    
    // Render top 3 games
    const topGamesContainer = document.getElementById('topGames');
    topGamesContainer.innerHTML = topGames.map(game => createGameCard(game, true)).join('');
    
    // Render all games
    const allGamesContainer = document.getElementById('allGames');
    allGamesContainer.innerHTML = gameData.map(game => createGameCard(game, false)).join('');
    
    // Add click listeners
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => playGame(card.dataset.gameId));
    });
}

// Create game card HTML
function createGameCard(game, isTop) {
    return `
        <div class="game-card ${isTop ? 'top-game' : ''}" data-game-id="${game.id}">
            <div class="game-icon">${game.icon}</div>
            <div class="game-title">${game.name}</div>
            <div class="game-stats">
                <span>Plays: ${game.plays}</span>
                <span>High Score: ${game.highScore}</span>
            </div>
        </div>
    `;
}

// Play game
function playGame(gameId) {
    const game = gameData.find(g => g.id === gameId);
    if (!game) return;
    
    currentGame = game;
    game.plays++;
    saveGameData();
    renderGames();
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <h3>${game.icon} ${game.name}</h3>
        <div class="game-controls">
            <button onclick="startGame('${gameId}')">Start Game</button>
            <button onclick="closeModal('gameModal')">Close</button>
        </div>
        <canvas id="gameCanvas" class="game-canvas" width="400" height="300"></canvas>
        <div id="gameScore">Score: 0</div>
    `;
    
    openModal('gameModal');
}

// Start specific game
function startGame(gameId) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Cleanup previous games
    if (window.cleanupSnake) window.cleanupSnake();
    if (window.cleanupFlappy) window.cleanupFlappy();
    if (window.cleanupTetris) window.cleanupTetris();
    
    // Clear canvas and reset size
    canvas.width = 400;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch(gameId) {
        case 'snake':
            startSnakeGame(canvas, ctx);
            break;
        case 'tic-tac-toe':
            startTicTacToe(canvas, ctx);
            break;
        case 'flappy-bird':
            startFlappyBird(canvas, ctx);
            break;
        case 'tetris':
            startTetris(canvas, ctx);
            break;
        default:
            startDemoGame(canvas, ctx, gameId);
    }
}

// Demo game for remaining games
function startDemoGame(canvas, ctx, gameId) {
    let score = 0;
    let gameRunning = true;
    
    ctx.fillStyle = '#333';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${gameId.toUpperCase()} - Coming Soon!`, canvas.width/2, canvas.height/2 - 20);
    ctx.fillText('Demo Mode - Click to score points', canvas.width/2, canvas.height/2 + 20);
    
    canvas.addEventListener('click', function() {
        if (gameRunning) {
            score += Math.floor(Math.random() * 50) + 10;
            document.getElementById('gameScore').textContent = `Score: ${score}`;
            
            if (score > currentGame.highScore) {
                currentGame.highScore = score;
                saveGameData();
                renderGames();
            }
            
            // Visual feedback
            ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
            ctx.fillRect(Math.random() * 300, Math.random() * 200, 50, 50);
        }
    });
}

// Demo game for other games
function startDemoGame(canvas, ctx, gameId) {
    let score = 0;
    let gameRunning = true;
    
    function gameLoop() {
        if (!gameRunning) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple demo animation
        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(Math.random() * 350, Math.random() * 250, 50, 50);
        
        score += Math.floor(Math.random() * 10);
        document.getElementById('gameScore').textContent = `Score: ${score}`;
        
        if (score > currentGame.highScore) {
            currentGame.highScore = score;
            saveGameData();
        }
        
        setTimeout(() => requestAnimationFrame(gameLoop), 100);
    }
    
    gameLoop();
    
    // Stop game after 10 seconds
    setTimeout(() => {
        gameRunning = false;
        ctx.fillStyle = '#333';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
    }, 10000);
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
    // Close modals when clicking X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            currentUser = { username, password };
            localStorage.setItem('gameHubUser', JSON.stringify(currentUser));
            updateLoginButton();
            closeModal('loginModal');
        }
    });
    
    // Register button
    document.getElementById('registerBtn').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            currentUser = { username, password };
            localStorage.setItem('gameHubUser', JSON.stringify(currentUser));
            updateLoginButton();
            closeModal('loginModal');
        }
    });
    
    // Leaderboard button
    document.getElementById('leaderboardBtn').addEventListener('click', function() {
        showLeaderboard();
    });
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('gameHubUser');
    updateLoginButton();
}

// Show leaderboard
function showLeaderboard() {
    const sortedGames = [...gameData].sort((a, b) => b.highScore - a.highScore);
    
    const leaderboardContent = document.getElementById('leaderboardContent');
    leaderboardContent.innerHTML = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Game</th>
                    <th>High Score</th>
                    <th>Total Plays</th>
                </tr>
            </thead>
            <tbody>
                ${sortedGames.map((game, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${game.icon} ${game.name}</td>
                        <td>${game.highScore}</td>
                        <td>${game.plays}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    openModal('leaderboardModal');
}
