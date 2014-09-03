/**
 * Created by ehtd on 8/16/14.
 */

//TODO: Add fog of war, maybe using oil drop
//TODO: Increase hero attack after killing an enemy, reduce it to normal after certain steps

var STATES = {
    "MENU":"menuState",
    "GAME":"gameState",
    "WIN":"winState",
    "LOSE":"loseState"
}

var currentState = STATES.MENU;

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var tileSize = 32;
var rowTileCount = 48;//canvas.height/tileSize + 10;
var colTileCount = 48;//canvas.width/tileSize;

var destructibleWallProbability = 1;

var playerAlive = true;

var camera = {
    x:0,
    y:0
}

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
        console.log(e.keyCode);
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
var topLayer = [[]];

var reset = function () {


    playerAlive = true;
    enemies = [];

    hero = {
        speed: 1,
        x:0,
        y:0,
        hp:10,
        attack:3
    }

    groundLayer = generateBackground();
    topLayer = createWorld();
    generateEnemies();

    hero.x = 1;
    hero.y = 1;

    topLayer[hero.y][hero.x] = 0;

    //clear up terrain for each enemy
//    enemies.forEach(function(enemy){
//
//        topLayer[enemy.y][enemy.x] = 0;
//    });

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

    if (!playerAlive) return;

    //TODO: Improve, this is first draft

    var xDistance = Math.abs(hero.x-enemy.x);
    var yDistance = Math.abs(hero.y-enemy.y);

    var manhattanDistance = xDistance + yDistance;

    if (manhattanDistance == 1){//Attack player directly

        hero.hp -= enemy.attack;

        if (hero.hp <= 0){
            currentState = STATES.LOSE;
        }
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
var KEY_X = 88;

var update = function (modifier) {

    if (currentState == STATES.MENU){

        if (KEY_X in keysDown){
            currentState = STATES.GAME;
        }

        return;
    }

    if (currentState == STATES.LOSE){

        if (KEY_X in keysDown){
            currentState = STATES.MENU;
            reset();
        }

        return;
    }

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

        player.play();
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

        player.play();
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

        player.play();
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
        player.play();
    }

    camera.x = hero.x - Math.floor((canvas.width/tileSize)/2);
    camera.y = hero.y - Math.floor((canvas.height/tileSize)/2);

};

var drawHero = function(){
    ctx.drawImage(tilesetImage, (3 * tileSize), (2 * tileSize), tileSize, tileSize, (hero.x - camera.x)*tileSize, (hero.y-camera.y)*tileSize-10, tileSize, tileSize);
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

    ctx.drawImage(tilesetImage, (col * tileSize), (row * tileSize), tileSize, tileSize, (enemy.x -camera.x)*tileSize, (enemy.y-camera.y)*tileSize-10, tileSize, tileSize);
}


var generateFOW = function (){

    var FOW = [];

        for (var r = 0; r < rowTileCount; r++) {

            var column = [];

            for (var c = 0; c < colTileCount; c++) {

                column.push(0);
            }

            FOW.push(column);
        }

    return FOW;

}

var drawFOW = function(){

    var FOW = generateFOW();

    //Prepare for hero
    for (var r = 0; r < rowTileCount; r++) {
        for (var c = 0; c < colTileCount; c++) {

            var xDistance = Math.abs(hero.x-camera.x-c);
            var yDistance = Math.abs(hero.y-camera.y-r);

            var manhattanDistance = xDistance + yDistance;

            if (manhattanDistance < 3){
                FOW[r][c] = 0
            }
            else if (manhattanDistance < 4){
                FOW[r][c] = 0.3
            }
            else if (manhattanDistance < 5){
                FOW[r][c] = 0.5
            } else{
                FOW[r][c] = 0.7
            }

//            enemies.forEach(function(enemy){
//                var xDistance = Math.abs(hero.x-enemy.x);
//                var yDistance = Math.abs(hero.y-enemy.y);
//
//                var manhattanDistance = xDistance + yDistance;
//
//                if (manhattanDistance < 8){
//                    FOW[enemy.y][enemy.x] = 0
//                }
//            });
        }
    }

    for (var r = 0; r < rowTileCount; r++) {
        for (var c = 0; c < colTileCount; c++) {

            ctx.fillStyle = "rgba(0, 0, 0,"+FOW[r][c]+")";
            ctx.fillRect(c*tileSize, r*tileSize, tileSize, tileSize);
        }
    }

}

var render = function () {

    ctx.clearRect(0,0,canvas.width, canvas.height);

    if (currentState == STATES.GAME){
        if (bgReady) {
            drawTiledBackground();

            drawHero();

            enemies.forEach(function(enemy){
                drawEnemy(enemy);
            });

            drawFOW();


        }

        //TODO: improve the display
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("HP: " + hero.hp + " A: "+hero.attack, 32, 0);

    } else if (currentState == STATES.MENU){

        var shield_maiden_title = [[0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0,0,0,0.8,0,0.8,0,0.8,0,0.8,0,0,0.8,0,0.8,0.8,0,0,0.8,0.8,0.8],
            [0.8,0,0.8,0.8,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0.8,0,0.8,0.8,0,0.8,0,0.8,0.8],
            [0.8,0,0,0,0.8,0,0,0,0.8,0,0.8,0,0,0.8,0,0.8,0.8,0,0.8,0,0.8,0.8],
            [0.8,0.8,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0.8,0,0.8,0.8,0,0.8,0,0.8,0.8],
            [0.8,0,0,0,0.8,0,0.8,0,0.8,0,0.8,0,0,0.8,0,0,0.8,0,0,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0,0,0,0,0,0.8,0,0,0,0.8,0,0.8,0,0,0.8,0.8,0,0,0.8,0,0,0],
            [0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0.8,0,0.8,0],
            [0,0.8,0.8,0.8,0,0.8,0,0,0,0.8,0,0.8,0,0.8,0,0.8,0,0,0.8,0,0.8,0],
            [0,0.8,0.8,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0.8,0,0.8,0],
            [0,0.8,0.8,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0,0,0.8,0.8,0,0,0.8,0,0.8,0],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8]
        ];

        for (var r = 0; r < canvas.height/tileSize; r++) {
            for (var c = 0; c < canvas.width/tileSize; c++) {

                var tile = hardWallIndex;
                var tileRow = (tile / imageNumTiles) | 0;
                var tileCol = (tile % imageNumTiles) | 0;
                ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, ((c) * tileSize), ((r) * tileSize), tileSize, tileSize);

                ctx.fillStyle = "rgba(0, 0, 0,"+shield_maiden_title[r][c]+")";
                ctx.fillRect(c*tileSize, r*tileSize, tileSize, tileSize);
            }
        }

        ctx.fillStyle = "rgb(100, 177, 164)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("– Press X to START your adventure – ", 150, 420);

        ctx.drawImage(tilesetImage, (3 * tileSize), (2 * tileSize), tileSize, tileSize, (3)*tileSize, (13)*tileSize, tileSize, tileSize);

    } else if (currentState == STATES.LOSE){

        var shield_maiden_title = [
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0,0,0.8,0.8,0,0,0.8,0,0,0,0.8,0,0,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0,0.8,0,0.8,0,0.8,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0,0.8,0,0.8,0,0,0.8,0,0,0,0.8,0,0.8,0,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0,0.8,0,0.8,0,0.8,0.8,0,0.8,0,0.8,0,0.8,0,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0,0,0.8,0.8,0,0,0.8,0,0.8,0,0.8,0,0,0.8,0.8,0,0.8,0,0.8,0,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
            [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8]
        ];

        for (var r = 0; r < canvas.height/tileSize; r++) {
            for (var c = 0; c < canvas.width/tileSize; c++) {

                var tile = hardWallIndex;
                var tileRow = (tile / imageNumTiles) | 0;
                var tileCol = (tile % imageNumTiles) | 0;
                ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, ((c) * tileSize), ((r) * tileSize), tileSize, tileSize);

                ctx.fillStyle = "rgba(0, 0, 0,"+shield_maiden_title[r][c]+")";
                ctx.fillRect(c*tileSize, r*tileSize, tileSize, tileSize);
            }
        }

        ctx.fillStyle = "rgb(100, 177, 164)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        ctx.fillText("– An honorable death... Press X to RETRY –", 130, 420);

    }

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

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillRect(c*tileSize, r*tileSize, tileSize, tileSize);

        }
    }

    for (var r = 0; r < rowTileCount; r++) {
        for (var c = 0; c < colTileCount; c++) {
            var tile = groundLayer[ r ][ c ];
            var tileRow = (tile / imageNumTiles) | 0; // Bitwise OR operation
            var tileCol = (tile % imageNumTiles) | 0;
            ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, ((c - camera.x) * tileSize), ((r - camera.y) * tileSize), tileSize, tileSize);

            tile = topLayer[ r ][ c ];
            tileRow = (tile / imageNumTiles) | 0;
            tileCol = (tile % imageNumTiles) | 0;
            ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, ((c - camera.x) * tileSize), ((r - camera.y) * tileSize), tileSize, tileSize);

        }
    }
}

