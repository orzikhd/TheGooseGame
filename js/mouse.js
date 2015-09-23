"use strict";

//document.onmousemove = handleMouseMove;
/**
 * Global variables for the X and Y positions of the
 * player's cursor.
 */
var cursorX = 0;
var cursorY = 0;

/**
 * The Mouse object is the object that represents the
 * player's cursor in the game area.
 */
function Mouse() {
	GameObject.call(this);
	this.prevX = -1;
	this.prevY = -1;
	this.element.classList.add("mouse");
	document.onmousemove = getPointerCoords;
};

/**
 * Mouse inherits from GameObject
 */
inherit(Mouse, GameObject);

/**
 * Default width of the Mouse element
 *
 * @const
 * @type {number}
 */
Mouse.prototype.width = 20;

/**
 * Default height of the Mouse element
 *
 * @const
 * @type {number}
 */
Mouse.prototype.height = 20;

/**
 * Moves the Mouse in the game area
 *
 * @param {World} world The World the Mouse is a part of.
 */
Mouse.prototype.move = function(world) {
	var parentLeft = getOffsetLeft(world.element);
	var parentTop = getOffsetTop(world.element);
	
	// Makes the mouse position relative to its background.
	this.X = cursorX - parentLeft - 5;  // 5 is the width of the border
	this.Y = cursorY - parentTop  - 5;  // (TODO: get from computed style)
	
	// Comptutes the xVel and yVel of the mouse based on previous position values.
	if(this.prevX > -1) {
		this.xVel = this.X - this.prevX;
		this.yVel = this.Y - this.prevY;
		this.displayxVel = this.xVel;
		this.displayyVel = this.yVel;
	}
	
	this.prevX = this.X;
	this.prevY = this.Y;
	this.sprite.updateSprite();
};


/**
 * Updates the position of the cursor and Mouse object. Called onmousemove in the constructor.
 *
 * @param {Event} event The event that caused this function to be called.
 */
function getPointerCoords(event) {
	event = event;
	cursorX = event.pageX;
	cursorY = event.pageY;
};



/**
 * Gets the left offset of an element in relation to the document.
 *
 * @param {HTMLElement} element The element whose left offset is being returned.
 */
function getOffsetLeft(element) {

	var offsetLeft = 0;
	do {
		if ( !isNaN( element.offsetLeft) ) {
		
			offsetLeft += element.offsetLeft;
		
		}
	} while ( element = element.offsetParent );
	return offsetLeft;

}

/**
 * Gets the top offset of an element in relation to the document.
 *
 * @param {HTMLElement} element The element whose top offset is being returned.
 */
function getOffsetTop(element) {

	var offsetTop = 0;
	do {
		if ( !isNaN( element.offsetTop) ) {
		
			offsetTop += element.offsetTop;
		
		}
	} while ( element = element.offsetParent );
	return offsetTop;
}

// Create time interval to track distance.
function timeInterval() {
	this.increment = 0;
}

timeInterval.prototype.addOneIncrement = function() {
	this.incremenet++;
}

timeInterval.prototype.addNIncrement = function(number) {
	this.increment += number;
}

timeInterval.prototype.getIncrement = function() {
	return increment;
}