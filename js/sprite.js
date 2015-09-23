"use strict";

/**
 * @param {HTMLElement} element The element the sprite image is attached to.
 * @param {string} name The name of the sprites to be attached to the element. Default setting is default.
 * @param {string} direction Optional starting direction, will display first frame of that direction.
 */
function Sprite(div, name, direction) {

	this.object = div;
	this.name = name || "default";
	this.direction = direction || "";
	this.frame = 0;
	this.img = img_create("images/" + this.name + "/" + this.name + this.direction + ".png","sprite");
	this.object.element.appendChild(this.img);

};

/** 
  * Updates the direction a Sprite is facing based on the velocity of 
  * the element it is attached to.
  */
Sprite.prototype.updateDirection = function() {
 
	if(this.object.displayxVel && this.object.displayyVel) {
		if( Math.abs(this.object.displayxVel) >= Math.abs(this.object.displayyVel) ) {
			if (this.object.displayxVel >= 0) {
				this.direction = "Right";
			} else {
				this.direction = "Left";
			}
		} else {
			if (this.object.displayyVel <= 0) {
				this.direction = "Up";
			} else {
				this.direction = "Down";
			}
		}
	} else {
		this.direction = "";
	}
};

/**
  * 
  * Updates the source of the current Sprite.
  * Should be called on the move of the element it is attached to.
  * Because of the limitations of javascript, each animation can only have a set amount of frames 
  * starting at 0 (5 in this case).
  * If it does not then the image will not be loaded on that specific frame.
  *
  */
Sprite.prototype.updateSprite = function() {
	
	this.updateDirection();
	
	// Runs through the frames on 
	if(this.direction != "") {
	
		this.img.src = "images/" + this.name + "/" + this.name + this.direction + this.frame + ".png";
		
		this.frame++;
		// Make sure the frame doesn't go past the max frames.
		this.frame = this.frame % 2;
		
	}
	

	
};

Sprite.prototype.getFrames = function() {

	var url = "images/" + this.name + "/" + this.name + this.direction + this.frame + ".png";

}

// Creates an img with the src and optional alt and title.
function img_create(src,alt,title) {

	var img = document.createElement('img');
	img.src = src;
	if (alt!=null) img.alt = alt;
	if (title!=null) img.title = title;
	return img;
	
}
