/**
 * Created by ehtd on 8/16/14.
 */

//TODO: Add fog of war, maybe using oil drop
//TODO: Increase hero attack after killing an enemy, reduce it to normal after certain steps


var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var tileSize = 32;
var rowTileCount = canvas.height/tileSize;
var colTileCount = canvas.width/tileSize;

var destructibleWallProbability = 1;

var hero = {
    speed: 1,
    x:0,
    y:0,
    hp:10,
    attack:3
}

var enemies = [];

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
    hero.x = 1;
    hero.y = 1;

    groundLayer = generateBackground();
    topLayer = generateTerrain();
    generateEnemies();

    //clear up terrain for each enemy
    enemies.forEach(function(enemy){

        topLayer[enemy.y][enemy.x] = 0;
    });

    //TODO: Add portals
//    topLayer[ 7 ][ 1 ] = 10;
//    topLayer[ 7 ][ 18 ] = 10;
//    topLayer[ 1 ][ 10 ] = 10;
//    topLayer[ 13 ][ 10 ] = 10;

};

var isEnemy = function(row,column){

    var enemyFound = false;

    enemies.forEach(function(enemy){

        if (!enemy.alive) return;

        if (enemy.x == column && enemy.y == row){
            enemyFound = true;
            enemy.hp -= hero.attack;

            if (enemy.hp <= 0) {
                enemy.alive = false;
            }
        }

    });

    return enemyFound
}

var isHardWall = function(row, column){

    var tile = topLayer[row][column];

    if (tile == hardWallIndex){
        return true;
    }

    return false;
}

var isDestructibleWall = function(row, column){

    var tile = topLayer[row][column];

    if (tile == destructibleWallIndex){
        return true;
    }

    return false;
}

var moveToPlayer = function(enemy){

    if (!enemy.alive) return;

    //TODO: Improve, this is first draft

    var xDistance = Math.abs(hero.x-enemy.x);
    var yDistance = Math.abs(hero.y-enemy.y);

    var manhattanDistance = xDistance + yDistance;

    if (manhattanDistance == 1){//Attack player directly

        hero.hp -= enemy.attack;

        return;
    }

    //TODO: avoid enemy overlap
    if (yDistance > xDistance) { //Try to move first in Y

        if (hero.y > enemy.y){ //Move down

            var row = enemy.y + 1;
            var column = enemy.x;

            if (isDestructibleWall(row,column)){
                topLayer[row][column] = 0;
            } else{
                enemy.y += 1;
            }

        } else{ //Move up

            var row = enemy.y - 1;
            var column = enemy.x;

            if (isDestructibleWall(row,column)){
                topLayer[row][column] = 0;
            } else{
                enemy.y -= 1;
            }

        }
    } else{

        if (hero.x > enemy.x){ //Move right

            var row = enemy.y;
            var column = enemy.x + 1;

            if (isDestructibleWall(row,column)){
                topLayer[row][column] = 0;
            } else{
                enemy.x += 1;
            }

        } else{ //Move left

            var row = enemy.y;
            var column = enemy.x - 1;

            if (isDestructibleWall(row,column)){
                topLayer[row][column] = 0;
            } else{
                enemy.x -= 1;
            }

        }

    }

}

var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;

