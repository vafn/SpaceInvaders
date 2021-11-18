export class Game {
    constructor() {
        this.lastUpdate = new Date();
        this.movable = true;
        this.enabled = true;
        this.collidable = true;
        this.type = 'Game';
        this.objects = [];
        this.dispatcher = null;
        this.sprite;
        this.animate = true;
        this.frameIndex = 0;
        this.frameCount = 0;
        this.framePerSec = 0;
        this.repeat = 0;
        this.repeatCount = 0;
        this.lastFrameChangedTime = new Date().getTime();
        this.animateEnded = () => {};
    }
    Update(counter) {
        this.objects.forEach((object) => object.Update());
    }
    UpdateSprite() {
        if (this.animate) {
            let now = new Date().getTime();
            if (
                this.framePerSec > 0 &&
                now - this.lastFrameChangedTime >= 1000 / this.framePerSec
            ) {
                this.lastFrameChangedTime = now;
                ++this.frameIndex;
                if (this.frameIndex >= this.frameCount) {
                    if (this.repeat > 0) {
                        this.repeatCount++;
                        if (this.repeatCount === this.repeat) {
                            this.animate = false;
                            this.repeatCount = 0;
                            this.frameIndex = this.frameCount - 1;
                            this.animateEnded();
                        } else this.frameIndex = 0;
                    } else this.frameIndex = 0;
                }
            }
        }
    }
    Beep() {
        var snd = new Audio(
            'data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='
        );
        //snd.play();
    }

    static lineLine(line1, line2) {
        let x1 = line1[0];
        let y1 = line1[1];
        let x2 = line1[2];
        let y2 = line1[3];
        let x3 = line2[0];
        let y3 = line2[1];
        let x4 = line2[2];
        let y4 = line2[3];
        let uA =
            ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        let uB =
            ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
    }
}
export class World extends Game {
    constructor(x, y, w, h) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.top = this.y;
        this.bottom = this.y + h;
        this.left = this.x;
        this.right = this.x + w;
        this.gravity = 9.8;
        this.friction = 0.1;
        this.backgroundColor = 'rgba(0,0,0,1)';
        this.movable = false;
        this.type = 'World';
    }
    Update() {
        this.objects.forEach((object) => {
            if (object.enabled) {
                object.Update();
                if (object.movable) {
                    this.objects.forEach((destinationObject) => {
                        if (
                            destinationObject.enabled &&
                            destinationObject.collidable
                        ) {
                            if (destinationObject !== object) {
                                //check against itself?
                                if (object.type === 'LaserShoot') {
                                    if (
                                        destinationObject.type === 'Alian' &&
                                        object.isColid(destinationObject)
                                    ) {
                                        object.enabled = false;
                                        destinationObject.enabled = false;
                                        this.dispatcher.dispatchEvent(
                                            new CustomEvent('AnAlianKilled', { detail: {alianIndex: destinationObject.index}})
                                        );
                                    } else if (
                                        destinationObject.type === 'Barrier' &&
                                        object.isColid(destinationObject)
                                    ) {
                                        this.Beep();
                                    }
                                } else if (object.type === 'Player') {
                                }
                            }
                        }
                    });
                    this.IsWentOutOfWorld(object);
                }
            }
        });
    }
    IsWentOutOfWorld(object) {
        if (typeof object.wentOut !== 'undefined') {
            if (object.left > this.right) object.wentOut('Right');
            else if (object.right < this.left) object.wentOut('Left');
            else if (object.top > this.bottom) object.wentOut('Bottom');
            else if (object.bottom < this.top) object.wentOut('Top');
        }
    }
}
class GameObject extends Game {
    constructor() {
        super();
        delete this.world;
        this.type = 'GameObject';
    }
    Update() {
        //this.x = this.x + this.xV;
        //this.y = this.y + this.yV;
        //this.top = this.y;
        //this.bottom = ball.y;
        //this.left = ball.x;
        //this.right = this.x;
    }
    Set(config) {
        if (typeof config.x != 'undefined') this.x = config.x;
        if (typeof config.y != 'undefined') this.y = config.y;
        if (typeof config.xV != 'undefined') this.xV = config.xV;
        if (typeof config.yV != 'undefined') this.yV = config.yV;
        if (typeof config.color != 'undefined') this.color = config.color;

        this.top = this.y - this.radius;
        this.bottom = this.y + this.radius;
        this.left = this.x - this.radius;
        this.right = this.x + this.radius;
    }
    isColid(obj2Check) {
        return false;
    }
}
class Point extends GameObject {
    constructor(x, y, xV, yV, wentOut) {
        super();
        this.xV = xV;
        this.yV = yV;
        this.type = 'Point';
        this.x = x;
        this.y = y;
        this.top = y;
        this.bottom = y;
        this.left = x;
        this.right = x;
    }
}
class Line extends GameObject {
    constructor(x1, y1, x2, y2, xV, yV, wentOut) {
        super();
        this.xV = xV;
        this.yV = yV;
        this.type = 'Line';
        this.x = x1;
        this.y = y1;
        this.top = this.y1;
        this.bottom = this.y2;
        this.left = this.x1;
        this.right = this.x2;
    }
}
class Rectangle extends GameObject {
    constructor(x, y, w, h, color, collidable) {
        super();
        this.collidableSides = [true, true, true, true];
    }
}
export class Ball extends GameObject {
    constructor(x, y, r, xV, yV, color) {
        super();
        this.visible = true;
        this.radius = r;
        this.xV = xV;
        this.yV = yV;
        this.xVDefault = xV;
        //this.yVDefault = yV;
        this.color = color;
        this.type = 'Ball';
        this.x = x;
        this.y = y;
        this.width = 2 * r;
        this.height = 2 * r;
        this.top = y - r;
        this.bottom = y + r;
        this.left = x - r;
        this.right = x + r;
        this.prevX = this.x;
        this.prevY = this.y;
        this.lastUpdate = new Date();
    }
    Update() {
        this.prevX = this.x;
        this.prevY = this.y;
        let now = new Date().getTime();
        let tPassed = now - this.lastUpdate;
        this.lastUpdate = now;
        this.x = this.x + (this.xV * tPassed) / 1000;
        this.y = this.y + (this.yV * tPassed) / 1000;
        this.top = this.y - this.radius;
        this.bottom = this.y + this.radius;
        this.left = this.x - this.radius;
        this.right = this.x + this.radius;
    }

