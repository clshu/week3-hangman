// Global Variables
var dict = ["Google", "Lion", "Cheetah", "Apocalypse"];
var isNewNewGame = true;
var isRestart = false;
var randomIndex = -1;
var userInput = null;
// Constant
var maxGuessNumber = 20;

// Functions
function display(sel, html) {
	document.querySelector(sel).innerHTML = html;
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
	this.answerDisplay = []; // display answer or '_'
	this.count = maxGuessNumber;
	this.message = '';
	this.initialize = function() {
		// set a [_, _, _, ...] array
		for (var i = 0; i < this.answer.length; i++) {
			this.answerDisplay.push('_');
		}
	};
	// find all occurences of ch in answer, if found,
	// replaced '_' with ch in answerDisplay accordingly
	this.find = function(ch) {
		var isFound = false;
		for (var i = 0; i < this.answer.length; i++) {
			if (ch == this.answer[i]) {
				this.answerDisplay[i] = ch;
				isFound = true;
			}
		}
		return isFound;
	};
	// The letter is not guessed if it can't be found in guessess
	this.isNotGuessed = function(ch) {
		return (this.guesses.indexOf(ch) == -1);
	}
	// The answer is matched if all '_' are replaced with
	// correct letters and no '_' exists in answerDisplay
	this.isMatched = function() {
		return (this.answerDisplay.indexOf('_') == -1);
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
	}

	if (isRestart) {

		// Don't start to count the number, run game logic yet
		// because this is a key stroke to restart a new game
		isRestart = false;
	
	} else {

		// if the letter has not been guessed, run game logic
		// otherwise, do nothing
		if (game.isNotGuessed(userInput)) {
			//console.log("isNotGuessed: " + game.isNotGuessed(userInput));
			game.count--;
			game.guesses.push(userInput);
			// find the letter in answer, if found, also replace '_' with
			// the letter in answerDisplay
			var isFound = game.find(userInput);

			// if letter is found in answer,
			// and all letters match answer
	
			if (isFound && game.isMatched()) {
				//console.log("isMatched: " + game.isMatched());
				game.message = "You Won! Hit any key to restart.";
				isNewNewGame = true;
				isRestart = true;
			} else if (game.count == 0) {
				game.message = "You Lost! The answer is: " + game.answer.join("") +
								"<br> Hit any key to restart";
				isNewNewGame = true;
				isRestart = true;
			}
		}
	}
	
	display("#answer", game.answerDisplay.join(""));
	display("#times", game.count);
	display("#guessed", game.guesses);
	display("#message", game.message);
}

	