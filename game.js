const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let isGameOver = false;
let isPaused = false;

// Touch states
const touchStates = {
    player1: {
        up: false,
        down: false,
        shoot: false
    },
    player2: {
        up: false,
        down: false,
        shoot: false
    }
};

// Initial player setup function
function initializePlayers() {
    return {
        player1: {
            x: 50,
            y: canvas.height/2,
            width: 30,
            height: 50,
            color: 'blue',
            speed: 5,
            health: 100,
            bullets: []
        },
        player2: {
            x: canvas.width - 80,
            y: canvas.height/2,
            width: 30,
            height: 50,
            color: 'red',
            speed: 5,
            health: 100,
            bullets: []
        }
    };
}

// Initialize players
let { player1, player2 } = initializePlayers();

// Key states
const keys = {
    w: false,    // Player 1 up
    s: false,    // Player 1 down
    ArrowUp: false,    // Player 2 up
    ArrowDown: false   // Player 2 down
};

// Bullet properties - Increased speed and size
const bulletSpeed = 15; // Increased from 7 to 15
const bulletSize = 8;   // Increased from 5 to 8

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    // Pause game when 'P' is pressed
    if (e.key.toLowerCase() === 'p') {
        isPaused = !isPaused;
        if (isPaused) {
            drawPauseScreen();
        } else {
            gameLoop();
        }
        return;
    }

    // Restart game when 'R' is pressed
    if (e.key.toLowerCase() === 'r') {
        restartGame();
        return;
    }

    if (isPaused || isGameOver) return;

    if (e.key in keys) {
        keys[e.key] = true;
    }
    // Shooting controls
    if (e.key === 'd') { // Player 1 shoot
        player1.bullets.push({
            x: player1.x + player1.width,
            y: player1.y + player1.height/2,
            size: bulletSize,
            direction: 1 // Moving right
        });
    }
    if (e.key === 'ArrowLeft') { // Player 2 shoot
        player2.bullets.push({
            x: player2.x,
            y: player2.y + player2.height/2,
            size: bulletSize,
            direction: -1 // Moving left
        });
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

function restartGame() {
    ({ player1, player2 } = initializePlayers());
    isGameOver = false;
    isPaused = false;
    gameLoop();
}

function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME PAUSED', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 70);
}

// Check collision between two rectangles
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Initialize mobile controls
function initializeMobileControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'mobile-controls';
    
    // Player 1 controls
    const player1Up = createControlButton('player1-up', '↑');
    const player1Down = createControlButton('player1-down', '↓');
    const player1Shoot = createControlButton('player1-shoot', '⚡');
    
    // Player 2 controls
    const player2Up = createControlButton('player2-up', '↑');
    const player2Down = createControlButton('player2-down', '↓');
    const player2Shoot = createControlButton('player2-shoot', '⚡');
    
    controlsContainer.appendChild(player1Up);
    controlsContainer.appendChild(player1Down);
    controlsContainer.appendChild(player1Shoot);
    controlsContainer.appendChild(player2Up);
    controlsContainer.appendChild(player2Down);
    controlsContainer.appendChild(player2Shoot);
    
    document.body.appendChild(controlsContainer);
}

function createControlButton(className, text) {
    const button = document.createElement('div');
    button.className = `control-button ${className}`;
    button.textContent = text;
    
    // Add touch event listeners
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleTouchStart(className);
    });
    
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleTouchEnd(className);
    });
    
    return button;
}

function handleTouchStart(className) {
    if (isPaused || isGameOver) return;
    
    switch(className) {
        case 'player1-up':
            touchStates.player1.up = true;
            break;
        case 'player1-down':
            touchStates.player1.down = true;
            break;
        case 'player1-shoot':
            touchStates.player1.shoot = true;
            shootBullet(player1);
            break;
        case 'player2-up':
            touchStates.player2.up = true;
            break;
        case 'player2-down':
            touchStates.player2.down = true;
            break;
        case 'player2-shoot':
            touchStates.player2.shoot = true;
            shootBullet(player2);
            break;
    }
}

