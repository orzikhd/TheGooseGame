"use strict";

/**
 * Maintains the entire world and its objects.
 *
 * @constructor
 */
function World(element) {
	this.element = element;
	this.objects = [];
	this.timer = new Timer();
	this.meter = new Meter(this);
	this.RUNNING = true;
	this.width  = this.element.clientWidth;
	this.height = this.element.clientHeight;
}

World.prototype.RUNNING;

/**
 * Add an object to the world.
 *
 * @param {GameObject} object The game object to put into play.
 */
World.prototype.addObject = function(object) {
	this.objects.push(object);
	object.restyle();
	this.element.appendChild(object.element);
};

/**
 * Remove an object from the world.
 *
 * @param {GameObject} object The game object to be removed from play.
 */
World.prototype.removeObject = function(object) {
	var index = this.objects.indexOf(object);
	this.objects.splice(index, 1);
	this.element.removeChild(object.element);
};

World.prototype.removeAllObject = function(object) {
	
	for (var i = 0; i < this.objects.length; i++) {
		if (this.objects[i] instanceof object) {
			this.removeObject(this.objects[i]);
			i--;
		}
	}
	
}

/**
 * Run one tick of the world.
 */
World.prototype.update = function() {
	if (this.RUNNING) {
		this.timer.setTime(this);
	}
	var objects = this.objects.slice();  // Now this can't change during iteration
	for(var i = 0; i < objects.length; i++) {
			objects[i].move(this);
			objects[i].isErasing(this);
			if(objects[i].health <= 0) {
				this.removeObject(objects[i]);
			}
	}
	objects = this.objects; // This can.
	for(i = 0; i < objects.length; i++) {
		objects[i].sprite.updateSprite();				
		objects[i].restyle();	
	}
};

/**
 * Returns the amount of geese in the objects array.
 *
 * @private
 */
World.prototype.countGeese = function() {
	var geese = 0;
	for(var i = 0; i < this.objects.length; i++) {
		if(this.objects[i] instanceof Goose) {
			geese++;
		}
	}
	return geese;
};

World.prototype.checkCoords = function(X, Y) {
	for(var i = 0; i < this.objects.length; i++) {
		if(this.objects[i] instanceof Sidewalk && this.objects[i].X == X
											   && this.objects[i].Y == Y) {
			return true;
		}
	}
	return false;
}

