/**
 * Created by ehtd on 8/14/14.
 */

var soundURL = jsfxr([0,,0.1812,,0.1349,0.4524,,0.2365,,,,,,0.0819,,,,,1,,,,,0.5]);
var player = new Audio();
player.src = soundURL;


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
        _.audio.play();
    }
    catch(e)
    {
        alert( e );
    }
    _.audio.parentNode.style.opacity = 1;
    _.button.disabled = false;
}
