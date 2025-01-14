const canvas_map = document.getElementById("canvas_map");
const context_map = canvas_map.getContext("2d");

const canvas_move = document.getElementById("canvas_move");
const context_move = canvas_move.getContext("2d");

let width = context_map.canvas.width,
    height = context_map.canvas.height;

const pixel = height / width * 20;

let snake = [
    [400, 400],
    [420, 400],
    [440, 400]
]

let buff = null;

let fruit = {
    x: 0,
    y: 0
}

// make a score 
let score = {
    score_main: 0,
    score_best: 0,
    update: function () {
        if (this.score_main > this.score_best) {
            this.score_best = this.score_main;
        }
    }
}
// make a counter 
let counter = {
    count: 0,
    update: function () {
        this.count++;
    }
}

//speed game 

let speed_value = document.getElementById('speed');
// let speed = speed_value/600;
speed_value.addEventListener('change', function (e) {
    speed = speed_value.value/60;
    interval_game = setInterval(run_game, speed);
    console.log(speed);
    console.log(interval_game);
})
// let speed = speed_value/60;

function clear_score() {
    score.score_main = 0;
}

let score_main = document.getElementById('main-scores').getElementsByTagName('p')[0],
    score_best = document.getElementById('high-scores').getElementsByTagName('p')[0],
    score_count = document.getElementById('count').getElementsByTagName('p')[0];

function add_score() {
    score.score_main++;
    set_score();
}

function set_score() {
    score_main.textContent = score.score_main;
    score_best.textContent = score.score_best;
    score_count.textContent = counter.count;
}

console.log (score_best);

let last_key_value = null;
let interval = null;

// Draw
function Draw_net() {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (i % pixel === 0 || j % pixel === 0) {
                context_map.fillStyle = "black";
                context_map.fillRect(i, j, 1, 1);
            }
        }
    }
}

function draw_snake() {
    context_move.fillStyle = "green";
    snake.forEach(element => {
        context_move.fillRect(element[0], element[1], pixel, pixel);
    })
}

function draw_fruit() {
    context_move.fillStyle = "red";
    context_move.fillRect(fruit.x, fruit.y, pixel, pixel);
}

// Move
function snake_move_left() {
    buff = snake.pop();
    context_move.clearRect(buff[0], buff[1], pixel, pixel);
    snake = [
        [snake[0][0] - pixel, snake[0][1]], ...snake
    ];
}

function snake_move_right() {
    buff = snake.pop();
    context_move.clearRect(buff[0], buff[1], pixel, pixel);
    snake = [
        [snake[0][0] + pixel, snake[0][1]], ...snake
    ];
}

function snake_move_up() {
    buff = snake.pop();
    context_move.clearRect(buff[0], buff[1], pixel, pixel);
    snake = [
        [snake[0][0], snake[0][1] - pixel], ...snake
    ];
}

function snake_move_down() {
    buff = snake.pop();
    context_move.clearRect(buff[0], buff[1], pixel, pixel);
    snake = [
        [snake[0][0], snake[0][1] + pixel], ...snake
    ];
}
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" ||
        event.key === "ArrowUp" || event.key === "ArrowDown") {
        last_key_value = event.key;
    }
})

function move_snake() {
    switch (last_key_value) {
        case "ArrowLeft":
            snake_move_left();
            break;
        case "ArrowRight":
            snake_move_right();
            break;
        case "ArrowUp":
            snake_move_up();
            break;
        case "ArrowDown":
            snake_move_down();
            break;
    }
}

// Logic
function add_fruit() {
    let x = Math.floor(Math.random() * (width - pixel) / pixel) * pixel;
    let y = Math.floor(Math.random() * (height - pixel) / pixel) * pixel;
    snake.forEach(element => {
        if (element[0] === x && element[1] === y) {
            add_fruit();
        }
    })
    fruit.x = x;
    fruit.y = y;
    draw_fruit();
}

function collision_fruit() {
    if (snake[0][0] === fruit.x && snake[0][1] === fruit.y) {
        add_score();
        add_fruit();
        snake.push([fruit.x, fruit.y]);
    }
}

function collision_body() {
    let [headX, headY] = snake[0];
    for (let i = 1; i < snake.length; i++) {
        let [x, y] = snake[i];
        if (headX === x && headY === y) {
            game_over();
        }
    }
}

function collision_area() {
    let [headX, headY] = snake[0];
    if (headX < 0 || headX >= width || headY < 0 || headY >= height) {
        game_over();
    }
}

function all_collisions() {
    collision_fruit();
    collision_body();
    collision_area();
}

function start_game() {
    Draw_net();
    snake = [
        [400, 400],
        [420, 400],
        [440, 400]
    ];
    last_key_value = null;
    add_fruit();
    run_game();
    // interval_game = setInterval(run_game, speed);
    // interval = setInterval(function() {
    //     move_snake();
    //     snake_ai_move();
    //     draw_snake();
    //     draw_fruit();
    //     all_collisions();
    // }, speed);
}
function run_game() {
    move_snake();
    snake_ai_move();
    draw_snake();
    draw_fruit();
    all_collisions();
}
function game_over() {
    score.update();
    counter.update();
    clear_score();
    set_score();
    context_move.clearRect(0, 0, width, height);
    clearInterval(interval);
    start_game();
}
start_game();


// start ai

function snake_ai_move() {
    switch (snake_see_all_info(snake, fruit)) {
        case "ArrowLeft":
            snake_move_left();
            break;
        case "ArrowRight":
            snake_move_right();
            break;
        case "ArrowUp":
            snake_move_up();
            break;
        case "ArrowDown":
            snake_move_down();
            break;
    }
}
// snake see snake body
function snake_see_body(snake_f) {
    let [x, y] = snake_f[0];
    for (let i = 1; i < snake_f.length; i++) {
        let [bodyX, bodyY] = snake_f[i];
        if (x === bodyX && y === bodyY) {
            return true;
        }
    }
    return false;
}
//maove snake with all information
function snake_see_all_info(snake_f, fruit_f) {
    let body = snake_see_body(snake_f);
    let direction = snake_see_all(snake_f, fruit_f);
    if (body) {
        return "Stop";
    } else {
        return direction;
    }
}

function snake_see_all(snake_f, fruit_f) {
    let [x, y] = snake_f[0];
    let [fruitX, fruitY] = [fruit_f.x, fruit_f.y];
    let dx = (fruitX - x), dy = (fruitY - y);
    let direction = null;
    if (dx > 0) direction = "ArrowRight";
    if (dx < 0) direction = "ArrowLeft";
    if (dy > 0) direction = "ArrowDown";
    if (dy < 0) direction = "ArrowUp";
    return direction;
}

//end ai
// hamilton path mapping
function path() {
    let path = [];
    for (let i = 0; i < snake.length; i++) {
        path.push(snake[i]);
    }
    return path;
}

console.log(path());