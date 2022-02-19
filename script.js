const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let totalBombs = 100;
let bombsLeft = totalBombs;

let tileCount = 20;//------> numarul de pozitii
let tileSize = 18; //------> marimea celulelor

const allElements = [[]];
const randomNumber = [];

function drawGameElements() {
	for(let c = 1; c <= canvas.height; ++c) {
		const btn =	document.createElement('button');
		btn.setAttribute('class', 'cellButtons');
		btn.setAttribute('id', c);
		btn.setAttribute('value', '0');
		btn.onclick = function() {checkId(this.id);};
		btn.addEventListener('contextmenu', function(event) {
			event.preventDefault();
			markCell(this.id);
			return false;
		}, false);
		document.getElementById('gameTable').appendChild(btn);
	}
	const bombsRemaning = document.getElementById('bombsLeft');
	bombsRemaning.textContent = 'Bombs left: ' + bombsLeft;
	setRandomNumber();
	setIdsInMatrix();
	setValuesForNrCells();
}

function setIdsInMatrix () {
	let ids = 1;
	for(let x = 0; x < canvas.height / tileCount; ++x) {
		allElements[x] = [];
		for(let y = 0; y < canvas.width / tileCount; ++y) {
			allElements[x][y] = ids;
			++ids;
		}
	}
}
// Here we set the bombs
function setRandomNumber() {
	while(randomNumber.length <= totalBombs) {
		let nr = Math.floor(Math.random() * canvas.height) + 1;
		randomNumber.push(nr);
		const btn = document.getElementById(nr);
		btn.setAttribute('value', '-1');
	}
}

function setValuesForNrCells() {
	for(let i = 1; i <= canvas.height; ++i) {
		let tiles = surroundingTiles(i);
		let bombs = 0;
		for(let j = 0; j < tiles.length; ++j) {
			const cell = document.getElementById(tiles[j]).value;
			if(cell == -1) {
				++bombs;
			}
		}
		const element = document.getElementById(i).value;
		if(element != -1 && bombs > 0) {
			const btn = document.getElementById(i);
			btn.setAttribute('value', bombs)
		}
	}
}

function surroundingTiles(index) {
	let columnsPerRow = canvas.width / tileCount;
	row = parseInt(index / columnsPerRow);
	if(index % tileCount === 0) {
		row = parseInt(index / (columnsPerRow + 1));
	}
	column = index % columnsPerRow - 1;
	if(column === -1) {
		column = tileCount -1;
	}
	if(index === 500) {
		row = canvas.height / tileCount - 1;
		column = canvas.width / tileCount -1;
	}
	const tiles = [];
	for(let xOffset = -1; xOffset <= 1; ++xOffset) {
		for(let yOffset = -1; yOffset <= 1; ++yOffset) {
			const tile = allElements[row + xOffset]?.[column + yOffset];
			if(tile) {tiles.push(tile)}
		}
	}
	return tiles;
}

function checkId(id) {
	const btnValue = document.getElementById(id).value;
	const btn = document.getElementById(id);
	if(btn.classList.contains('marked') === true) {
		return;
	}
	if(btnValue == -1) {
		showBombs();	
	}
	if(btnValue > 0) {
		let val = 1;
		revealCell(id, val);
	}
	if(btnValue == 0) {	
		revealSurrounding(id);
	}
	gameStatus();
}

function revealSurrounding(id) {
	let tiles = surroundingTiles(id);
	for(let i = 0; i < tiles.length; ++i) {
		const clicked = document.getElementById(tiles[i]);
		let val = document.getElementById(tiles[i]).value;
		if(val == 0 && clicked.classList.contains('clickedButton') === false) {
			revealCell(tiles[i], val);
			revealSurrounding(tiles[i]);
		}
		if(val != -1) {
			revealCell(tiles[i], val);
		}		
	}
}

function revealCell(id, val) {
	const cell = document.getElementById(id);
	cell.setAttribute('class', 'clickedButton');
	if(val > 0) {
		cell.textContent = document.getElementById(id).value;
	}
}

function showBombs() {
	for(let i = 0; i < randomNumber.length; ++i) {
		const btn = document.getElementById(randomNumber[i]);
		btn.setAttribute('class', 'bombs');
	}
	isGameOver(true);
}

function markCell(id) {
	const bombsRemaning = document.getElementById('bombsLeft');
	const btn = document.getElementById(id);
	if(btn.classList.contains('cellButtons') === true) {
		--bombsLeft;
		btn.setAttribute('class', 'marked');
	} else if(btn.classList.contains('marked') === true) {
		++bombsLeft;
		btn.setAttribute('class', 'cellButtons');
	}
	bombsRemaning.textContent = 'Bombs left: ' + bombsLeft;
}

function gameStatus() {
	for(let i = 1; i <= canvas.height; ++i) {
		const element = document.getElementById(i);
		if(element.classList.contains('cellButtons')) {
			return;
		}
	}
	isGameOver(false);
}

function isGameOver(winLose) {
	let prg = document.getElementById('winParagraph');
	if(winLose === true) {
		prg.textContent = 'YOU LOSE!';
	} else {
		prg.textContent = 'WIN!';
	}
}