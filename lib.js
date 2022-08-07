const removeValueFromArray = (array, value) => {
    return array.filter(item => item !== value)
}

class Position {
    x;
    y;

    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}
class MousePosition {
    x;
    y;
    static #isTracking = false;

    #mouseDownHandlers = [];
    

    constructor () {
        if (MousePosition.#isTracking) {
            console.error("[MousePosition Error] Mouse position already tracking by other instance!");
        } else {
            MousePosition.#isTracking = true;
            document.onmousemove = (e) => {
                this.x = e.x;
                this.y = e.y;
            };
            document.onmousedown = (e) => {
                for(let i = 0; i < this.#mouseDownHandlers.length; i++) {
                    this.#mouseDownHandlers[i](this.x, this.y);
                }
            }
        }
    }

    // getMouseDownPosition () {
    //     const pos = new Position(this.#down_x, this.#down_y);
    //     this.#down_x = -1;
    //     this.#down_y = -1;
    //     return pos;
    // }
    addMouseDownHandler (handler) {
        this.#mouseDownHandlers.push(handler);
        return this.#mouseDownHandlers.length - 1;
    }
    removeMouseDownHandler (handler_index) {
        this.#mouseDownHandlers.splice(handler_index, 1);
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
class Button extends GameObject {
    func;
    clickHandlerID;
    text;
    textSize;
    textColor;

    constructor (x, y, width, height, text, func, textSize, textColor, bgColor) {
        super(x, y, width, height, bgColor);
        this.func = func;
        this.text = text;
        this.textSize = textSize;
        this.textColor = textColor;
    }
}
class Game {
    #FPS;
    #WIDTH;
    #HEIGHT;
    #CANVAS;
    #objects;

    #updateInterval;
    mousePosition;
    
    update;

    constructor(width, height, canvas, fps) {
        this.#WIDTH = width;
        this.#HEIGHT = height;
        this.#CANVAS = canvas;
        this.#FPS = fps;
        this.#objects = [];
        
        this.mousePosition = new MousePosition();
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
        
        if (gameObject instanceof Button) {
            ctx.fillStyle = gameObject.color;
            ctx.fillRect((gameObject.x - gameObject.width / 2), (gameObject.y - gameObject.height / 2), gameObject.width, gameObject.height);
            ctx.font = `${gameObject.textSize}px serif`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = gameObject.textColor;
            ctx.fillText(gameObject.text, gameObject.x, gameObject.y);
            // ctx.fillText(gameObject.text, (gameObject.x - gameObject.width / 2), (gameObject.y - gameObject.height / 2));
        } else {
            ctx.fillStyle = gameObject.color;
            ctx.fillRect((gameObject.x - gameObject.width / 2), (gameObject.y - gameObject.height / 2), gameObject.width, gameObject.height);
        }
    }

    #update () {
        this.#updateInterval = setInterval(() => {
            this.#clearCanvas(this.#CANVAS);
            for(let i = 0; i < this.#objects.length; i++) {
                const obj = this.#objects[i];
                this.#renderGameObject(this.#CANVAS, obj);
            }

            this.update();
        }, 1000 / this.#FPS);
    }

    createGameObject (x, y, width, height, color="#000000") {
        const obj = new GameObject(x, y, width, height, color);
        this.#objects.push(obj);
        return obj;
    }

    createButton (x, y, width, height, text, func, textSize="12", textColor="#ffffff", bgColor="#000000") {
        const obj = new Button(x, y, width, height, text, func, textSize, textColor, bgColor);
        this.#objects.push(obj);
        obj.clickHandlerID = this.mousePosition.addMouseDownHandler((x, y) => {
            if (this.isCoordsOverGameObject(x, y, obj)) {
                obj.func();
            }
        });
        return obj;
    }

    removeGameObject (gameObject) {
        if (gameObject instanceof Button) {
            this.mousePosition.removeMouseDownHandler(gameObject.clickHandlerID);
        }
        this.#objects = removeValueFromArray(this.#objects, gameObject);
    }

    removeAllGameObjects () {
        this.#objects = [];
    }

    isCoordsOverGameObject (x, y, gameObject) {
        const x1 = gameObject.x - gameObject.width / 2;
        const x2 = gameObject.x + gameObject.width / 2;

        const y1 = gameObject.y - gameObject.height / 2;
        const y2 = gameObject.y + gameObject.height / 2;

        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return true;
        return false;
    }

    isMouseOverGameObject (gameObject) {
        return this.isCoordsOverGameObject(this.mousePosition.x, this.mousePosition.y, gameObject);
    }

    // isMouseDownOnGameObject (gameObject) {
    //     const x1 = gameObject.x - gameObject.width / 2;
    //     const x2 = gameObject.x + gameObject.width / 2;

    //     const y1 = gameObject.y - gameObject.height / 2;
    //     const y2 = gameObject.y + gameObject.height / 2;

    //     const pos = this.mousePosition.getMouseDownPosition();
    //     if (pos.x == -1 && pos.y == -1) return false;

    //     const mx = pos.x;
    //     const my = pos.y;

    //     if (mx >= x1 && mx <= x2 && my >= y1 && my <= y2) return true;
    //     return false;
    // }

    end () {
        clearInterval(this.#updateInterval);
        this.mousePosition.stopTracking();
        console.log("Game ended");
    }

}

const initGame = (width, height, canvas, fps=60) => {
    canvas.width = width;
    canvas.height = height;
    return new Game(width, height, canvas, fps);
}
