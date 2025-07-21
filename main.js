"use strict";
// JS Assessment: Find Your Hat //
import promptSync from "prompt-sync";
import clear from "clear-screen";

const prompt = promptSync({ sigint: true });


const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
	constructor(field = [[]]) {
		this.field = field;

		this.positionRowX = 0;
		this.positionColY = 0;
		// this.field[this.positionRowX][this.positionColY] = pathCharacter;

		// find position
		for (let i = 0; i < this.field.length; i++){
			for (let j = 0 ; j < this.field[i].length; j++){
				if(this.field[i][j]===pathCharacter){
					this.positionColY = i ;
					this.positionRowX= j ;
					break;
				}
			}
			if(this.field[this.positionColY][this.positionRowX]===pathCharacter)
				break;
		}
		this.gameOver = false;
        this.gameStatus = 'playing';
	}

	// Print field //
	print() {
		for(let i = 0; i< this.field.length; i++){
			console.log(this.field[i].join(''));
		}
	}
	// -------------------------------------
	askformove(){
		const move = prompt("Which Way (A:left, D:right, W:up, S:down)").toUpperCase();
		let newPositionRowX = this.positionRowX;
		let newPositionColY = this.positionColY;

		switch (move){
			case 'A' : newPositionRowX--;
				break;
			case 'D': newPositionRowX++;
				break;
			case 'W':newPositionColY--;
				break;
			case 'S' : newPositionColY++;
				break;
			default:
				console.log('Please use to A, D, W, S');
				return false;
		}
		return{x:newPositionRowX, y: newPositionColY};
	}
	// ------------------------------------------
	checkmove(newX,newY){

		//-----------
		if(newY < 0 || newY >= this.field.length ||
			newX <0 || newX >= this.field[0].length){
			this.gameOver = true;
			this.gameStatus = 'Lose (You walked off the map.)';
			return false;
			}
		//-----------

		const targetmove = this.field[newY][newX];
		if(targetmove===hole){
			this.gameOver = true;
			this.gameStatus = 'Lose (You fall into a hole)';
			return false;
		}
		if(targetmove===hat){
			this.gameOver = true;
			this.gameStatus = 'Win🎉';
			return false;
		}

		this.positionColY = newY;
		this.positionRowX = newX;

		this.field[this.positionColY][this.positionRowX] = pathCharacter
		return true;
	}
	//-------------------------------------------

	runGame(){
		clear();
		this.print();

		while(!this.gameOver){
			const newPos = this.askformove();
			if(newPos===false){
				continue;
			}

			const isValidMove = this.checkmove(newPos.x,newPos.y)
			if(isValidMove){
				clear();
				this.print();
			}
			if(this.gameOver){
				clear();
			}
		}
		console.log(`Game Over! --> You ${this.gameStatus}`);
	}
}

// Game Mode ON
// Remark: Code example below should be deleted and use your own code.
// const newGame = new Field([
// 	["░", "░", "O"],
// 	["░", "O", "░"],
// 	["░", "^", "░"],
// ]);

const genfield = (height, width, holePercent) => {
	//----------
	const map = [];
	for( let i=0; i<height;i++){
		map.push([]);
		for(let j=0; j<width;j++){
			const rand = Math.random();
			if(rand<holePercent/100){
				map[i].push(hole);
			}
			else{
				map[i].push(fieldCharacter);
			}
		}
	}
	//----------
	let hatX,hatY;
	do{
		hatX = Math.floor(Math.random()*width);
		hatY = Math.floor(Math.random()*height);
	} while (hatX===0 && hatY ===0);
	map[hatX][hatY] = hat;

	//-----------
	let playerX,playerY;
	do{
		playerX = Math.floor(Math.random()*width);
		playerY = Math.floor(Math.random()*height);
	} while(playerX===0 && playerY===0);
	map[playerX][playerY] = pathCharacter;
	//-----------
	return map;
};

const randomField = genfield(6,6,20);
const newGame = new Field(randomField);

newGame.runGame();
