
// Global Variables
var isNewGame = true; // One game for each word
var randomIndex = -1;
var userInput = '';
var winCount = 0;
var lossCount = 0;
var gamesOver = false;
var movies = [];
var firstTime = true;

// Constant
var maxGuessNumber = 20;
var marker = '_'; // mark the positions that are not matched yet
var winMessage = "You Won! Hit any key to restart.";
var lossMessage = "You Lost! Hit any key to restart";

// Functions
function loadMovies() {
	// deep copy
	for (var i = 0; i < gameMovies.length; i++) {
		movies.push(gameMovies[i]);
	}
}
function display(sel, html) {
	document.querySelector(sel).innerHTML = html;
}
function formatGuesses(arr) {
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		result.push(arr[i].toUpperCase());
		result.push(' ');
	}
	return result.join("");
}
function postProcessing(game, result) {
	var message = '';
	if (result == "win") {
		winCount++;
		message = winMessage;
	} else if ("loss") {
		lossCount++;
		message = lossMessage;
	} else {
		message = "Argumnet error: " + result;
	}
	message += "<br>Wins: " + winCount;
	message += "  Losses: " + lossCount;
	isNewGame = true;
	// Remove the movie that's been played
	// because random number generator sometime is not
	// that random and pick the same number very often
	// Removing the played movie object will ensure it will not
	// be picked again until all moives play out and start
	// all over again
	movies.splice(randomIndex, 1);
	message += " Games Left: " + movies.length;
	game.message = message;

	if (movies.length == 0) {
		gamesOver = true;
		game.movie.hint = "<h2>Games Over</h2><p>Hit any key to restart";
	}
	
}

// Snippet from mozilla developer network
// Generate random integer between min(included) and max (excluded)
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// Class
function Game(movie) {
	this.movie = Object.assign({}, movie); // deep copy
	this.answer = this.movie.answer.toLowerCase().split("");
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
			// set a [_  _  _ ....] array
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

	if (gamesOver) {
		//Reload the page to restart the game
		//all variables are reset to initial values
		location.reload(true);
	}

	if (firstTime) {
		loadMovies();
		firstTime = false;
	}

	if (isNewGame) {
		isNewGame = false;
		randomIndex = getRandomInt(0, movies.length);
		game = new Game(movies[randomIndex]);
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
				postProcessing(game, "win");
			} else if (game.count == 0) {
				postProcessing(game, "loss");
			}
		}
	}

	display("#hint", game.movie.hint);
	display("#answer", game.answerDisplay.join(""));
	display("#times", game.count);
	display("#guessed", formatGuesses(game.guesses));
	display("#message", game.message);

}

// Game data
// I tried to stored it in a JSON file but couldn't
// get it work with JSON.parse, XMLHttpRequest or $.getJSON
// They all have same weird error message.
// So I put it in a variable.

var gameMovies = [
{
	"answer": "Aqaba",
	"title": "Lawrence of Arabia",
	"hint": "In this historical drama, a British was sent to the Middle East desert to start a revolt during WW I. What is the first city he captured from the enemy?"
},

{
	"answer": "Galapagos",
	"title": "Master and Commander: The Far Side of the World",
	"hint": "The story of this movie occured during the Napoleonic Wars. The British Capitan pursued his enemy ship to these islands, which are also rich with flora and fauna. What is the islands' name?"
},

{
	"answer": "Mondoshawans",
	"title": "The Fifth Element",
	"hint": "In this Sci-Fi movie, the leading female character is an alien sent to save the earth. But she ended up falling into a cab. What is the name of her alien race?"	
},

{
	"answer": "Marseille",
	"title": "The Count of Monte Cristo",
	"hint": "This movie is based on a French novel, the leading character is a sailor wrongfully convicted and imprisoned. What is the salor's home port?"
},

{
	"answer": "Nautilus",
	"title": "20000 Leagues Under the Sea",
	"hint": "In this Sci-Fi movie, it involves sea monsters, giant squids and a mysterious Capitan. What's the name of his vessel?"
},

{
	"answer": "Edelweiss",
	"title": "The Sound of Music",
	"hint": "In this famous musical, the leading character sings this song, which is named after a popular flower in his country, to bid farewell to his homeland. What is the name of the song?"
},

{
	"answer": "Apocalypse",
	"title": "Apocalypse now",
	"hint": "In this Vietnam War movie, the leading character was sent to the jungle to kill a lunatic US officer. What is the first word of the move title?"
},

{
	"answer": "Unknown",
	"title": "The Good, the Bad and the Ugly",
	"hint": "In this epic Western, part of Dollars Trillogy, 3 leading characters pursued gold buried under a grave. What is the name on that grave?"
},

{
	"answer": "Buffalo",
	"title": "The Silence of the Lambs",
	"hint": "In this psychological horror-thriller, an FBI trainee was sent to interview a serial killer in prison in order to catch another serial killer who skins his victims' corpses. What's the first word of the nickname of that serial killer she's trying to catch?"
},

{
	"answer": "Casablanca",
	"title": "Casablanca",
	"hint": "In this romantic drama set during WW II, an American expatriate opened a night club in this African coastal city. The movie's title is the same name as the city. What is the movie title?"
}

];

