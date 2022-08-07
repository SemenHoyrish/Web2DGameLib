// const FPS = 30;
const FPS = 60;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const CANVAS = document.querySelector('canvas');
const BODY = document.querySelector('body');

BODY.style.width = WIDTH.toString() + "px";
BODY.style.height = HEIGHT.toString() + "px";


const game = initGame(WIDTH, HEIGHT, CANVAS, FPS);

game.createGameObject(40, 60, 200, 100);

document.onkeydown = (e) => {
    if (e.code == "KeyQ") game.end();
}

let prev_time = 0;
let i = 0;
let prev_obj;
game.update = () => {

    if (new Date().getTime() - prev_time > 200) {
        console.log("HELLO");
        i++;
        game.removeGameObject(prev_obj);
        prev_obj = game.createGameObject(100 + 10 * i, 100 + 10 * i, 100, 100, "#c4c4c4");

        if (10 * i > WIDTH || 10 * i > HEIGHT) i = 0;

        prev_time = new Date().getTime();
    }

}

//game.end();
