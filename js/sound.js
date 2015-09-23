"use strict";

// Creates two audio channels to be used during the game and appends them to the gameArea.
var source = "sounds/default/default.mp3";

var audio1 = document.createElement("audio");
audio1.setAttribute("id","audio1");
var audio2 = document.createElement("audio");
audio2.setAttribute("id","audio2");

	document.getElementById("gameArea").appendChild(audio1);
	document.getElementById("gameArea").appendChild(audio2);

// Preps the audio by playing an empty mp3.
audio1.src = source;
audio1.play();

audio2.src = source;
audio2.play();

// Creates two channels that the game will switch between to play the goose noises.
var channel = 1;

audio1.addEventListener("ended", function() {
	audio1.currentTime = 0;
});

audio2.addEventListener("ended", function() {
	audio2.currentTime = 0;
});


// Checks the amount of geese in the game area and assigns a source to an audio channel.
function checkAmtGeese(world) {

	var geese = world.countGeese();
	
	
	if (geese >= 0 && geese < 5) {
		source = "sounds/geese/geese1.mp3";
	} else if (geese >= 5 && geese < 10) {
		source = "sounds/geese/geese2.mp3";
	} else if (geese >= 10) {
		source = "sounds/geese/geese3.mp3";
	} else {
		source = "none";
	}
	
	var currentAudio = document.getElementById("audio" + channel);
	
	// Switches off between channels so spawning geese wont interrupt the sound as much.
	if(channel == 1) {
		channel = 2;
	} else {
		channel = 1;
	}
	
	var nextAudio = document.getElementById("audio" + channel);
	
	// I use a timeOut function to make sure the current audio channel finishes playing before it 
	// loads the other channel.
	
	if(currentAudio.currentTime != 0) {
	
		var timeOut = setTimeout( function() {
	
		
		currentAudio.src = source;
		currentAudio.load();
	
	
		}, (currentAudio.duration - currentAudio.currentTime)*1000);
	
	} else {
	
		currentAudio.src = source;
		currentAudio.load();
		
	}
	
	
}

// Plays the current audio channel.
function playGooseSound(world) {

	var currentAudio = document.getElementById("audio" + channel);

	if(source != "none") {
		currentAudio.play();
	}
	
} 

