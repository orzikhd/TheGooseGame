"use strict";

/**
 * Aggregate an array of influences into the net influence of the influences. <- WHY YOU PHRASE IT LIKE THAT?
 * Constructor for a Goose object
 *
 * @param {?number} x The x position to put the Goose at.
 * @param {?number} y The y position to put the Goose at.
 */
function Goose(x,y) {
	
	GameObject.call(this,"goose", x,y);
	this.element.classList.add("goose");
	this.element.style.width = this.width + "px";
	this.element.style.height = this.height + "px";
	
};

/**
 * Goose inherits from GameObject
 */
inherit(Goose, GameObject);

/**
 * Default width of the Goose element
 *
 * @const
 * @type {number}
 */
Goose.prototype.width = 50;

/**
 * Default height of the Goose element
 *
 * @const
 * @type {number}
 */
Goose.prototype.height = 50;

/**
 * Maximum number of pixels the goose moves each frame.
 *
 * @const
 * @type {number}
 */
Goose.prototype.SPEED = 6;

/**
 * Number of pixels within which the mouse has an influence on the goose.
 *
 * @const
 * @type {number}
 */
Goose.prototype.MOUSE_RANGE = 150;

/**
 * The number of frames between choosing a new random exploration direction.
 *
 * @const
 * @type {number}
 */
Goose.prototype.FRAMES_BETWEEN_RANDOM_CHOICES = 30;

/**
 * The number of frames until the next random direction choice.
 *
 * @type {number}
 */
Goose.prototype.framesTillNextRandomChoice = 0;

/**
 * How willing the goose is to move towards a sidewalk.
 *
 * @type {number}
 */
Goose.prototype.bravado = 0;

/**
 * Moves the Goose in the game area
 *
 * @param {World} world The World the Goose is a part of.
 */
Goose.prototype.move = function(world) {
	
	var influences = this.determineInfluences(world);
	var netInfluence = Influence.net(influences);
	this.displayxVel = netInfluence.x / netInfluence.weight;
	this.displayyVel = netInfluence.y / netInfluence.weight;
	
	influences.push(this.determineGooseInfluence(world));
	netInfluence = Influence.net(influences);
	
	// Increment the meter by passing the goose's distance to the closest sidewalk.
	world.meter.incrementBar(this.lineDistance(this.getClosestObject(world,Sidewalk)));
	
	this.xVel = netInfluence.x / netInfluence.weight;
	this.yVel = netInfluence.y / netInfluence.weight;
	
	playGooseSound(world);
	
	// Makes sure the object does not go out of bounds.
	this.clampToBoundary(world);
	this.mabyePoop(world);
	
	this.X += this.xVel;
	this.Y += this.yVel;
	
};

/**
 * Determine the influences on the goose.
 *
 * @private
 * @param {World} world The World the Goose is a part of.
 * @return {Array.<Influence>}
 */
Goose.prototype.determineInfluences = function(world) {

	var influences = [];
	influences.push(this.determineMouseInfluence(world));
	influences.push(this.determineSidewalkInfluence(world));
	influences.push(this.determineRandomInfluence(world));
	
	return influences;
};

/**
 * Determine the influence the mouse has on the goose.
 *
 * @private
 * @param {World} world The World the Goose is a part of.
 * @return {Influence}
 */
Goose.prototype.determineMouseInfluence = function(world) {
	
	var dx = this.X - world.mouse.X;
	var dy = this.Y - world.mouse.Y;
	var distSq = dx * dx + dy * dy;
	var influence = new Influence(dx, dy, 21000 / (1 + distSq));
	influence.limitMagnitude(this.SPEED);
	return influence;
	
};

/**
 * Determine the influence the closest goose has on the goose.
 *
 * @private
 * @param {World} world The World the Goose is a part of.
 * @return {Influence}
 */
Goose.prototype.determineGooseInfluence = function(world) {
	
	var geese = world.countGeese();
	
	if (geese > 1) {
	
		var closestGoose = this.getClosestObject(world,Goose);

		var dx = this.X - closestGoose.X;
		var dy = this.Y - closestGoose.Y;
		var distSq = dx * dx + dy * dy;
		var influence = new Influence(dx, dy, 10000000 / (1 + distSq * distSq));
		influence.limitMagnitude(this.SPEED);
		
	} else {
	
		influence = new Influence(0,0,0);
		
	}
	
	return influence;
};

/**
 * Determine the influence the sidewalks have on the goose.
 *
 * @private
 * @param {World} world The World the Goose is a part of.
 * @return {Influence}
 */
Goose.prototype.determineSidewalkInfluence = function(world) {
	this.bravado += 0.05;
	if(this.bravado > 2) this.bravado = 2;
	if(this.lineDistance(world.mouse) < this.MOUSE_RANGE) this.bravado -= 0.08;
	if(this.bravado < 0) this.bravado = 0;
	var closestSidewalk = this.getClosestObject(world,Sidewalk);
	var influence = new Influence(closestSidewalk.X - this.X,
	                              closestSidewalk.Y - this.Y, 0.2);
								  
	influence.limitMagnitude(this.SPEED);
	return influence;
};

/**
 * Determine the random influence on the goose.
 *
 * @private
 * @param {World} world The World the Goose is a part of.
 * @return {Influence}
 */
Goose.prototype.determineRandomInfluence = function(world) {
	
	var randMag = this.SPEED / 2;
	if(this.framesTillNextRandomChoice == 0) {
		this.framesTillNextRandomChoice = this.FRAMES_BETWEEN_RANDOM_CHOICES;
		this.chosenRandomXVelocity = Math.random() * randMag * 2 - randMag;
		this.chosenRandomYVelocity = Math.random() * randMag * 2 - randMag;
	}
	this.framesTillNextRandomChoice--;
	return new Influence(this.chosenRandomXVelocity,
	                     this.chosenRandomYVelocity, 1);
						 
};

// At the frames till the next random choice the goose has a 50/50 chance
// of creating a poop object on its coordinates.
Goose.prototype.mabyePoop = function(world) {
	
	var closestSidewalk = this.getClosestObject(world,Sidewalk);
	
	if (this.framesTillNextRandomChoice == 0 && this.lineDistance(closestSidewalk) < 30) {
			var random = Math.random() * 2;
			if(random > 1) {
				world.addObject(new Poop(this.X,this.Y));
			}
	}
}




