import * as PIXI from 'pixi.js';
import Keyboard from 'pixi.js-keyboard';

export default class extends PIXI.Sprite {
    constructor() {
        super();

        PIXI.Loader.shared
            .add('astronaut_0', 'astronaut_0.png')
    }

    show(resources) {
        this.texture = resources.astronaut_0.texture;

        this.height = 100;
        this.width = 100;
        this.anchor.set(0.5);

        this.setTicker(app.ticker);
    }

    setTicker(ticker) {
        ticker.add(() => {
            const mouse = app.renderer.plugins.interaction.mouse.global;
            var position = this.toGlobal(panel);
            this.rotation = Math.atan2(position.y - mouse.y, position.x - mouse.x);

            this.walk();
            Keyboard.update();
        });
    }

    walk() {
        const speed = 5;
        var nextX = this.x, nextY = this.y;

        if (Keyboard.isKeyDown('ArrowLeft', 'KeyA'))
            nextX -= speed;
        if (Keyboard.isKeyDown('ArrowRight', 'KeyD'))
            nextX += speed;
        if (Keyboard.isKeyDown('ArrowUp', 'KeyW'))
            nextY -= speed;
        if (Keyboard.isKeyDown('ArrowDown', 'KeyS'))
            nextY += speed;

        if (nextX != this.x || nextY != this.y) {
            this.x = nextX;
            this.y = nextY;
        }
    }
}