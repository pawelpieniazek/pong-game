
let username = localStorage.getItem('username');

const GAME_HEIGHT = 360;
const GAME_WIDTH = 640;

let gameLive = true;

let scoreLeft = 0;
let scoreRight = 0;

//players
let playerLeft = {
    x:40,
    y: GAME_HEIGHT / 2,
    w:4,
    h:80,
    speedY: 0,
    isMoving: false,
    get top(){
        return this.y - this.h/2
    },
    get right() {
        return this.x + this.w/2
    },
    get bottom(){
        return this.y + this.h/2
    },
    get left() {
        return this.x - this.w/2
    }
};
let playerRight = {
    x: GAME_WIDTH - 40,
    y: GAME_HEIGHT / 2,
    w:4,
    h:80,
    speedY: 0,
    isMoving: false,
    get top(){
        return this.y - this.h/2
    },
    get right() {
        return this.x + this.w/2
    },
    get bottom(){
        return this.y + this.h/2
    },
    get left() {
        return this.x - this.w/2
    }
};
//ball
let ball = {
    //initial position
    x: GAME_WIDTH/2,
    y: GAME_HEIGHT/2,
    //ball dimensions
    w: 14,
    h: 14,
    //ball speed
    speedY: 0,
    speedX: 8,
    isMoving: false,
    get top(){
        return this.y - this.h/2
    },
    get right() {
        return this.x + this.w/2
    },
    get bottom(){
        return this.y + this.h/2
    },
    get left() {
        return this.x - this.w/2
    }
};

//move ball
let moveBall = function(){
    ball.isMoving = true;
}
let stopBall = function(){
    ball.isMoving = false;
}
let resetBall = function(){
    ball.speedY = 1;
    ball.speedX = (Math.abs(ball.speedX)/ball.speedX)*8;
}

//move players

let movePlayerLeft = function(direction) {
    playerLeft.isMoving = true;
    if (playerLeft.y < ball.y) {
        playerLeft.speedY = 6;
    } else if (playerLeft.y > ball.y){
        playerLeft.speedY = -6;
    } else {
        playerLeft.isMoving = false;
    }      
};

let movePlayerRight = function(event) {
    if (event.code === "ArrowUp") {
        playerRight.isMoving = true;
        playerRight.speedY = -6
    } else if (event.code === "ArrowDown") {       
        playerRight.isMoving = true
        playerRight.speedY = 6
    };  
};
let stopPlayerRight = function(event) {
    if (event.code === "ArrowUp") {
        playerRight.isMoving = false;
    } else if (event.code === "ArrowDown") {       
        playerRight.isMoving = false;
    };
};

//grab the canvas and context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//event listeners to move player
window.addEventListener("keydown", movePlayerRight);
window.addEventListener("keyup", stopPlayerRight);
window.addEventListener("keydown", moveBall);

