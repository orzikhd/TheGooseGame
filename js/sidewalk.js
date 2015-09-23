"use strict";

/**
 * The Sidewalk object is a single segment of a sidewalk in the game.
 */
function Sidewalk() {
	GameObject.call(this,"sidewalk");
	this.element.style.width = this.width + "px";
	this.element.style.height = this.height + "px";
	this.element.classList.add("sidewalk");
}

/**
 * Sidewalk inherits from GameObject
 */
inherit(Sidewalk, GameObject);

/**
 * Default width of a sidewalk segment
 *
 * @const
 * @type {number}
 */
Sidewalk.prototype.width = 75;

/**
 * Default height of a sidewalk segment
 *
 * @const
 * @type {number}
 */
Sidewalk.prototype.height = 75;

/**
 * Puts a sidewalk segment into its proper position using a
 * direction and the given previousBit.
 *
 * @param {Sidewalk} previousBit The previous Sidewalk in the line of Sidewalk segments.
 * @param {String} direction The direction a Sidewalk can be placed relative to the previousBit.
 */
Sidewalk.prototype.setNextBit = function(previousBit, direction) {
	if (direction == "north") {
		this.Y = previousBit.Y - this.height;
		this.X = previousBit.X;
	}
	else if (direction == "south") {
		this.Y = previousBit.Y + this.height;
		this.X = previousBit.X;
	}
	else if (direction == "east") {
		this.X = previousBit.X + this.width;
		this.Y = previousBit.Y;	
	}
	else if (direction == "west") {
		this.X = previousBit.X - this.width;
		this.Y = previousBit.Y;
	}
	else {
		console.log("Invalid direction recieved by Sidewalk.move(previousBit, direction): " + direction);
	}
}

/**
 * Creates Sidewalks of varying lengths and directions
 * 
 * @param {World} world The world to put the Sidewalks into
 * @param {?number} numSidewalks The number of independent Sidewalks
 */
function createSidewalks(world, numSidewalks) {

	clearSidewalks(world);

	for (var z = 0; z < numSidewalks; z++) {
		var startBit = new Sidewalk;
		startBit.randomlyPositionWithin(world);
		world.addObject(startBit);
		
		var numDirections = Math.floor(Math.random() * 4 + 1);
		for (var j = 0; j < numDirections; j++) {
			var direction = getRandomDirection(startBit, world);
			var segments = [];
			segments.push(startBit);
			
			var numSegments = getPossibleLength(startBit, direction, world);
			
			for (var i = 1; i < numSegments; i++) {
				segments.push(new Sidewalk);
				world.addObject(segments[i]);
				segments[i].setNextBit(segments[i - 1], direction);
			}
		}
	}
}

/**
 * Picks out a random direction for a new length of sidewalk where there
 * is not a sidewalk already.
 *
 * @param {Sidewalk} startBit The Sidewalk from which the line of segments will extend.
 * @param {World} world The World the sidewalks are inside of.
 * @return {String}
 */
function getRandomDirection(startBit, world) {
	var possibilities = ["north", "south", "east", "west"];
	var index = Math.floor(Math.random() * possibilities.length);
	if (verifySpace(startBit, possibilities[index], world)) {
		return possibilities[index];
	}
	else {
		return getRandomDirection(startBit, world);
	}
}

/**
 * Decides how many Sidewalk segments may be placed in a given direction.
 *
 * @param {Sidewalk} startBit The Sidewalk from which the sidewalk will spawn.
 * @param {String} direction The direction in which the sidewalk will go.
 * @param {World} world The world the sidewalk is inside of.
 * @return {?number}
 */
function getPossibleLength(startBit, direction, world) {
	var count = 0;
	var possible = true;
	while (possible == true) {
		if (direction == "north") {
			if (startBit.Y - startBit.height * count > 0) {
				count++;
			}
			else {
				possible = false;
			}			
		}
		else if (direction == "south") {
			if (startBit.Y + startBit.height * count < world.height) {
				count++;
			}
			else {
				possible = false;
			}			
		}
		else if (direction == "east") {
			if (startBit.X + startBit.width * count < world.width) {
				count++;
			}
			else {
				possible = false;
			}			
		}
		else if (direction == "west") {
			if (startBit.X - startBit.width * count > 0) {
				count++;
			}
			else {
				possible = false;
			}
		}
		else {
			console.log("Invalid direction recieved by getPossibleLength(startBit, direction, world): " + direction);
			return;
		}
	}
	return count + 1;
}

/**
 * Ensures that there is not already a sidewalk segment in a given direction.
 *
 * @param {Sidewalk} startBit The Sidewalk from which the sidewalk will spawn.
 * @param {String} direction The direction the sidewalk would go.
 * @param {World} world The world the sidewalk would be in.
 * @return {Boolean}
 */
function verifySpace(startBit, direction, world) {
	var adjacentToStart = startBit.getClosestObject(world, Sidewalk);
	if (adjacentToStart == null) {
		return true;
	}
	if (direction == "north") {
		return !world.checkCoords(startBit.X, startBit.Y - startBit.height);
	}
	else if (direction == "south") {
		return !world.checkCoords(startBit.X, startBit.Y + startBit.height);
	}
	else if (direction == "east") {
		return !world.checkCoords(startBit.X + startBit.width, startBit.Y);
	}
	else if (direction == "west") {
		return !world.checkCoords(startBit.X - startBit.width, startBit.Y);
	}
	else {
		console.log("Invalid direction recieved by verifySpace(previousBit, direction, world): " + direction);
		return;
	}
}

/**
 * Clears all Sidewalks and poops off the game area
 *
 * @param {World} world The World to clear Sidewalks out of
 */
function clearSidewalks(world) {
	world.removeAllObject(Sidewalk);
	world.removeAllObject(Poop);
}