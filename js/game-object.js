"use strict";

/** 
 * The GameObject is the base object in the game
 * @param {string} name The name of the object used for assigning sprites and sounds. Default is "default".
 * @param {?number} x The x position on the GameArea.
 * @param {?number} y The y position on the GameArea.
 * @param {?number} xVel The pixel amount this.X is updated each frame. 
 * @param {?number} yVel The pixel amount this.Y is updated each frame.
 */
function GameObject(name, x,y, xvel, yvel) {

	this.element = document.createElement("div");
	this.element.className += "gameObject";
	this.X = x || 0;
	this.Y = y || 0;
	this.xVel = xvel || 0;
	this.yVel = yvel || 0;
	this.displayxVel = xvel;
	this.displayyVel = yvel;
	this.name = name || "default";
	this.sprite = new Sprite(this, name);
	
};

GameObject.prototype.move = function() {
};

GameObject.prototype.isErasing = function() {
	
};

/**
 * Reposition the object such that it is within the boundary of the world.
 *
 * @param {World} world The world to reposition with respect to.
 */
GameObject.prototype.clampToBoundary = function(world) {
	var minX = this.width / 2, minY = this.height / 2;
	var maxX = world.width - minX, maxY = world.height - minY;
	if(this.X < minX) {
		this.X = minX;
		this.yVel += this.xVel * -sign(this.yVel);
		this.xVel = 0;
	}
	if(this.X > maxX) {
		this.X = maxX;
		this.yVel += this.xVel * -sign(this.yVel);
		this.xVel = 0;
	}
	if(this.Y < minY) {
		this.Y = minY;
		this.xVel += this.yVel * sign(this.xVel);
		this.yVel = 0;
	}
	if(this.Y > maxY) {
		this.Y = maxY;
		this.xVel += this.yVel * sign(this.xVel);
		this.yVel = 0;
	}
};

/**
 * Randomly position the game object within the world.
 *
 * @param {World} world The world this game object is a part of or is to be a
 *                      part of.
 */
GameObject.prototype.randomlyPositionWithin = function(world) {
	this.X = this.width  / 2 + Math.random() * (world.width  - this.width);
	this.Y = this.height / 2 + Math.random() * (world.height - this.height);
};

/**
 * Set the styles of the element to position it correctly.  This should only be
 * called from the World class.
 */
GameObject.prototype.restyle = function() {
	this.element.style.left = this.X - this.width  / 2 + 'px';
	this.element.style.top  = this.Y - this.height / 2 + 'px';
};

/**
 * Move towards the given point, moving no more than maxDist.
 *
 * @param {number} x The x coordinate of the point to move to.
 * @param {number} y The y coordinate of the point to move to.
 * @param {number} maxDist The maximum distance to travel.
 */
GameObject.prototype.moveTowardsPoint = function(x, y, maxDist) {
	var dx = x - this.X;
	var dy = y - this.Y;
	var distSq = dx * dx + dy * dy;
	if(distSq <= maxDist * maxDist) {
		this.X = x;
		this.Y = y;
	}else{
		var factor = maxDist / Math.sqrt(distSq);
		this.X += dx * factor;
		this.Y += dy * factor;
	}
};

/**
 * Move towards the given object, moving no more than maxDist.
 *
 * @param {GameObject} object The object to move towards.
 * @param {number} maxDist The maximum distance to travel.
 */
GameObject.prototype.moveTowardsObject = function(object, maxDist) {
	this.moveTowardsPoint(object.X, object.Y, maxDist);
};

// Calculates the difference between two objects, the caller and the passed object.
GameObject.prototype.lineDistance = function(object) {

	var xs = 0;
	var ys = 0;
	
	xs = object.X - this.X;
	xs = xs * xs;
	
	ys = object.Y - this.Y;
	ys = ys * ys;
	
	return Math.sqrt( xs + ys );
	
};

/**
 * getClosestObject returns the closest object to the calling object.
 *
 * @param {World} world The World the Goose is a part of.
 */
GameObject.prototype.getClosestObject = function(world,object) {

	var objects = [];
	var distance;
	var minDistance;
	var closestObject;
	
	// Get the specified objects out of all the objects.
	for (var i = 0; i < world.objects.length; i++) {
		if (world.objects[i] instanceof object && world.objects[i] != this) {
			objects.push(world.objects[i]);
		}
	}
	
	if(objects.length > 0) {
	
		// Get the object with the minimum distance to the calling object (goose).
		minDistance = this.lineDistance(objects[0]);
		closestObject = objects[0];
	
		for (var i = 1; i < objects.length; i++) {
	
			distance = this.lineDistance(objects[i]);
		
			if (distance < minDistance) {
				minDistance = distance;
				closestObject = objects[i];
			}
	
		}
	} else {
		closestObject = null;
	}
	
	// Return the closest specified object.
	return closestObject;
	
};

// Gets the sign of a number (don't ask me how).
function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }
