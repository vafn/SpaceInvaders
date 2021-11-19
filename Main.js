import { PlayerAI } from './AI.js';
import { Game, World, Wall, Player, Ball, Text, Shooter, Alian, LaserShoot, TopExplosion, AlianGrid, AlianShoot,Explosion } from './Game.js';
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
let p1Score = null;
let p2Score = null;
let gamePaused = false;
const alians = [];
const evtDispatcher = new EventTarget();
let docWidth = 0;
let docHeight = 0;
let waveNo = 0;
const firstWaveY = 164;
const waveStartX = 62;
const waveAdvance = 25;
var images = new Image();
const sprites = {
	squid: { x: 22, y: 1, sWidth: 8, sHeight: 8, dWidth: 24, dHeight: 24, frames: [0, 1], spriteSheet: images },
	crab: { x: 31, y: 1, sWidth: 11, sHeight: 8, dWidth: 33, dHeight: 24, frames: [0, 1], spriteSheet: images },
	octopus: { x: 43, y: 1, sWidth: 12, sHeight: 8, dWidth: 36, dHeight: 24, frames: [0, 1], spriteSheet: images },
	shooter: { x: 1, y: 1, sWidth: 13, sHeight: 8, dWidth: 39, dHeight: 24, frames: [0], spriteSheet: images },
	topExplosion: { x: 73, y: 1, sWidth: 8, sHeight: 8, dWidth: 22, dHeight: 22, frames: [0, 1], spriteSheet: images },
	explosion: { x: 73, y: 1, sWidth: 8, sHeight: 8, dWidth: 22, dHeight: 22, frames: [0, 1], spriteSheet: images }
}
const worlConfig = {
	world: { width: 669, height: 727 },
	shooter: { width: 39, height: 24, color: 'red' },
	laserShoot: { width: 1, height: 25, color: 'white' },
	alianShoot: { width: 3, height: 25, color: 'yellow' }
};
let liveAlians = 0;
let alianGrid = new AlianGrid(5, 11);

images.onload = () => {
	///
}
images.src = 'Sprites.png';

window.addEventListener('load', () => OnLoad());

document.addEventListener('visibilitychange', (event) => {
    if (document.hidden)
		PauseGame(0);
    else
		PlayGame(0);
});

