// const FPS = 30;
// const FPS = 60;
const FPS = 10;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const CANVAS = document.querySelector('canvas');
const BODY = document.querySelector('body');

BODY.style.width = WIDTH.toString() + "px";
BODY.style.height = HEIGHT.toString() + "px";


const game = initGame(WIDTH, HEIGHT, CANVAS, FPS);

game.createGameObject(40, 60, 200, 100);
const btn = game.createButton(500, 500, 200, 100, "click me", () => {
    game.createGameObject(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, "rgba(54, 168, 2, 0.3)");
    console.log("clicked");
}, 48, "#c4c4c4", "red");

// game.removeGameObject(btn);

document.onkeydown = (e) => {
    if (e.code == "KeyQ") game.end();
}

let field = [
];

for (let i = 0; i < 10; i++) {
    let row = [];
    for (let j = 0; j < 10; j++)
        row.push(0);
    field.push(row);
}
console.log(field);


field[3][5] = 1;
field[4][5] = 1;
field[7][5] = 1;
field[3][7] = 1;

game.update = () => {
    return;
    
    console.log(game.mousePosition.getMouseDownPosition());

    game.removeAllGameObjects();

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            let color = "#c4c4c4";
            if (field[y][x] == 1) color = "#00cbd6";
            const SIZE = 50;
            const obj = game.createGameObject(SIZE + (SIZE + 1) * x, SIZE + (SIZE + 1) * y, SIZE, SIZE, color);
            if (field[y][x] == 1 && game.isMouseOverGameObject(obj)) {
                obj.color = "#000bd6";
            }
        }
    }

    console.log("updated");
}


// let prev_time = 0;
// let i = 0;
// let prev_obj;
// game.update = () => {

//     if (new Date().getTime() - prev_time > 200) {
//         console.log("HELLO");
//         i++;
//         game.removeGameObject(prev_obj);
//         prev_obj = game.createGameObject(100 + 10 * i, 100 + 10 * i, 100, 100, "#c4c4c4");

//         if (10 * i > WIDTH || 10 * i > HEIGHT) i = 0;

//         prev_time = new Date().getTime();
//     }

// }

//game.end();
