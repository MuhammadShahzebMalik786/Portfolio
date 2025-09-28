// Snake Game Implementation
function startSnakeGame(canvas, ctx) {
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0, dy = 0;
    let score = 0;
    let gameRunning = true;
    let gameStarted = false;
    
    // Add instructions
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press Arrow Keys to Start!', canvas.width/2, canvas.height/2);
    ctx.fillText('Use Arrow Keys to Move', canvas.width/2, canvas.height/2 + 25);
    
    function drawGame() {
        if (!gameRunning) return;
        
        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 0; i <= tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
        
        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#00ff00' : '#90EE90';
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        });
        
        // Draw food
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);
        
        if (!gameStarted) return;
        
        // Move snake
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('gameScore').textContent = `Score: ${score}`;
            generateFood();
        } else {
            snake.pop();
        }
        
        setTimeout(() => requestAnimationFrame(drawGame), 150);
    }
    
    function generateFood() {
        do {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    }
    
    function gameOver() {
        gameRunning = false;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
        ctx.font = '18px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
        ctx.fillText('Press R to Restart', canvas.width/2, canvas.height/2 + 50);
        
        if (score > currentGame.highScore) {
            currentGame.highScore = score;
            saveGameData();
            renderGames();
        }
    }
    
    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        gameRunning = true;
        gameStarted = false;
        document.getElementById('gameScore').textContent = `Score: ${score}`;
        generateFood();
        drawGame();
    }
    
    // Keyboard controls
    function handleKeyPress(e) {
        if (!gameRunning && e.key.toLowerCase() === 'r') {
            resetGame();
            return;
        }
        
        if (!gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp': 
                if (dy !== 1) { dx = 0; dy = -1; gameStarted = true; }
                break;
            case 'ArrowDown': 
                if (dy !== -1) { dx = 0; dy = 1; gameStarted = true; }
                break;
            case 'ArrowLeft': 
                if (dx !== 1) { dx = -1; dy = 0; gameStarted = true; }
                break;
            case 'ArrowRight': 
                if (dx !== -1) { dx = 1; dy = 0; gameStarted = true; }
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Cleanup function
    window.cleanupSnake = () => {
        document.removeEventListener('keydown', handleKeyPress);
    };
    
    drawGame();
}

// Tic Tac Toe Implementation with AI
function startTicTacToe(canvas, ctx) {
    const cellSize = canvas.width / 3;
    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameRunning = true;
    let score = 0;
    let vsAI = true;
    
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(cellSize, 0);
        ctx.lineTo(cellSize, canvas.height);
        ctx.moveTo(cellSize * 2, 0);
        ctx.lineTo(cellSize * 2, canvas.height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, cellSize);
        ctx.lineTo(canvas.width, cellSize);
        ctx.moveTo(0, cellSize * 2);
        ctx.lineTo(canvas.width, cellSize * 2);
        ctx.stroke();
        
        // Draw X's and O's
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        board.forEach((cell, index) => {
            if (cell) {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const x = col * cellSize + cellSize / 2;
                const y = row * cellSize + cellSize / 2;
                
                ctx.fillStyle = cell === 'X' ? '#e74c3c' : '#3498db';
                ctx.fillText(cell, x, y);
            }
        });
        
        // Draw game status
        ctx.font = '16px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText(`Current Player: ${currentPlayer}`, 10, canvas.height + 25);
        ctx.fillText(`Mode: ${vsAI ? 'vs AI' : 'vs Player'}`, 10, canvas.height + 45);
    }
    
    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        
        return board.includes('') ? null : 'tie';
    }
    
    function minimax(board, depth, isMaximizing) {
        const winner = checkWinner();
        
        if (winner === 'O') return 1;
        if (winner === 'X') return -1;
        if (winner === 'tie') return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove = 0;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }
    
    function makeMove(index) {
        if (!gameRunning || board[index]) return false;
        
        board[index] = currentPlayer;
        drawBoard();
        
        const winner = checkWinner();
        if (winner) {
            gameRunning = false;
            setTimeout(() => {
                let message = '';
                if (winner === 'tie') {
                    message = 'It\'s a tie!';
                    score += 1;
                } else {
                    message = `${winner} wins!`;
                    score += winner === 'X' ? 3 : 0;
                }
                
                // Draw winner message
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(message, canvas.width/2, canvas.height/2);
                ctx.font = '16px Arial';
                ctx.fillText('Click to play again', canvas.width/2, canvas.height/2 + 30);
                
                document.getElementById('gameScore').textContent = `Score: ${score}`;
                if (score > currentGame.highScore) {
                    currentGame.highScore = score;
                    saveGameData();
                    renderGames();
                }
            }, 500);
            return true;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        drawBoard();
        return true;
    }
    
    function resetGame() {
        board = Array(9).fill('');
        currentPlayer = 'X';
        gameRunning = true;
        drawBoard();
    }
    
    // Click handler
    canvas.addEventListener('click', function(e) {
        if (!gameRunning) {
            resetGame();
            return;
        }
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        const index = row * 3 + col;
        
        if (currentPlayer === 'X') {
            if (makeMove(index) && vsAI && gameRunning) {
                setTimeout(() => {
                    if (gameRunning) {
                        const aiMove = getBestMove();
                        makeMove(aiMove);
                    }
                }, 500);
            }
        }
    });
    
    drawBoard();
}