var update = function (modifier) {
    if (KEY_UP in keysDown && !playerHasMoved) {

        var row = hero.y - 1;
        var column = hero.x;


        if (isDestructibleWall(row,column)){
            topLayer[row][column] = 0;
        } else if (isEnemy(row,column)){
            //TODO: add experience or something
        } else if (!isHardWall(row,column)){
            hero.y -= hero.speed;
        }

        playerHasMoved = true;

        enemies.forEach(moveToPlayer);

    }

    if (KEY_DOWN in keysDown && !playerHasMoved) {

        var row = hero.y + 1;
        var column = hero.x;

        if (isDestructibleWall(row,column)){
            topLayer[row][column] = 0;
        } else if (isEnemy(row,column)){
            //TODO: add experience or something
        } else if (!isHardWall(row,column)) {
            hero.y += hero.speed;
        }

        playerHasMoved = true;

        enemies.forEach(moveToPlayer);

    }
    if (KEY_LEFT in keysDown && !playerHasMoved) {

        var row = hero.y;
        var column = hero.x - 1;

        if (isDestructibleWall(row,column)){
            topLayer[row][column] = 0;
        } else if (isEnemy(row,column)){
            //TODO: add experience or something
        } else if (!isHardWall(row,column)) {
            hero.x -= hero.speed;
        }
        playerHasMoved = true;

        enemies.forEach(moveToPlayer);

    }
    if (KEY_RIGHT in keysDown && !playerHasMoved) {

        var row = hero.y;
        var column = hero.x + 1;

        if (isDestructibleWall(row,column)){
            topLayer[row][column] = 0;
        } else if (isEnemy(row,column)){
            //TODO: add experience or something
        } else if (!isHardWall(row,column)) {
            hero.x += hero.speed;
        }
        playerHasMoved = true;

        enemies.forEach(moveToPlayer);
    }

};

var drawHero = function(){
    ctx.drawImage(tilesetImage, (3 * tileSize), (2 * tileSize), tileSize, tileSize, hero.x*tileSize, hero.y*tileSize-10, tileSize, tileSize);
}

var drawEnemy = function(enemy){

    if (!enemy.alive) return;

    var row = 0;
    var col = 0;

    switch (enemy.type){
        case redCentaurIndex:
            col = 0;
            row = 2;

            break;
        case blueCentaurIndex:
            col = 3;
            row = 1;
            break;

    }

    ctx.drawImage(tilesetImage, (col * tileSize), (row * tileSize), tileSize, tileSize, enemy.x*tileSize, enemy.y*tileSize-10, tileSize, tileSize);
}

var render = function () {

    ctx.clearRect(0,0,canvas.width, canvas.height);

    if (bgReady) {
        drawTiledBackground();

        drawHero();

    }

    enemies.forEach(function(enemy){
        drawEnemy(enemy);
    });

    //TODO: improve the display
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("HP: " + hero.hp + " A: "+hero.attack, 32, 0);
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

var redCentaurIndex = 8;
var blueCentaurIndex = 7;

var getEnemy = function (type){

    var enemy = {
        speed: 1,
        x:0,
        y:0,
        hp:0,
        attack:1,
        alive:true
    }

    enemy.type = type;

    enemy.x = (Math.floor((Math.random() * (colTileCount-2)) + 1));
    enemy.y = (Math.floor((Math.random() * (rowTileCount-2)) + 1));

    switch (type){
        case redCentaurIndex:
            enemy.hp = 9;

            break;
        case blueCentaurIndex:
            enemy.hp = 1;

            break;

    }

    return enemy;
}

var generateEnemies = function() {

    //TODO: handle multiple rooms

    var enemyIndexes = [redCentaurIndex, blueCentaurIndex];

    var enemyNumber = 4;

    for (i = 0; i < enemyNumber; i++){

        //TODO: random enemies
        var enemy = getEnemy(redCentaurIndex);
        enemies.push(enemy);
    }

    //TODO: Validate enemies do not spawn in same place or too near player
}

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

        if (Math.random() > destructibleWallProbability)  {
            row.push(0);
        } else{
            row.push(destructibleWallIndex);
        }


    }
    row.push(hardWallIndex);
    return row;
}

var generateTerrain = function()
{
    //TODO: Add hard wall generation

    var layer = [];

    layer.push(getFullRowWall());
    for (var i = 1; i < rowTileCount-1; i++){
        layer.push(getBorderedRowWall());
    }
    layer.push(getFullRowWall());

    //Always clear the space for hero
    layer[hero.y][hero.x] = 0;

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
