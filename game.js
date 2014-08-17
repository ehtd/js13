/**
 * Created by ehtd on 8/16/14.
 */
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var tileSize = 32;
var rowTileCount = canvas.height/tileSize;
var colTileCount = canvas.width/tileSize;

var hero = {
    speed: 32,
    x:0,
    y:0
}


var playerHasMoved = false;

var canPressKey = true;

var keysDown = {};

addEventListener("keydown", function (e) {

    if (canPressKey){
        playerHasMoved = false;
        keysDown[e.keyCode] = true;
        canPressKey = false;
    }

}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
    canPressKey = true;
}, false);

var groundLayer = [];
var topLayer = [];

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = 32;
    hero.y = 32;

    groundLayer = generateBackground();
    topLayer = generateTerrain();

    topLayer[ 10 ][ 5 ] = hardWallIndex;
    topLayer[ 10 ][ 4 ] = hardWallIndex;
    topLayer[ 10 ][ 3 ] = hardWallIndex;
    topLayer[ 10 ][ 6 ] = hardWallIndex;

    topLayer[ 3 ][ 1 ] = destructibleWallIndex;
    topLayer[ 3 ][ 2 ] = destructibleWallIndex;
    topLayer[ 3 ][ 2 ] = destructibleWallIndex;
    topLayer[ 2 ][ 2 ] = destructibleWallIndex;
    topLayer[ 1 ][ 5 ] = destructibleWallIndex;
    topLayer[ 1 ][ 4 ] = destructibleWallIndex;
    topLayer[ 1 ][ 3 ] = destructibleWallIndex;
    topLayer[ 1 ][ 6 ] = destructibleWallIndex;
    topLayer[ 2 ][ 5 ] = destructibleWallIndex;
    topLayer[ 2 ][ 4 ] = destructibleWallIndex;
    topLayer[ 4 ][ 3 ] = destructibleWallIndex;
    topLayer[ 4 ][ 6 ] = destructibleWallIndex;
    topLayer[ 3 ][ 5 ] = destructibleWallIndex;
    topLayer[ 3 ][ 4 ] = destructibleWallIndex;
    topLayer[ 5 ][ 3 ] = destructibleWallIndex;
    topLayer[ 5 ][ 6 ] = destructibleWallIndex;

    //portals
    topLayer[ 7 ][ 1 ] = 10;
    topLayer[ 7 ][ 18 ] = 10;
    topLayer[ 1 ][ 10 ] = 10;
    topLayer[ 13 ][ 10 ] = 10;

    topLayer[ 6 ][ 7 ] = 8;
    topLayer[ 9 ][ 15 ] = 7;
    topLayer[ 13 ][ 5 ] = 3;
    topLayer[ 13 ][ 18 ] = 8;

};

var isHardWall = function(row, column){

    var tile = topLayer[ row ][ column ];

    if (tile == hardWallIndex){
        return true;
    }

    return false;
}

var isDestructibleWall = function(row, column){

    var tile = topLayer[ row ][ column ];

    if (tile == destructibleWallIndex){
        return true;
    }

    return false;
}

var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;

var update = function (modifier) {
    if (KEY_UP in keysDown && !playerHasMoved) {

        var row = (hero.y / tileSize) - 1;
        var column = (hero.x / tileSize);


        if (isDestructibleWall(row,column)){
            topLayer[row][column] = 0;
        } else if (!isHardWall(row,column)){
            hero.y -= hero.speed;
        }

        playerHasMoved = true;

    }

    if (KEY_DOWN in keysDown && !playerHasMoved) {

        var row = (hero.y / tileSize) + 1;
        var column = (hero.x / tileSize);

        if (isDestructibleWall(row,column)){
            topLayer[row][column] = 0;
        } else if (!isHardWall(row,column)) {
            hero.y += hero.speed;
        }

        playerHasMoved = true;

    }
    if (KEY_LEFT in keysDown && !playerHasMoved) {

        var row = (hero.y / tileSize);
        var column = (hero.x / tileSize) - 1;

        if (isDestructibleWall(row,column)){
            topLayer[row][column] = 0;
        } else if (!isHardWall(row,column)) {
            hero.x -= hero.speed;
        }
        playerHasMoved = true;

    }
    if (KEY_RIGHT in keysDown && !playerHasMoved) {

        var row = (hero.y / tileSize);
        var column = (hero.x / tileSize) + 1;

        if (isDestructibleWall(row,column)){
            topLayer[row][column] = 0;
        } else if (!isHardWall(row,column)) {
            hero.x += hero.speed;
        }
        playerHasMoved = true;
    }

};

var drawHero = function(){
    ctx.drawImage(tilesetImage, (3 * tileSize), (2 * tileSize), tileSize, tileSize, hero.x, hero.y, tileSize, tileSize);
}

var render = function () {

    ctx.clearRect(0,0,canvas.width, canvas.height);

    if (bgReady) {
        drawTiledBackground();

        drawHero();

    }

    // Score
//        ctx.fillStyle = "rgb(250, 250, 250)";
//        ctx.font = "24px Helvetica";
//        ctx.textAlign = "left";
//        ctx.textBaseline = "top";
//        ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    requestAnimationFrame(main);
};

var hardWallIndex = 12;
var destructibleWallIndex = 2;
var backgroundIndex = 1;

var getBackgroundRow = function() {
    var row = [];

    for (var i = 0; i < colTileCount; i++){
        row.push(backgroundIndex);
    }

    return row;
}

var generateBackground = function()
{
    var layer = [];

    for (var i = 0; i < rowTileCount; i++){
        layer.push(getBackgroundRow());
    }

    return layer;
}

var getFullRowWall = function() {
    var row = [];

    for (var i = 0; i < colTileCount; i++){
        row.push(hardWallIndex);
    }

    return row;
}

var getBorderedRowWall = function() {
    var row = [];
    row.push(hardWallIndex);
    for (var i = 1; i < colTileCount-1; i++){
        row.push(0);
    }
    row.push(hardWallIndex);
    return row;
}

var generateTerrain = function()
{
    var layer = [];

    layer.push(getFullRowWall());
    for (var i = 1; i < rowTileCount-1; i++){
        layer.push(getBorderedRowWall());
    }
    layer.push(getFullRowWall());

    return layer;
}

var bgReady = false;
var tilesetImage = new Image();
tilesetImage.src = 'js13k.png';
tilesetImage.onload = function () {
    bgReady = true;
};



var imageNumTiles = 4;  // The number of tiles per row in the tileset image

function drawTiledBackground () {
    for (var r = 0; r < rowTileCount; r++) {
        for (var c = 0; c < colTileCount; c++) {
            var tile = groundLayer[ r ][ c ];
            var tileRow = (tile / imageNumTiles) | 0; // Bitwise OR operation
            var tileCol = (tile % imageNumTiles) | 0;
            ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, (c * tileSize), (r * tileSize), tileSize, tileSize);

            tile = topLayer[ r ][ c ];
            tileRow = (tile / imageNumTiles) | 0;
            tileCol = (tile % imageNumTiles) | 0;
            ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, (c * tileSize), (r * tileSize), tileSize, tileSize);

        }
    }
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();
main();
