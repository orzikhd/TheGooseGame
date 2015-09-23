"use strict";

/**
 * Constructor for a meter object which increments and fills a bar based on the number of geese on the side-walk. 
 */
function Meter(world) {
	this.world = world;
	this.height = 500;
	this.speed = .1;

	var playMenu = document.getElementById("playMenu");

		
	this.meter = document.createElement("div");
	this.meter.className += "meter";
	
	this.bar = document.createElement("div");
	this.bar.className += "bar";
	
	playMenu.appendChild(this.meter);
	this.meter.appendChild(this.bar);

	this.applyColor();
}

Meter.prototype.NORMAL_COLOR = [153, 217, 234];


/**
* @return a number that represents the amount the meter has been filled
**/
Meter.prototype.getAmountFilled = function() {
	return parseInt(5000/this.height);
};

/**
 * @return an array of each color's rgb value adjusted for the amount filled.
 **/
Meter.prototype.getColor = function() {
	var amountFilled = this.getAmountFilled();
	return [
		this.NORMAL_COLOR[0] + amountFilled,
		this.NORMAL_COLOR[1] - amountFilled,
		this.NORMAL_COLOR[2] - amountFilled
	];
};

/**
 * Creates a CSS string and applies that style of each adjusted color to the bar and gameArea divs.
 *
**/
Meter.prototype.applyColor = function() {
	
	var color = this.getColor();
	
	var result = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
	this.bar.style.backgroundColor = result;
	document.getElementById("playMenu").style.backgroundColor = result;
	
}

// If the sidewalkDistance is less than a number then the height of the bar decreases (appears as if the meter is increasing) and 
// the bar is shaded more red depending on the percent that the bar is filled.
Meter.prototype.incrementBar = function(sidewalkDistance) {
	if(this.world.RUNNING) {
		var playMenu = document.getElementById("playMenu");
		
		if (sidewalkDistance < 30) {
			
			this.setHeight(this.height - this.speed);
			
		}
		
		if(this.height > 500) {
			this.height = 500;
		}
		
		if(this.height < 0) {
			
			//alert("game over brah");
			this.gameOver();
			
		}
		
		// Makes the bars height equal to this.height.
		this.bar.style.height = this.height + "px"

		this.applyColor();
	}
}

Meter.prototype.gameOver = function() {
	this.world.RUNNING = false;
	/*var gameOver = document.createElement("div");
	gameOver.className += "lossScreen";
	gameOver.textContent = "Game over brah.";
	gameOver.style.height = this.world.height/2 + "px";
	gameOver.style.width = this.world.width/2 + "px";
	this.world.element.appendChild(gameOver);
	*/
	document.getElementById("lossScreen").hidden = false;
	//this.height = 500;
}

// Increases the height (which corresponds to a decrease in bar size)
Meter.prototype.setHeight = function(number) {
	
	this.height = number;
	
}

Meter.prototype.incrementHeight = function(number) {
	
	this.height += number;
	
}
