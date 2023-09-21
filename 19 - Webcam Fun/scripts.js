//  video元素
const video = document.querySelector(".player");
//  canvas畫布
const canvas = document.querySelector(".photo");
//  設定 canvas內容使用2d接口
const ctx = canvas.getContext("2d");
//  拍照\截圖暫存區
const strip = document.querySelector(".strip");
//  音檔節點（拍照聲）
const snap = document.querySelector(".snap");

getUserMedia();
function getUserMedia() {
  const constraints = {
    audio: false,
    video: true,
    // video: { width: 1000, height: 1000 },
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      console.log(mediaStream);
      video.srcObject = mediaStream;
      video.play();
    })
    .catch((err) => console.log(err));
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);

    // mess with them
    // pixels = pinkEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;

    pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}
function pinkEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 255; // RED
    pixels.data[i + 1] = pixels.data[i + 1]; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] + 255; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
function takePhoto() {
  // 播放快門聲
  snap.currentTime = 0;
  snap.play();

  // 將canvas內容轉換為Blob物件
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Selfie");
    const screenshot = document.createElement("img");
    screenshot.src = url;
    screenshot.alt = "screenshot";
    link.appendChild(screenshot);
    strip.insertBefore(link, strip.firstChild);
  }, "image/jpeg");
}

video.addEventListener("canplay", paintToCanvas);
