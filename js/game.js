"use strict";
/**
 * Initializes the world of the game and its updates
 */
function startGame() {
	var world = new World(document.getElementById('gameArea'));
	world.addObject(world.mouse = new Mouse);
	setInterval(world.update.bind(world), 25);
	document.getElementById("createGoose").onclick = function(e) {
		e.preventDefault();
		GooseSpawn(world);
	};

	document.getElementById("createLevel").onclick = function(e) {
		e.preventDefault();
		createSidewalks(world, 1);
	};
	createLevel(world, 1);
	playGameMusic();
}

/*function clearGameArea() {
	var gameArea = document.getElementById('gameArea');
	while (gameArea.firstChild) {
		gameArea.removeChild(gameArea.firstChild);
	}
	//<p><span id = "seconds">60</span><span id = "milliseconds">0000</span></p>
	var timerP = document.createElement('p');
	var sec = document.createElement('span');
	sec.textContent = "60";
	sec.id = "seconds";
	var milli = document.createElement('span');
	milli.textContent = "0000";
	milli.id = "milliseconds";
	timerP.appendChild(sec);
	timerP.appendChild(milli);
	gameArea.appendChild(timerP);
	
	
}
*/
/**
 * Spawns a Goose somewhere in the given world
 *
 * @param {World} world The World to spawn a Goose in
 */
function GooseSpawn(world) {
	var goose = new Goose();
	goose.randomlyPositionWithin(world);
	world.addObject(goose);
	checkAmtGeese(world);
}

/**
 * Spawns an appropriate number of geese and creates
 * new Sidewalks.
 *
 * @param {World} world The World to create the level within
 * @param {?number} difficulty The desired difficulty level
 */
function createLevel(world, difficulty) {
	createSidewalks(world, difficulty);
	
	for (var i = 0; i < difficulty; i++) {
		GooseSpawn(world);
		checkAmtGeese(world);
	}
}

/**
 * Initialize the help menu
 */
function createHelpMenu() {
	console.log("jxrhzsrt");
	var zoo = new World(document.getElementById('helpArea'));
	zoo.addObject(zoo.mouse = new Mouse);
	setInterval(zoo.update.bind(zoo), 25);	
	createLevel(zoo, 1);
	GooseSpawn(zoo);
}










