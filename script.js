const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pipePrefab = {
    x: canvas.width,
    y: 300,
    width: 52,
    height: 410,
    green: {
        x: 26,
        y: 0,
        w: 26,
        h: 160,
    },
    speed: 100,
    speedInterval: 10,
    distance: 200,
}

const duck = {
    x: 50,
    y: 300,
    width: 62,
    height: 45,
    gravity: 0,
    angle: 0,
    jumpForce: -4.56,
}

const background = {
    x: 0,
    y: 0,
    width: 143,
    height: 256,
    speed: 100,
}

const ground = {
    x: 0,
    y: canvas.height / 1.2,
    width: canvas.width * 2,
    height: 100,
    speed: 200,
    speedInterval: 5,
}

const pipes = [];
let isGameOver = false;
let isPaused = false;
let score = 0;
let accumulatedTime = 0;
let timeGame = 0;
let distance = 80;
const user = "Дорогой друг";

const duckImg = new Image();
const pipesImg = new Image();
const backgroundImg = new Image();
const groundImg = new Image();
// const pausedImg = document.getElementById("paused");
// const playImg = new Image();
const come = document.getElementById("come");
const exit = document.getElementById("exit");
const loginDiv = document.getElementById("login");
const login = localStorage.getItem("login");

duckImg.src = "faby1.png";
pipesImg.src = "pipes2.0.png";
backgroundImg.src = "bg2.2.png";
groundImg.src = "ground.png";
// pausedImg.src = "paused.png";
// playImg.src = "play.png";

document.getElementById("new-game").focus();

function update(prevTime) {
    // if (isPaused) {
    //     return;
    // }
    const nowTime = Date.now();
    const deltaTime = Math.min((nowTime - prevTime), 500) / 1000;
    accumulatedTime += deltaTime;

    if (accumulatedTime >= 10) {
        pipePrefab.speed += pipePrefab.speedInterval;
        ground.speed += ground.speedInterval;
        accumulatedTime -= 10;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isGameOver) {
        come.style.display = "none";
        gameOver();
        return;
    }

    sendingScore(score, login);
    welcome();
    hide(isGameOver);
    gravityDuck();
    collision();
    drawing(deltaTime);
    reset();
    requestAnimationFrame(() => update(nowTime));
}

function main() {

    addEventListener("keydown", (evt) => {
        if (evt.code === "ArrowUp") {
            if (!isGameOver) {
                duck.gravity = duck.jumpForce * 1.1;
            }
        }
    });
    loginDiv.innerText = localStorage.getItem("login");
    // document.getElementById("paused").addEventListener("click", () => {
    //     isPaused = !isPaused;
    //     document.getElementById("pause-message").style.display = isPaused ? "block" : "none";
    // });
    document.getElementById("new-game").addEventListener("click", () => {
        startNewGame();
        createPipe();
        createPipe(canvas.width * 1.58);
    });

    come.addEventListener("click", () => {
        document.getElementById("from-menu").style.display = "flex";
    });

    welcome();
    submitForm();
    closeForm();
    info();
}

function createPipe(x = canvas.width) {
    pipes.push({
        ...pipePrefab,
        x: x,
        y: random(0.2, 0.6) * canvas.height,
        speed: pipePrefab.speed,
    });
}

function reset() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (pipe.x < -pipe.width) {
            pipes.splice(i, 1);
            i--;
            createPipe();
            score++;
        }
    }
}

function showGameOverMenu(show = true) {
    document.getElementById("game-over-wrap").style.display = show ? "flex" : "none";
}

function startNewGame() {
    showGameOverMenu(false);
    isGameOver = false;
    duck.x = 50;
    duck.y = 250;
    pipes.length = 0;
    score = 0;
    ground.speed = 200;
    pipePrefab.speed = 100;
    timeGame = 0;


    requestAnimationFrame(() => update(Date.now()));
}

function gameOver() {
    showGameOverMenu(true);
    alert("Game over");
}

function gravityDuck() {
    if (ground.x + 100 <= 0) {
        ground.x = 0;
    }

    duck.y = duck.y + duck.gravity * 1.6;
    duck.gravity = duck.gravity + .3;

    if (duck.gravity < 0) {
        duck.angle = -.2;
        duckImg.src = "faby1.png";
    } else if (duck.gravity > 0) {
        duck.angle = .2;
        duckImg.src = "faby3.png";
    } else {
        duck.angle = 0;
        duckImg.src = "faby2.png";
    }

    if (duck.y > ground.y - duck.height / 2) {
        duck.y = ground.y - duck.height / 2;
        duck.gravity = 1;
        duckImg.src = "faby2.png";
        duck.angle = 0;
    }
}