// the world grid: a 2d array of tiles
var world = [[]];

// size in the world in sprite tiles
var worldWidth =rowTileCount;
var worldHeight = colTileCount;

// size of a tile in pixels (this is only important for drawing)
var tileWidth = 32;
var tileHeight = 32;

function createWorld()
{
    birthLimit = 4;
    deathLimit = 3;
    chanceToStartAlive = 0.4;
    numberOfSteps = 2;

    world = generateMap();
    1;
//    redraw();

    return world;
}

function generateMap()
{
    //So, first we make the map
    var map = [[]];
    //And randomly scatter solid blocks
    initialiseMap(map);

    //Then, for a number of steps
    for(var i=0; i<numberOfSteps; i++){
        //We apply our simulation rules!
        map = doSimulationStep(map);
    }

    map[0] = getFullRowWall();
    map[rowTileCount -1] = getFullRowWall();


    for (var y=1; y < worldHeight -1; y++)
    {
        map[y][0] = hardWallIndex;
        map[y][worldHeight -1] = hardWallIndex;

    }

    //And we're done!
    return map;
}

function initialiseMap(map)
{
    for (var x=0; x < worldWidth; x++)
    {
        map[x] = [];
        for (var y=0; y < worldHeight; y++)
        {
            map[x][y] = 0;
        }
    }

    for (var x=0; x < worldWidth; x++)
    {
        for (var y=0; y < worldHeight; y++)
        {
            //Here we use our chanceToStartAlive variable
            if (Math.random() < chanceToStartAlive)
            //We're using numbers, not booleans, to decide if something is solid here. 0 = not solid
                map[x][y] = destructibleWallIndex;
        }
    }

    return map;
}

