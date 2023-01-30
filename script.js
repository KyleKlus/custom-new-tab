// script.js
// Load the background image and hide the loading screen
var image = new Image();
image.src = "https://source.unsplash.com/1920x1080/?nature";
image.onload = function() {
    console.log("test")
    document.body.style.backgroundImage = "url('" + image.src + "')";
    var content = document.getElementById("bookmark-list");
    content.className = "show";
};

chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    var list = document.getElementById("bookmark-list");
    for (var i = 0; i < bookmarkTreeNodes[0].children[0].children.length; i++) {
      var node = bookmarkTreeNodes[0].children[0].children[i];
      if(!node.url) continue
      var li = document.createElement("li");
      var a = document.createElement("a");
        a.href = node.url;
        a.innerText = node.title;
        a.innerHTML = "<img src='https://s2.googleusercontent.com/s2/favicons?domain=" + node.url + "&sz=16' height='16' width='16' style='margin-right:10px; overflow: hidden; text-wrap:nowrap'>" + node.title;
      li.appendChild(a);
      list.appendChild(li);
    }
});

// Refresh the background image every day
setInterval(function() {
  document.querySelector(".loader").style.display = "flex";
  var image = new Image();
  image.src = "https://source.unsplash.com/1920x1080/?nature";
  image.onload = function() {
    document.body.style.backgroundImage = "url('" + image.src + "')";
    var content = document.getElementById("bookmark-list");
    content.className = "show";
  };
}, 86400000);
