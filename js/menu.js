/**
 * Manages the state and interactions of the main menu.
 *
 * @constructor
 */
function MainMenu() {
	this.element = document.getElementById('menu');
	this.gooseHeadSprites = [];
	for(var i = 0; i < 3; i++) {
		this.gooseHeadSprites.push(
			document.getElementById('gooseSpriteHead' + (i + 1)));
	}
	this.header = this.element.getElementsByTagName('h1')[0];
	this.list = this.element.getElementsByTagName('ul')[0];
	this.list.onclick = this._itemClicked.bind(this);
	playMenuMusic();
}

/**
 * Animate the menu in.
 *
 * @param {Function=} cb An optional callback to run when the animation has
 *                       completed.
 */
MainMenu.prototype.show = function(cb) {
	this.element.style.opacity = 0;
	this.header.style.opacity = 0;
	this.list.style.opacity = 0;
	for(var i = 0; i < 3; i++) {
		this.gooseHeadSprites[i].style.left = '';
		this.gooseHeadSprites[i].style.top = '';
	}
	var menu = this;
	
	Animation.fadeIn(menu.element);
	Animation.fadeIn(menu.header);
	Animation.fadeIn(menu.list,cb);
	Animation.breath(menu.list,20);

	// Pauses the animation to run when the music comes in.
	// Sorry I have to method chain so hard with this call, but java is single threaded so 
	// there's not many other ways to make this animation line up with the music.
	var timeout = setTimeout(
		function() {
			Animation.moveTo(menu.gooseHeadSprites[0], 40, 50, 200);
			Animation.moveTo(menu.gooseHeadSprites[1], 40, 200, 200);
			Animation.moveTo(menu.gooseHeadSprites[2], 40, 500, 200, function() {
						Animation.shake(menu.element,10,100);
			});
		},1000);

};

MainMenu.prototype.showMenu = function() {
	
	
}

/**
 * Animate the menu out.
 *
 * @param {Function=} cb An optional callback to run when the animation has
 *                       completed.
 */
MainMenu.prototype.hide = function(cb) {
	this.disappearing = true;
	var menu = this;
	Animation.fadeOut(this.element, function() {
		menu.disappearing = false;
		if(cb) cb();
	});
};

/**
 * Handle a click on (potentially) an item in the menu.
 *
 * @param {Event} e The event that triggered this event handler.
 * @private
 */
MainMenu.prototype._itemClicked = function(e) {
	// The target of the event is not necessarily the list item; work our way
	// up the tree, trying to find the anchor.  If we hit the list before then,
	// we didn't click an anchor.
	var target = e.target;
	while(target && target !== this.list && target.tagName !== 'A') {
		target = target.parentNode;
	}
	if(!target || target.tagName !== 'A') {
		return;
	}
	e.preventDefault();
	e.stopPropagation();
	// If we've already clicked something, ignore additional clicks.
	if(this.disappearing) {
		return;
	}
	// Fade us out and call the item callback.
	var menu = this;
	this.hide(function() {
		menu.itemCallbacks[target.id].call(this);
	});
};

/**
 * Functions to be run when specific items in the menu have been clicked.
 */
MainMenu.prototype.itemCallbacks = {
	play: function() {
		Animation.fadeIn(document.getElementById('playMenu'));
		//clearGameArea();
		startGame();
	},
	help: function() {
		Animation.fadeIn(document.getElementById('helpMenu'));
	},
	credits: function() {
		Animation.fadeIn(document.getElementById('creditsMenu'));
	},
	highscores: function() {
		Animation.fadeIn(document.getElementById('highscoresMenu'));
	}
};

/**
 * Attach an event listener to the document that listens for clicks on anchors
 * with the "back" class inside of an element with the "menu" class.  When
 * clicked, the "menu" element will be faded out and the main menu will
 * reappear.
 */
MainMenu.prototype.setUpBack = function() {
	document.documentElement.addEventListener(
		'click', this._backClicked.bind(this), false);
};

/**
 * Handle a (potential) back-button click.
 *
 * @param {Event} e The event that triggered the event handler.
 * @private
 */
MainMenu.prototype._backClicked = function(e) {
	// Even more broadly than in _itemClicked, the event could be any click in
	// the document.  It is essential that we check that it was actually a
	// click on an anchor with the correct class.
	var target = e.target;
	while(target && target !== document && target.tagName !== 'A') {
		target = target.parentNode;
	}
	if(!target || target.tagName !== 'A' ||
	   !/\bback\b/.test(target.className)) {
		return;
	}
	// We've found the anchor, and now we need to find the enclosing menu
	// element.
	var holder = target;
	while(holder && holder !== document &&
	      !(holder.className && /\bmenu\b/.test(holder.className))) {
		holder = holder.parentNode;
	}
	if(!holder || !holder.className || !/\bmenu\b/.test(holder.className)) {
		return;
	}
	// Aha!  Found it.  Now bring the main menu back in.
	e.preventDefault();
	/*var menu = this;
	Animation.fadeOut(holder, function() {
		menu.show();
	});
	*/
	location.reload();
};

// Until now, we've only been defining the MainMenu class.  Let's actually set
// it up and kick everything off.
!function() {
	var mainMenu = new MainMenu();
	mainMenu.setUpBack();
	mainMenu.show();
}();
