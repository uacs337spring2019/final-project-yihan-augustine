let begin  = -1;
let bricks = [];
let rightarrow = false;
let leftarrow = false;
let radius = 10;      
let dx = 3;
let dy = -3;
let paddleHeight = 12;
let row = 1//16;
let column = 1//9;
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

document.addEventListener("keydown", function(event){
    if(event.keyCode == 39) {
            rightarrow = true;
            console.log(1)
        }
    if(event.keyCode == 37) {
            leftarrow = true;
            console.log(1)
        }
    });
document.addEventListener("keyup", function(event){
    if(event.keyCode == 39) {
            rightarrow = false;
        }
    if(event.keyCode == 37) {
            leftarrow = false;
        }
    });
document.addEventListener("keydown", function(event){
    if(event.keyCode == 32) {
            begin = -begin;
        }
    });

    window.onload = function(){
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        paddleX = (canvas.width-paddleWidth)/2;
        initBrick()
        draw();
        post();
    }

    function draw () {
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawPaddle();
        drawBricks();
        drawBall();
        drawScore();
        drawLives();
        collisionDetection();
        paddleControl()
        drawMulti();
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
                    score = score+multiHit
                    multiHit = 0;
                }
                else {
                    lives--;
                    if(lives==0) {
                        if (confirm("GAME OVER!")) {
                            document.location.reload();
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
        window.requestAnimationFrame(draw);
    }

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

    
    function paddleControl(){
        if(rightarrow==true && paddleX<900-paddleWidth/2) {
            paddleX += 7;
        }
        if(leftarrow==true && paddleX>0-paddleWidth/2) {
            paddleX -= 7;
        }
    }

    function collisionDetection() {
        for(let col=0; col<column; col++) {
            for(let ro=0; ro<row; ro++) {
                let b = bricks[col][ro];
                if(b[2] == 1) {
                    if(x > b[0] && x < b[0]+brickWidth && y > b[1] && y < b[1]+brickHeight) {
                        if(dy>0){
                            dy = -dy-0.1;
                            multiHit += 1
                        }else{
                            dy = -dy+0.1;
                            multiHit += 1
                        }
                        b[2] = 0;
                        score++;
                        if(win()) {
                            if (confirm("YOU WIN, CONGRATS! Enter your name:")) {
                                getname();
                            }
                        }
                    }
                }
            }
        }
    }
    function drawBall() {
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
    function drawBricks() {
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        for(let col=0; col<column; col++) {
            for(let ro=0; ro<row; ro++) {
                if(bricks[col][ro][2] == 1) {
                    let brickX = (ro*(brickWidth+brickPadding))+brickOffsetLeft;
                    let brickY = (col*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[col][ro][0] = brickX;
                    bricks[col][ro][1] = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }
    function drawLives() {
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives "+lives, canvas.width-65, 20);
    }
    function drawMulti() {
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Multi Hit * "+multiHit, canvas.width/2-30, 20);
    }
    function win(){
        for(let col=0; col<column; col++) {
            for(let ro=0; ro<row; ro++) {
                let b = bricks[col][ro];
                if (b[2]==1){
                    return false
                }
            }
        }
        return true
    }

    function getname() {
        let username = document.createElement('input');
        username.type = "text";
        username.value = 'username';
        username.setAttribute('id','username');
        let submit = document.createElement('button');
        let restart = document.createElement('button');
        submit.innerHTML = "Submit";
        restart.innerHTML = "Restart";
        submit.onclick = sendscore;
        restart.onclick = restart;
        let getinput = document.getElementById("name");
        getinput.appendChild(username);
        getinput.appendChild(submit);
        getinput.appendChild(restart);
    }

    function post(){
        fetch("http://localhost:3000")//fetch all messages
            .then(checkStatus)//check status
            .then(function(responseText) {
                let result = document.getElementById("result");//get comments div
                var table = document.createElement("table");
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
                for (let i=0; i<5; i++) {//iterate through books list
                    let row = document.createElement('tr');//create the row
                    let name = document.createElement("td");//create a title paragraph
                    name.setAttribute('class', 'name');
                    name.innerHTML = record[i]['name'];//display name
                    let score = document.createElement("td");//create an comment
                    score.setAttribute('class', 'score');
                    score.innerHTML = record[i]['score'];//display comment
                    var num = document.createElement('td');//create the num
                    num.setAttribute('class', 'num');//set class for first column
                    num.innerHTML = i+1;//get correct num
                    row.appendChild(num);//append column to row
                    row.appendChild(name);//append name to message
                    row.appendChild(score);//append comment to message
                    table.appendChild(row);//append message to comments
                }
            })
            .catch(function(error){ 
            });
    }

    function postcurrent(){
        fetch("http://localhost:3000")//fetch all messages
            .then(checkStatus)//check status
            .then(function(responseText) {
                let current = document.getElementById("current");//get comments div
                let name = document.getElementById("username");
                var table = document.createElement("table");
                let tr = document.createElement("tr");//create head tr
                let th1 = document.createElement('th');//create first column
                let th2 = document.createElement('th');//create second column
                let th3 = document.createElement('th');//create third column
                let title = document.createElement('h2');
                title.innerHTML = "Your ranking";
                console.log(currentname);
                table.appendChild(tr);//append row to table
                tr.appendChild(th1);//append column to row
                tr.appendChild(th2);//append column to row
                tr.appendChild(th3);//append column to row
                current.appendChild(title);
                current.appendChild(table);
                let json = JSON.parse(responseText);//get message json
                let record = json.record;//set message list
                for (let i=0; i<record.length; i++) {//iterate through books list
                    if (record[i]['name'] == name) {
                        th2.innerHTML = name;
                        th3.innerHTML = record[i]['score'];
                        th1.innerHTML = i + 1;
                    }
                }
            })
            .catch(function(error){ 
            });
    }

    function restart(){
        window.location.reload();
    }
    /** This is a function for sending name and message.*/
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
        }
        fetch("http://localhost:3000", fetchOptions)//post to service
            .then(checkStatus)
            .then(function(responseText) {
                console.log(responseText);
            })
            .catch(function(error){ 
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
    