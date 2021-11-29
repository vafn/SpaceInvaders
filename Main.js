import { Game, World, Wall, Text, Shooter, Alian, LaserShoot, TopExplosion, AlianGrid, AlianShoot,Explosion, AlianExplosion, Shield, ShieldBlock, ShieldDot, ShooterExplosion } from './Game.js';
import { Display } from './Display.js';
import { Controller } from './Controller.js';

let canvas;
const game = new Game();
const controller = new Controller();
let display = null;
let world = null;
let wallBottom = null;
let shooter = null;
let laserShoot = null;
let topExplosion = null;
let shooterExplosion = null;
let p1Score = null;
let gamePaused = false;
const alians = [];
const evtDispatcher = new EventTarget();
let docWidth = 0;
let docHeight = 0;
let waveNo = 1;
const firstWaveY = 164;
const waveStartX = 92;
const waveAdvance = 72;
const alianDefalutXV = 10;
var images = new Image();
const sprites = {
	squid: { x: 22, y: 1, sWidth: 8, sHeight: 8, dWidth: 24, dHeight: 24, frames: [0, 1], spriteSheet: images },
	crab: { x: 31, y: 1, sWidth: 11, sHeight: 8, dWidth: 33, dHeight: 24, frames: [0, 1], spriteSheet: images },
	octopus: { x: 43, y: 1, sWidth: 12, sHeight: 8, dWidth: 36, dHeight: 24, frames: [0, 1], spriteSheet: images },
	shooter: { x: 1, y: 1, sWidth: 13, sHeight: 8, dWidth: 39, dHeight: 24, frames: [0], spriteSheet: images },
	topExplosion: { x: 73, y: 1, sWidth: 8, sHeight: 8, dWidth: 24, dHeight: 24, frames: [0, 1], spriteSheet: images },
	explosion: { x: 82, y: 1, sWidth: 8, sHeight: 8, dWidth: 24, dHeight: 24, frames: [0, 1], spriteSheet: images },
	alianExplosion: { x: 91, y: 1, sWidth: 13, sHeight: 8, dWidth: 39, dHeight: 24, frames: [0], spriteSheet: images },
	shooterExplosion: { x: 105, y: 1, sWidth: 16, sHeight: 8, dWidth: 48, dHeight: 24, frames: [0, 1], spriteSheet: images }
}
const worlConfig = {
	world: { width: 669, height: 727 },
	shooter: { width: 39, height: 24 },
	laserShoot: { width: 3, height: 24, color: 'white' },
	alianShoot: { width: 3, height: 24, color: 'white' }
};
let liveAlians = 0;
let alianGrid = new AlianGrid(5, 11);
let lives = 3;
let points = 0;
let shooters = [];

images.onload = () => {
	///
}
images.src = 'Sprites.png';

window.addEventListener('load', () => OnLoad());

document.addEventListener('visibilitychange', (event) => {
    if (document.hidden)
		PauseGame(0);
    //else
		//PlayGame(0);
});

