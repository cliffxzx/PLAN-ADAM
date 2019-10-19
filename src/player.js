import * as PIXI from 'pixi.js';
import Keyboard from 'pixi.js-keyboard';
import { Planet, Star } from './planet';
class Ball extends PIXI.Sprite {
    constructor(theta, v, g, r, x, y, rock) {
        super();
        this.texture = rock;
        this.scale.x = this.scale.y = 0.3;
        this.x = x - 50;
        this.y = y + 50;
        this.g = g * 10;
        this.v = v;//初速度
        this.theta = theta;
        this.alltime = 2 * this.v * Math.sin(Math.PI * this.theta / 180) / this.g;
        //this.mx = this.v * Math.cos(this.theta * 180 / Math.PI) / 60;
        this.my = 200 * this.v * this.v * Math.sin(Math.PI * this.theta / 180) * Math.abs(Math.cos(Math.PI * this.theta / 180)) * (Math.sin(r) / (this.g * (this.alltime * 60)));
        this.mx = 200 * this.v * this.v * Math.sin(Math.PI * this.theta / 180) * Math.abs(Math.cos(Math.PI * this.theta / 180)) * (Math.cos(r) / (this.g * (this.alltime * 60)));
        //console.log(this.alltime);
        //console.log(this.mx);
        //console.log(2 * this.v * this.v * Math.sin(Math.PI * this.theta / 180) * Math.abs(Math.cos(Math.PI * this.theta / 180)) / (this.g));
        this.h = 0;
        this.ah = 0.1;
        this.mh = this.ah * (this.v * Math.sin(Math.PI * this.theta / 180) * (this.alltime / 2) - (1 / 2) * this.g * ((this.alltime / 2) * (this.alltime / 2))) / ((this.alltime / 2) * 60);
        this.time = 0;
        this.ballmove = setInterval(() => {
            this.time++;
            if (this.time / 60.0 > this.alltime) clearInterval(this.ballmove);
            this.x += this.mx;
            this.y += this.my;
            this.h = this.ah * (this.v * Math.sin(Math.PI * this.theta / 180) * (this.time / 60) - (1 / 2) * this.g * ((this.time / 60) * (this.time / 60)));
            // if (this.time / 60.0 > this.alltime / 2)
            //     this.h -= this.mh;
            // else
            //     this.h += this.mh;
            console.log(this.h);
            this.scale.x = this.scale.y = 0.3 + (this.h < 0 ? 0 : this.h);
        }, 100 / 6);
    }
}
export default class extends PIXI.Sprite {
    constructor() {
        super();

        for (var i = 0; i <= 36; i++) {
            PIXI.Loader.shared.add(`astronaut_${i}`, `animate/astronaut-${i}.png`);
        }

        this.spaceup = true;
        PIXI.Loader.shared
            .add('rock', 'rock.png')
        this.Planet_param = Planet.fetch();
        this.vx = this.vy = 0;
        this.f = 0;
        this.v = 1.1;
        this.g = this.Planet_param.g;
        this.g_scale = 1000;
        this.up = true;
        this.t = this.v / (3.0 * this.g);
        //this.maxf = this.v ^ 2 / 2 * this.Planet_param.g;
        this.maxf = (this.v * this.v / (2.0 * this.g));
        this.mf = this.maxf / (this.t * 30)
        this.ms = (Math.abs((1.05 * (this.maxf) / 10))) / (this.t * 30) / 10;
        this.nowscale = 0.2;
    }

    show(resources) {
        this.textures = [];
        for (var i = 0; i <= 36; i++) {
            this.textures.push(resources[`astronaut_${i}`].texture);
        }

        this.texture = this.textures[0];

        this.width = this.texture.width / 10;
        this.height = this.texture.height / 10;

        this.resources = resources;
        // this.width = this.texture.width / 10;
        // this.height = this.texture.height / 10;
        this.original_width = this.width;
        this.original_height = this.height;
        this.anchor.set(0.5);

        this.setTicker(app.ticker);
    }

    setTicker(ticker) {
        ticker.add((delta) => {
            const mouse = app.renderer.plugins.interaction.mouse.global;
            var position = this.toGlobal(panel);
            this.rotation = Math.atan2(position.y - mouse.y, position.x - mouse.x);
            //console.log(this.rotation);
            this.walk(delta);
            Keyboard.update();
        });
    }
    throw() {
        var ball = new Ball(89, 15, this.g, this.rotation + Math.PI, this.x, this.y, this.resources.rock.texture);
        ground.addChildAt(ball, ground.children.length - 1);
    }
    walk(delta) {
        const speed = 100 / this.t;

        //console.log(this.nowscale);
        if (this.spaceup)
            if (Keyboard.isKeyDown('Space')) {
                this.spaceup = false;
                this.throw();
            }
        if (Keyboard.isKeyPressed('Space')) {
            this.spaceup = true
        }
        if (this.f == 0) {
            if (Keyboard.isKeyDown('ArrowLeft', 'KeyA')) {
                this.vx -= speed;
            }
            if (Keyboard.isKeyDown('ArrowRight', 'KeyD'))
                this.vx += speed;
            if (Keyboard.isKeyDown('ArrowUp', 'KeyW'))
                this.vy -= speed;
            if (Keyboard.isKeyDown('ArrowDown', 'KeyS'))
                this.vy += speed;
        }
        this.x += this.vx / delta / 60;
        this.y += this.vy / delta / 60;
        if (Math.abs(this.vx) != 0 || Math.abs(this.vy) != 0) {
            if (this.up) {
                this.f += this.mf;
                this.nowscale += this.ms;
                if (this.maxf < this.f) {
                    this.up = false;
                    this.f = this.maxf;
                    this.nowscale = (Math.abs((1.05 * (this.maxf) / 100)) + 0.2);
                }
            }
            else {
                this.f -= this.mf;
                this.nowscale -= this.ms;
                if (this.f < 0) {
                    this.up = true;
                    this.f = 0;
                    this.nowscale = 0.2;
                }
            }
        }
        if (this.f == 0) {
            if (this.vx != 0) {
                if (this.vx > 0 && this.vx - (this.g) * this.g_scale < 0)
                    this.vx = 0;
                else if (this.vx < 0 && this.vx + (this.g) * this.g_scale > 0)
                    this.vx = 0;
                else
                    this.vx += this.vx > 0 ? -(this.g) * this.g_scale : (this.g) * this.g_scale;
            }
            if (this.vy != 0) {
                if (this.vy > 0 && this.vy - (this.g) * this.g_scale < 0)
                    this.vy = 0;
                else if (this.vy < 0 && this.vy + (this.g) * this.g_scale > 0)
                    this.vy = 0;
                else
                    this.vy += this.vy > 0 ? -(this.g) * this.g_scale : (this.g) * this.g_scale;
            }

        }
        this.scale.x = this.scale.y = this.nowscale;
    }
}