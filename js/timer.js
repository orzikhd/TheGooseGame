/**
 * Creates a Timer object intended to keep track of a countdown clock
 */
function Timer() {
	this.startTime = new Date();
	this.difficulty = 1;
	this.minutes_passed = 0;
}

/**
 * The number of minutes the Timer should count down before
 * increasing the difficulty.
 *
 * @const
 * @type {number}
 */
Timer.prototype.MINUTES_BEFORE_DIFFICULTY = 3;

/**
 * The Timer counts down this many milliseconds
 *
 * @const
 * @type {number}
 */
Timer.prototype.MAX_TIME = 60000;

/**
 * Returns the milliseconds portion of the countdown clock
 * @param {?number} time The difference between the startTime 
 *						 date and the current date
 * @return {?number}
 */
 Timer.prototype.getMilliseconds = function(time) {
	return time % 1000;
};

/**
 * Returns the seconds portion of the countdown clock
 * @param {?number} time The difference between the startTime 
 *						 date and the current date
 * @return {?number}
 */
Timer.prototype.getSeconds = function(time) {
	return Math.floor(time / 1000);
};

/**
 * The update function of the Timer, this finds the current
 * elapsed time and updates the visual clock accordingly.
 *
 * @param {World} world The world the Timer is a part of.
 */
Timer.prototype.setTime = function(world) {
	var now = new Date();
	var elapsed = now - this.startTime;
	
	if (elapsed > this.MAX_TIME) {
		elapsed = this.resetClock(world, now);
	}
	
	var time = this.MAX_TIME - elapsed;
	var currentMilli = this.getMilliseconds(time);
	var currentSeconds = this.getSeconds(time);
	
	this.printTime(currentMilli, currentSeconds);
};

/**
 * Resets the Timer to 0 when called and updates the amount of passed minutes.
 * 
 * @param {World} world The world the Timer is a part of.
 * @param {Date} now The current time.
 * @return {number}
 */
Timer.prototype.resetClock = function(world, now) {
	this.startTime = now;
	this.minutes_passed++;
	var currentDiff = this.minutes_passed % this.MINUTES_BEFORE_DIFFICULTY;
	if (currentDiff == 0) {
		this.difficulty++;
	}
	createLevel(world, this.difficulty);
	
	return 0;
}

/**
 * Sets the contents of the countdown elements in the HTML
 * @param {number} currentMilli Number of milliseconds on the clock.
 * @param {number} currentSeconds Number of seconds on the clock.
 */
Timer.prototype.printTime = function(currentMilli, currentSeconds) {
	if (currentMilli > 99) {
		document.getElementById("milliseconds").textContent = currentMilli;
	}
	else if (currentMilli > 9) {
		document.getElementById("milliseconds").textContent = "0" + currentMilli;
	}
	else {
		document.getElementById("milliseconds").textContent = "00" + currentMilli;
	}
	
	if (currentSeconds > 9) {
		document.getElementById("seconds").textContent = currentSeconds;
	}
	else {
		document.getElementById("seconds").textContent = "0" + currentSeconds;
	}	
}