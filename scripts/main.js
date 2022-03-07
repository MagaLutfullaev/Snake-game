let scoreBlock;
let score = 0;
let speed = 10;
let scores = [];
let record = 0;

if (localStorage.getItem("num")) {
	scores = localStorage.getItem("num").split(',');
	record = Math.max.apply(null, scores);
} 

const checkBox = document.querySelector('.input_check');
const recordTitle = document.querySelector('.score-record');
const btnStart = document.querySelector('.btn_start');

recordTitle.textContent = 'Рекорд: ' + record;

const config = {
	step: 0,
	maxStep: 6,
	sizeCell: 16,
	sizeBerry: 16 / 4
}

const snake = {
	x: 160,
	y: 160,
	dx: config.sizeCell,
	dy: 0,
	tails: [],
	maxTails: 3
}

let berry = {
	x: 0,
	y: 0
} 
let dir = 'right';


let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");
drawScore();

document.addEventListener('keydown', documentFunc);
function documentFunc(e) {
	if (e.code = 'Enter') {
		btnStartFunc();
	}
	document.removeEventListener('keydown', documentFunc);
	
};
btnStart.addEventListener('click', btnStartFunc);

function btnStartFunc()  {
	btnStart.style.display = 'none';
	function gameLoop() {
	
		if (!speed) {
			requestAnimationFrame( gameLoop );
		} else {
			setTimeout(() => requestAnimationFrame( gameLoop ), speed);
		}
		
		if ( ++config.step < config.maxStep) {
			return;
		}
		config.step = 0;
	
		context.clearRect(0, 0, canvas.width, canvas.height);
	
		drawBerry();
		drawSnake();
	}
	requestAnimationFrame( gameLoop );
	
};

function drawSnake() {
	snake.x += snake.dx;
	snake.y += snake.dy;

	collisionBorder();

	// todo бордер
	snake.tails.unshift( { x: snake.x, y: snake.y } );

	if ( snake.tails.length > snake.maxTails ) {
		snake.tails.pop();
	}

	snake.tails.forEach( function(el, index){
		if (index == 0) {
			context.fillStyle = "#18d26c";
		} else {
			context.fillStyle = "#019790";
		}
		context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

		if ( el.x === berry.x && el.y === berry.y ) {
			snake.maxTails++;
			incScore();
			randomPositionBerry();
		}

		for( let i = index + 1; i < snake.tails.length; i++ ) {

			if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y ) {
				refreshGame();
			}

		}

	} );
}

function collisionBorder() {
	if (checkBox.checked) {
		if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
			refreshGame();
		}
	} else {
		if (snake.x < 0) {
			snake.x = canvas.width - config.sizeCell;
		} else if ( snake.x >= canvas.width ) {
			snake.x = 0;
		}
	
		if (snake.y < 0) {
			snake.y = canvas.height - config.sizeCell;
		} else if ( snake.y >= canvas.height ) {
			snake.y = 0;
		}
	}
}
function refreshGame() {	
	scores.push(score);
	localStorage.setItem("num", scores)
	dir = 'right';
	score = 0;
	drawScore();

	snake.x = 160;
	snake.y = 160;
	snake.tails = [];
	snake.maxTails = 3;
	snake.dx = config.sizeCell;
	snake.dy = 0;

	randomPositionBerry();
	record = Math.max.apply(null, localStorage.getItem("num").split(','));
	recordTitle.textContent = 'Рекорд: ' + record;
}

function drawBerry() {
	context.beginPath();
	context.fillStyle = "#18d26c";
	context.arc( berry.x + (config.sizeCell / 2 ), berry.y + (config.sizeCell / 2 ), config.sizeBerry, 0, 2 * Math.PI );
	context.fill();
}

function randomPositionBerry() {
	berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
	berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}

function incScore() {
	score++;
	drawScore();
}

function drawScore() {
	scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) {
	return Math.floor( Math.random() * (max - min) + min );
}

document.addEventListener("keydown", function (e) {
	if ( e.code == "KeyW" && dir != 'down' || e.code == 'ArrowUp' && dir != 'down') {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
		dir = 'up';
	} else if ( e.code == "KeyA" && dir != 'right' || e.code == 'ArrowLeft' && dir != 'right') {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
		dir = 'left';
	} else if ( e.code == "KeyS" && dir != 'up' || e.code == 'ArrowDown' && dir != 'up') {
		snake.dy = config.sizeCell;
		snake.dx = 0;
		dir = 'down';
	} else if ( e.code == "KeyD" && dir != 'left' || e.code == 'ArrowRight' && dir != 'left') {
		snake.dx = config.sizeCell;
		snake.dy = 0;
		dir = 'right';
	}
});


const modal = document.querySelector('.settings');
const open = document.querySelector('.open_btn');
const speedInput = document.querySelector('.input_speed');

speedInput.addEventListener('input', () => {
	speedInput.value = speedInput.value.replace(/\D/g, '');
	
	speed = speedInput.value;
})

open.addEventListener('click', () => {
	modal.style.display = 'flex';
})
modal.addEventListener('click', (e) => {
	if (e.target.classList.contains("btn_close") || e.target.classList.contains("settings")) {
		modal.style.display = 'none';
		refreshGame();
	}
})
