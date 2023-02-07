/** @format */

// script.js
// Load the background image from local storage
const imageWidth = 1920;
const imageHeight = 1080;
const imageURL =
  'https://source.unsplash.com/' + imageWidth + 'x' + imageHeight + '/?nature';
const image = new Image();
let isRefreshNeeded = true; // TODO: only refresh if 6h old

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

chrome.storage.local
  .get('imgData')
  .then((result) => {
    if (!result || !result.imgData) {
      image.src = imageURL;
      return;
    } else {
      image.src = 'data:image/png;base64,' + result.imgData;
    }
    image.onload = this.showImage;
  })
  .then(() => {
    this.refreshStoredImage();
  });

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

function showImage() {
  document.body.style.backgroundImage = "url('" + image.src + "')";
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center';
  var content = document.getElementById('content');
  content.className = 'show';
}

function refreshStoredImage() {
  const newImage = new Image();
  newImage.crossOrigin = 'anonymous';
  newImage.src = imageURL;
  newImage.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(newImage, 0, 0);
    var dataURL = canvas.toDataURL('image/png');

    // Clear storage and save downloaded image
    chrome.storage.local.clear().then((_) => {
      chrome.storage.local.set({
        imgData: dataURL.split(';base64,')[1],
      });
    });
  };
}
