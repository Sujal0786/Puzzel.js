var rows = 3;
var columns = 3;

var currTile;
var otherTile; // blank tile
var turns = 0;

// var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
var imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];

window.onload = function () {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "images/" + imgOrder.shift() + ".jpg";

            // DRAG FUNCTIONALITY (for desktop)
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            // TOUCH FUNCTIONALITY (for mobile)
            tile.addEventListener("touchstart", touchStart);
            tile.addEventListener("touchmove", touchMove);
            tile.addEventListener("touchend", touchEnd);

            document.getElementById("board").append(tile);
        }
    }
}

// DRAG EVENTS (for desktop)
function dragStart() {
    currTile = this; // the tile being dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this; // the tile being dropped on
}

function dragEnd() {
    swapTiles();
}

// TOUCH EVENTS (for mobile)
var startX, startY;

function touchStart(e) {
    currTile = e.target; // the tile being touched
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}

function touchMove(e) {
    e.preventDefault(); // prevent scrolling
}

function touchEnd(e) {
    var endX = e.changedTouches[0].clientX;
    var endY = e.changedTouches[0].clientY;

    var deltaX = endX - startX;
    var deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Move sideways
        if (deltaX > 0) {
            otherTile = getTile(currTile, 0, 1); // right
        } else {
            otherTile = getTile(currTile, 0, -1); // left
        }
    } else {
        // Move vertically
        if (deltaY > 0) {
            otherTile = getTile(currTile, 1, 0); // down
        } else {
            otherTile = getTile(currTile, -1, 0); // up
        }
    }

    if (otherTile && otherTile.tagName === "IMG") {
        swapTiles();
    }
}

// Helper to get adjacent tile based on direction
function getTile(tile, rowOffset, colOffset) {
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]) + rowOffset;
    let c = parseInt(coords[1]) + colOffset;

    if (r >= 0 && r < rows && c >= 0 && c < columns) {
        return document.getElementById(r + "-" + c);
    }
    return null;
}

// COMMON FUNCTIONALITY (drag & touch)
function swapTiles() {
    if (!otherTile.src.includes("images/3.jpg")) {
        return; // only swap with blank tile
    }

    let currCoords = currTile.id.split("-"); // ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;
    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;
    }
}
