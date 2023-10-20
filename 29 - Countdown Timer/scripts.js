const buttons = document.querySelectorAll(".timer__button");
const customForm = document.querySelector("#custom");
const endTime = document.querySelector(".display__end-time");
const timeLeft = document.querySelector(".display__time-left");

let interval;

buttons.forEach((button) => {
  button.addEventListener("click", handleClick);
});

customForm.addEventListener("submit", handleSubmit);

function handleClick(e) {
  const seconds = Number(this.dataset.time);
  if (!isNaN(seconds)) timer(seconds);
}

function handleSubmit(e) {
  e.preventDefault();
  const seconds = Number(this.minutes.value) * 60;
  if (!isNaN(seconds)) timer(seconds);
  this.reset();
}

function timer(seconds) {
  clearInterval(interval);
  const endTimeStamp = Date.now() + seconds * 1000;
  displayTimeLeft(endTimeStamp);
  displayEndTime(endTimeStamp);
  interval = setInterval(() => {
    displayTimeLeft(endTimeStamp);
  }, 1000);
}

function displayEndTime(endTimeStamp) {
  const endHours = new Date(endTimeStamp).getHours();
  const endMinutes = new Date(endTimeStamp).getMinutes();
  endTime.textContent = `Be back At ${endHours}:${
    endMinutes < 10 ? 0 : ""
  }${endMinutes}`;
}
function displayTimeLeft(endTimeStamp) {
  const nowTimeStamp = Date.now();
  const leftSeconds = Math.max(
    Math.round((endTimeStamp - nowTimeStamp) / 1000),
    0
  );
  const minutes = Math.floor(leftSeconds / 60);
  const seconds = leftSeconds % 60;
  const timeString = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  document.title = timeString;
  timeLeft.textContent = timeString;
  if (nowTimeStamp > endTimeStamp) {
    clearInterval(interval);
  }
}
