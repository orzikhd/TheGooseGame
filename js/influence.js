"use strict";

/**
 * Something that influences the goose's direction.
 *
 * @constructor
 * @param {number} x The influence to go in the X direction.
 * @param {number} y The influence to go in the Y direction.
 * @param {number} weight The weight proportional to other influences of this
 *                        influence.
 */
function Influence(x, y, weight) {
	this.x = x;
	this.y = y;
	this.weight = weight;
}

/**
 * Aggregate an array of influences into the net influence of the influences. <- wut?
 *
 * @param {Array.<Influence>} influences The influences to aggregate. <- wut?
 * @return {Influence} The net influence.
 */
Influence.net = function(influences) {
	var net = new Influence(0, 0, 0);
	for(var i = 0, l = influences.length; i < l; i++) {
		var inf = influences[i];
		net.x += inf.x * inf.weight;
		net.y += inf.y * inf.weight;
		net.weight += inf.weight;
	}
	return net;
};

/**
 * Limit the magnitude of the influence to the given magnitude.
 *
 * @param {number} maxMag The maximum magnitude.
 */
Influence.prototype.limitMagnitude = function(maxMag) {
	var magSq = this.x * this.x + this.y * this.y;
	if(magSq > maxMag * maxMag) {
		var factor = maxMag / Math.sqrt(magSq);
		this.x *= factor;
		this.y *= factor;
	}
};