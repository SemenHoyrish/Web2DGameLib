const removeValueFromArray = (array, value) => {
    return array.filter(item => item !== value)
}

class MousePosition {
    x;
    y;
    static #isTracking = false;


    constructor () {
        if (MousePosition.#isTracking) {
            console.error("[MousePosition Error] Mouse position already tracking by other instance!");
        } else {
            MousePosition.#isTracking = true;
            document.onmousemove = (e) => {
                this.x = e.x;
                this.y = e.y;
            };
        }
    }

    stopTracking () {
        document.onmousemove = () => {};
        MousePosition.#isTracking = false;
    }

}
class GameObject {
    x; //center
    y; //center
    width;
    height;
    color;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        // objects.push(this);
    }
}
class Game {
    #FPS;
    #WIDTH;
    #HEIGHT;
    #CANVAS;
    #objects;

    #updateInterval;
    #mousePosition;
    
    update;

    constructor(width, height, canvas, fps) {
        this.#WIDTH = width;
        this.#HEIGHT = height;
        this.#CANVAS = canvas;
        this.#FPS = fps;
        this.#objects = [];
        
        this.#mousePosition = new MousePosition();
        this.#update();
    }

    #error (message, fatal=false) {
        console.error("[GAME Error] " + message);
        if (fatal) this.end();
    }

    #getContext (canvas) {
        if (canvas.getContext) {
            return canvas.getContext('2d');
        } else {
            this.#error("Canvas not supported", true);
        }
    }

    #clearCanvas (canvas) {
        const ctx = this.#getContext(canvas);
        ctx.clearRect(0, 0, this.#WIDTH, this.#HEIGHT);
    }

    #renderGameObject (canvas, gameObject) {
        const ctx = this.#getContext(canvas);

        ctx.fillStyle = gameObject.color;
        ctx.fillRect((gameObject.x - gameObject.width / 2), (gameObject.y - gameObject.height / 2), gameObject.width, gameObject.height);
    }

    #update () {
        this.#updateInterval = setInterval(() => {
            this.#clearCanvas(this.#CANVAS);
            for(let i = 0; i < this.#objects.length; i++)
                this.#renderGameObject(this.#CANVAS, this.#objects[i]);

            this.update();
        }, 1000 / this.#FPS);
    }

    createGameObject (x, y, width, height, color="#000000") {
        const obj = new GameObject(x, y, width, height, color);
        this.#objects.push(obj);
        return obj;
    }

    removeGameObject (gameObject) {
        this.#objects = removeValueFromArray(this.#objects, gameObject);
    }

    end () {
        clearInterval(this.#updateInterval);
        this.#mousePosition.stopTracking();
        console.log("Game ended");
    }

}

const initGame = (width, height, canvas, fps=60) => {
    canvas.width = width;
    canvas.height = height;
    return new Game(width, height, canvas, fps);
}
