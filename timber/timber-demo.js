
var tempo = 120;        // tempo in beats per minute
var beat = 0;           // what beat are we on
var blinkTime = 150;    // time in ms that light will blink
var metronome = null;   // the metronome div
var notes = null;       // the notes div
var playing = false;    // is there a note currently playing
var currentNote = null; // the letter of the current note, if playing

var notesPlayed = [];   // history of the notes played


// additional init
function my_init(){
    // snag these dom elements
    metronome = jQuery("#metronome");
    notes = jQuery("#notes")
}

// callback for jquery slider to adjust tempo
function setTempo(){
   tempo = jQuery("#tempo-slider").slider("value");
   jQuery("#tempo").text(tempo);
}

var gray  = 'rgb(128, 128, 128)'
var red   = 'rgb(255, 0, 0)'
var green = 'rgb(0, 255, 0)'

// Make the metronome flash / click every (1 / tempo / 60) seconds
function metronomeClick() {

    console.log(metronome.css('background-color'));

    if(metronome.css('background-color') == gray) {
        // Start the blink
        if(beat % 4 == 0)
            metronome.css('background-color', red);
        else 
            metronome.css('background-color', green);

        if(playing){
            // If a note was playing, push it onto the notesPlayed array
            if(notesPlayed.push(currentNote) > 12)
                notesPlayed.shift();
            notes.text( notesPlayed )
            playing = false; // should be reset to true if we are playing
        }else {
            // If a note was not playing, push a "rest" onto notesPlayed
            if(notesPlayed.push("(__)") > 12)
                notesPlayed.shift();
            notes.text( notesPlayed )
        }
        setTimeout("metronomeClick()", blinkTime);
    } else {
        // End the blink
        metronome.css('background-color', gray);
        beat = beat + 1;
        setTimeout("metronomeClick()", (1 / (tempo / 60)) * 1000 - blinkTime);
    }
    return true;
}

// for integer to string conversion
var noteStrings = 
    ["(C )", "(C#)", "(D )", "(D#)", "(E )", "(F )", "(F#)", "(G )", "(G#)", "(A )", "(A#)", "(B )"];
    // 0       1       2       3       4       5       6       7       8       9       10      11

function note_detected(noteNumber, amplitude) {
    if(amplitude < .5) // threshold amplitude detecting a note
        return

    note = Math.round(noteNumber);
    playing = true;
    currentNote = noteStrings[note];
}

/* NOT WILLS CODE */

function debug(message) {
    $('debug').innerHTML += message + "<br>";
    $('debug').scrollTop = $('debug').scrollHeight;
}

var debug_visible = false;

function toggle_debug() {
    debug_visible = !debug_visible;
    if(debug_visible) {
        $('debug').style.display = "block";
	$('debug').scrollTop = $('debug').scrollHeight;
        $('debug_toggle_button').innerHTML = "hide debug output";
    } else {
        $('debug').style.display = "none";
        $('debug_toggle_button').innerHTML = "show debug output";
    }
    return false;
}

function timber_demo_init() {

    var mics = $("timber_demo_flash").getMicrophoneNames();
    var selects = "";
    for(i=0; i<mics.length; i++) {
        selects += "<option value='" + mics[i] + "'>" + mics[i] + "</option>";
    }
    $("microphone-select").innerHTML = selects;
    $("mics").style.display = "block";
    $("timber_demo_flash").setCallback("NOTE_DETECTED", "note_detected");
    $("timber_demo_flash").setCallback("DEBUG", "debug");
    $("timber_demo_flash").setCallback("MIC_INIT", "select_microphone");
    $("timber_demo_flash").setCallback("MIC_OK", "mic_ok");
    $("timber_demo_flash").setCallback("MIC_FAILED", "mic_failed");
    setTimeout(redraw, 100);
}

function mic_ok() {
    $('output').appear();
    $('debug_toggle').appear();
}

function mic_failed() {
    alert("Couldn't access a working microphone!");
}

function select_microphone(name) {
    var s = $('microphone-select');
    for(i=0; i<s.options.length; i++) {
        if(s.options[i].text == name) {
            s.selectedIndex = i;
        }
    }
}

function microphone_selected() {
    $("timber_demo_flash").useMicrophone($('microphone-select').selectedIndex);
}
