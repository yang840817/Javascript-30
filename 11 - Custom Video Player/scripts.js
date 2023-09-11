const video = document.querySelector(".player__video.viewer");
const playButton = document.querySelector(".player__button.toggle");
const playerSliderList = document.querySelectorAll(".player__slider");
const skipButtonList = document.querySelectorAll(".player__button[data-skip]");
const progressContainer = document.querySelector(".progress");
const progressFilled = document.querySelector(".progress__filled");

//video & playButton
[video, playButton].forEach((node) => {
  node.addEventListener("click", togglePlay);
});
//volume & playbackRate
playerSliderList.forEach((input) => {
  input.addEventListener("input", handlePlayerSliderInput);
});
// 2 skip Button
skipButtonList.forEach((button) => {
  button.addEventListener("click", handleSkipButtonClick);
});

// 進度條更新
video.addEventListener("timeupdate", updateProgress);
// 進度條事件
progressContainer.addEventListener("click", handleProgressEvents);
progressContainer.addEventListener("mousedown", handleProgressMouseDown);
progressContainer.addEventListener("mouseup", handleProgressMouseUp);
progressContainer.addEventListener("mouseleave", handleProgressMouseLeave);

function togglePlay() {
  if (video.paused) {
    video.play();
    playButton.textContent = "❚ ❚";
  } else {
    video.pause();
    playButton.textContent = "►";
  }
}

function handlePlayerSliderInput() {
  video[this.name] = this.value;
}

function handleSkipButtonClick() {
  video.currentTime += Number(this.dataset.skip);
}

function updateProgress() {
  progressFilled.style.flexBasis = `${
    (video.currentTime / video.duration) * 100
  }%`;
}

function handleProgressEvents(e) {
  video.currentTime =
    (e.offsetX / progressContainer.clientWidth) * video.duration;
}

function handleProgressMouseDown() {
  progressContainer.addEventListener("mousemove", handleProgressEvents);
}

function handleProgressMouseUp() {
  progressContainer.removeEventListener("mousemove", handleProgressEvents);
}

function handleProgressMouseLeave() {
  progressContainer.removeEventListener("mousemove", handleProgressEvents);
}
