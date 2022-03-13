const CELL_SIZE = 20;
// Soal no 1: Set canvas size menjadi 600
const CANVAS_SIZE = 1300;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = (CANVAS_SIZE - 800) / CELL_SIZE;
const DIRECTION = {
        LEFT: 0,
        RIGHT: 1,
        UP: 2,
        DOWN: 3,
    }
    // Soal no 2: Pengaturan Speed (semakin kecil semakin cepat) ubah dari 150 ke 120
let MOVE_INTERVAL = 120;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndTail() {
    let head = initPosition();
    let tail = [{ x: head.x, y: head.y }];
    return {
        head: head,
        tail: tail,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake() {
    return {
        ...initHeadAndTail(),
        direction: initDirection(),
    }
}


function initSnakeProp() {
    return {
        life: 3,
        level: 1,
        score: 0,
        counter: 0,
    }
}

let snake = initSnake();
let snakeProp = initSnakeProp();

// Soal no 4: make apples array
let apples = [{
        position: initPosition(),
    },
    {
        position: initPosition(),
    }
]

// add extra life
let extraLife = {
    position: initPosition(),
    visible: true,
    visibleCount: 0,
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawHead(ctx, x, y) {
    let img = document.getElementById('head');
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawTail(ctx, x, y) {
    let img = document.getElementById('tail');
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Soal no 6: Pada fungsi drawScore, tambahkan score3Board:
function drawScore(snake) {
    let canvasScore;
    if (snake.color == snake.color) {
        canvasScore = document.getElementById("score1Board");
    }
    let scoreCtx = canvasScore.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = "snake";
    scoreCtx.fillText(snakeProp.score, 10, canvasScore.scrollHeight / 2);
}

// draw extra life
function drawLifeExtra(ctx) {
    while (extraLife.position.y == 0 || lineCollision(extraLife.position.x, extraLife.position.y)) {
        extraLife.position = initPosition();
    }
    if (extraLife.visible) {
        var img = document.getElementById("life");
        ctx.drawImage(img, extraLife.position.x * CELL_SIZE, extraLife.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        extraLife.visibleCount++;
        if (extraLife.visibleCount == 10) {
            extraLife.visible = false;
        }
    } else {
        drawCell(ctx, extraLife.position.x, extraLife.position.y, "rgb(255,255,255,0)")
        extraLife.visibleCount--;
        if (extraLife.visibleCount == 0) {
            extraLife.visible = true;
        }
    }
}

function checkPrime() {
    let isPrime = true;
    if (snakeProp.score > 1) {
        for (let i = 2; i < snakeProp.score; i++) {
            if (snakeProp.score % i == 0) {
                isPrime = false;
                break;
            }
        }
        return isPrime;
    }
}

function bgDraw() {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");
}

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x1 * CELL_SIZE, y1 * CELL_SIZE);
    ctx.lineTo(x2 * CELL_SIZE, y2 * CELL_SIZE);
    ctx.stroke();
}

let lines = []

// add level
function levelUp() {
    if (snakeProp.score == 5 && snakeProp.counter == 0) {
        alert("Level 1 Complete");
        snakeProp.level = 2;
        MOVE_INTERVAL = 100;
        lines[0] = { x1: 15, y1: 5, x2: 15, y2: 25 };
        snakeProp.counter++;
    } else if (snakeProp.score == 10 && snakeProp.counter == 1) {
        alert("Level 2 Complete");
        snakeProp.level = 3;
        MOVE_INTERVAL = 80;
        lines[0] = { x1: 5, y1: 10, x2: 25, y2: 10 };
        lines[1] = { x1: 5, y1: 20, x2: 25, y2: 20 };
        snakeProp.counter++;
    } else if (snakeProp.score == 15 && snakeProp.counter == 2) {
        alert("Level 3 Complete");
        snakeProp.level = 4;
        MOVE_INTERVAL = 65;
        lines[0] = { x1: 5, y1: 5, x2: 25, y2: 5 };
        lines[1] = { x1: 5, y1: 15, x2: 25, y2: 15 };
        lines[2] = { x1: 5, y1: 25, x2: 25, y2: 25 };
        snakeProp.counter++;
    } else if (snakeProp.score == 20 && snakeProp.counter == 3) {
        alert("Level 4 Complete");
        snakeProp.level = 5;
        MOVE_INTERVAL = 50;
        lines[0] = { x1: 10, y1: 5, x2: 20, y2: 5 };
        lines[1] = { x1: 5, y1: 10, x2: 5, y2: 20 };
        lines[2] = { x1: 10, y1: 25, x2: 20, y2: 25 };
        lines[3] = { x1: 25, y1: 10, x2: 25, y2: 20 };
        snakeProp.counter++;
    }
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        bgDraw();
        drawHead(ctx, snake.head.x, snake.head.y);
        for (let i = 1; i < snake.tail.length; i++) {
            drawTail(ctx, snake.tail[i].x, snake.tail[i].y);
        }

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];
            while (apple.position.y == 0 || lineCollision(apple.position.x, apple.position.y)) {
                apple.position = initPosition();
            }
            // Soal no 3: DrawImage apple dan gunakan image id:
            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        // display life
        for (let i = 0; i < snakeProp.life; i++) {
            var img = document.getElementById("life");
            ctx.drawImage(img, i * CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
        }

        // display extra life
        if (checkPrime()) {
            drawLifeExtra(ctx);
        }

        // display lines
        if (snakeProp.level > 1) {
            for (i = 0; i < snakeProp.level - 1; i++) {
                drawLine(ctx, lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
            }
        }

        drawScore(snake);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            var audio = new Audio('assets/sound/eating.mp3');
            audio.play();
            apple.position = initPosition();
            snakeProp.score++;
            snake.tail.push({ x: snake.head.x, y: snake.head.y });
        }
    }
    levelUp();
    eatExtraLife();
}

// eat extra life
function eatExtraLife() {
    if (snake.head.x == extraLife.position.x && snake.head.y == extraLife.position.y) {
        extraLife.position = initPosition();
        snakeProp.life++;
        snakeProp.score++;
        snake.tail.push({ x: snake.head.x, y: snake.head.y });
        levelUp();
    }
}

// check wall collision
function lineCollision(x, y) {
    let isCollide = false;

    if (snakeProp.level > 1) {
        for (let i = 0; i < snakeProp.level - 1; i++) {
            if (x == lines[i].x1 && y >= lines[i].y1 && y < lines[i].y2 || y == lines[i].y1 && x >= lines[i].x1 && x < lines[i].x2) {
                isCollide = true;
            }
        }
    }
    return isCollide;
}



// check tail collision
function selfCollision(snakes) {
    let isCollide = false;

    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].tail.length; k++) {
                if (snakes[i].head.x == snakes[j].tail[k].x && snakes[i].head.y == snakes[j].tail[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (lineCollision(snake.head.x, snake.head.y)) {
        isCollide = true;
    }
    if (isCollide) {
        var audio = new Audio('assets/sound/gameover.mp3');
        audio.play();
        snake = initSnake("purple");
        snakeProp.life--;
        if (snakeProp.life == 0) {
            alert("Game Over");
            snake = initSnake();
            snakeProp = initSnakeProp();
            MOVE_INTERVAL = 120;
        }
    }
    return isCollide;
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    // Soal no 6: Check collision dengan snake3
    if (!selfCollision([snake])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.tail.unshift({ x: snake.head.x, y: snake.head.y });
    snake.tail.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        turn(snake, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake);
}

initGame();