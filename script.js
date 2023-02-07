/** @format */

// script.js
// Load the background image from local storage
const imageWidth = 1920;
const imageHeight = 1080;
const imageURL =
  'https://source.unsplash.com/' + imageWidth + 'x' + imageHeight + '/?nature';
const image = new Image();
let imageData;
let isRefreshNeeded = true; // TODO: only refresh if 6h old

chrome.storage.local.get('imgData').then((result) => {
  imageData = result.imgData;
});

if (!imageData) {
  image.src = imageURL;
} else {
  image.src = 'data:image/png;base64,' + imageData;
  chrome.storage.local.remove('imgData');
}

image.onload = function () {
  document.body.style.backgroundImage = "url('" + image.src + "')";
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center';
  var content = document.getElementById('content');
  content.className = 'show';
};

// Init clock
function refreshClock() {
  const clock = document.getElementById('clock');
  if (clock) {
    const time = new Date();
    clock.innerHTML = time.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
this.refreshClock();

setInterval(() => this.refreshClock(), 1000);

// Load bookmarks
if (chrome) {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    var list = document.getElementById('bookmark-list');
    for (var i = 0; i < bookmarkTreeNodes[0].children[0].children.length; i++) {
      var node = bookmarkTreeNodes[0].children[0].children[i];
      if (!node.url) continue;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = node.url;
      a.innerText = node.title;
      a.innerHTML =
        "<img src='https://s2.googleusercontent.com/s2/favicons?domain=" +
        node.url +
        "&sz=16' height='16' width='16' style='margin-right:10px; overflow: hidden; text-wrap:nowrap'>" +
        node.title;
      li.appendChild(a);
      list.appendChild(li);
    }
  });
}

// Save a new background image to local storage
if (isRefreshNeeded) {
  const newImage = new Image();
  newImage.crossOrigin = 'anonymous';
  newImage.src = imageURL;
  newImage.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(newImage, 0, 0);
    var dataURL = canvas.toDataURL('image/png');
    chrome.storage.local.set({
      imgData: dataURL.replace(/^data:image\/(png|jpg);base64,/, ''),
    });
  };
}