function collision() {
    for (const pipe of pipes) {
        if ((duck.x + duck.width / 1.15 > pipe.x &&
                duck.x - duck.width / 2.5 < pipe.x + pipe.width / 2.5) ||
            (duck.y < 0)) {
            if (duck.y - duck.height / 2.5 < pipe.y - distance ||
                duck.y + duck.height / 2.5 > pipe.y + distance + pipe.height) {
                isGameOver = true;

            } else if (duck.y + duck.height / 2.5 > pipe.y + distance &&
                duck.y - duck.height / 2.5 < pipe.y + distance + pipe.height) {
                isGameOver = true;
            }
        }
    }
}

function hide(show = false) {
    document.getElementById("resume-game").style.display = show ? "revert" : "none";
}

function drawing(deltaTime) {
    ctx.drawImage(backgroundImg,
        background.x, background.y, background.width, background.height,
        background.x, background.y, canvas.width, canvas.height);

    timeGame += deltaTime * 10;

    for (const pipe of pipes) {
        pipe.x -= (50 + timeGame) * deltaTime;

        drawImg(pipesImg,
            pipe.x, pipe.y - distance - pipe.height / 2, Math.PI,
            pipe.width, pipe.height, 1
        );

        drawImg(pipesImg,
            pipe.x, pipe.y + distance + pipe.height / 2, 0,
            pipe.width, pipe.height, 1
        );
    }

    // ctx.drawImage(pausedImg,
    //     10, 10, 30, 30);

    ctx.drawImage(groundImg,
        ground.x, ground.y, ground.width, ground.height);
    ground.x -= ground.speed * deltaTime;

    drawImg(duckImg,
        duck.x, duck.y, duck.angle,
        duck.width, duck.height);

    drawScore(score, canvas.width / 2, canvas.height / 20);
    result(timeGame, score);
}

function random(min, max) {
    return min + Math.random() * (max - min);
}

function drawImg(image, x, y, angleInRadians = 0, w = 1, h = null, alpha = 1) {
    ctx.globalAlpha = alpha;
    if (!h) h = w;
    if (angleInRadians !== 0) {
        ctx.translate(x, y);
        ctx.rotate(angleInRadians);
        ctx.drawImage(image, -w / 2, -h / 2, w, h);
        ctx.rotate(-angleInRadians);
        ctx.translate(-x, -y);
    } else
        ctx.drawImage(image, x - w / 2, y - h / 2, w, h);
    ctx.globalAlpha = 1;
}

function drawScore(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "28px Arial";
    ctx.fillText(text, x, y);
}

function info() {
    const btns = document.querySelectorAll(".info-button");

    btns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const content = btn.nextElementSibling;
            btn.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
            event.preventDefault();
        });
    });
}

function result(timeGame, score) {
    if (timeGame > 0) {
        document.getElementById("score").innerText = "Ваш результат: " + score;
        document.getElementById("sending-result").style.display = "initial";
    }
}

function closeForm() {
    document.getElementById("closeForm").addEventListener("click", (event) => {
        document.getElementById("from-menu").style.display = "none";
        event.preventDefault();
    });
}

function submitForm() {
    document.getElementById("sending-result").addEventListener("click", () => {
        document.getElementById("from-menu").style.display = "flex";
    })
}

function authorization() {
    const authorizationForm = document.auth_form;

    authorizationForm.addEventListener("submit", (evt) => {
        evt.preventDefault();

        const formData = new FormData(authorizationForm);
        fetch("registration.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("message").innerText = data.message;
                    document.getElementById("from-menu").style.display = "none";
                    localStorage.setItem("login", data.login);
                    if (localStorage.getItem("login") === authorizationForm.login.value) {
                        come.style.display = "none";
                        loginDiv.innerText = localStorage.getItem("login");
                        exit.style.display = "initial";
                    }
                } else {
                    document.getElementById("message").innerText = data.message;
                }
            });
    });
}

function welcome() {
    if (localStorage.getItem("login") !== null) {
        exit.style.display = "initial";
        // document.getElementById("login").innerText = localStorage.getItem("login");
    } else {
        come.style.display = "initial";
        loginDiv.innerText = user;
    }
    exit.addEventListener("click", () => {
        localStorage.removeItem("login");
        loginDiv.innerText = user;
        exit.style.display = "none";
        come.style.display = "initial";

    });
}

function sendingScore(score, login) {
    document.getElementById("sending-result").addEventListener("click", (evt) => {
        evt.preventDefault();
        const formData = new FormData();
        formData.append("score", score);
        formData.append("login", login);

        fetch("sendingResult.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Успех!")
                } else {
                    console.log("Ошибка((")
                }
            });
    });
}

backgroundImg.addEventListener("load", () => {
    main();
});

// welcome();
authorization();