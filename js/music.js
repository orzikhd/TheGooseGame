"use strict";

// Creates a music audio channel for each game music element.
var menuMusicStart = document.createElement("audio");
var loopAudio1 = document.createElement("audio");
var loopAudio2 = document.createElement("audio");
var currentAudio = null;

menuMusicStart.src = "sounds/music/menuMusicStart.mp3";
loopAudio1.src = "sounds/music/menuMusicLoop.mp3";
loopAudio2.src = "sounds/music/menuMusicLoop.mp3";

// Prep the audio tags.
menuMusicStart.load();
loopAudio1.load();
loopAudio2.load();

menuMusicStart.setAttribute("id","music");
loopAudio1.setAttribute("id","music");
loopAudio2.setAttribute("id","music");

document.getElementById("gameArea").appendChild(menuMusicStart);
document.getElementById("gameArea").appendChild(loopAudio1);
document.getElementById("gameArea").appendChild(loopAudio2);

// Returns the time left in miliseconds until an audio tag is finished playing.
function timeLeft(element) {
	
	return (element.duration - element.currentTime) * 1000;
	
}

loopAudio1.addEventListener("ended", function() {
	this.currentTime = 0;
	this.load();
});

loopAudio2.addEventListener("ended", function() {
	this.currentTime = 0;
	this.load();
});

loopAudio1.addEventListener("timeupdate", function () {

  var time = timeLeft(this);
  if(time < 199) {
		loopAudio2.play();
		currentAudio = loopAudio2;
  }
  
}, false);

loopAudio2.addEventListener("timeupdate", function () {

  var time = timeLeft(this);
  if(time < 199) {
		loopAudio1.play();
		currentAudio = loopAudio1;
  }
}, false);


var gameMusicPlaying = false;

// The music has 3 main files. The music1 begins when the menu is displayed.
// music1-2 is a looping version of music1 that plays after music1 finished. 
// music2 is a looping song that plays when start game is clicked.

// Plays the main menu music.
function playMenuMusic() {
	
	menuMusicStart.play();
	currentAudio = menuMusicStart;
	var timeOut = setTimeout( function() {
		if(!gameMusicPlaying) {
				loopAudio1.play();
		}
		// I have to hard code in a time for looping music to play because .duration doesn't seem to work.
	},12900);
				
}

function playGameMusic() {

	gameMusicPlaying = true;
	var time = timeLeft(currentAudio);
	
	if(time > 200) {
		var timeOut = setTimeout( function() {
			
			loopAudio1.src = "sounds/music/gameMusic.mp3";
			loopAudio2.src = "sounds/music/gameMusic.mp3";
			loopAudio1.load();
			loopAudio2.load();
			loopAudio1.play();
					
		}, time - 150);
		
	} else {
		
		currentAudio.pause();
		loopAudio1.src = "sounds/music/gameMusic.mp3";
		loopAudio2.src = "sounds/music/gameMusic.mp3";
		loopAudio1.load();
		loopAudio2.load();
			
		loopAudio1.play();
	
	}
	
} 