function OnLoad() {
	/*
	console.clear();
	console.log('OnLoad' + (new Date()))
	//console.log('%cSpace Invaders %c\nBy Vahid A.', 'color:red;font-size:18px;', 'color:green;font-size:14px;')
	console.trace('Blah Blah')
	// monitor in chrome console
	// breakpoint on attribute
	//debug
	*/

	canvas = document.createElement('canvas');
	document.body.insertBefore(canvas, document.body.firstChild);
	BuildRAFPolyfill();
	CreateWorld(worlConfig);
	display = new Display(canvas, world);
	Resize(canvas, world);
	AddEvents();
	controller.setup(window);
	Render();
}
function CreateWorld(c) {
	world = new World(0, 0, c.world.width, c.world.height);
	wallBottom = new Wall(world.left, 694, world.width, 3, '#00B098', true);
	shooter = new Shooter(world.left + (world.width - c.shooter.width) / 2, 629, c.shooter.width, c.shooter.height, sprites.shooter);
	laserShoot = new LaserShoot(0, 0, c.laserShoot.width, c.laserShoot.height, 'white');
	topExplosion = new TopExplosion(0, 83, 22, 26, sprites.topExplosion);
	shooterExplosion = new ShooterExplosion(world.left + (world.width - c.shooter.width) / 2, 629, 48, 24, sprites.shooterExplosion);
	p1Score = new Text(world.left + world.width * 1 / 4, 0, '0', 'white', true, 24, 'Arial', true);

	shooter.Explode =  (shooter) => {
        shooter.enabled = false;
		shooterExplosion.x = shooter.x + (shooter.width - shooterExplosion.width) /2;
		shooterExplosion.y = shooter.y;
		shooterExplosion.lastFrameChangedTime = new Date().getTime();
		shooterExplosion.frameIndex = 0;
		shooterExplosion.animate = true;
		shooterExplosion.animateEnded = () => {
			shooterExplosion.enabled = false;
			shooter.x = 0;
			shooter.y = 629;
			shooter.enabled = true;
			controller.ClearBuffer();

			lives--;
			if (lives > 0)
				shooters.forEach((shooter, index) => shooter.enabled = index < lives - 1 );
			else
				alert('Game Over!');

		};
		shooterExplosion.enabled = true;
	}

	for (let sIndex = 0; sIndex < lives - 1; sIndex++) {
		shooters[sIndex] = new Shooter(world.left + sIndex * (c.shooter.width + 5), world.bottom - c.shooter.height - 2, c.shooter.width, c.shooter.height, sprites.shooter);
		world.objects.push(shooters[sIndex]);
	}
	
	world.dispatcher = evtDispatcher;

	let alianConfig = {
		index: 0,
		type: 'Alian',
		race: 'Squid',
		x: waveStartX + (32 - 22) / 2,
		y: firstWaveY,
		width: 24,
		height: 24,
		xV: alianDefalutXV,
		yV: 0,
		dispatcher: evtDispatcher,
		sprite: sprites.squid,
		frameCount: 2,
		framePerSec: 1.3,
		grid: alianGrid,
		point: 30,
		Shoot: (alian) => {
			const aShoot = new AlianShoot(alian.left + (alian.width / 2) - c.alianShoot.width / 2, alian.y + alian.height, c.alianShoot.width, c.alianShoot.height, c.alianShoot.color);
			aShoot.onExplode = (ashoot) => {
				const explosion = new Explosion(ashoot.left + ashoot.width / 2 - 22 / 2, wallBottom.y - 23, 24, 24, sprites.explosion);
				explosion.lastFrameChangedTime = new Date().getTime();
				explosion.frameIndex = 0;
				explosion.animate = true;
					explosion.animateEnded = () => {
					setTimeout(() => {
						explosion.enabled = false;
						explosion.Garbage = true;
					}, 100);
				};
				world.objects.push(explosion);
			}
			world.objects.push(aShoot);
			//PauseGame(2);
		}
	};
	CreateAlians(alianConfig);
	alianGrid.objects = alians;

	topExplosion.animateEnded = () => {
		setTimeout(() => {
			topExplosion.enabled = false;
		}, 100);
	};
	shooterExplosion.animateEnded = () => {
		setTimeout(() => {
			//shooterExplosion.enabled = false;
		}, 100);
	};

	let blankDots = [];
    for (let i = 0; i < 20; i++) blankDots[i] = [];
	blankDots[0] = [0, 1, 2, 3, 4, 5, 6, 8, 9, 12];
	blankDots[4] = [0, 1, 2, 3, 5, 6, 7, 10, 11, 15];
	blankDots[16] = [3,6,7,9,10,11,13,14,15];
	blankDots[17] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
	blankDots[18] = [0,4,5,8,9,10,12,13,14];
	let shields = [];
	let shieldX = 114;
	let shieldY = 550;
	for (let shieldNo = 0; shieldNo <= 3; shieldNo++) {
		shields[shieldNo] = new Shield(shieldX, shieldY);
		let blockIndex = 0;
		for (let r = 0; r <= 3; r++) {
			for (let c = 0; c <= 4; c++) {
				const shieldBlockX = shieldX + c * 12;
				const shieldBlockY = shieldY + r * 12;
				const shieldBlock = new ShieldBlock(shieldBlockX, shieldBlockY, shields[shieldNo], r, c);
				shields[shieldNo].objects[blockIndex++] = shieldBlock;
				world.objects.push(shieldBlock);

				let dotIndex = 0;
				for (let r = 0; r < 4; r++) {
					for (let c = 0; c < 4; c++) {
						const dotX = shieldBlockX + c * 3;
						const dotY = shieldBlockY + r * 3;
						const dot = new ShieldDot(dotX, dotY, '#00B098', shieldBlock, r , c);
						shieldBlock.objects[dotIndex++] = dot;
						world.objects.push(dot);
					}
				}
				blankDots[blockIndex - 1].forEach((dotIndex)=>{
					shieldBlock.objects[dotIndex].enabled = false;
				});
			}
		}
		shieldX += 60 +  67;
	}

	world.objects.push(alianGrid);
	world.objects.push(wallBottom);
	world.objects.push(shooter);
	world.objects.push(laserShoot);
	world.objects.push(topExplosion);
	world.objects.push(shooterExplosion);
	world.objects.push(p1Score);
	game.objects.push(world);
}
function CreateAlians(config) {
	AddAlianRow(config);
	config.x = waveStartX;
	config.race = 'Crab';
	config.sprite = sprites.crab;
	config.width = 32;
	config.y += 48;
	config.point = 20;
	AddAlianRow(config);
	config.y += 48;
	AddAlianRow(config);
	config.race = 'Octopus';
	config.sprite = sprites.octopus;
	config.width = 36;
	config.y += 48;
	config.point = 10;
	AddAlianRow(config);
	config.y += 48;
	AddAlianRow(config);
	liveAlians = alians.length;
}
function AddAlianRow(config) {
	let xBak = config.x;
	for (let index = 0; index < 11; index++) {
		const alian = new Alian(config);
		alian.onExplode = (alian) => {
			const x = alian.left + alian.width / 2 - 39 / 2;
			const y = alian.top + alian.height / 2 - 24 / 2;
			const alianExplosion = new AlianExplosion(x, y, 39, 24, sprites.alianExplosion);
			alianExplosion.animate = false;
			alianExplosion.xV = alian.xV;
			setTimeout(() => {
				alianExplosion.enabled = false
				alianExplosion.Garbage = true;
			}, 200);
			world.objects.push(alianExplosion);
		}
		world.objects.push(alian);
		alians.push(alian);
		config.x += 36 + 9;
		config.index++;
	}
	config.x = xBak;
}
function SendNextAliansWave() {
	waveNo++;
	console.log(waveNo, firstWaveY + waveAdvance * (waveNo - 1));
	let now = new Date().getTime();
	for (let row = 0; row < 5; row++)
		for (let col = 0; col < 11; col++) {
			let alian = alians[row * 11 + col];
			alian.framePerSec = 1.3;
			alian.y = firstWaveY + waveAdvance * (waveNo - 1) + row * 48;
			alian.x = col * (36 + 12);
			alian.xV = alianDefalutXV;
			alian.lastUpdate = now;
			alian.enabled = true;
		}
	liveAlians = alians.length;
	alianGrid.Reset();
}
function AddEvents() {
	window.addEventListener('resize', () => Resize(canvas, world));
	evtDispatcher.addEventListener('AnAlianKilled', (event) => {
		const pBak = parseInt(points / 1000);
		points += event.detail.point;
		if (parseInt(points / 1000) !== pBak)
			IncreaseLive();
		UpdateScore();
		alianGrid.SetAlianKilled(event.detail.alianIndex);
		const speed = --liveAlians > 0 ? Math.sign(alians[0].xV) * (0.8 + 450 / liveAlians ** 0.9705) : 0;
		alians.forEach((alian) => {
			alian.xV = speed;
			alian.framePerSec *= 1.05;
		});
		alianGrid.shootInterval = 1000 - 500 * (55 - liveAlians) / 54;
	});
}
function Resize(canvas, world) {
	docWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	docHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	const ratio = world.height / world.width;
	if (docHeight / docWidth > ratio) {
		canvas.height = docWidth * ratio;
		canvas.width = docWidth;
	} else {
		canvas.height = docHeight;
		canvas.width = docHeight / ratio;
	}
}
function UpdateScore() {
	p1Score.text = points;
}
function BuildRAFPolyfill() {
	window.requestAnimationFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (cb, elt) {
			window.setTimeout(function () {
				cb(+new Date());
			}, 1000 / 60);
		};
}
function ShootLaser() {
	if (!laserShoot.enabled) {
		laserShoot.lastUpdate = new Date().getTime();
		laserShoot.enabled = true;
		laserShoot.x = shooter.left + shooter.width / 2 - laserShoot.width / 2;
		laserShoot.y = shooter.y - laserShoot.height;
		laserShoot.yV = -1000;

		world.objects.forEach(gObj => {
			if (gObj instanceof ShieldBlock)
				gObj.collidable = true;
			if (gObj instanceof ShieldDot)
				gObj.collidable = false;
		});

	}
}

