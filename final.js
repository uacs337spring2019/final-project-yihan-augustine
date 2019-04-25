
// CSC 337
// Yihan Mo & Augustine Xu
// Final project client code

(function(){
'use strict'
let begin  = -1;
let bricks = [];
let rightarrow = false;
let leftarrow = false;
let radius = 10;      
let dx = 3;
let dy = -3;
let paddleHeight = 12;
let row = 16;
let column = 9;
let brickWidth = 50;
let brickHeight = 20;
let brickPadding = 3;
let brickOffsetTop = 50;
let brickOffsetLeft = 30;
let score = 0;
let lives = 5;
let paddleWidth = 75;
let x = 500;
let y = 900;
let paddleX = 412.5;
let multiHit = 0;

/**monitor the action of direction key*/
document.addEventListener("keydown", function(event){
    if(event.keyCode == 39) {
            rightarrow = true;
        }
    if(event.keyCode == 37) {
            leftarrow = true;
        }
    });

/**monitor the action of direction key*/
document.addEventListener("keyup", function(event){
    if(event.keyCode == 39) {
            rightarrow = false;
        }
    if(event.keyCode == 37) {
            leftarrow = false;
        }
    });

/**monitor the action of space key*/
document.addEventListener("keydown", function(event){
    if(event.keyCode == 32) {
            begin = -begin;
        }
    });

    window.onload = function(){
        document.getElementById("restart").onclick = restart;
        let canvas = document.getElementById("myCanvas");
        paddleX = (canvas.width-paddleWidth)/2;
        initBrick();
        draw();
        post();
        
    };

    /**draw the canvas area and run it as designed.*/
    function draw () {
        let canvas = document.getElementById("myCanvas");
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle();
        displayBricks();
        Ball();
        Score();
        livesLeft();
        hitOnBricks();
        paddleMove();
        multiHitCount();
        //determine the motion of the ball
        if(begin==1){
            if(x + dx > canvas.width-radius || x + dx < radius) {
                dx = -dx;
            }
            if(y + dy < radius) {
                dy = -dy;

            }
            else if(y + dy > canvas.height-radius) {
                if(x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                    score = score+multiHit;
                    multiHit = 0;
                }
                else {
                    lives--;
                    if(lives==0) {
                        if (confirm("GAME OVER!")) {
                            window.location.reload();
                    }
                }
                    else {
                        x = canvas.width/2;
                        y = canvas.height-30;
                        dx = 3;
                        dy = -3;
                        paddleX = (canvas.width-paddleWidth)/2;
                        multiHit = 0;
                    }
                }
            }
            x += dx;
            y += dy;
        }
        window.requestAnimationFrame(draw);//let the area to be a Animation area
    }

    /**set the format of bricks*/
    function initBrick(){
        for(let col=0; col<column; col++) {
            bricks[col] = [];
            for(let ro=0; ro<row; ro++) {
                if((ro+col)%2==0){
                bricks[col][ro] =  [col,ro,1];
                }else{
                    bricks[col][ro] =  [col,ro,0];
                }

            }
        }
    }

    /**control how the paddle move*/
    function paddleMove(){
        if(rightarrow==true && paddleX<900-paddleWidth/2) {
            paddleX += 8;
        }
        if(leftarrow==true && paddleX>0-paddleWidth/2) {
            paddleX -= 8;
        }
    }

    /**determine the brick is hit or not, return win information when no brick left*/
    function hitOnBricks() {
        for(let col=0; col<column; col++) {
            for(let ro=0; ro<row; ro++) {
                let b = bricks[col][ro];
                if(b[2] == 1) {
                    if(x > b[0] && x < b[0]+brickWidth && y > b[1] && y < b[1]+brickHeight) {
                        if(dy>0){
                            dy = -dy-0.1; //accelerate the ball
                            multiHit += 1; //count multi-hit extra score
                        }else{
                            dy = -dy+0.1; //accelerate the ball
                            multiHit += 1; //count multi-hit extra score
                        }
                        b[2] = 0;
                        score++;
                        //if no brick left
                        if(win()) {
                            begin = -1;
                            if (confirm("YOU WIN, CONGRATS! Enter Your Name!")) {
                                getname();
                            }
                        }
                    }
                }
            }
        }
    }

    /**draw the ball*/
    function Ball() {
        let canvas = document.getElementById("myCanvas");
        let context = canvas.getContext("2d");
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI*2);
        context.fillStyle = "black";
        context.fill();
        context.closePath();
    }

    /**draw the paddle*/
    function drawPaddle() {
        let canvas = document.getElementById("myCanvas");
        let context = canvas.getContext("2d");
        context.beginPath();
        context.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        context.fillStyle = "black";
        context.fill();
        context.closePath();
    }
    
    /**determine which bricks are still on the screen and print it out*/
    function displayBricks() {
        let canvas = document.getElementById("myCanvas");
        let context = canvas.getContext("2d");
        for(let col=0; col<column; col++) {
            for(let ro=0; ro<row; ro++) {
                if(bricks[col][ro][2] == 1) {
                    let brickX = (ro*(brickWidth+brickPadding))+brickOffsetLeft;
                    let brickY = (col*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[col][ro][0] = brickX;
                    bricks[col][ro][1] = brickY;
                    context.beginPath();
                    context.rect(brickX, brickY, brickWidth, brickHeight);
                    context.fillStyle = "brown";
                    context.fill();
                    context.closePath();
                }
            }
        }
    }

    /**print score on the top*/
    function Score() {
        let canvas = document.getElementById("myCanvas");
        let context = canvas.getContext("2d");
        context.font = "16px Arial";
        context.fillStyle = "#red";
        context.fillText("Score: "+score, 8, 20);
    }
    
    /**print how many lives left on the top*/
    function livesLeft() {
        let canvas = document.getElementById("myCanvas");
        let context = canvas.getContext("2d");
        context.font = "16px Arial";
        context.fillStyle = "red";
        context.fillText("Lives "+lives, canvas.width-65, 20);
    }

    /**print multihit score on the top*/
    function multiHitCount() {
        let canvas = document.getElementById("myCanvas");
        let context = canvas.getContext("2d");
        context.font = "16px Arial";
        context.fillStyle = "red";
        context.fillText("Multi Hit * "+multiHit, canvas.width/2-30, 20);
    }
    
    /**traverse the bricks array to find out if there brick left*/
    function win(){
        for(let col=0; col<column; col++) {
            for(let ro=0; ro<row; ro++) {
                let b = bricks[col][ro];
                if (b[2]==1){
                    return false;
                }
            }
        }
        return true;
    }

    /**build div which can input player name*/
    function getname() {
        let username = document.createElement('input');
        username.type = "text";
        username.value = 'username';
        username.setAttribute('id','username');
        let submit = document.createElement('button');
        submit.innerHTML = "Submit";
        submit.onclick = sendscore;
        let getinput = document.getElementById("name");
        getinput.appendChild(username);
        getinput.appendChild(submit);
    }
    
    /**post ranking information to the screen*/
    function post(){
        fetch("https://hit-bricks.herokuapp.com")//fetch all messages
            .then(checkStatus)//check status
            .then(function(responseText) {
                let result = document.getElementById("result");//get comments div
                let table = document.createElement("table");
                let tr = document.createElement("tr");//create head tr
                let th1 = document.createElement('th');//create first column
                let th2 = document.createElement('th');//create second column
                let th3 = document.createElement('th');//create third column
                th2.setAttribute('class', 'name');//set class for first column
                th3.setAttribute('class', 'score');//set class for second column
                th1.setAttribute('class', 'num');//set class for third column
                th1.innerHTML = "#";//display top row for first column 
                th2.innerHTML = "Name";//display top row for first column 
                th3.innerHTML = "Score";//display top row for second column
                table.appendChild(tr);//append row to table
                tr.appendChild(th1);//append column to row
                tr.appendChild(th2);//append column to row
                tr.appendChild(th3);//append column to row
                result.appendChild(table);
                let json = JSON.parse(responseText);//get message json
                let record = json.record;//set message list
                for (let i=0; i<10; i++) {//iterate through books list
                    let row = document.createElement('tr');//create the row
                    let name = document.createElement("td");//create a title paragraph
                    name.setAttribute('class', 'name');
                    name.innerHTML = record[i]['name'];//display name
                    let score = document.createElement("td");//create an comment
                    score.setAttribute('class', 'score');
                    score.innerHTML = record[i]['score'];//display comment
                    let num = document.createElement('td');//create the num
                    num.setAttribute('class', 'num');//set class for first column
                    num.innerHTML = i+1;//get correct num
                    row.appendChild(num);//append column to row
                    row.appendChild(name);//append name to message
                    row.appendChild(score);//append comment to message
                    table.appendChild(row);//append message to comments
                }
            })
            .catch(function(error){
                console.log(error);
            });
    }
    
    /**refresh the page to restart game*/
    function restart(){
        window.location.reload();
    }
    /** sending player name and score.*/
    function sendscore() {
        let username = document.getElementById('username').value;//get name input
        const ranking = {name:username, score:score};//construct message json
        const fetchOptions = {
            method : 'POST',
            headers : {
                 'Accept': 'application/json',
                 'Content-Type' : 'application/json'
            },
            body : JSON.stringify(ranking)
        };
        fetch("https://hit-bricks.herokuapp.com", fetchOptions)//post to service
            .then(checkStatus)
            .then(function(responseText) {
                console.log(responseText);
                alert("Your Ranking was Saved!");
                setTimeout(restart,100);
            })
            .catch(function(error){
                console.log(error);
            });

    }

    /** This is a function for check service status.*/ 
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response.text();
        } 
        else {
            return Promise.reject(new Error(response.status+":"+response.statusText));
        }
    }
})();
