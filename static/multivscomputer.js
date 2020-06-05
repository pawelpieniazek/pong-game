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
let playerRightOne = {
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
let playerRightTwo = {
    x: GAME_WIDTH - 100,
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
    speedX: 5,
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
    ball.speedX = (Math.abs(ball.speedX)/ball.speedX)*5;
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

let movePlayerRightOne = function(event) {
    if (event.code === "ArrowUp") {
        playerRightOne.isMoving = true;
        playerRightOne.speedY = -6
    } else if (event.code === "ArrowDown") {       
        playerRightOne.isMoving = true
        playerRightOne.speedY = 6
    };  
};
let stopPlayerRightOne = function(event) {
    if (event.code === "ArrowUp") {
        playerRightOne.isMoving = false;
    } else if (event.code === "ArrowDown") {       
        playerRightOne.isMoving = false;
    };
};

let movePlayerRightTwo = function(event) {
    if (event.code === "KeyW") {
        playerRightTwo.isMoving = true;
        playerRightTwo.speedY = -6
    } else if (event.code === "KeyS") {       
        playerRightTwo.isMoving = true
        playerRightTwo.speedY = 6
    };  
};
let stopPlayerRightTwo = function(event) {
    if (event.code === "KeyW") {
        playerRightTwo.isMoving = false;
    } else if (event.code === "KeyS") {       
        playerRightTwo.isMoving = false;
    };
};

//grab the canvas and context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//event listeners to move player
window.addEventListener("keydown", movePlayerRightOne);
window.addEventListener("keyup", stopPlayerRightOne);
window.addEventListener("keydown", movePlayerRightTwo);
window.addEventListener("keyup", stopPlayerRightTwo);
window.addEventListener("keydown", moveBall);

//update the rectangle position
const update = function() {
    
    //update player
    if(playerLeft.isMoving) {
        playerLeft.y += playerLeft.speedY;
    };
    
    if(playerRightOne.isMoving) {
        playerRightOne.y += playerRightOne.speedY;
    };

    if(playerRightTwo.isMoving) {
        playerRightTwo.y += playerRightTwo.speedY;
    };
    
    if (playerLeft.y <= playerLeft.h/2 + 10) {
        playerLeft.speedY = 0;
        playerLeft.y = playerLeft.h/2 + 10;
    } else if (playerLeft.y >= GAME_HEIGHT - playerLeft.h/2 - 10){
        playerLeft.y = GAME_HEIGHT - playerLeft.h/2 - 10;
        playerLeft.speedY = 0
    };

    if (playerRightOne.y <= playerRightOne.h/2 + 10){
        playerRightOne.y = playerRightOne.h/2 + 10;
        playerRightOne.speedY = 0;
    } else if (playerRightOne.y >= GAME_HEIGHT - playerRightOne.h/2 - 10){
        playerRightOne.y = GAME_HEIGHT - playerRightOne.h/2 - 10;
        playerRightOne.speedY = 0;
    };

    if (playerRightTwo.y <= playerRightTwo.h/2 + 10){
        playerRightTwo.y = playerRightTwo.h/2 + 10;
        playerRightTwo.speedY = 0;
    } else if (playerRightTwo.y >= GAME_HEIGHT - playerRightTwo.h/2 - 10){
        playerRightTwo.y = GAME_HEIGHT - playerRightTwo.h/2 - 10;
        playerRightTwo.speedY = 0;
    };
    
    //ball
    if(ball.isMoving){
    ball.x = ball.x + ball.speedX;
    ball.y = ball.y + ball.speedY;
        if (ball.speedX < 0 && ball.x < GAME_WIDTH * 0.55){
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
        $('#winModalLabel').text('Congratulations, '+ username + "!")
        $('#win').click();
    };
    
    //hitting the ball
    collision(playerLeft, ball)
    collision(playerRightOne, ball)
    collision(playerRightTwo, ball)

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
    ctx.fillRect(playerRightOne.left, playerRightOne.top, playerRightOne.w, playerRightOne.h);  
    ctx.fillRect(playerRightTwo.left, playerRightTwo.top, playerRightTwo.w, playerRightTwo.h);  
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
        if (ball.speedX > 20 || ball.speedX < -20){
            ball.speedX *= -1;
        } else {
            ball.speedX *= -1;
            ball.speedX += (Math.abs(ball.speedX)/ball.speedX)*0.4;
            if (ball.speedY < 0.05 && ball.speedY > -0.05) {
                ball.speedY = 0;
            } else {
                ball.speedY *= 0.8;
            }
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