function Poop(x,y) {

	GameObject.call(this,"poop",x,y);
	this.element.style.width = this.width + "px";
	this.element.style.height = this.height + "px";
	this.element.classList.add("poop");
	this.erasing = false;
	this.health = 300;

}

/**
 * Poop inherits from GameObject
 */
inherit(Poop, GameObject);


// Returns whether the poop is being erased or not.
// Decrements its health, if the health is less than 0, then the poop dies.
Poop.prototype.isErasing = function(world) {

	if(this.lineDistance(world.mouse) < 30) this.erase(world);
	
}

// Decrements the poop's health based on how much the mouse has moved within it.
Poop.prototype.erase = function(world) {
	
	var mouseMovement = Math.abs(world.mouse.yVel) + Math.abs(world.mouse.xVel);
	
	this.health -= mouseMovement;
	world.meter.incrementHeight(.0001 * -mouseMovement);
	
	if(this.health < 200) {
			this.sprite.img.src = "images/poop/poop0.png";
	}
	if(this.health < 100) {
			this.sprite.img.src = "images/poop/poop1.png";
	}
	
		
	
}

Poop.prototype.width = 30;

Poop.prototype.height = 35;

