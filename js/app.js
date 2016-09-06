// (MillToTimecode(player.duration(), timeFormat))

//Converts time in seconds to a broadcast timecode
//timeFormat: 'PAL', 'PALp', 'NTSC', 'STANDARD'
// function MillToTimecode(seconds, TimeFormat) {

//     //alert(milliseconds);

//     var h = Math.floor(seconds / 3600);

//     seconds = seconds - h * 3600;

//     var m = Math.floor(seconds / 60);

//     seconds = seconds - m * 60;

//     var s = Math.floor(seconds);

//     seconds = seconds - s;

//     if (TimeFormat == 'PAL') {
//         var f = Math.floor((seconds * 1000) / 40);
//     }
//     else if (TimeFormat == 'NTSC') {
//         var f = Math.floor((seconds * 1000) / (100 / 3));
//     }
//     else if (TimeFormat == 'PALp') {
//         var f = Math.floor((seconds * 1000) / 20);
//     }
//     else if (TimeFormat == 'STANDARD') {
//         var f = Math.floor(seconds * 1000);
//     }

//     // Check if we need to show hours
//     h = (h < 10) ? ("0" + h) + ":" : h + ":";

//     // If hours are showing, we may need to add a leading zero.
//     // Always show at least one digit of minutes.
//     m = (((h) && m < 10) ? "0" + m : m) + ":";

//     // Check if leading zero is need for seconds
//     s = ((s < 10) ? "0" + s : s) + ":";

//     f = (f < 10) ? "0" + f : f;

//     if (TimeFormat == 'STANDARD')
//         f = (f < 100) ? "0" + f : f;

//     return h + m + s + f;
// }


function CnvToTime(FrameCount) {
var FRate = 29.97;
var TotalSecs = parseInt(FrameCount / FRate, 10);
var hours = parseInt(TotalSecs / 3600, 10);
var mins = parseInt((TotalSecs - hours * 3600) / 60, 10);
var secs = TotalSecs - hours * 3600 - mins * 60;
var frames = (FrameCount - TotalSecs * 30);
var dropframes = (hours * 108) + ((mins - parseInt(mins / 10, 10)) * 2);

if ((frames + dropframes) > 30) {secs =  secs + 1; frames = "1";}
else if ((frames + dropframes) == 30) {secs = secs + 1; frames = "0";}
else {frames = frames + dropframes;}

//INSERT FOR EACH LOOP HERE TO FORMAT TIMECODE ARRAY

var i;
var timecode = new Array();
timecode[0] = hours;
timecode[1] = mins;
timecode[2] = secs;
timecode[3] = frames

for (i=0;i<timecode.length;i++)
{if(timecode[i] < 10) timecode[i] = "0" + timecode[i];}

return timecode.join(':');
}

function CnvToFrames(timecode) {
var FRate = 29.97;
var hours = parseInt(timecode.slice(0,2),10);
var mins = parseInt(timecode.slice(3,5),10);
var secs = parseInt(timecode.slice(6,8),10);
var frames = parseInt(timecode.slice(9,11),10);
var dropframes = (hours * 108) + (mins * 2) - (parseInt(timecode.slice(3,4),10) * 2);

var framecount = (hours * 3600 * FRate) + (mins * 60 * FRate) + (secs * FRate) + frames - dropframes;

return framecount;
}

function timeFormat(time) {
    while (time.length < 8) {
        time = '0' + time;
    } 
    if (time.length == 8) {
        return time.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1' + ':' + '$2' + ':' + '$3' + ';' + '$4');
    }
}

var newItem = function(item, timeID, itemID) {

    // clone result template code
    var result = $('.templates .segList').clone();
    
    // Set properties in result
    var itemName = result.find('.list-item h3');
    itemName.text(item);

    var itemNum = result.find('#item');
    itemNum.attr('id', itemID);

    var timeNum = result.find('#time');
    timeNum.attr('id', timeID);

    return result;

};

$(document).ready(function() {

    var time = $('#time').val();

    //Clears text input when clicked 
$('body').on('click', '.add-item', function() {
  this.value="";
 });

 $('body').on('click', '.add-time', function() {
  this.value="";
 }); 

 //Time and item variables for incrementing
 var timeNum = 0;
 var itemNum = 0;

 //Clone and add items on Enter

$("body").on('keyup', '.add-item', function(event) {
    
    if (event.keyCode == 13) {
    itemNum += 1;
    timeNum += 1;
    var item = $('.add-item').val();
    var timeID = 'time' + timeNum;
    var itemID = 'item' + itemNum;
    var addItem = newItem(item, timeID, itemID);
    $('.list').append(addItem);
    $('.add-item').val('Add a segment');
    $('.add-item').blur(); 
    }
 });


    //Time Entry
$("body").on('keyup', '.add-time', function(event) {
  if (event.keyCode == 13) {
    var timeID = this.id;
    var time = $('#' + timeID).val();
    var timeFix = timeFormat(time);
    $('#' + timeID).val(timeFix);

    //Add to TRT
    var oldTRT = $('#trt, h1').html();
    var oldTRTFrames = CnvToFrames(oldTRT);

    console.log(oldTRTFrames);
    var newTime = CnvToFrames(timeFix);
    var totalFrames = oldTRTFrames + newTime;
    var trt = CnvToTime(totalFrames);
    $('#trt, h1').html(trt);
    $('.add-time').blur();   
  }
});



})