// Flappy Bird Implementation
function startFlappyBird(canvas, ctx) {
    const bird = { x: 80, y: canvas.height / 2, velocity: 0, size: 20 };
    const pipes = [];
    const gravity = 0.4;
    const jump = -7;
    const pipeWidth = 60;
    const pipeGap = 140;
    let score = 0;
    let gameRunning = true;
    let gameStarted = false;
    let frameCount = 0;
    
    // Instructions
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click or Press Space to Fly!', canvas.width/2, canvas.height/2);
    
    function drawGame() {
        if (!gameRunning) return;
        
        // Draw sky background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 3; i++) {
            const x = (frameCount * 0.5 + i * 150) % (canvas.width + 100) - 50;
            drawCloud(x, 50 + i * 30);
        }
        
        if (gameStarted) {
            // Update bird physics
            bird.velocity += gravity;
            bird.y += bird.velocity;
            
            // Generate pipes
            if (frameCount % 120 === 0) {
                const pipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
                pipes.push({
                    x: canvas.width,
                    topHeight: pipeHeight,
                    bottomY: pipeHeight + pipeGap,
                    scored: false
                });
            }
            
            // Update pipes
            for (let i = pipes.length - 1; i >= 0; i--) {
                const pipe = pipes[i];
                pipe.x -= 3;
                
                // Check collision
                if (bird.x + bird.size/2 > pipe.x && bird.x - bird.size/2 < pipe.x + pipeWidth) {
                    if (bird.y - bird.size/2 < pipe.topHeight || bird.y + bird.size/2 > pipe.bottomY) {
                        gameOver();
                        return;
                    }
                }
                
                // Score point
                if (pipe.x + pipeWidth < bird.x && !pipe.scored) {
                    score++;
                    pipe.scored = true;
                    document.getElementById('gameScore').textContent = `Score: ${score}`;
                }
                
                // Remove off-screen pipes
                if (pipe.x + pipeWidth < 0) {
                    pipes.splice(i, 1);
                }
            }
            
            // Check boundaries
            if (bird.y < 0 || bird.y > canvas.height - bird.size) {
                gameOver();
                return;
            }
        }
        
        // Draw pipes
        ctx.fillStyle = '#228B22';
        pipes.forEach(pipe => {
            // Top pipe
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
            // Bottom pipe
            ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
            
            // Pipe caps
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipeWidth + 10, 20);
            ctx.fillRect(pipe.x - 5, pipe.bottomY, pipeWidth + 10, 20);
            ctx.fillStyle = '#228B22';
        });
        
        // Draw ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        
        // Draw bird
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Bird eye
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(bird.x + 5, bird.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Bird beak
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(bird.x + bird.size/2, bird.y);
        ctx.lineTo(bird.x + bird.size/2 + 8, bird.y - 2);
        ctx.lineTo(bird.x + bird.size/2 + 8, bird.y + 2);
        ctx.fill();
        
        if (!gameStarted) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Click or Space to Start!', canvas.width/2, canvas.height/2 + 50);
        }
        
        frameCount++;
        requestAnimationFrame(drawGame);
    }
    
    function drawCloud(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.arc(x + 15, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 30, y, 15, 0, Math.PI * 2);
        ctx.arc(x + 15, y - 10, 15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function gameOver() {
        gameRunning = false;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 30);
        ctx.font = '18px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
        ctx.fillText('Click to Restart', canvas.width/2, canvas.height/2 + 40);
        
        if (score > currentGame.highScore) {
            currentGame.highScore = score;
            saveGameData();
            renderGames();
            ctx.fillText('New High Score!', canvas.width/2, canvas.height/2 - 60);
        }
    }
    
    function resetGame() {
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes.length = 0;
        score = 0;
        frameCount = 0;
        gameRunning = true;
        gameStarted = false;
        document.getElementById('gameScore').textContent = `Score: ${score}`;
        drawGame();
    }
    
    function jump() {
        if (!gameRunning) {
            resetGame();
            return;
        }
        
        if (!gameStarted) {
            gameStarted = true;
        }
        
        bird.velocity = jump;
    }
    
    // Event listeners
    function handleKeyPress(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            jump();
        }
    }
    
    canvas.addEventListener('click', jump);
    document.addEventListener('keydown', handleKeyPress);
    
    // Cleanup function
    window.cleanupFlappy = () => {
        document.removeEventListener('keydown', handleKeyPress);
    };
    
    drawGame();
}
    drawGame();
}

