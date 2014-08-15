/**
 * Created by ehtd on 8/14/14.
 */

//From http://www.p01.org/releases/140bytes_music_softSynth/


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