function doSimulationStep(map)
{
    //Here's the new map we're going to copy our data into
    var newmap = [[]];
    for(var x = 0; x < map.length; x++){
        newmap[x] = [];
        for(var y = 0; y < map[0].length; y++)
        {
            //Count up the neighbours
            var nbs = countAliveNeighbours(map, x, y);
            //If the tile is currently solid
            if(map[x][y] > 0){
                //See if it should die
                if(nbs < deathLimit){
                    newmap[x][y] = 0;
                }
                //Otherwise keep it solid
                else{
                    newmap[x][y] = destructibleWallIndex;
                }
            }
            //If the tile is currently empty
            else{
                //See if it should become solid
                if(nbs > birthLimit){
                    newmap[x][y] = destructibleWallIndex;
                }
                else{
                    newmap[x][y] = 0;
                }
            }
        }
    }

    return newmap;
}

//This function counts the number of solid neighbours a tile has
function countAliveNeighbours(map, x, y)
{
    var count = 0;
    for(var i = -1; i < 2; i++){
        for(var j = -1; j < 2; j++){
            var nb_x = i+x;
            var nb_y = j+y;
            if(i == 0 && j == 0){
            }
            //If it's at the edges, consider it to be solid (you can try removing the count = count + 1)
            else if(nb_x < 0 || nb_y < 0 ||
                nb_x >= map.length ||
                nb_y >= map[0].length){
                count = count + 1;
            }
            else if(map[nb_x][nb_y] == destructibleWallIndex){
                count = count + 1;
            }
        }
    }
    return count;
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();
main();
