import { ExplosionType } from './Main.js';
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
        this.paused = false;
        this.Garbage = false;
        this.onAnimateEnd = () => {};
        this.onExplode = () => {};
    }
    Update() {
        this.objects.forEach((object) => object.Update());
    }
    SetPause(paused) {
        this.paused = paused;
    }
    UpdateSprite() {
        if (this.animate) {
            let now = new Date().getTime();
            if (this.framePerSec > 0 && now - this.lastFrameChangedTime >= 1000 / this.framePerSec) {
                this.lastFrameChangedTime = now;
                ++this.frameIndex;
                if (this.frameIndex >= this.frameCount) {
                    if (this.repeat > 0) {
                        this.repeatCount++;
                        if (this.repeatCount === this.repeat) {
                            this.animate = false;
                            this.repeatCount = 0;
                            this.frameIndex = this.frameCount - 1;
                            this.onAnimateEnd();
                        } else
                            this.frameIndex = 0;
                    } else
                        this.frameIndex = 0;
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
                object.Update(this.objects);
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
class Rectangle extends GameObject {
    constructor(x, y, w, h, color, collidable) {
        super();
        this.collidableSides = [true, true, true, true];
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
        this.collidable = false;
    }
}
export class Shooter extends Rectangle {
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
        this.xV = 0;
        this.yV = 0;
        this.defaultXSpeed = 300;
        this.friction = 10000;
        this.score = 0;
        this.conceded = false;
        this.type = 'Shooter';
        this.wentOut;
        this.shoot;
        this.sprite = sprite;
    }
    Update() {
        if (this.enabled)
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
    Explode() {
        this.enabled = false;
        this.onExplode(this);
    }
}
export class Alien extends Rectangle {
    constructor(config) {
        super();
        this._x = 0;
        this.y = 100;
        this.width = 24;
        this.height = 24;
        this.top = 0;
        this.bottom = 24;
        this.left = 0;
        this.right = 24;
        this.xV = 0;
        this.yV = 0;
        this.conceded = false;
        this.type = 'Alien';
        this.race = 'Squid';
        this.wentOut;
        this.shoot;
        this.race = '';
        this.dispatcher = null;
        this.index = -1;
        this.grid;
        this.point = 0;
        this.Shoot;
        this.Damage2Shield = 1;
        this.onExplode = () => {};

        if (typeof config !== 'undefined') {
            if (typeof config.type !== 'undefined') this.type = config.type;
            if (typeof config.race !== 'undefined') this.race = config.race;
            if (typeof config.dispatcher !== 'undefined') this.dispatcher = config.dispatcher;
            if (typeof config.x !== 'undefined') this._x = config.x;
            if (typeof config.y !== 'undefined') this.y = config.y;
            if (typeof config.xV !== 'undefined') this.xV = config.xV;
            if (typeof config.yV !== 'undefined') this.yV = config.yV;
            if (typeof config.width !== 'undefined') this.width = config.width;
            if (typeof config.height !== 'undefined') this.height = config.height;
            if (typeof config.sprite !== 'undefined') this.sprite = config.sprite;
            if (typeof config.frameCount !== 'undefined') this.frameCount = config.frameCount;
            if (typeof config.framePerSec !== 'undefined') this.framePerSec = config.framePerSec;
            if (typeof config.index !== 'undefined') this.index = config.index;
            if (typeof config.grid !== 'undefined') this.grid = config.grid;
            if (typeof config.Shoot !== 'undefined') this.Shoot = config.Shoot;
            if (typeof config.point !== 'undefined') this.point = config.point;
        }
        this.top = this.y;
        this.left = this._x;
        this.right = this._x + this.width;
        this.bottom = this.y + this.height;
    }
    Update(objects) {
        if (this.enabled) {
            this.UpdateLocation();
            this.UpdateSprite();
            this.Check4Collision(objects);
        }
    }
    UpdateLocation() {
        const now = new Date().getTime();
        const tPassed = now - this.lastUpdate;
        this.lastUpdate = now;
        if (!this.paused) {
            this._x = this._x + (this.xV * tPassed) / 1000;
            this.y = this.y + (this.yV * tPassed) / 1000;
            this.top = this.y;
            this.bottom = this.y + this.height;
            this.left = this._x;
            this.right = this._x + this.width;
        }
    }
    Explode() {
        this.enabled = false;
        this.onExplode(this);
    }
    Check4Collision(objects) {
        objects.forEach((destObj) => {
            if (destObj.enabled && destObj.collidable && destObj !== this) {
                if (this.isColid(destObj)) {
                    
                    if (destObj.type === 'ShieldBlock') 
                        for (let d=0; d < destObj.objects.length; d++)
                            destObj.objects[d].collidable = true;
                    if (destObj.type === 'Shooter') {
                        this.Explode();
                        this.dispatcher.dispatchEvent(
                            new CustomEvent('AnAlienKilled', { detail: {
                                alienIndex: this.index,
                                point: this.point
                            }})
                        );
                        destObj.Explode(destObj);
                    } else if (destObj.type === 'ShieldDot') {
                        //destObj.parent.CollisionAt(destObj.row, destObj.col, this.type);
                        destObj.enabled = false;
                    }
                }
            }
        });
    }
    isColid(obj2Check) {
        if (this.x >= obj2Check.x + obj2Check.width || this.x + this.width <= obj2Check.x || this.y >= obj2Check.y + obj2Check.height || this.y + this.height <= obj2Check.y)
            return false;
        return true;
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
        this.y = y;
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
        this.Damage2Shield = 2;
    }
    Update(objects) {
        if (this.enabled) {
            this.UpdateLocation();
            this.Check4Collision(objects);
        }
    }
    UpdateLocation() {
        if (this.enabled) {
            let now = new Date().getTime();
            let tPassed = now - this.lastUpdate;
            this.lastUpdate = now;
            if (!this.paused) {
                this.y = this.y + (this.yV * tPassed) / 1000;
                this.top = this.y;
                this.bottom = this.y + this.height;
            }
        }
    }
    Check4Collision(objects){
        objects.every((destObj, aaa, bbb, cccc) => {
            if (destObj.enabled && destObj.collidable && destObj !== this) {
                if (this.isColid(destObj)) {
                    if (destObj.type === 'ShieldBlock') 
                        for (let d=0; d < destObj.objects.length; d++)
                            destObj.objects[d].collidable = true;
                    if (destObj.type === 'Alien') {
                        this.enabled = false;  
                        this.yV = 0;
                        destObj.Explode();
                        destObj.dispatcher.dispatchEvent(
                            new CustomEvent('AnAlienKilled', { detail: {
                                alienIndex: destObj.index,
                                point: destObj.point
                            }})
                        );
                    } else if (destObj.type === 'ShieldDot') {
                        this.enabled = false;
                        this.yV = 0;
                        destObj.parent.CollisionAt(destObj.row, destObj.col, this.type);
                        return false;
                    } else if (destObj.type === 'AlienShoot') {
                        this.enabled = false;
                        this.yV = 0;
                        destObj.Explode(this.top, ExplosionType.Round);
                    } else if (destObj.type === 'Spaceship') {
                        this.enabled = false;
                        this.yV = 0;
                        destObj.Explode(this.top, ExplosionType.Round);
                    }
                }
            }
            return true;
        }, this);
    }
    isColid(obj2Check) {
        if (this.x >= obj2Check.x + obj2Check.width || this.x + this.width <= obj2Check.x || this.y >= obj2Check.y + obj2Check.height || this.y + this.height <= obj2Check.y)
            return false;
        return true;
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
        this.type = 'TopExplosion';
        this.enabled = false;
        this.sprite = sprite;
        this.frameCount = 2;
        this.framePerSec = 20;
        this.repeat = 1;
        this.collidable = false;
    }
    Update() {
        this.UpdateSprite();
    }
}
export class AlienGrid extends Rectangle {
        constructor(rows, cols) {
        super();
        this.movable = false;
        this.collidable = false;
        this.type = 'AlienGrid';
        this.lastTry2Shoot = new Date().getTime();
        this.shootInterval = 1000;
        
        this.rows = rows;
        this.cols = cols;
        this.aliens = [];
        this.Reset();
    }
    Reset() {
        this.shootInterval = 1000;
        this.lastTry2Shoot = new Date().getTime();
        for (let c = 0; c < this.cols; c++)
            for (let r = 0; r < this.rows; r++)
                this.aliens[c * this.rows + r] = 1;
    }
    CanFire(alien) {
        let result = true;
        if (alien.enabled) {
            const alienIndex = alien.index;
            let aRow = parseInt(alienIndex / this.cols);
            if (aRow < this.rows - 1) {
                let aCol = alienIndex % this.cols;
                for (let r = aRow + 1; r < this.rows; r++) {
                    if (this.aliens[r * this.cols + aCol] > 0) {
                        result = false;
                        break;
                    }
                }
            }
        } else
            result = false;
        return result;
    }
    SetAlienKilled(alienIndex) {
        this.aliens[alienIndex] = 0;
    }
    Update() {
        if (this.enabled) {
            const now = new Date().getTime();
            const tPassed = now - this.lastTry2Shoot;
            if (this.paused)
                this.lastTry2Shoot = now;
            else {
                if (tPassed > this.shootInterval) {
                    this.lastTry2Shoot = now;
                    const canFireList = [];
                    this.objects.forEach((alien, index) => {
                        if (this.CanFire(alien))
                            canFireList.push(index);
                    });
                    if (canFireList.length > 0) {
                        const selectedAlienIndex2Fire = canFireList[Math.floor(canFireList.length * Math.random())];
                        this.objects[selectedAlienIndex2Fire].Shoot(this.objects[selectedAlienIndex2Fire]);
                    }
                }
            }
        }
    }
}
export class AlienShoot extends Rectangle {
    constructor(x, y, model, sprite) {
        super();
        this.x = x;
        this.y = y;
        this.width = 9;
        this.height = 21;
        this.top = y;
        this.bottom = y + this.height;
        this.left = x;
        this.right = x + this.width;
        this.yV = 250;
        this.type = 'AlienShoot';
        this.model = model;
        this.sprite = sprite;
        this.frameCount = 2;
        this.framePerSec = 12;
        this.repeat = 0;
        this.onExplode = () => {};
    }
    Update(objects) {
        if (this.enabled) {
            this.UpdateLocation();
            this.UpdateSprite();
            this.Check4Collision(objects);
        }
    }
    UpdateLocation() {
        if (this.enabled) {
            let now = new Date().getTime();
            let tPassed = now - this.lastUpdate;
            this.lastUpdate = now;
            if (!this.paused) {
                this.y = this.y + (this.yV * tPassed) / 1000;
                this.top = this.y;
                this.bottom = this.y + this.height;
            }
        }
    }
    Check4Collision(objects){
        objects.every((destObj) => {
            if (destObj.enabled && destObj.collidable && destObj !== this) {
                if (this.isColid(destObj)) {
                    if (destObj.type === 'ShieldBlock')
                        for (let d = 0; d < destObj.objects.length; d++)
                            destObj.objects[d].collidable = true;

                    if (destObj.type === 'Shooter') {
                        this.enabled = false;
						this.Garbage = true;
                        destObj.Explode();
                        return false;
                    } else if (destObj.type === 'ShieldDot') {
                        this.enabled = false;
                        this.yV = 0;
                        destObj.parent.CollisionAt(destObj.row, destObj.col, this.type, this.model);
                        return false;
                    }
                }
            }
            return true;
        }, this);
    }
    isColid(obj2Check) {
        if (this.x >= obj2Check.x + obj2Check.width || this.x + this.width <= obj2Check.x || this.y >= obj2Check.y + obj2Check.height || this.y + this.height <= obj2Check.y)
            return false;
        return true;
    }
    Explode(impactTop, explosionType) {
        this.yV = 0;
        this.enabled = false;
        this.onExplode(this, impactTop, explosionType);
        this.Garbage = true;
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
        this.type = 'Explosion';
        this.enabled = true;
        this.sprite = sprite;
        this.frameCount = 2;
        this.framePerSec = 20;
        this.repeat = 1;
        this.collidable = false;
    }
    Update() {
        this.UpdateSprite();
    }
}
export class AlienExplosion extends Rectangle {
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
        this.type = 'AlienExplosion';
        this.enabled = true;
        this.sprite = sprite;
        this.collidable = false;
    }
    Update() {
        this.UpdateLocation();
        this.UpdateSprite();
    }
    UpdateLocation() {
        const now = new Date().getTime();
        const tPassed = now - this.lastUpdate;
        this.lastUpdate = now;
        if (!this.paused) {
            this.x = this.x + (this.xV * tPassed) / 1000;
            this.left = this.x;
            this.right = this.x + this.width;
        }
    }
}

export class Shield extends Rectangle {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 48;
        this.top = 0;
        this.bottom = 48;
        this.left = 0;
        this.right = 60;
        this.type = 'Shield';
        this.movable = false;
 
        this.top = this.y;
        this.left = this.x;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
    }
    CollisionAt(blockRow, blockCol, dotRow, dotCol, hitBy, alienShootModel) {
        //console.log('Shield: ' + hitBy)
        this.objects.forEach((shieldBlck, index) => {
            shieldBlck.collidable = false;
            shieldBlck.objects.forEach((dot, index) => {
                dot.collidable = false;
            });
        });

        let row = blockRow * 4 + dotRow;
        let col = blockCol * 4 + dotCol;

        if (hitBy === 'Alian') {
            //this.TurnoffDotAt(row, col);
        } else if (hitBy === 'LaserShoot') {
            for (let r = 15; r > row; r--) { //Find first collision point (laser fast movement)
                let blockIndex = 5 * parseInt(r / 4) + parseInt(col / 4);
                let shieldBlock = this.objects[blockIndex];
                let index = (r % 4) * 4 + (col % 4)
                if (shieldBlock.objects[index].enabled) {
                    row = r;
                    break;
                }
            }                
            this.TurnoffDotAt(row, col);
            if (Math.random() > 0.5)
                this.TurnoffDotAt(row, col + 1);
            if (Math.random() > 0.5)
                this.TurnoffDotAt(row, col - 1);
        } else if (hitBy === 'AlienShoot') {
            if (alienShootModel > 1) {
                for (let r = row; r <= row + 6; r++){
                    this.TurnoffDotAt(r, col);
                    this.TurnoffDotAt(r, col + (Math.random() > 0.5 ? 1 : -1));
                }
                row += 6;
            }
            for (let r = row - 1; r <= row + 1; r++)
                for (let c = col - 1; c <= col + 1; c++)
                    this.TurnoffDotAt(r, c);

            for (let r = row - 2; r <= row + 2; r++)
                for (let c = col - 2; c <= col + 2; c++)
                    if (r < row - 1 || r > row + 1 || c < col - 1 || c > col + 1)
                        if (Math.random() > 0.3)
                            this.TurnoffDotAt(r, c);
        
            for (let r = row - 3; r <= row + 3; r++)
                for (let c = col - 3; c <= col + 3; c++)
                    if (r < row - 2 || r > row + 2 || c < col - 2 || c > col + 2)
                        if (Math.random() > 0.3)
                            this.TurnoffDotAt(r, c);
        }
        this.objects.forEach(shieldBlock => {
            shieldBlock.collidable = true;
        });
    }
    TurnoffDotAt(r, c) {
        if (r >= 0 && r < 16 && c >= 0 && c < 20) {
            let blockIndex = 5 * parseInt(r / 4) + parseInt(c / 4);
            let shieldBlock = this.objects[blockIndex];
            let index = (r % 4) * 4 + (c % 4)
            shieldBlock.objects[index].enabled = false;
        }
        this.onAddExplosionFragment(this.x + c * 3, this.y + r * 3);

    }
    AddExplosionFragment(x, y) {
    }
}

export class ShieldBlock extends Rectangle {
    constructor(x, y, parent, row, col) {
        super();
        this.x = x;
        this.y = y;
        this.width = 12;
        this.height = 12;
        this.top = 0;
        this.bottom = 24;
        this.left = 0;
        this.right = 24;
        this.type = 'ShieldBlock';
        this.movable = false;
        this.parent = parent;
        this.row = row;
        this.col = col;
 
        this.top = this.y;
        this.left = this.x;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
    }
    CollisionAt(row, col, hitBy, model) {
        this.parent.CollisionAt(this.row, this.col, row, col, hitBy, model);
    };
}
export class ShieldDot extends Rectangle {
    constructor(x, y, color, parent, row, col) {
        super();
        this.x = x;
        this.y = y;
        this.width = 3;
        this.height = 3;
        this.top = 0;
        this.bottom = 3;
        this.left = 0;
        this.right = 3;
        this.type = 'ShieldDot';
        this.movable = false;
        this.color = color;
        this.parent = parent;
        this.row = row;
        this.col = col;
        this.collidable = false;
        this.animate = false;
 
        this.top = this.y;
        this.left = this.x;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
    }
}
export class ShooterExplosion extends Rectangle {
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
        this.type = 'ShooterExplosion';
        this.enabled = false;
        this.animate = false;
        this.sprite = sprite;
        this.frameCount = 2;
        this.framePerSec = 20;
        this.repeat = 5;
        this.collidable = false;
    }
    Update() {
        this.UpdateSprite();
    }
}
export class Spaceship extends Rectangle {
    constructor(x, y, w, h, xV, maxXMovement, sprite) {
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
        this.type = 'Spaceship';
        this.animate = false;
        this.sprite = sprite;
        this.frameCount = 1;
        this.collidable = true;
        this.NextAppearance = 0;
        this.maxXMovement = maxXMovement;
        this.speed = xV;
        this.dir = -1;
        this.enabled = false;
        this.point = 50;
    }
    Update() {
        if (this.enabled) {
            this.UpdateLocation();
            //this.UpdateSprite();
        }
        this.UpdateReappear();
    }
    UpdateLocation() {
        let now = new Date().getTime();
        let tPassed = now - this.lastUpdate;
        this.lastUpdate = now;
        if (!this.paused) {
            this.x = this.x + (this.xV * tPassed) / 1000;
            this.left = this.x;
            this.right = this.x + this.width;
            if (this.x < - this.width -1 || this.x > this.maxXMovement + 1)
                this.ResetToReappear();
        }
    }
    Explode(impactTop, explosionType) {
        this.ResetToReappear();
        this.onExplode(this, impactTop);
    }
    ResetToReappear() {
        this.enabled = false;
        this.xV = 0;
        this.collidable = false;
        this.point = 50 * Math.floor(1 + Math.random() * 4);
        this.NextAppearance = new Date().getTime() + 5000 + Math.random() * 5000;
    }
    UpdateReappear() {
        if (!this.enabled) {
            let now = new Date().getTime();
            if (this.NextAppearance < now) {
                let now = new Date().getTime();
                this.lastUpdate = now;
                this.collidable = true;
                this.dir = Math.random() > 0.5 ? 1 : -1;
                if (this.dir > 0)
                    this.x = - this.width;
                else
                    this.x = this.maxXMovement;
                this.left = this.x;
                this.right = this.x + this.width;
                this.xV = this.dir * this.speed;
                this.enabled = true;
            }
        }
    }
}
export class SpaceshipExplosion extends Rectangle {
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
        this.type = 'SpaceshipExplosion';
        this.animate = false;
        this.sprite = sprite;
        this.frameCount = 1;
        this.collidable = false;
    }
    Update() {
        this.UpdateSprite();
    }
}
export class ExplosionFragment extends Rectangle {
    constructor(x, y, color) {
        super();
        this.x = x;
        this.y = y;
        this.width = 3;
        this.height = 3;
        this.top = y;
        this.bottom = y + this.height;
        this.left = x;
        this.right = x + this.width;
        this.type = 'ExplosionFragment';
        this.animate = false;
        this.collidable = false;
        this.color = color;
    }
}
