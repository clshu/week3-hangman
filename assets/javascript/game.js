// Global Variables
var dict = ["Google", "Lion", "Cheetah", "Apocalypse"];
var isNewNewGame = true;
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
	this.guesses = [];
	this.answerDisplay = [];
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

	// set initial values
	this.initialize();
}

// Main Program
document.onkeyup = function(event) {

	userInput = String.fromCharCode(event.keyCode).toLowerCase();

	if (isNewNewGame == true) {
		isNewNewGame = false;
		randomIndex = getRandomInt(0, dict.length);
		game = new Game(dict[randomIndex]);
	}

	// if the letter has not been guessed
	if (game.guesses.indexOf(userInput) == -1) {
		game.count--;
		game.guesses.push(userInput);
		// find the letter in answer, if foound, also replace '_' with
		// the letter in answerDisplay
		var isFound = game.find(userInput);
		console.log("isFound: " + isFound);
		// if letter is found in answer, see if all letters
		// matched, i.e. all '_' have been replaced with correct letters 
		// in answerDisplay
	
		if (isFound == true && game.answerDisplay.indexOf('_') == -1) {
			game.message = "You Won!";
			isNewNewGame = true;
		} else if (game.count == 0) {
			game.message = "You Lost! The answer is: " + game.answer.join("");
			isNewNewGame = true;
		}
	}

	display("#answer", game.answerDisplay.join(""));
	display("#times", game.count);
	display("#guessed", game.guesses);
	display("#message", game.message);
}

	