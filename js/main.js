const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 448
canvas.height = 512

// /* START GAME VARIABLES */
// let isGameStarted = false

// ////////////////////////////////////////////
// function starterEvent() {
//     document.addEventListener('keypress', gameStarts)

//     function gameStarts(event) {
//         const { key } = event
//         if (key == 'Up' || key == 'ArrowUp') {
//             isGameStarted = true
//         }
//     }
// }
// ////////////////////////////////////////////

/* BALL VARIABLES */
const ballRadius = 6;
// ball position
let x = canvas.width / 2
let y = canvas.height - 30
// ball speed (directions)
let dx = 2
let dy = -2

/* PADDLE VARIABLES */
const paddleHeight = 10;
const paddleWidth = 65;

const PADDLE_SENSITIVITY = 5;

let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 15

let rightPressed = false
let leftPressed = false

/* BRICKS VARIABLES */
const brickRowCount = 8;
const brickColumnCount = 8;
const brickWidth = 50;
const brickHeight = 16;
const bricksGap = 2;
const brickPaddingTop = 15;
const brickPaddingLeft = 17;
const bricks = [];

const BRICK_STATUS = {
    ACTIVE: 1,
    BROKEN: 0
}

// const BRICK_COLOR = ['#FF53cd','#2dd9fe','#FF5161','#9461fd','#00fe9b','#ffdb4e']
const BRICK_COLOR = ['#D30302','#e10361','#4003e6','#00a3d5','#02c435','#b48505']

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [] // Initialize with an empty array
    for (let r = 0; r < brickRowCount; r++) {
        // Calculate the position of the brick in the screen
        const brickX = c * (brickWidth + bricksGap) + brickPaddingLeft
        const brickY = r * (brickHeight + bricksGap) + brickPaddingTop
        // Set a random color for each brick
        const random = Math.floor(Math.random() * 6)
        // Save each brick information
        bricks[c][r] = {
            x: brickX, 
            y: brickY, 
            status: BRICK_STATUS.ACTIVE, 
            color: BRICK_COLOR[random]
        }
    }
}

/* START & END GAME FUNCTIONS */ 
function gameEnds() {
    x = canvas.width / 2
    y = canvas.height - 50
    dy = 0
}

/* DRAW FUNCTIONS */
function drawBall() {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()
}

function drawPaddle() {
    ctx.beginPath()
    ctx.fillStyle = '#0ae'
    ctx.roundRect(
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight,
        1
    )
    ctx.fill()
    ctx.strokeStyle = 'purple'
    ctx.stroke()
    ctx.closePath()
    // ctx.shadowColor = '#0ae'
    // ctx.shadowBlur = 5
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status == BRICK_STATUS.BROKEN) continue;
            ctx.beginPath()
            ctx.fillStyle = `${currentBrick.color}`
            ctx.fillRect(
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            )
            ctx.closePath()
        }
    }
}

function drawScore() {

}

/* MOVEMENT & COLLISION FUNCTIONS */
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status == BRICK_STATUS.BROKEN) continue;

            const isBallSameXAsBrick =
            x > currentBrick.x &&
            x < currentBrick.x + brickWidth

            const isBallSameYAsBrick =
            y > currentBrick.y &&
            y < currentBrick.y + brickHeight

            if (isBallSameXAsBrick && isBallSameYAsBrick) {
                dy = -dy
                currentBrick.status = BRICK_STATUS.BROKEN
            }
        }
    }
}

function ballMovement() {
    if (
    x + dx > canvas.width - ballRadius || // right side
    x + dx < ballRadius // left side
    ) {
        dx = -dx
    }
        
    // Ball bounces with the top wall
    if (y + dy < ballRadius) {
        dy = -dy
    }   
        
    const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth
    const isBallTouchingPaddle = y + dy > paddleY
        
    // Ball touches the paddle
    if (isBallSameXAsPaddle && isBallTouchingPaddle) {
        dy = -dy // Change ball direction
    } else if ( // Ball touches the ground
        y + dy > canvas.height - ballRadius
        ) {
        gameEnds()  
    }

    if (y + dy > paddleY + paddleHeight) gameEnds();
        
    x += dx
    y += dy

}

function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SENSITIVITY
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SENSITIVITY
    }
}

/* CANVAS CLEANER & EVENT LISTENER FUNCTIONS */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event
        if (key == 'Right' || key == 'ArrowRight') {
            rightPressed = true
        } else if (key == 'Left' || key == 'ArrowLeft') {
            leftPressed = true
        }
    }

    function keyUpHandler(event) {
        const { key } = event
        if (key == 'Right' || key == 'ArrowRight') {
            rightPressed = false
        } else if (key == 'Left' || key == 'ArrowLeft') {
            leftPressed = false
        }
    }
}

// Basic function for any type of game
function draw() {
    clearCanvas()
    // draws
    drawBall()
    drawPaddle()
    drawBricks()
    drawScore()

    // collisions
    collisionDetection()
    ballMovement()
    paddleMovement()

    // frame loop
    window.requestAnimationFrame(draw)
}

draw()
initEvents() 
