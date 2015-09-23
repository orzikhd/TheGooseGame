var Animation = function() {

	/* THEORY OF OPERATION
	 * -------------------
	 *
	 * At any time, there can be any number of animations running.  Each of
	 * these animations will need to have a 'tick' function called periodically
	 * so it can perform a frame of its animation.  While we could potentially
	 * use a setInterval/setTimeout/requestAnimationFrame for each individual
	 * animation, for efficiency's sake, we might as well have one call to one
	 * of those scheduling functions and then use that 'global tick' for /all/
	 * animations.  That's what we do.  As long as there is any animation
	 * whatsoever, we will have one global ticker.  If all animations have
	 * finished, we stop the global ticker, and when we start an animation when
	 * there are none already, we start it.  That's it.  Simple enough. */

	/**
	 * Default duration in milliseconds for animations if not otherwise
	 * specified.
	 *
	 * @const
	 * @type {number}
	 */
	var DEFAULT_DURATION = 500;

	/**
	 * Request a function to be called in the near future for purposes of
	 * animation.
	 *
	 * @type {function(Function)}
	 */
	var requestAnimationFrame = window.requestAnimationFrame
	                         || window.mozRequestAnimationFrame
	                         || window.webkitRequestAnimationFrame
	                         || window.msRequestAnimationFrame
	                         || window.oRequestAnimationFrame
	                         || function(f) { setTimeout(f, 13); };

	/**
	 * The list of 'tick' functions for animations that are currently running.
	 *
	 * @type {Array.<Function>}
	 */
	var running = [];

	/**
	 * Kick off an animation taking a given amount of time, along with the
	 * given tick and completion callbacks.
	 *
	 * @param {number} duration The number of milliseconds in which this
	 *                          animation will complete.
	 * @param {function(number)=} tick An optional callback to be run each
	 *                                 frame.  It will be passed one argument,
	 *                                 the amount of time elapsed, between 0
	 *                                 (at the start) and 1 (completion).
	 * @param {Function=} complete An optional callback to be run when the
	 *                             animation has completed.
	 */
	function start(duration, tick, complete) {
		var startTime = +new Date;
		var wasRunning = running.length > 0;
		running.push(function myTick() {
			var time = (new Date - startTime) / duration;
			if(time < 0) time = 0;
			if(time > 1) time = 1;
			if(tick) tick(time);
			if(time === 1) {
				running.splice(running.indexOf(myTick), 1);
				if(complete) complete();
			}
		});
		if(!wasRunning) {
			globalTick();
		}
	}

	/**
	 * Handle the 'global tick', running every ticker in running, and
	 * rescheduling itself if there is anything still running.
	 */
	function globalTick() {
		var tickers = running.slice();
		for(var i = 0, l = tickers.length; i < l; i++) {
			tickers[i]();
		}
		if(running.length > 0) {
			requestAnimationFrame(globalTick);
		}
	}

	/**
	 * Linearly interpolate from one value to another.
	 *
	 * @param {number} from The value to interpolate from.
	 * @param {number} to The value to interpolate to.
	 * @param {number} time The time between 0 and 1, determining how much of
	 *                      from to mix in and how much of to to mix in.
	 * @return {number} The result of the interpolation.
	 */
	function lerp(from, to, time) {
		return from + (to - from) * time;
	}

	/**
	 * Fades in an element over a given time, optionally running a callback on
	 * completion.
	 *
	 * @param {HTMLElement} element The element to fade in.
	 * @param {number=} duration The amount of time, in milliseconds, over
	 *                           which to run the animation.  Defaults to
	 *                           DEFAULT_DURATION.
	 * @param {Function=} complete An optional callback to run when the fade
	 *                             has completed.
	 */
	function fadeIn(element, duration, complete) {
		if(duration instanceof Function) {
			complete = duration;
			duration = undefined;
		}
		if(duration === undefined) {
			duration = DEFAULT_DURATION;
		}
		element.hidden = false;
		start(duration, function(time) {
			element.style.opacity = time;
		}, complete);
	}

	/**
	 * Fades out an element over a given time, optionally running a callback on
	 * completion.
	 *
	 * @param {HTMLElement} element The element to fade out.
	 * @param {number=} duration The amount of time, in milliseconds, over
	 *                           which to run the animation.  Defaults to
	 *                           DEFAULT_DURATION.
	 * @param {Function=} complete An optional callback to run when the fade
	 *                             has completed.
	 */
	function fadeOut(element, duration, complete) {
		if(duration instanceof Function) {
			complete = duration;
			duration = undefined;
		}
		if(duration === undefined) {
			duration = DEFAULT_DURATION;
		}
		element.hidden = false;
		start(duration, function(time) {
			element.style.opacity = 1 - time;
		}, function() {
			element.hidden = true;
			if(complete) complete();
		});
	}

	/**
	 * Moves an element to a given X and Y position over a given amount of
	 * time, optionally running a callback upon completion.
	 *
	 * @param {HTMLElement} element The element to move.
	 * @param {number} toX The X position to animate to.
	 * @param {number} toY The Y position to animate to.
	 * @param {number=} duration The amount of time, in milliseconds, over
	 *                           which the animation should run.  Defaults to
	 *                           DEFAULT_DURATION.
	 * @param {Function=} complete An optional callback to run upon completion
	 *                             of the animation.
	 */
	function moveTo(element, toX, toY, duration, complete) {
		if(duration instanceof Function) {
			complete = duration;
			duration = undefined;
		}
		if(duration === undefined) {
			duration = DEFAULT_DURATION;
		}
		var computedStyle = document.defaultView.getComputedStyle(element);
		var fromX = parseInt(computedStyle.left),
		    fromY = parseInt(computedStyle.top);
		start(duration, function(time) {
			element.style.left = lerp(fromX, toX, time) + 'px';
			element.style.top = lerp(fromY, toY, time) + 'px';
		}, complete);
	}
	
	// Shakes the passed element.
	// element: element to shake.
	// intensity: weight on shaking amount.
	// duration: duration of shake.
	// complete: callback function called when the shake completes.
	function shake(element,intensity,duration, complete) {
		
		var computedStyle = document.defaultView.getComputedStyle(element);
		var elementX = parseInt(computedStyle.left);
		var elementY = parseInt(computedStyle.top);
		
		start(duration, 
			
			function() {
				// Random direction of shake.
				if(Math.random() > .5) {
						intensity = -intensity;
				}
				
				element.style.left = intensity * Math.random() + elementX + "px";
				
				// Random direction of shake.
				if(Math.random() > .5) {
						intensity = -intensity;
				}
				
				element.style.top = intensity * Math.random() + elementY + "px";
				
		},	function() {
				element.style.left = elementX + "px";
				element.style.top = elementY + "px";
			}
			
		,complete);
		
	};
	
	function breath(element,intensity, initial) {
		
		var computedStyle = document.defaultView.getComputedStyle(element);
		var elementX = parseInt(computedStyle.left);
		var elementY = parseInt(computedStyle.right);	
		initial = initial || 0;
		
		if(!isNaN(elementY)) {
			var time = 1000;
			if(initial == 0) {
				time= time/2;
			}
			
			Animation.moveTo(
				element,elementX,elementY + intensity,time,
				function() {
					Animation.moveTo(
					element,elementX,elementY,time,
					function() {
							Animation.breath(element,-intensity,1);
					});
				}
			);
		}
	};
	
	return {
		start: start,
		lerp: lerp,
		fadeIn: fadeIn,
		fadeOut: fadeOut,
		moveTo: moveTo,
		shake: shake,
		breath: breath
	};
	
}();