function OnLoad() {
	/*
	console.clear();
	console.log('OnLoad' + (new Date()))
	console.log('%c Code Started', 'color:red;font-size:18px;')
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
	wallBottom = new Wall(world.left, 694, world.width, 3, 'white', true);
	shooter = new Shooter(world.left + (world.width - c.shooter.width) / 2, 629, c.shooter.width, c.shooter.height, 0, 0, c.shooter.color, 'right', sprites.shooter);
	laserShoot = new LaserShoot(0, 0, c.laserShoot.width, c.laserShoot.height, c.laserShoot.color);
	topExplosion = new TopExplosion(0, 83, 22, 26, sprites.topExplosion);
	p1Score = new Text(world.left + world.width * 1 / 4, 0, '0', 'white', true, 24, 'Arial', true);
	p2Score = new Text(world.left + world.width * 3 / 4, 0, '0', 'white', true, 24, 'Arial', true);

	world.dispatcher = evtDispatcher;

	let alianConfig = {
		index: 0,
		type: 'Alian',
		race: 'Squid',
		x: waveStartX + (32 - 22) / 2,
		y: firstWaveY,
		width: 24,
		height: 24,
		xV: 7.5,
		yV: 0,
		color: 'yellow',
		dispatcher: evtDispatcher,
		sprite: sprites.squid,
		frameCount: 2,
		framePerSec: 1.3,
		grid: alianGrid,
		Shoot: (alian) => {
			const aShoot = new AlianShoot(alian.left + (alian.width / 2) - c.alianShoot.width / 2, alian.y + alian.height, c.alianShoot.width, c.alianShoot.height, c.alianShoot.color);
			aShoot.onExplode = (ashoot) => {
				const explosion = new Explosion(ashoot.left + ashoot.width / 2 - 22 / 2, ashoot.bottom - 26 / 2 , 22, 26, sprites.topExplosion);
				explosion.lastFrameChangedTime = new Date().getTime();
				explosion.frameIndex = 0;
				explosion.animate = true;
					explosion.animateEnded = () => {
					setTimeout(() => {
						explosion.enabled = false;
					}, 100);
				};
				world.objects.push(explosion);
			}
			world.objects.push(aShoot);
			//console.log(alian)
			//PauseGame(2);
		}
	};
	CreateAlians(alianConfig);

	topExplosion.animateEnded = () => {
		setTimeout(() => {
			topExplosion.enabled = false;
		}, 100);
	};

	world.objects.push(wallBottom);
	world.objects.push(shooter);
	world.objects.push(laserShoot);
	world.objects.push(topExplosion);
	world.objects.push(p1Score);
	world.objects.push(p2Score);
	game.objects.push(world);
}
function CreateAlians(config) {

	//console.log(config)

	AddAlianRow(config);
	config.x = waveStartX;
	config.race = 'Crab';
	config.sprite = sprites.crab;
	config.width = 32;
	config.y += 48;
	AddAlianRow(config);
	config.y += 48;
	AddAlianRow(config);
	config.race = 'Octopus';
	config.sprite = sprites.octopus;
	config.width = 36;
	config.y += 48;
	AddAlianRow(config);
	config.y += 48;
	AddAlianRow(config);
	liveAlians = alians.length;
}
function AddAlianRow(config) {
	let xBak = config.x;
	for (let index = 0; index < 11; index++) {
		const alian = new Alian(config);
		world.objects.push(alian);
		alians.push(alian);
		config.x += 36 + 12;
		config.index++;
	}
	config.x = xBak;
}
function SendNextAliansWave() {
	waveNo++;
	let now = new Date().getTime();
	//laserShoot.lastUpdate = new Date().getTime();
	for (let row = 0; row < 5; row++)
		for (let col = 0; col < 11; col++) {
			let alian = alians[row * 11 + col];
			alian.y = firstWaveY + waveAdvance * (waveNo - 1) + row * 47;
			alian.x = col * (32 + 6);
			alian.xV = 50;
			alian.lastUpdate = now;
			alian.enabled = true;
		}
	liveAlians = alians.length;
}
function AddEvents() {
	window.addEventListener('resize', () => Resize(canvas, world));
	evtDispatcher.addEventListener('AnAlianKilled', (event) => {
		alianGrid.SetAlianKilled(event.detail.alianIndex)
		const speed = --liveAlians > 0 ? Math.sign(alians[0].xV) * (0.8 + 378 / liveAlians ** 1.01) : 0;
		alians.forEach(alian => alian.xV = speed);
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
function ShowScores() {
	p1Score.text = player1.score;
	p2Score.text = player2.score;
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
		laserShoot.yV = -1200;
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
		if (controller.isPressed('ArrowRight'))
			shooter.moveRight();
		if (controller.isPressed('ArrowLeft'))
			shooter.moveLeft();
		if (controller.isPressed('ArrowUp'))
			shooter.y -= 4;
		if (controller.isPressed('ArrowDown'))
			shooter.y += 4;
		if (controller.isPressed(' '))
			ShootLaser();
	}

	game.Update();


	if (!gamePaused) {

		if (!alians.some(gObj => gObj.enabled))
			SendNextAliansWave();

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
				alian.y += alian.height * 0.2;
				if (distToRight < 0)
					alian.x += distToRight;
				else if (distToLeft < 0)
					alian.x -= distToLeft;
			})
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
			//topExplosion.y = laserShoot.y - topExplosion.height / 2;
			//topExplosion.y = 83;
			laserShoot.enabled = false;
			laserShoot.y = shooter.y - laserShoot.height;
		}
	}

	display.clear();

	world.color = 'green'
	p1Score.text = world.x;
	display.drawBox(world);

	world.objects.forEach(gObj => {
		if (gObj.enabled) {
			if (gObj instanceof Wall)
				display.drawBox(gObj);
			else if (gObj instanceof Ball && gObj.visible)
				display.drawDisk(gObj);
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
		}
	});

	world.objects.forEach((gObj, index) => {
        if (gObj instanceof AlianShoot) {
			if (!gObj.enabled)
				world.objects.splice(index, 1);
			else if (gObj.bottom > wallBottom.y)
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
//558
//545	487
