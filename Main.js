import { Game, World, Wall, Text, Shooter, Alian, LaserShoot, TopExplosion, AlianGrid, AlianShoot, Explosion, AlianExplosion, Shield, ShieldBlock, ShieldDot, ShooterExplosion, Spaceship, SpaceshipExplosion } from './Game.js';
import { Display } from './Display.js';
import { Controller } from './Controller.js';

export const ExplosionType = {Round: 1, FlatBottom: 2};
const green = '#69C42B';	//#00B098
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
const images = new Image();
const sprites = {
	squid: { x: 22, y: 1, sWidth: 8, sHeight: 8, dWidth: 24, dHeight: 24, frames: [0, 1], spriteSheet: images },
	crab: { x: 31, y: 1, sWidth: 11, sHeight: 8, dWidth: 33, dHeight: 24, frames: [0, 1], spriteSheet: images },
	octopus: { x: 43, y: 1, sWidth: 12, sHeight: 8, dWidth: 36, dHeight: 24, frames: [0, 1], spriteSheet: images },
	shooter: { x: 1, y: 1, sWidth: 13, sHeight: 8, dWidth: 39, dHeight: 24, frames: [0], spriteSheet: images },
	greenShooter: { x: 1, y: 10, sWidth: 13, sHeight: 8, dWidth: 39, dHeight: 24, frames: [0], spriteSheet: images },
	topExplosion: { x: 73, y: 1, sWidth: 8, sHeight: 8, dWidth: 24, dHeight: 24, frames: [0, 1], spriteSheet: images },
	explosion: { x: 82, y: 1, sWidth: 8, sHeight: 8, dWidth: 24, dHeight: 24, frames: [0, 1], spriteSheet: images },
	alianExplosion: { x: 91, y: 1, sWidth: 13, sHeight: 8, dWidth: 39, dHeight: 24, frames: [0], spriteSheet: images },
	shooterExplosion: { x: 105, y: 1, sWidth: 16, sHeight: 8, dWidth: 48, dHeight: 24, frames: [0, 1], spriteSheet: images },
	spaceship: { x: 56, y: 1, sWidth: 16, sHeight: 8, dWidth: 48, dHeight: 24, frames: [0], spriteSheet: images },
	spaceshipWhite: { x: 56, y: 10, sWidth: 16, sHeight: 8, dWidth: 48, dHeight: 24, frames: [0], spriteSheet: images },
	spaceshipExplosion: { x: 122, y: 1, sWidth: 21, sHeight: 8, dWidth: 63, dHeight: 24, frames: [0], spriteSheet: images },
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
let livesCountText = null;
let spaceship = null;
let shields = [];
let blankDots = [];
let gameStarted = false;
let highScore = 0;
let press2layBlinkingTimer = 0;
let gameData = { HighScore: 0 } ;

let scoreTitle;
let scoreText;
let hightScoreTitle;
let hightScoreText;

images.onload = () => {
	///
}
images.src = 'Sprites.png';

let background = new Image();
background.src = 'Background.png';

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
	if (localStorage.getItem('gameData') !== null) {
		gameData = JSON.parse(localStorage.getItem('gameData'));
		highScore = gameData.HighScore;
	}
	
	canvas = document.createElement('canvas');
	document.body.insertBefore(canvas, document.body.firstChild);
	BuildRAFPolyfill();
	ShowStartPage(worlConfig);
	display = new Display(canvas, world);
	Resize(canvas, world);
	AddEvents();
	controller.setup(window);
	//PauseGame(-1);
	Run();
}
function ShowStartPage(c) {
	world = new World(0, 0, c.world.width, c.world.height);
	const center = world.left + world.width * 2 / 4;

	const t1 = new Text(world.left + world.width * 1 / 4, 10, 'SCORE', 'white', false, 24, 'Arial', true);
	const t2 = new Text(world.left + world.width * 1 / 4, 40, '0000', 'white', false, 24, 'Arial', true);
	const t3 = new Text(world.left + world.width * 3 / 4, 10, 'HI-SCORE', 'white', false, 24, 'Arial', true);
	const t4 = new Text(world.left + world.width * 3 / 4, 40, highScore.toString().padStart(4, "0"), 'white', false, 24, 'Arial', true);
	const t5 = new Text(center, 200, 'PLAY      ', 'white', false, 24, 'Arial', true);
	const t6 = new Text(center, 260, 'SPACE        INVADERS', 'white', false, 24, 'Arial', true);
	const t7 = new Text(center, 320, '*SCORE ADVANCE TABLE*', 'white', false, 24, 'Arial', true);
	const t8 = new Text(center, 360, '=? MYSTERY', 'white', false, 24, 'Arial', true);
	const t9 = new Text(center, 400, '= 30 POINTS', 'white', false, 24, 'Arial', true);
	const t10 = new Text(center, 440, '= 20 POINTS', 'white', false, 24, 'Arial', true);
	const t11 = new Text(center, 480, '= 10 POINTS', 'white', false, 24, 'Arial', true);
	const t12 = new Text(center, 550, 'PRESS SPACE TO PLAY', 'white', false, 24, 'Arial', true);

	const spaceship = new Spaceship(center - 125, 355, 48, 24, 0, world.width, sprites.spaceshipWhite);
	spaceship.enabled = true;

	let alianConfig = {
		race: 'Squid',
		x: center - 100,
		y: 395,
		width: 24,
		height: 24,
		sprite: sprites.squid,
		frameCount: 1
	};
	const squid = new Alian(alianConfig);

	alianConfig = {
		race: 'Crab',
		x: center - 110,
		y: 435,
		width: 33,
		sprite: sprites.crab,
	};
	const crab = new Alian(alianConfig);

	alianConfig = {
		race: 'Octopus',
		x: center - 115,
		y: 475,
		width: 36,
		sprite: sprites.octopus,
	};
	const octopus = new Alian(alianConfig);
	
	world.objects.push(t1);
	world.objects.push(t2);
	world.objects.push(t3);
	world.objects.push(t4);
	world.objects.push(t5);
	world.objects.push(t6);
	world.objects.push(t7);
	world.objects.push(t8);
	world.objects.push(spaceship);
	world.objects.push(t9);
	world.objects.push(squid);
	world.objects.push(t10);
	world.objects.push(crab);
	world.objects.push(t11);
	world.objects.push(octopus);
	world.objects.push(t12);

	game.objects.push(world);

	press2layBlinkingTimer = setInterval(() => {
		t12.enabled = !t12.enabled;
	}, 700);

}
function StartGame(c) {
	lives = 3;
	points = 0;
	gameStarted = true;
	gamePaused = false;
	world = new World(0, 0, c.world.width, c.world.height);

	scoreTitle = new Text(world.left + world.width * 1 / 4, 10, 'SCORE', 'white', false, 24, 'Arial', true);
	scoreText = new Text(world.left + world.width * 1 / 4, 40, '0000', 'white', false, 24, 'Arial', true);
	hightScoreTitle = new Text(world.left + world.width * 3 / 4, 10, 'HI-SCORE', 'white', false, 24, 'Arial', true);
	hightScoreText = new Text(world.left + world.width * 3 / 4, 40, highScore.toString().padStart(4, "0"), 'white', false, 24, 'Arial', true);

	wallBottom = new Wall(world.left, 694, world.width, 3, green, true);
	shooter = new Shooter(world.left + (world.width - c.shooter.width) / 2, 629, c.shooter.width, c.shooter.height, sprites.shooter);
	laserShoot = new LaserShoot(0, 0, c.laserShoot.width, c.laserShoot.height, 'white');
	topExplosion = new TopExplosion(0, 83, 22, 26, sprites.topExplosion);
	shooterExplosion = new ShooterExplosion(world.left + (world.width - c.shooter.width) / 2, 629, 48, 24, sprites.shooterExplosion);
	//p1Score = new Text(world.left + world.width * 1 / 4, 10, 'SCORE: 0', 'white', true, 24, 'Arial', true);
	livesCountText = new Text(25, world.height - 30, lives, green, true, 32, 'Arial', true);
	spaceship = new Spaceship(0, firstWaveY - 2 * 24, 48, 24, 100, world.width, sprites.spaceship);
	spaceship.onExplode = (ashoot, impactTop) => {
		UpdatePoints(spaceship.point);
		const spaceshipExplosion = new SpaceshipExplosion(spaceship.left + spaceship.width / 2 - sprites.spaceshipExplosion.dWidth / 2, spaceship.top, 24, 24, sprites.spaceshipExplosion);
		world.objects.push( spaceshipExplosion);
		setTimeout(() => {
			spaceshipExplosion.enabled = false;
			spaceshipExplosion.Garbage = true;

			const spaceshipPoints = new Text(spaceship.left + spaceship.width / 2, spaceshipExplosion.top, spaceship.point, 'red', true, 28, 'Arial', true);
			world.objects.push(spaceshipPoints);
			setTimeout(() => {
				spaceshipPoints.enabled = false;
				spaceshipPoints.Garbage = true;
			}, 1000);

		}, 500);
		
	}
	spaceship.ResetToReappear();

	shooter.onExplode =  (shooter) => {
		console.log('shooter.onExplode', lives)
		shooterExplosion.x = shooter.x + (shooter.width - shooterExplosion.width) /2;
		shooterExplosion.y = shooter.y;
		shooterExplosion.lastFrameChangedTime = new Date().getTime();
		shooterExplosion.frameIndex = 0;
		shooterExplosion.animate = true;
		shooterExplosion.onAnimateEnd = () => {
			shooterExplosion.enabled = false;
			if (lives > 0) {
				shooter.x = 0;
				shooter.y = 629;
				shooter.enabled = true;
			}
		};
		shooterExplosion.enabled = true;

		lives--;
		UpdateLivesCountText();
		shooters.forEach((shooter, index) => shooter.enabled = index < lives - 1 );
		if (lives === 0)
			GameOver();
	}
	for (let sIndex = 0; sIndex < lives - 1; sIndex++) {
		shooters[sIndex] = new Shooter(60  + sIndex * (c.shooter.width + 5), world.bottom - c.shooter.height - 2, c.shooter.width, c.shooter.height, sprites.greenShooter);
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
			aShoot.onExplode = (ashoot, impactTop, explosionType) => {
				let explosion;
				if (explosionType === ExplosionType.FlatBottom)
					explosion = new Explosion(ashoot.left + ashoot.width / 2 - 22 / 2, impactTop - 22, 24, 24, sprites.explosion);
				else if (explosionType === ExplosionType.Round)
					explosion = new Explosion(ashoot.left + ashoot.width / 2 - sprites.topExplosion.dWidth / 2, impactTop - sprites.topExplosion.dHeight / 2, 24, 24, sprites.topExplosion);

				explosion.lastFrameChangedTime = new Date().getTime();
				explosion.frameIndex = 0;
				explosion.animate = true;
					explosion.onAnimateEnd = () => {
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

	topExplosion.onAnimateEnd = () => {
		setTimeout(() => {
			topExplosion.enabled = false;
		}, 100);
	};
	shooterExplosion.onAnimateEnd = () => {
		setTimeout(() => {
			//shooterExplosion.enabled = false;
		}, 100);
	};

    for (let i = 0; i < 20; i++) blankDots[i] = [];
	blankDots[0] = [0, 1, 2, 3, 4, 5, 6, 8, 9, 12];
	blankDots[4] = [0, 1, 2, 3, 5, 6, 7, 10, 11, 15];
	blankDots[16] = [3,6,7,9,10,11,13,14,15];
	blankDots[17] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
	blankDots[18] = [0,4,5,8,9,10,12,13,14];
	shields = [];
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
				shields[shieldNo].objects[blockIndex] = shieldBlock;
				world.objects.push(shieldBlock);

				let dotIndex = 0;
				for (let r = 0; r < 4; r++) {
					for (let c = 0; c < 4; c++) {
						const dotX = shieldBlockX + c * 3;
						const dotY = shieldBlockY + r * 3;
						const dot = new ShieldDot(dotX, dotY, green, shieldBlock, r , c);
						shieldBlock.objects[dotIndex++] = dot;
						world.objects.push(dot);
					}
				}
				blankDots[blockIndex++].forEach((dotIndex) => {
					shieldBlock.objects[dotIndex].enabled = false;
				});
			}
		}
		shieldX += 60 +  67;
	}


	world.objects.push(scoreTitle);
	world.objects.push(scoreText);
	world.objects.push(hightScoreTitle);
	world.objects.push(hightScoreText);
	world.objects.push(alianGrid);
	world.objects.push(wallBottom);
	world.objects.push(shooter);
	world.objects.push(laserShoot);
	world.objects.push(topExplosion);
	world.objects.push(shooterExplosion);
	//world.objects.push(p1Score);
	world.objects.push(livesCountText);
	world.objects.push(spaceship);
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
		UpdatePoints(event.detail.point);
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
function UpdatePoints(point) {
	const pBak = parseInt(points / 1000);
	points += point;
	if (parseInt(points / 1000) !== pBak)
		IncreaseLive();
	//p1Score.text = 'SCORE: ' + points;
	scoreText.text = points;
	if (points > highScore) {
		highScore = points;
		hightScoreText.text = highScore;
		gameData.HighScore = highScore;
		localStorage.setItem('gameData', JSON.stringify(gameData));
	}
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

function Run() {
	//console.time('Render');
	window.requestAnimationFrame(Run);

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

	if (gameStarted) {
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
			if (controller.isPressed(' ')) {
				console.log('s1')
				ShootLaser();
			}
		}
	} else {
		if (controller.isPressed(' ')) {
			controller.ClearBuffer();
			console.log('Start Game!');
			clearInterval(press2layBlinkingTimer);
			
			PopObjectFromWorld(()=> {
				setTimeout(() => {
					StartGame(worlConfig)
				}, 700);
			});

		}
	}

	game.Update();

	if (gameStarted && !gamePaused) {

		if (!alians.some(gObj => gObj.enabled)) {
			world.objects.forEach((gObj) => {
				//if (gObj instanceof AlianExplosion)
					//gObj.enabled = false;
			});

			for (let index = world.objects.length - 1; index >= 0; index--) {
				const gObj = world.objects[index];
				if (gObj instanceof AlianShoot) {
					gObj.enabled = false;
					world.objects.splice(index, 1);
				}
			}

			gamePaused = true;
			setTimeout(() => {
				gamePaused = false;
				ResetShields();
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

	for (let index = world.objects.length - 1; index >= 0; index--) {
		const gObj = world.objects[index];
        if (gObj.Garbage)
			world.objects.splice(index, 1);
        else if (gameStarted && gObj.enabled) {
			if (gObj instanceof AlianShoot && gObj.bottom > wallBottom.y)
				gObj.Explode(wallBottom.y, ExplosionType.FlatBottom);
			else if (gObj instanceof Alian && gObj.bottom > shooter.top && shooter.enabled) {
				lives = 1;
				shooter.Explode();
			}
		}
	}
	Render();
	//console.timeEnd('Render');
}
function Render() {
	display.clear();
	//world.color = 'green'
	display.drawBox(world);

	display.buffer.drawImage(background, 0, 0, 755, 572, -60, 0, 755, 695);

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
			else if (gObj instanceof Spaceship)
				display.drawSprite(gObj);
			else if (gObj instanceof SpaceshipExplosion)
				display.drawSprite(gObj);
		}
	});
	display.render();
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
	UpdateLivesCountText();
	if (shooters.length < lives - 1) {
		const sIndex = shooters.length;
		shooters[sIndex] = new Shooter(60 + sIndex * (worlConfig.shooter.width + 5), world.bottom - worlConfig.shooter.height - 2, worlConfig.shooter.width, worlConfig.shooter.height, sprites.greenShooter);
		world.objects.push(shooters[sIndex]);
	}
	shooters.forEach((shooter, index) => shooter.enabled = index < lives - 1 );
}
function UpdateLivesCountText()  {
	livesCountText.text = lives.toString();
}
function GameOver() {
	PauseGame(3)
	laserShoot.enabled = false;
	for (let index = world.objects.length - 1; index >= 0; index--) {
		const gObj = world.objects[index];
        if (gObj instanceof AlianShoot) {
			gObj.enabled = false;
			world.objects.splice(index, 1);
		}
	}
	
	gameData.HighScore = highScore;
	localStorage.setItem('gameData', JSON.stringify(gameData));

	const gameOver = new Text(world.width / 2, 145, 'GAME OVER', 'white', true, 18, 'Arial', true);
	world.objects.push(gameOver);
	setTimeout(() => {
		gameOver.enabled = false;
		gameOver.Garbage = true;
		gameStarted = false;
		ShowStartPage(worlConfig);
	}, 4000);
}

function ResetShields() {
	world.objects.forEach(gObj => {
		if (gObj instanceof ShieldBlock)
			gObj.collidable = true;
		if (gObj instanceof ShieldDot) {
			gObj.collidable = false;
			gObj.enabled = true;
		}
	});

	for (let shieldNo = 0; shieldNo <= 3; shieldNo++) {
		for (let blockIndex = 0; blockIndex < 20; blockIndex++) {
			const shieldBlock = shields[shieldNo].objects[blockIndex];
			blankDots[blockIndex].forEach((dotIndex) => {
				shieldBlock.objects[dotIndex].enabled = false;
			});
		}
	}
}
function PopObjectFromWorld(callback) {
	world.objects.pop();
	if (world.objects.length > 0)
		setTimeout(()=> {
			PopObjectFromWorld(callback);
		}, 40)
	else
		callback();
}