let pauseEnabled = true;

function Render() {
	//console.time('Render');
	window.requestAnimationFrame(Render);

	if (controller.isPressed('p')) {
		if (pauseEnabled) {
			if (gamePaused)
				PlayGame(1);
			else
				PauseGame(1);

			pauseEnabled = false;
			setTimeout(() => {
				pauseEnabled = true;
			}, 100);
		}
	}

	if (!gamePaused) {
		if (shooter.enabled) {
			if (controller.isPressed('ArrowRight'))
				shooter.moveRight();
			if (controller.isPressed('ArrowLeft'))
				shooter.moveLeft();
			if (controller.isPressed('ArrowUp'))
				shooter.y -= 4;
			if (controller.isPressed('ArrowDown'))
				shooter.y += 4;
		}
		if (controller.isPressed(' '))
			ShootLaser();
	}

	game.Update();

	if (!gamePaused) {

		if (!alians.some(gObj => gObj.enabled)) {
			world.objects.forEach((gObj) => {
				//if (gObj instanceof AlianExplosion)
					//gObj.enabled = false;
			});
			gamePaused = true;
			setTimeout(() => {
				gamePaused = false;
				SendNextAliansWave();	
			}, 800);
			
		}

		let distToRight = 10000;
		let distToLeft = 10000;
		
		alians.forEach(gObj => {
			if (gObj.enabled) {
				if (world.right - gObj.right < distToRight)
					distToRight = world.right - gObj.right;
				if (gObj.left - world.left < distToLeft)
					distToLeft = gObj.left - world.left;
			}
		});

		if (distToLeft < 0 || distToRight < 0) {
			alians.forEach(alian => {
				alian.xV = -alian.xV;
				alian.y += alian.height;
				if (distToRight < 0)
					alian.x += distToRight;
				else if (distToLeft < 0)
					alian.x -= distToLeft;
			});

			world.objects.forEach(gObj => {
				if (gObj.enabled) {
					if (gObj instanceof AlianExplosion){
						gObj.xV = -gObj.xV;
						gObj.y += gObj.height * 0.2;
					}
				}
			});
		
		}

		if (shooter.left < world.left)
			shooter.x = world.x
		else if (shooter.right > world.right)
			shooter.x = world.right - shooter.width

		if (laserShoot.y < 103) {
			if (!topExplosion.enabled) {
				topExplosion.lastFrameChangedTime = new Date().getTime();
				topExplosion.frameIndex = 0;
				topExplosion.enabled = true;
				topExplosion.animate = true;
			}
			topExplosion.x = laserShoot.x - topExplosion.width / 2;
			laserShoot.enabled = false;
			laserShoot.y = shooter.y - laserShoot.height;
		}
	}

	display.clear();

	//world.color = 'green'
	display.drawBox(world);

	world.objects.forEach(gObj => {
		if (gObj.enabled) {
			if (gObj instanceof Wall)
				display.drawBox(gObj);
			else if (gObj instanceof Text)
				display.drawText(gObj);
			else if (gObj instanceof Shooter)
				display.drawSprite(gObj);
			else if (gObj instanceof Alian)
				display.drawSprite(gObj);
			else if (gObj instanceof TopExplosion)
				display.drawSprite(gObj);
			else if (gObj instanceof LaserShoot)
				display.drawBox(gObj);
			else if (gObj instanceof AlianShoot)
				display.drawBox(gObj);
			else if (gObj instanceof Explosion)
				display.drawSprite(gObj);
			else if (gObj instanceof AlianExplosion)
				display.drawSprite(gObj);
			else if (gObj instanceof ShieldDot)
				display.drawBox(gObj);
			else if (gObj instanceof Shield)
				display.drawRectangle(gObj);
			else if (gObj instanceof ShooterExplosion)
				display.drawSprite(gObj);
		}
	});

	world.objects.forEach((gObj, index) => {
        if (gObj.Garbage)
			world.objects.splice(index, 1);
        else if (gObj instanceof AlianShoot) {
			if (gObj.bottom > wallBottom.y)
				gObj.Explode();
        }
    });

	display.render();
	//console.timeEnd('Render');
}
function PauseGame(pa) {
	gamePaused = true;
	world.objects.forEach((gObj, index) => gObj.SetPause(gamePaused));
	console.log('Paused: ' + pa);
}
function PlayGame(pa) {
	gamePaused = false;
	world.objects.forEach((gObj, index) => gObj.SetPause(gamePaused));
	console.log('Resummed: ' + pa);
}
function IncreaseLive() {
	lives++;
	if (shooters.length < lives - 1) {
		const sIndex = shooters.length;
		shooters[sIndex] = new Shooter(world.left + sIndex * (worlConfig.shooter.width + 5), world.bottom - worlConfig.shooter.height - 2, worlConfig.shooter.width, worlConfig.shooter.height, sprites.shooter);
		world.objects.push(shooters[sIndex]);
	}
	shooters.forEach((shooter, index) => shooter.enabled = index < lives - 1 );
}