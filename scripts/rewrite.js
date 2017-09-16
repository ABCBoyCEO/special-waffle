function updateSVG (level) {
  mysvg = document.getElementById("svg" + level);
}

function setSpellOnBoard(i) {
  var x = mysvg.children[i].getAttribute("x");
  var y = mysvg.children[i].getAttribute("y");
  mysvg.insertAdjacentHTML('beforeend', makeSVGTag("g", {
    class: "spell-display",
    "data-index": i,
    "data-id": config.id
  }));
  var gTag = mysvg.lastElementChild;
  if (config.color1 && config.color2) {
    gTag.insertAdjacentHTML('beforeend', makeSVGTag("rect", {
      height: 10,
      width: 10,
      stroke: config.color1,
      "stroke-width": 2,
      x: Number(x) + 4,
      y: Number(y) + 4,
      fill: config.color2,
      class: "spell",
      "data-index": i,
      "data-id": config.id
    }));
  }
  if (config.color3 && config.symbol1) {
    gTag.insertAdjacentHTML('beforeend', makeSVGTagContent("text", {
      x: Number(x) + 5,
      y: Number(y) + 15,
      "font-family": "monospac",
      "font-size": 17,
      stroke: "none",
      fill: config.color3,
      class: "spell-symbol spell-symbol1",
      "data-index": i,
      "data-id": config.id
    }, config.symbol1));
  }
  if (config.color4 && config.symbol2) {
    gTag.insertAdjacentHTML('beforeend', makeSVGTagContent("text", {
      x: Number(x) + 5,
      y: Number(y) + 15,
      "font-family": "monospac",
      "font-size": 17,
      stroke: "none",
      fill: config.color4,
      class: "spell-symbol spell-symbol2",
      "data-index": i,
      "data-id": config.id
    }, config.symbol2));
  }
}

function changeSpell(i, l) {
  var curMove = getSpell(i);
  var levMoves = DATA[LEVELS[l]].moves;
  var indexStr = (+i).toString(15);
  // Delete curMove
  if (curMove.dataset) {
    var id = curMove.dataset.id;

    // If painting over the same spell, skip everything.
    if (mouse.mode == "add" && id == config.id) return; 

    // Assuming levMoves[id] exists. If it doesn't, this section shouldn't run to begin with.
    levMoves[id] = levMoves[id].replace(new RegExp(indexStr + "(?=(..)*$)", "g"), "");
    if (levMoves[id] == "") {
      delete levMoves[id];
      removeDisplay(LEVELS[l], MOVES[IMOVE[id]].name);
    }
    curMove.remove();
  }

  if (mouse.mode == "add") {
    setSpellOnBoard(i);
    // Check and add display
    levMoves[config.id] = levMoves[config.id] || "";
    levMoves[config.id] += indexStr;
    setDisplay(LEVELS[l], MOVES[IMOVE[config.id]].name);
  }

  if (l == 3) return;
  // Peek nextMove
  updateSVG(+l+1);
  var nextMove = getSpell(i);
  if (! curMove.dataset && ! nextMove.dataset ) changeSpell(i, +l+1);
  else if (curMove.dataset.id == nextMove.dataset.id) changeSpell(i, +l+1);
}

function getSpell(index) {
  var ret = {};
  var moveGrid = mysvg.getElementsByClassName("spell-display");
  for (var i = 0; i < moveGrid.length; i++) {
    if (moveGrid[i].getAttribute("data-index") == index) {
      ret = moveGrid[i];
    }
  }

  return ret;
}

for (var ext = 0; ext < 4; ext ++) {
  updateSVG(ext);
  for (var i = 0; i < 225; i++) {
    mysvg.insertAdjacentHTML("beforeend", makeSVGTag("rect", {
      height: 17,
      width: 17,
      stroke: "#444",
      "stroke-width": 1,
      x: (i % 15) * 17 + 1,
      y: Math.floor(i / 15) * 17 + 1,
      fill: i % 2 ? "#ccc" : "#eee",
      class: "tile",
      "data-index": i,
      "data-level": ext,
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
  	"shape-rendering": "crispEdges"
  }));
	
  mysvg.insertAdjacentHTML("beforeend", makeSVGTag("circle", {
    cx: mysvg.getAttribute("width") / 2,
    cy: mysvg.getAttribute("height") / 2,
    r: 6,
    class: "piece",
    "data-index": 112
  }));
}

$(".tile").on("mousedown", function (e) {
  e.preventDefault();
  updateSVG(this.dataset.level);

  if (this.dataset.index == 112) return;

  var curMove = getSpell(this.dataset.index);
  if (curMove.dataset && curMove.dataset.id == config.id) mouse.mode = "remove";

  mouse.down = this.dataset.level;
  changeSpell(this.dataset.index, this.dataset.level);
});

$(".tile").on("mouseover", function (e) {
  e.preventDefault();
  updateSVG(this.dataset.level);

  if (mouse.down != this.dataset.level) return;
  if (this.dataset.index == 112) return;
  changeSpell(this.dataset.index, this.dataset.level);
});

$(".tile").on("contextmenu", function () {
  return false;
});

$(".tile[data-index=112]").on("dblclick", function (e) {
  e.preventDefault();
  for (var l = this.dataset.level; l < 4; l ++) {
    DATA[LEVELS[l]].move = DATA[LEVELS[l]] || "";
    setDisplay(LEVELS[l], MOVES[IMOVE[config.id]].name);
  }
});

$(document).on("mouseup dragend", function () {
  mouse.down = -1;
  mouse.mode = "add";
});

if ($("#code").val()) validate($("#code").val());