//update the rectangle position
const update = function() {
    
    //update player
    if(playerLeft.isMoving) {
        playerLeft.y += playerLeft.speedY;
    };
    
    if(playerRight.isMoving) {
        playerRight.y += playerRight.speedY;
    };
    
    if (playerLeft.y <= playerLeft.h/2 + 10) {
        playerLeft.speedY = 0;
        playerLeft.y = playerLeft.h/2 + 10;
    } else if (playerLeft.y >= GAME_HEIGHT - playerLeft.h/2 - 10){
        playerLeft.y = GAME_HEIGHT - playerLeft.h/2 - 10;
        playerLeft.speedY = 0
    };

    if (playerRight.y <= playerRight.h/2 + 10){
        playerRight.y = playerRight.h/2 + 10;
        playerRight.speedY = 0;
    } else if (playerRight.y >= GAME_HEIGHT - playerRight.h/2 - 10){
        playerRight.y = GAME_HEIGHT - playerRight.h/2 - 10;
        playerRight.speedY = 0;
    };
    
    //ball
    if(ball.isMoving){
    ball.x = ball.x + ball.speedX;
    ball.y = ball.y + ball.speedY;
        if (ball.speedX < 0 && ball.x < GAME_WIDTH * 0.45){
            movePlayerLeft(ball.speedX);
        } else {
            playerLeft.isMoving = false;
        }
    }   
    
    //goals
    const crossedRightLimit = ball.right >= GAME_WIDTH;
    const crossedLeftLimit = ball.left <= 0;

    if(crossedRightLimit) {
        scoreLeft++;
        stopBall();
        resetBall();
        ball.speedX *= -1;
        ball.x = GAME_WIDTH/2;
        ball.y = GAME_HEIGHT/2;
        
    } else if (crossedLeftLimit) {
        scoreRight++;
        stopBall();
        resetBall();
        ball.speedX *= -1;
        ball.x = GAME_WIDTH/2;;
        ball.y = GAME_HEIGHT/2;
    };
    
    if(scoreLeft === 5) {
        gameLive = false;
        $('#lose').click();
    } else if (scoreRight === 5) {
        gameLive = false;
        socket.emit('points', {'username': username, 'points': 3})
        $('#winModalLabel').text('Congratulations, '+ username + "!")
        $('#win').click();
    };
    
    //hitting the ball
    collision(playerLeft, ball)
    collision(playerRight, ball)

    //ball bouncing
    
    const crossedBottomLimit = ball.bottom >= GAME_HEIGHT;
    const crossedTopLimit = ball.top <= 0;

    if(crossedBottomLimit) {
        ball.y = GAME_HEIGHT - ball.h/2;
        ball.speedY = -ball.speedY;
    } else if (crossedTopLimit) {
        ball.y = ball.h/2;
        ball.speedY = -ball.speedY;
    }
};

//show it on the screen
const draw = function() {

    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    ctx.fillStyle = "rgb(256,256,256)";
    ctx.fillText(scoreLeft, GAME_WIDTH/2 - 20, GAME_HEIGHT - 25);
    ctx.fillText(scoreRight, GAME_WIDTH/2 + 20, GAME_HEIGHT - 25);
    ctx.fillText("Computer", GAME_WIDTH/2 - 40, GAME_HEIGHT - 10);
    ctx.fillText(username, GAME_WIDTH/2 + 20, GAME_HEIGHT - 10);

    ctx.fillStyle = "rgb(256,256,256)";
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.w/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(playerLeft.left, playerLeft.top, playerLeft.w, playerLeft.h);
    ctx.fillRect(playerRight.left, playerRight.top, playerRight.w, playerRight.h);  
};

//gets executed multiple times per second
const step = function() {
    update();
    draw();
    
    if(gameLive){        
        window.requestAnimationFrame(step);
    }
};

let collision = (player, ball) => {
    if (player.left < ball.right && player.right > ball.left &&
        player.top < ball.bottom && player.bottom > ball.top) {
        ball.x = player.x - ball.speedX;
        checkBottom(player, ball)
        checkMiddle(player, ball)
        checkTop(player, ball)
    }
}
let checkBottom = (player, ball) => {
    if (ball.y > player.y + player.h/6){
        if (ball.speedX > 12 || ball.speedX < -12){
            ball.speedX *= -0.95;
            ball.speedY += 1;
            
        } else {
            ball.speedX *= -1;
            ball.speedX += (Math.abs(ball.speedX)/ball.speedX)*0.2;
            ball.speedY += 0.5;
        }
    }
}
let checkMiddle = (player, ball) => {
    if (ball.y > player.y - player.h/6 && ball.y < player.y + player.h/6){
        ball.speedX *= -1;
        ball.speedX += (Math.abs(ball.speedX)/ball.speedX)*0.4;
        if (ball.speedY < 0.05 && ball.speedY > -0.05) {
            ball.speedY = 0;
        } else {
            ball.speedY *= 0.8;
        }
    }
}
let checkTop = (player, ball) => {
    if (ball.y < player.y - player.h/6){
        if (ball.speedX > 12 || ball.speedX < -12){
            ball.speedX *= -0.95;
            ball.speedY -= 1;
        } else {
            ball.speedX *= -1;
            ball.speedX += (Math.abs(ball.speedX)/ball.speedX)*0.2;
            ball.speedY -= 0.5;
        }
    }
}
//initial kick
step();