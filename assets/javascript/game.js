// Global Variables
var dict = ["Google", "Lion", "Cheetah", "Apocalypse"];
var isNewNewGame = true;[]
var randomIndex = -1;
var userInput = null;
var winCount = 0;
var lossCount = 0;
// Constant
var maxGuessNumber = 20;
var marker = '_'; // mark the positions that are not matched yet
var winMessage = "You Won! Hit any key to restart.";
var lossMessage = "You Lost! + Hit any key to restart";

// Functions
function display(sel, html) {
	document.querySelector(sel).innerHTML = html;
}
function createEndMessage(result) {
	var message = '';
	if (result == "win") {
		message = winMessage;
	} else if ("loss") {
		message = lossMessage;
	} else {
		message = "Argumnet error: " + result;
	}
	message += "<br>Wins: " + winCount;
	message += "<br>Losses: " + lossCount;

	return message;
}
// Copied from mozilla developer network
// Generate random integer between min(included) and max (excluded)
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
// Class
function Game(word) {
	this.answer = word.toLowerCase().split("");
	this.guesses = []; // letters have been guessed stored here
	this.answerDisplay = []; // holds matched letters or '_' with blanks in between
	this.count = maxGuessNumber;
	this.message = '';
	this.initialize = function() {	
		// markers mark down the positions that haven't been matched yet
		// no letter has been matched yet in the beginning 
		// so every letter position is marked
		// 
		for (var i = 0; i < this.answer.length; i++) {
			// set a [_,  , _,  ,..] array
			// insert a blank in betwen letters for display purpose
			// so only even number positions hold letters or markers
			this.answerDisplay.push(marker);
			this.answerDisplay.push(' ');
		}
	};
	// find all occurences of ch in answer, if found,
	// replace marker with ch in answerDisplay accordingly
	this.find = function(ch) {
		var isFound = false;
		for (var i = 0; i < this.answer.length; i++) {
			if (ch == this.answer[i]) {
				// even number positions hold letters
				this.answerDisplay[i*2] = ch;
				isFound = true;
			}
		}
		return isFound;
	};
	// The letter is not guessed if it can't be found in guessess
	this.isNotGuessed = function(ch) {
		return (this.guesses.indexOf(ch) == -1);
	}
	// The answer is matched if all markers are replaced with
	// correct letters and no marker found in answerDisplay
	this.isMatched = function() {
		return (this.answerDisplay.indexOf(marker) == -1);
	}

	// set initial values
	this.initialize();
}

// Main Program
document.onkeyup = function(event) {

	userInput = String.fromCharCode(event.keyCode).toLowerCase();

	if (isNewNewGame) {
		isNewNewGame = false;
		randomIndex = getRandomInt(0, dict.length);
		game = new Game(dict[randomIndex]);
		// Don't start to count the number, run game logic yet
		// because this is a key stroke to start a new game
		game.message = "Game started ...";
	
	} else {
		// if the letter has not been guessed, then run game logic
		// otherwise, do nothing
		if (game.isNotGuessed(userInput)) {
			game.message = "Continuing ......";
			game.count--;
			game.guesses.push(userInput);
			// find the letter in answer, if found, also replace marker with
			// the letter in answerDisplay
			var isFound = game.find(userInput);

			// if letter is found in answer,
			// and all letters match answer
			if (isFound && game.isMatched()) {
				winCount++;
				game.message = createEndMessage("win");
				isNewNewGame = true;
		
			} else if (game.count == 0) {
				lossCount++;
				game.message = createEndMessage("loss");
				isNewNewGame = true;
			}
		}
	}
	
	display("#answer", game.answerDisplay.join(""));
	display("#times", game.count);
	display("#guessed", game.guesses);
	display("#message", game.message);
}

	