    isColid(obj2Check) {
        /*
        console.log(obj2Check.collidableSides);

        let boxLines = [];
        boxLines[0] = [obj2Check.left, obj2Check.top, obj2Check.right, obj2Check.top];
        boxLines[1] = [obj2Check.right, obj2Check.top, obj2Check.right, obj2Check.bottom];
        boxLines[2] = [obj2Check.left, obj2Check.bottom, obj2Check.right, obj2Check.bottom];
        boxLines[3] = [obj2Check.left, obj2Check.top, obj2Check.left, obj2Check.bottom];

        for(let side = 0; side < 4; side++) {
          if(obj2Check.collidableSides[side])
            if(Game.circleLine(boxLines[side]))
              return side + 1;
        }
        */

        let deltaX =
            this.x - Math.max(obj2Check.x, Math.min(this.x, obj2Check.right));
        let deltaY =
            this.y - Math.max(obj2Check.y, Math.min(this.y, obj2Check.bottom));
        if (deltaX * deltaX + deltaY * deltaY < this.radius * this.radius)
            return true;
        else {
            //Check Tunneling
            let boxLines = [];
            boxLines[0] = [
                obj2Check.left,
                obj2Check.top,
                obj2Check.right,
                obj2Check.top,
            ];
            boxLines[1] = [
                obj2Check.right,
                obj2Check.top,
                obj2Check.right,
                obj2Check.bottom,
            ];
            boxLines[2] = [
                obj2Check.left,
                obj2Check.bottom,
                obj2Check.right,
                obj2Check.bottom,
            ];
            boxLines[3] = [
                obj2Check.left,
                obj2Check.top,
                obj2Check.left,
                obj2Check.bottom,
            ];
            let b = Math.abs(this.x - this.prevX);
            let a = Math.abs(this.y - this.prevY);
            let A = this.radius / Math.sqrt(1 + ((b / a) * b) / a);
            let B = (A * b) / a;
            let circlePathLines = [];
            circlePathLines[0] = [
                this.prevX - B,
                this.prevY - A,
                this.x - B,
                this.y - A,
            ];
            circlePathLines[1] = [
                this.x + B,
                this.y + A,
                this.x + B,
                this.y + A,
            ];
            circlePathLines[2] = [
                this.x - B,
                this.y - A,
                this.prevX + B,
                this.prevY + A,
            ];
            circlePathLines[3] = [
                this.prevX - B,
                this.prevY - A,
                this.prevX + B,
                this.prevY + A,
            ];
            for (let pl = 0; pl <= 3; pl++)
                for (let cpl = 0; cpl <= 3; cpl++)
                    if (Game.lineLine(boxLines[pl], circlePathLines[cpl]))
                        return true;
        }
        return false;
    }
}
export class Wall extends Rectangle {
    constructor(x, y, w, h, color, collidable) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        this.top = y;
        this.bottom = y + h;
        this.left = x;
        this.right = x + w;
        this.type = 'Wall';
        this.collidable = collidable;
        this.movable = false;
    }
    Update() {}
}
export class Player extends Rectangle {
    constructor(x, y, w, h, xV, yV, color, colidFrom) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.top = y;
        this.bottom = y + h;
        this.left = x;
        this.right = x + w;
        this.xV = xV;
        this.yV = yV;
        this.maxV = 800;
        this.acc = 300;
        this.friction = 150;
        this.color = color;
        this.score = 0;
        this.conceded = false;
        this.type = 'Player';
        this.wentOut;
        this.kickBall;
        this.ai;
        this.actions = [];
        this.action = null;
        this.colidFrom = colidFrom;
    }
    Update() {
        if (typeof this.ai !== 'undefined') this.UpdateAction();
        this.UpdateLocation();
    }
    UpdateLocation() {
        let now = new Date().getTime();
        let tPassed = now - this.lastUpdate;
        this.lastUpdate = now;
        this.x = this.x + (this.xV * tPassed) / 1000;
        this.y = this.y + (this.yV * tPassed) / 1000;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;

        if (this.yV > 0) {
            if (this.yV > this.friction) this.yV -= this.friction;
            else this.yV = 0;
        } else if (this.yV < 0) {
            if (this.yV < -this.friction) this.yV += this.friction;
            else this.yV = 0;
        }
    }
    UpdateAction() {
        if (this.actions.length === 0) this.actions = this.ai.GetActions();
        if (this.action === null) {
            this.action = this.actions.shift();
            this.action.lastUpdate = new Date().getTime();
            if (typeof this.action.oneTime === 'undefined')
                this.action.oneTime = false;
        }
        let now = new Date().getTime();
        let tPassed = now - this.action.lastUpdate;
        this.action.lastUpdate = now;
        if (!this.action.oneTime) this.action.duration -= tPassed;
        if (this.action.oneTime || this.action.duration > 0) {
            switch (this.action.do) {
                case 'nothing':
                    break;
                case 'moveUp':
                    this.moveUp();
                    break;
                case 'moveDown':
                    this.moveDown();
                    break;
                case 'kickBall':
                    this.action.duration = 0;
                    this.kickBall();
                    break;
            }
            if (this.action.oneTime) this.action = null;
        } else this.action = null;
    }
    moveUp() {
        if (this.yV > -this.maxV) this.yV -= this.acc;
        else this.yV = -this.maxV;
    }
    moveDown() {
        if (this.yV < this.maxV) this.yV += this.acc;
        else this.yV = this.maxV;
    }

    isColid(obj2Check) {
        if (obj2Check.type === 'Wall') {
            if (obj2Check.collidable) {
                let topBottom =
                    (this.top < obj2Check.bottom && this.top > obj2Check.top) ||
                    (this.bottom > obj2Check.top &&
                        this.bottom < obj2Check.bottom);
                topBottom =
                    topBottom ||
                    (this.top < obj2Check.top &&
                        this.bottom > obj2Check.bottom);
                let leftRight =
                    (this.left < obj2Check.right &&
                        this.left > obj2Check.left) ||
                    (this.right > obj2Check.left &&
                        this.right < obj2Check.right);
                return topBottom && leftRight;
            }
        }
        return false;
    }
    zzzzplay() {
        let move = this.ai.GetMove();
        if (move === 'up') this.moveUp();
        else if (move === 'down') this.moveDown();
        return move;
    }
    concededAPoint() {
        this.conceded = true;
        this.hasBall = true;
        if (typeof this.ai !== 'undefined') {
            this.actions = [];
            this.action = null;
            this.actions = this.ai.GetActions();
            this.conceded = false;
        }
    }
}
export class Text extends GameObject {
    constructor(x, y, text, fillStyle, bold, size, font, centerAligned) {
        super();
        this.type = 'Text';
        this.x = x;
        this.y = y;
        this.text = text;
        this.fillStyle = fillStyle;
        this.bold = bold;
        this.size = size;
        this.font = font;
        this.centerAligned = centerAligned;
        this.movable = false;
    }
}
export class Shooter extends Rectangle {
    constructor(x, y, w, h, xV, yV, color, colidFrom, sprite) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.top = y;
        this.bottom = y + h;
        this.left = x;
        this.right = x + w;
        this.xV = xV;
        this.yV = yV;
        this.defaultXSpeed = 300;
        this.friction = 10000;
        this.color = color;
        this.score = 0;
        this.conceded = false;
        this.type = 'Shooter';
        this.wentOut;
        this.shoot;
        this.ai;
        this.colidFrom = colidFrom;
        this.sprite = sprite;
    }
    Update() {
        this.UpdateLocation();
    }
    UpdateLocation() {
        let now = new Date().getTime();
        let tPassed = now - this.lastUpdate;
        this.lastUpdate = now;
        this.x = this.x + (this.xV * tPassed) / 1000;
        this.y = this.y + (this.yV * tPassed) / 1000;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;

        if (this.xV > 0) {
            if (this.xV > this.friction) this.xV -= this.friction;
            else this.xV = 0;
        } else if (this.xV < 0) {
            if (this.xV < -this.friction) this.xV += this.friction;
            else this.xV = 0;
        }
    }
    moveRight() {
        this.xV = this.defaultXSpeed;
    }
    moveLeft() {
        this.xV = -this.defaultXSpeed;
    }

    isColid(obj2Check) {
        if (obj2Check.type === 'Wall') {
            if (obj2Check.collidable) {
                let topBottom =
                    (this.top < obj2Check.bottom && this.top > obj2Check.top) ||
                    (this.bottom > obj2Check.top &&
                        this.bottom < obj2Check.bottom);
                topBottom =
                    topBottom ||
                    (this.top < obj2Check.top &&
                        this.bottom > obj2Check.bottom);
                let leftRight =
                    (this.left < obj2Check.right &&
                        this.left > obj2Check.left) ||
                    (this.right > obj2Check.left &&
                        this.right < obj2Check.right);
                return topBottom && leftRight;
            }
        }
        return false;
    }
    concededAPoint() {
        this.conceded = true;
        this.hasBall = true;
        if (typeof this.ai !== 'undefined') {
            this.actions = [];
            this.action = null;
            this.actions = this.ai.GetActions();
            this.conceded = false;
        }
    }
}
export class Alian extends Rectangle {
    constructor(config) {
        super();
        this._x = 0;
        this.y = 100;
        this.width = 40;
        this.height = 40;
        this.top = 0;
        this.bottom = 40;
        this.left = 0;
        this.right = 40;
        this.xV = 0;
        this.yV = 0;
        this.color = '';
        this.conceded = false;
        this.type = 'Alian';
        this.race = 'Squid';
        this.wentOut;
        this.shoot;
        this.ai;
        this.colidFrom = '';
        this.race = '';
        this.dispatcher = null;
        this.index = -1;
        this.grid;
        this.shootInterval = 8000;
        this.lastTry2Shoot = new Date().getTime() - Math.floor(Math.random() * this.shootInterval);
        this.Shoot;

        if (typeof config !== 'undefined') {
            if (typeof config.type !== 'undefined') this.type = config.type;
            if (typeof config.race !== 'undefined') this.race = config.race;
            if (typeof config.dispatcher !== 'undefined')
                this.dispatcher = config.dispatcher;
            if (typeof config.color !== 'undefined') this.color = config.color;
            if (typeof config.x !== 'undefined') this._x = config.x;
            if (typeof config.y !== 'undefined') this.y = config.y;
            if (typeof config.xV !== 'undefined') this.xV = config.xV;
            if (typeof config.yV !== 'undefined') this.yV = config.yV;
            if (typeof config.width !== 'undefined') this.width = config.width;
            if (typeof config.height !== 'undefined')
                this.height = config.height;
            if (typeof config.sprite !== 'undefined')
                this.sprite = config.sprite;
            if (typeof config.frameCount !== 'undefined')
                this.frameCount = config.frameCount;
            if (typeof config.framePerSec !== 'undefined')
                this.framePerSec = config.framePerSec;
            if (typeof config.index !== 'undefined') this.index = config.index;
            if (typeof config.grid !== 'undefined')
                this.grid = config.grid;
            if (typeof config.Shoot !== 'undefined')
                this.Shoot = config.Shoot;
        }
        this.top = this.y;
        this.left = this._x;
        this.righ = this._x + this.width;
        this.bottom = this.y + this.height;

        this.SetupEvents();
    }
    ChangeDir(dir) {
        this.direction = dir;
        console.log(this.name + ': I changed my direction to:' + dir);
    }
    SetupEvents() {
        this.dispatcher.addEventListener('AnAlianHitTheWall', (event) => {
            if (event.detail.wall === 'left') this.ChangeDir(dir.right);
            else if (event.detail.wall === 'right') this.ChangeDir(dir.left);
        });
    }
    Update() {
        this.UpdateLocation();
        this.UpdateSprite();
        this.UpdateShooting();
    }
    UpdateLocation() {
        const now = new Date().getTime();
        const tPassed = now - this.lastUpdate;
        this.lastUpdate = now;
        this._x = this._x + (this.xV * tPassed) / 1000;
        this.y = this.y + (this.yV * tPassed) / 1000;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this._x;
        this.right = this._x + this.width;
    }
    UpdateShooting() {
        const now = new Date().getTime();
        const tPassed = now - this.lastTry2Shoot;
        if (tPassed > this.shootInterval) {
            this.lastTry2Shoot = now;
            if (this.grid && this.grid.CanFire(this))
                this.Shoot(this);
        }
    }
    set x(value) {
        this._x = value;
        this.left = this._x;
        this.right = this._x + this.width;
    }
    get x() {
        return this._x;
    }
}
export class LaserShoot extends Rectangle {
    constructor(x, y, w, h, color) {
        super();
        this.x = x;
        this.y = 600;
        this.width = w;
        this.height = h;
        this.top = y;
        this.bottom = y + h;
        this.left = x;
        this.right = x + w;
        this.yV = 0;
        this.color = color;
        this.conceded = false;
        this.type = 'LaserShoot';
        this.wentOut;
        this.enabled = false;
    }
    Update() {
        this.UpdateLocation();
    }
    UpdateLocation() {
        if (this.enabled) {
            let now = new Date().getTime();
            let tPassed = now - this.lastUpdate;
            this.lastUpdate = now;
            this.y = this.y + (this.yV * tPassed) / 1000;
            this.top = this.y;
            this.bottom = this.y + this.height;
        }
    }
    isColid(obj2Check) {
        return (
            this.x < obj2Check.x + obj2Check.width &&
            this.x + this.width > obj2Check.x &&
            this.y < obj2Check.y + obj2Check.height &&
            this.y + this.height > obj2Check.y
        );
    }
}
export class TopExplosion extends Rectangle {
    constructor(x, y, w, h, sprite) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.top = y;
        this.bottom = y + h;
        this.left = x;
        this.right = x + w;
        this.yV = 0;
        this.type = 'TopExplosion';
        this.enabled = false;
        this.sprite = sprite;
        this.frameCount = 2;
        this.framePerSec = 20;
        this.repeat = 1;
    }
    Update() {
        this.UpdateSprite();
    }
}
export class AlianGrid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.alians = [];
        this.Setup();
    }
    Setup() {
        for (let c = 0; c < this.cols; c++)
            for (let r = 0; r < this.rows; r++)
                this.alians[c * this.rows + r] = 1;
    }

    CanFire(alian) {
        let result = true;
        if (alian.enabled) {
            const alianIndex = alian.index;
            let aRow = parseInt(alianIndex / this.cols);
            if (aRow < this.rows - 1) {
                let aCol = alianIndex % this.cols;
                for (let r = aRow + 1; r < this.rows; r++) {
                    if (this.alians[r * this.cols + aCol] > 0) {
                        result = false;
                        break;
                    }
                }
            }
        } else
            result = false;
        return result;
    }
    SetAlianKilled(alianIndex) {
        this.alians[alianIndex] = 0;
    }
}
export class AlianShoot extends Rectangle {
    constructor(x, y, w, h, color) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.top = y;
        this.bottom = y + h;
        this.left = x;
        this.right = x + w;
        this.yV = 250;
        this.color = color;
        this.conceded = false;
        this.type = 'AlianShoot';
        this.wentOut;
        this.enabled = true;
        this.onExplode = () => {};
    }
    Update() {
        this.UpdateLocation();
    }
    UpdateLocation() {
        if (this.enabled) {
            let now = new Date().getTime();
            let tPassed = now - this.lastUpdate;
            this.lastUpdate = now;
            this.y = this.y + (this.yV * tPassed) / 1000;
            this.top = this.y;
            this.bottom = this.y + this.height;
        }
    }
    isColid(obj2Check) {
        return (
            this.x < obj2Check.x + obj2Check.width &&
            this.x + this.width > obj2Check.x &&
            this.y < obj2Check.y + obj2Check.height &&
            this.y + this.height > obj2Check.y
        );
    }
    Explode() {
        this.yV = 0;
        this.enabled = false;
        this.onExplode(this);
    }
}
export class Explosion extends Rectangle {
    constructor(x, y, w, h, sprite) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.top = y;
        this.bottom = y + h;
        this.left = x;
        this.right = x + w;
        this.yV = 0;
        this.type = 'Explosion';
        this.enabled = true;
        this.sprite = sprite;
        this.frameCount = 2;
        this.framePerSec = 20;
        this.repeat = 1;
    }
    Update() {
        this.UpdateSprite();
    }
}
