/**
 * Created by ehtd on 8/14/14.
 */

var sounds = {
    "test" : [0,,0.1812,,0.1349,0.4524,,0.2365,,,,,,0.0819,,,,,1,,,,,0.5],
    "start" : [0,,0.0911,0.4779,0.434,0.5016,,,,,,0.3504,0.6396,,,,,,1,,,,,0.5],
    "dirt" : [3,,0.1337,0.3709,0.0896,0.0379,,0.2476,,,,,,,,0.4619,0.1879,-0.1484,1,,,,,0.5],
    "hp" : [0,,0.3722,,0.407,0.3215,,0.4808,,,,,,0.2295,,0.6552,,,1,,,,,0.5],
    "horse" : [0,,0.3239,,0.4899,0.3072,,0.1272,,,,,,0.2305,,0.7536,,,1,,,,,0.5],
    "treasure": [1,,0.3429,,0.2116,0.2116,,0.2249,,,,,,,,,,,1,,,,,0.5],
    "enemy" : [1,,0.0919,,0.2654,0.5705,,-0.3563,,,,,,,,,,,1,,,,,0.5],
    "move" : [1,,0.0458,,0.1652,0.442,,0.1422,,,,,,,,,,,1,,,,,0.0]
}


//var soundURL = jsfxr([0,,0.1812,,0.1349,0.4524,,0.2365,,,,,,0.0819,,,,,1,,,,,0.5]);
var player = new Audio();
player.src = jsfxr(sounds.start);

//Music from very short programs - the 3rd iteration
//By: Ville-Matias Heikkilä
//https://www.youtube.com/watch?v=tCRPUv8V22o

//From http://www.p01.org/releases/140bytes_music_softSynth/

//http://countercomplex.blogspot.mx/2011/10/algorithmic-symphonies-from-one-line-of.html
//(t*5&t>>7)|(t*3&t>>10)

//((t*10)|(t*3 &t >> 15)|(t*30 &t >> 70) | (sin(t)))&255
//((t*15) | t | t>>7)&255

//	faster implementation in 142bytes
var softsynth = function(f){return eval("for(var t=0,S='RIFF_oO_WAVEfmt "+atob('EAAAAAEAAQBAHwAAQB8AAAEACAA')+"data';++t<3e5;)S+=String.fromCharCode("+f+")")};

var e,_={};
_.button 	= document.getElementById('generate');
_.audio		= document.getElementById('audio');
_.formula	= document.getElementById('formula');
_.button.onclick = startPlayer;

function startPlayer() {
    _.button.disabled = true;
    _.audio.parentNode.style.opacity = .3;
    try
    {
        //	allow sin/cos/tan/floor/ceil shorthands
        var crazyFormula = _.formula.value.replace(/(sin|cos|tan|floor|ceil)/g,'Math.$1');

        _.audio.stop&&_.audio.stop();
        _.audio.src = 'data:audio/wav;base64,'+btoa( softsynth( crazyFormula ) );
        _.audio.title = _.formula.value;
        _.audio.volume = 0.3
        _.audio.play();
    }
    catch(e)
    {
        alert( e );
    }
    _.audio.parentNode.style.opacity = 1;
    _.button.disabled = false;
}