function handleTouchEnd(className) {
    switch(className) {
        case 'player1-up':
            touchStates.player1.up = false;
            break;
        case 'player1-down':
            touchStates.player1.down = false;
            break;
        case 'player1-shoot':
            touchStates.player1.shoot = false;
            break;
        case 'player2-up':
            touchStates.player2.up = false;
            break;
        case 'player2-down':
            touchStates.player2.down = false;
            break;
        case 'player2-shoot':
            touchStates.player2.shoot = false;
            break;
    }
}

function shootBullet(player) {
    if (player === player1) {
        player1.bullets.push({
            x: player1.x + player1.width,
            y: player1.y + player1.height/2,
            size: bulletSize,
            direction: 1
        });
    } else {
        player2.bullets.push({
            x: player2.x,
            y: player2.y + player2.height/2,
            size: bulletSize,
            direction: -1
        });
    }
}

// Game loop
function gameLoop() {
    if (isPaused || isGameOver) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move players vertically (including touch controls)
    if ((keys.w || touchStates.player1.up) && player1.y > 0) player1.y -= player1.speed;
    if ((keys.s || touchStates.player1.down) && player1.y < canvas.height - player1.height) player1.y += player1.speed;
    if ((keys.ArrowUp || touchStates.player2.up) && player2.y > 0) player2.y -= player2.speed;
    if ((keys.ArrowDown || touchStates.player2.down) && player2.y < canvas.height - player2.height) player2.y += player2.speed;

    // Update and draw bullets
    // Player 1 bullets
    for (let i = player1.bullets.length - 1; i >= 0; i--) {
        const bullet = player1.bullets[i];
        bullet.x += bulletSpeed * bullet.direction;
        
        // Check collision with player 2
        if (bullet.x >= player2.x && 
            bullet.x <= player2.x + player2.width &&
            bullet.y >= player2.y &&
            bullet.y <= player2.y + player2.height) {
            player2.health -= 10;
            player1.bullets.splice(i, 1);
            continue;
        }

        // Remove bullets that are off screen
        if (bullet.x > canvas.width || bullet.x < 0) {
            player1.bullets.splice(i, 1);
            continue;
        }

        // Draw bullet with trail effect
        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'; // Light blue trail
        ctx.fillRect(bullet.x - bulletSpeed, bullet.y, bulletSize * 2, bulletSize);
        ctx.fillStyle = 'blue';
        ctx.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
    }

    // Player 2 bullets
    for (let i = player2.bullets.length - 1; i >= 0; i--) {
        const bullet = player2.bullets[i];
        bullet.x += bulletSpeed * bullet.direction;
        
        // Check collision with player 1
        if (bullet.x >= player1.x && 
            bullet.x <= player1.x + player1.width &&
            bullet.y >= player1.y &&
            bullet.y <= player1.y + player1.height) {
            player1.health -= 10;
            player2.bullets.splice(i, 1);
            continue;
        }

        // Remove bullets that are off screen
        if (bullet.x > canvas.width || bullet.x < 0) {
            player2.bullets.splice(i, 1);
            continue;
        }

        // Draw bullet with trail effect
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Light red trail
        ctx.fillRect(bullet.x + bulletSpeed, bullet.y, bulletSize * 2, bulletSize);
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
    }

    // Draw players
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    
    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw health bars
    // Player 1 health
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, player1.health * 2, 20);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(10, 10, 200, 20);

    // Player 2 health
    ctx.fillStyle = 'green';
    ctx.fillRect(canvas.width - 210, 10, player2.health * 2, 20);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(canvas.width - 210, 10, 200, 20);

    // Draw controls guide
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText('Player 1: W/S to move, D to shoot', 10, canvas.height - 40);
    ctx.fillText('Player 2: ↑/↓ to move, ← to shoot', canvas.width - 250, canvas.height - 40);
    ctx.fillText('P: Pause/Resume | R: Restart', canvas.width/2 - 80, canvas.height - 20);

    // Check for game over
    if (player1.health <= 0 || player2.health <= 0) {
        isGameOver = true;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `${player1.health <= 0 ? 'Player 2' : 'Player 1'} Wins!`,
            canvas.width / 2,
            canvas.height / 2
        );
        ctx.font = '24px Arial';
        ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 40);
        return;
    }

    requestAnimationFrame(gameLoop);
}

// Initialize mobile controls when the game starts
initializeMobileControls();

// Start the game
gameLoop();
