var canvas, ctx;

var frame = 0,
score = 0;

var pipes = [];

var gameState = "lost";

var player = {
    x: 50,
    y: 100,
    w: 32,
    h: 32,
    velX: 2,
    velY: -5,
    c: "yellow",
};

function draw(obj) {
    ctx.fillStyle = obj.c;
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
}

function collisionTest(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w &&
        obj1.x + obj1.w > obj2.x &&
        obj1.y < obj2.y + obj2.h &&
        obj1.y + obj1.h > obj2.y;
}

function input() {
    if (gameState == "playing") {
        player.velY += -10;
    } else if (gameState == "lost") {
        frame = 0;
        score = 0;
        pipes = [];
        gameState = "playing";
        player = {
            x: 50,
            y: 100,
            w: 32,
            h: 32,
            velX: 2,
            velY: -5,
            c: "yellow",
        };
    }
}

window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.onclick = function() {
        input();
    };
    window.setInterval(function() {
        if (gameState == "playing") {
            if (frame % 250 === 0) {
                var height = Math.random()*(canvas.height-100);
                var space = (Math.random()*64)+128;
                pipes.push({
                    x: canvas.width,
                    y: 0,
                    w: 50,
                    h: height,
                    c: "rgb(0, 255, 0)",
                });
                pipes.push({
                    x: canvas.width,
                    y: height+space,
                    w: 50,
                    h: canvas.height,
                    c: "rgb(0, 255, 0)",
                });
            }
            frame++;
            score = 0;
            pipes.forEach(function(pipe) {
                pipe.x -= player.velX;
                if (pipe.x <= player.x) score += 0.5;
            });
            player.y += player.velY;
            if (player.y <= 0 || player.y >= canvas.height-player.h) gameState = "lost";
            pipes.forEach(function(pipe) {
                if (collisionTest(player, pipe)) {
                    gameState = "lost";
                }
            });
            player.velY += 0.5;
            player.velX += 0.0005;
        }
        window.requestAnimationFrame(function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw(player);
            pipes.forEach(function(pipe) {
                draw(pipe);
            });
            ctx.fillStyle = 'black';
            ctx.font = '24px verdana';
            ctx.fillText(String(score), 15, 25);
        });
    }, 1000/45);
}

document.onkeydown = function(e) {
    switch(e.key) {
        case "w":
        case "ArrowUp":
        case "Up":
        case " ":
            input();
            break;
    }
};