// Complete Tetris Game Implementation
function startTetris(canvas, ctx) {
    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 20;
    
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
    
    let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    let score = 0;
    let level = 1;
    let lines = 0;
    let dropTime = 0;
    let dropInterval = 1000;
    let gameRunning = true;
    
    const PIECES = [
        { shape: [[1,1,1,1]], color: '#00FFFF' },
        { shape: [[1,1],[1,1]], color: '#FFFF00' },
        { shape: [[0,1,0],[1,1,1]], color: '#800080' },
        { shape: [[0,1,1],[1,1,0]], color: '#00FF00' },
        { shape: [[1,1,0],[0,1,1]], color: '#FF0000' },
        { shape: [[1,0,0],[1,1,1]], color: '#FF7F00' },
        { shape: [[0,0,1],[1,1,1]], color: '#0000FF' }
    ];
    
    let currentPiece = { shape: [], color: '', x: 0, y: 0 };
    
    function newPiece() {
        const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
        currentPiece = {
            shape: piece.shape,
            color: piece.color,
            x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
        if (collision()) gameOver();
    }
    
    function collision() {
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const newX = currentPiece.x + x;
                    const newY = currentPiece.y + y;
                    if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
                    if (newY >= 0 && board[newY][newX]) return true;
                }
            }
        }
        return false;
    }
    
    function merge() {
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const boardY = currentPiece.y + y;
                    const boardX = currentPiece.x + x;
                    if (boardY >= 0) board[boardY][boardX] = currentPiece.color;
                }
            }
        }
    }
    
    function clearLines() {
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            lines += linesCleared;
            score += linesCleared * 100 * level;
            level = Math.floor(lines / 10) + 1;
            dropInterval = Math.max(50, 1000 - (level - 1) * 100);
            document.getElementById('gameScore').textContent = `Score: ${score} | Level: ${level} | Lines: ${lines}`;
        }
    }
    
    function rotate() {
        const rotated = currentPiece.shape[0].map((_, i) =>
            currentPiece.shape.map(row => row[i]).reverse()
        );
        const previousShape = currentPiece.shape;
        currentPiece.shape = rotated;
        if (collision()) currentPiece.shape = previousShape;
    }
    
    function move(dx, dy) {
        currentPiece.x += dx;
        currentPiece.y += dy;
        if (collision()) {
            currentPiece.x -= dx;
            currentPiece.y -= dy;
            if (dy > 0) {
                merge();
                clearLines();
                newPiece();
            }
        }
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x]) {
                    ctx.fillStyle = board[y][x];
                    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            }
        }
        
        ctx.fillStyle = currentPiece.color;
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    ctx.fillRect((currentPiece.x + x) * BLOCK_SIZE, (currentPiece.y + y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            }
        }
    }
    
    function gameLoop(time = 0) {
        if (!gameRunning) return;
        if (time - dropTime > dropInterval) {
            move(0, 1);
            dropTime = time;
        }
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    function gameOver() {
        gameRunning = false;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
        ctx.font = '14px Arial';
        ctx.fillText('Press R to Restart', canvas.width/2, canvas.height/2 + 30);
        if (score > currentGame.highScore) {
            currentGame.highScore = score;
            saveGameData();
            renderGames();
        }
    }
    
    function handleKeyPress(e) {
        if (!gameRunning && e.key.toLowerCase() === 'r') {
            board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
            score = 0; level = 1; lines = 0; dropInterval = 1000; gameRunning = true;
            document.getElementById('gameScore').textContent = `Score: ${score} | Level: ${level} | Lines: ${lines}`;
            newPiece(); gameLoop();
            return;
        }
        if (!gameRunning) return;
        switch(e.key) {
            case 'ArrowLeft': move(-1, 0); break;
            case 'ArrowRight': move(1, 0); break;
            case 'ArrowDown': move(0, 1); break;
            case 'ArrowUp': rotate(); break;
            case ' ': e.preventDefault(); while (!collision()) move(0, 1); move(0, -1); break;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    window.cleanupTetris = () => document.removeEventListener('keydown', handleKeyPress);
    
    const instructions = document.createElement('div');
    instructions.innerHTML = '<p style="margin: 10px 0; font-size: 14px;"><strong>Controls:</strong><br>← → Move | ↓ Soft Drop | ↑ Rotate | Space Hard Drop</p>';
    document.getElementById('gameContainer').appendChild(instructions);
    
    document.getElementById('gameScore').textContent = `Score: ${score} | Level: ${level} | Lines: ${lines}`;
    newPiece();
    gameLoop();
}
