function makeSVGTag(tagName, properties) {
  var keys = Object.keys(properties);
  var ret = "<" + tagName;
  for (var i = 0; i < keys.length; i++) {
    ret += " " + keys[i] + '="' + properties[keys[i]] + '"';
  }
  ret += "/>";
  return ret;
}

function makeSVGTagContent(tagName, properties, content) {
  var keys = Object.keys(properties);
  var ret = "<" + tagName;
  for (var i = 0; i < keys.length; i++) {
    ret += " " + keys[i] + '="' + properties[keys[i]] + '"';
  }
  ret += ">" + content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</" + tagName + ">";
  return ret;
}

function setSpellOnBoard(color1, color2, color3, color4, symbol1, symbol2, i) {
  var x = mysvg.children[i].getAttribute("x");
  var y = mysvg.children[i].getAttribute("y");
  mysvg.insertAdjacentHTML('beforeend', makeSVGTag("rect", {
    height: 10,
    width: 10,
    stroke: color1,
    "stroke-width": 2,
    x: Number(x) + 4,
    y: Number(y) + 4,
    fill: color2,
    class: "spell spell-display",
    "data-index": i,
    //onmousedown: 'tileClick(' + i + ')',
    //onmouseover: 'tileDrag(' + i + ')'
  }));
  mysvg.insertAdjacentHTML('beforeend', makeSVGTagContent("text", {
    x: Number(x) + 5,
    y: Number(y) + 15,
    "font-family": "monospac",
    "font-size": 17,
    stroke: "none",
    fill: color3,
    class: "spell-symbol spell-symbol1 spell-display",
    "data-index": i,
    //onmousedown: 'tileClick(' + i + ')',
    //onmouseover: 'tileDrag(' + i + ')'
  }, symbol1));
  mysvg.insertAdjacentHTML('beforeend', makeSVGTagContent("text", {
    x: Number(x) + 5,
    y: Number(y) + 15,
    "font-family": "monospac",
    "font-size": 17,
    stroke: "none",
    fill: color4,
    class: "spell-symbol spell-symbol2 spell-display",
    "data-index": i,
    //onmousedown: 'tileClick(' + i + ')',
    //onmouseover: 'tileDrag(' + i + ')'
  }, symbol2));
}
var config = {
  color1: "#000",
  color2: "#fff",
  color3: "#048",
  color4: "#800",
  symbol1: "\uec61",
  symbol2: "\u00d7"
};

function changeMove(i) {
  if (mouse.mode == "add") {
    setSpellOnBoard(config.color1, config.color2, config.color3, config.color4, config.symbol1, config.symbol2, i);
  } else if (getMove(i)[0]) {
    if (typeof getMove(i)[0].remove == "function") {
      getMove(i)[0].remove();
    }
    if (typeof getMove(i)[1].remove == "function") {
      getMove(i)[1].remove();
    }
    if (typeof getMove(i)[2].remove == "function") {
      getMove(i)[2].remove();
    }
  }
}

var mouse = {
  down: false,
  mode: "add"
};

function getMove(index) {
  var ret = [, , ];
  var moveList = mysvg.getElementsByClassName("spell");
  for (var i = 0; i < moveList.length; i++) {
    if (moveList[i].getAttribute("data-index") == index) {
      ret[0] = moveList[i];
    }
  }
  moveList = mysvg.getElementsByClassName("spell-symbol1");
  for (var i = 0; i < moveList.length; i++) {
    if (moveList[i].getAttribute("data-index") == index) {
      ret[1] = moveList[i];
    }
  }
  moveList = mysvg.getElementsByClassName("spell-symbol2");
  for (var i = 0; i < moveList.length; i++) {
    if (moveList[i].getAttribute("data-index") == index) {
      ret[2] = moveList[i];
    }
  }
  return ret;
}

//window.tileClick = tileClick;
//window.tileDrag = tileDrag;

for (var i = 0; i < 225; i++) {
  mysvg.insertAdjacentHTML("beforeend", makeSVGTag("rect", {
    height: 17,
    width: 17,
    stroke: "#444",
    "stroke-width": 1,
    x: (i % 15) * 17 + 1,
    y: Math.floor(i / 15) * 17 + 1,
    fill: i % 2 ? "#ccc" : "#eee",
    //onmousedown: 'tileClick(' + i + ')',
    //onmouseover: 'tileDrag(' + i + ')',
    class: "tile",
    "data-index": i,
    "data-level": "base",
    draggable: false,
    "shape-rendering": "crispEdges"
  }));
}

mysvg.insertAdjacentHTML("beforeend", makeSVGTag("rect", {
  height: 256,
  width: 256,
  stroke: "#444",
  "stroke-width": 2,
  x: 0,
  y: 0,
  fill: "transparent",
  draggable: false,
  class: "ignore-mouse",
}));

mysvg.insertAdjacentHTML("beforeend", makeSVGTag("circle", {
  cx: mysvg.getAttribute("width") / 2,
  cy: mysvg.getAttribute("height") / 2,
  r: 6,
  class: "piece",
  "data-index": 112
}));

$(".tile").on("mousedown", function (e) {
  e.preventDefault();
  if (this.dataset.index == 112) return;
  if (getMove(this.dataset.index)[0] || e.which == 3) mouse.mode = "remove";
  mouse.down = this.dataset.level;
  changeMove(this.dataset.index);
});

$(".tile").on("mouseover", function (e) {
  e.preventDefault();
  if (mouse.down != this.dataset.level) return;
  if (this.dataset.index == 112) return;
  changeMove(this.dataset.index);
});

$(".tile").on("contextmenu", function () {
  return false;
});

$(document).on("mouseup dragend", function () {
  mouse.down = false;
  mouse.mode = "add";
});