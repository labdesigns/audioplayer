document.addEventListener('DOMContentLoaded', () => {

	const audioPlayer = document.querySelector('#podcast-player');
	const playBtn = document.querySelector('#play');
	const pauseBtn = document.querySelector('#pause');
	const currentTime = document.querySelector('#current-time');
	const totalTime = document.querySelector('#total-time');
	const timeTrack = document.querySelector('#time-track');
	const volumeControl = document.querySelector('#volume');
	const volumeDisplay = document.querySelector('#volume-display');
	const volumeIcon = document.querySelector('.audioplayer-volume-icon');
	const volumeIconMute = document.querySelector('.audioplayer-volume-icon #mute');
	const volumeIconLow = document.querySelector('.audioplayer-volume-icon #low');
	const volumeIconMiddle = document.querySelector('.audioplayer-volume-icon #middle');
	const volumeIconLoud = document.querySelector('.audioplayer-volume-icon #loud');
	const ratePlus = document.querySelector('#audioplayer-playrate_plus');
	const rateNormal = document.querySelector('#audioplayer-playrate_normal');
	const rateMinus = document.querySelector('#audioplayer-playrate_minus');
	const rateCurrent = document.querySelector('#audioplayer-current_playrate');
	const extraPlayBtns = document.querySelectorAll('.podcast-play_btn');

	let trackUpdateInterval = setInterval(trackUpdate, 1000);



	function normalize(val, max, min) {
		return (val - min) / (max - min);
	}

	function toHHMMSS(time) {
		var sec_num = parseInt(time, 10); // don't forget the second param
		var hours = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours < 10) { hours = "0" + hours; }
		if (minutes < 10) { minutes = "0" + minutes; }
		if (seconds < 10) { seconds = "0" + seconds; }
		return hours + ':' + minutes + ':' + seconds;
	}

	function setClickedTimeVal() {
		let clickedTrackVal = timeTrack.value / 100;
		audioPlayer.currentTime = audioPlayer.duration * clickedTrackVal;
	}

	function trackUpdate() {
		currentTime.innerHTML = toHHMMSS(audioPlayer.currentTime);
		let trackVal = normalize(audioPlayer.currentTime, audioPlayer.duration, 0) * 100;
		timeTrack.value = trackVal.toFixed(2);
	}

	//playback rate

	rateNormal.addEventListener('click', e => {
		audioPlayer.playbackRate = 1;
		rateCurrent.innerHTML = 'x ' + audioPlayer.playbackRate;

	});

	ratePlus.addEventListener('click', e => {
		if (audioPlayer.playbackRate < 1.75) {
			audioPlayer.playbackRate = audioPlayer.playbackRate + .25;
		}

		rateCurrent.innerHTML = 'x ' + audioPlayer.playbackRate;
	});

	rateMinus.addEventListener('click', e => {
		if (audioPlayer.playbackRate > 0.25) {
			audioPlayer.playbackRate = audioPlayer.playbackRate - .25;
		}
		rateCurrent.innerHTML = 'x ' + audioPlayer.playbackRate;
	});



	//volume
	volumeControl.addEventListener('change', () => {
		audioPlayer.volume = volumeControl.value;

		let vol = audioPlayer.volume * 100;

		// volume icon manipulation
		//mute
		if (vol === 0) {
			volumeIconMute.classList.remove('hidden');

		} else {
			volumeIconMute.classList.add('hidden');
		}

		//sound bars
		if (vol > 0 && vol <= 33) {
			volumeIconMiddle.classList.add('hidden');
			volumeIconLoud.classList.add('hidden');
		} else if (vol > 33 && vol <= 75) {
			volumeIconMiddle.classList.remove('hidden');
			if (!volumeIconLoud.classList.contains('hidden')) {
				volumeIconLoud.classList.add('hidden');
			}
		} else {
			volumeIconMiddle.classList.remove('hidden');
			volumeIconLoud.classList.remove('hidden');

		}

		//    volumeDisplay.innerHTML = vol.toFixed(0) + '%';
	});

	// volume icon click event

	let storedVolume = 1;
	volumeIcon.addEventListener('click', () => {
		if (audioPlayer.volume !== 0) {
			storedVolume = audioPlayer.volume;
		}

		if (volumeControl.value > 0) {

			volumeControl.value = 0;
			audioPlayer.volume = volumeControl.value;
			volumeIconMute.classList.remove('hidden');
		} else {

			volumeControl.value = storedVolume;
			audioPlayer.volume = volumeControl.value;
			volumeIconMute.classList.add('hidden');
		}
	});

	//load audio metadata (for duration data)
	audioPlayer.onloadedmetadata = function () {
		totalTime.innerHTML = ' / ' + toHHMMSS(audioPlayer.duration);
	};

	function play(btnType) {

		if (btnType !== '') {
			audioPlayer.play();
			if (!playBtn.classList.contains('hidden')) {
				playBtn.classList.add('hidden');
			}
			if (pauseBtn.classList.contains('hidden')) {
				pauseBtn.classList.remove('hidden');
			}
			trackUpdateInterval;
		} else {
			audioPlayer.play();
			playBtn.classList.toggle('hidden');
			pauseBtn.classList.toggle('hidden');
			trackUpdateInterval;
		}

	}

	//extra play buttons
	extraPlayBtns.forEach(e => {
		e.addEventListener('click', elm => {
			play('xtra');
		});
	});



	// play button
	playBtn.addEventListener('click', elm => {
		play('');
	});

	//pause button
	pauseBtn.addEventListener('click', elm => {
		audioPlayer.pause();
		playBtn.classList.toggle('hidden');
		pauseBtn.classList.toggle('hidden');
	});

	// stop trackUpdateInterval (time /timetrack updater)
	timeTrack.addEventListener('mousedown', elm => {
		clearInterval(trackUpdateInterval);
	});

	timeTrack.addEventListener('touchstart', elm => {
		clearInterval(trackUpdateInterval);

	});

	// play song at selected time + restart trackUpdateInterval
	timeTrack.addEventListener('click', elm => {
		setClickedTimeVal();
		trackUpdate();
		trackUpdateInterval = setInterval(trackUpdate, 1000);
		trackUpdateInterval;
	});

	timeTrack.addEventListener('touchend', elm => {
		setClickedTimeVal();
		trackUpdate();
		trackUpdateInterval = setInterval(trackUpdate, 1000);
		trackUpdateInterval;
	});

	timeTrack.addEventListener('drag', elm => {
		setClickedTimeVal();
		trackUpdate();
		trackUpdateInterval = setInterval(trackUpdate, 1000);
		trackUpdateInterval;
	});

	setTimeout(() => {
		if (totalTime.innerHTML === '') {
			//            console.log(totalTime);
			totalTime.innerHTML = ' / ' + toHHMMSS(audioPlayer.duration);
		}
	}, 2000);


}, false);