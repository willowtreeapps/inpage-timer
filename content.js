var timer_value = -1;
var clock = 0;
//alert('content.js is running');
var timerObj = undefined;
var status="stopped"; //stopped, running, paused
var prevTime = -1;
var interval = 500;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.reset==true){
        clearInterval(timerObj);
        var el = document.getElementById('timer_container');
        el.parentNode.removeChild(el);
        clock=0;
        timer_value=-1;
        status="stopped";
        prevTime = -1;
        timerObj = undefined;
    }
    else if(request.pause==true && status=="running"){
        clearInterval(timerObj);
        status="paused";
        prevTime = -1;
    }
    //lets just allow for start to resume as well since people confuse it enough
    else if((request.resume==true || request.start==true) && status=="paused"){
        timerObj = setInterval(tick,interval);
        status="running";
        prevTime = new Date().getTime();
    }
    else if(request.tick != undefined && !timerObj) {
        timer_value = request.tick;
        //document.getElementById('timer_container').innerHTML = timer_value+'seconds';
        //alert(timer_value);
        if(document.getElementById('timer_container') == undefined) {
            var container = document.createElement('div');
            container.id="timer_container";
            document.getElementsByTagName('body')[0].insertBefore(container,undefined);
        }
        status="running";
        //.appendChild(container);
        tick();
        timerObj = setInterval(tick, interval);
        addListeners();
        //alert('element added');
    }
    
    //alert(request.message);
});
/*
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.get(tabs[0].id).;
         });
*/
function tick(){
    if(clock<=timer_value){
        var curTime = new Date().getTime();
        //If we haven't set the previous time then ignore this tick
        if(prevTime == -1) {
          prevTime = curTime-500;
        }
        var diff = curTime-prevTime;
        clock = clock + diff;
        prevTime = curTime;
        var newTime = Math.ceil((timer_value - clock)/1000);
        if(newTime < 0) newTime = 0;
        time_to_display = secondsToHms(newTime);
        document.getElementById('timer_container').innerText= time_to_display;
    }
    else{
        document.getElementById('timer_container').innerText= "TIME UP!";
        clearInterval(timerObj);
    }
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    h= h>9?h:"0"+h;
    var m = Math.floor(d % 3600 / 60);
    m= m>9?m:"0"+m;
    var s = Math.floor(d % 3600 % 60);
    s= s>9?s:"0"+s;

    return (h!="00") ? h +':'+ m +':'+ s : m +':'+ s; 
}

var x_pos = 0,
  y_pos = 0;

function addListeners() {
  document.getElementById('timer_container').addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);
}

function mouseUp() {
  window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
  var div = document.getElementById('timer_container');
  x_pos = e.clientX - div.offsetLeft;
  y_pos = e.clientY - div.offsetTop;
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  var div = document.getElementById('timer_container');
  div.style.position = 'absolute';
  div.style.top = (e.clientY - y_pos) + 'px';
  div.style.left = (e.clientX - x_pos) + 'px';
}
