////////////////
//globals
////////////////

const root = document.documentElement; //html root
const canvas = document.createElement('canvas'); //html canvas
const mainDiv = document.getElementsByTagName('main')[0] //<main>
mainDiv.appendChild(canvas) //attatch canvas to main
const ctx = canvas.getContext("2d"); //canvas context
var isTouchDevice = false;  // gets calculated
var isMobileDevice = false; // gets calculated
//device pixel ration, aspect ratio, bounding rectangle, window dims, canvas dims, mouse xy, mouse last down x,y, mouse last up xy all calculated
var dvp, ar, brect, wWidth, wHeight, cWidth, cHeight, mX, mY, mdX, mdY, muX, muY;
var mouseDownCan = false; var verticalOrien = false; //get calculated
var firstFrame = true; //gets calculated
var marg = 10; //pixel margin
const gameRec = [0,0,0,0] //gets calculated
var rat = 16/9; //gameRec aspect ratio for horizontal
var un_mute = document.getElementById('un-mute'); //html icon
var muteimages = document.getElementsByClassName('muteimage')// html icon
// var oscillator;


//detect mobile
if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {

        isMobileDevice = true ;
}

if(isMobileDevice) {
    console.log('MOBILE DETECTED')
    canvas.style.width = "100%"
    canvas.style.height = "100%"
}

//on mute/unmute click toggle audiocontext and audioAllowed
un_mute.onclick = function() {
    console.log('toggling sound')
    if(AudioContext){

        console.log('audiocontext detected')
        if (audioContext.state === "suspended") {
            console.log('enabling audio')
            audioContext.resume();
        }
        if(!audioAllowed){
            audioAllowed = true;
            // pop_high.play()
            
            // oscillator = audioContext.createOscillator();

            // // oscillator.type = 'custom'; //"sine", "square", "sawtooth", "triangle" and "custom" for periodicWave
            // var imag= new Float32Array([0,1,0,1,0]);   // sine
            // var real = new Float32Array([1,0,1,0,1]);  // cos
            // var customWave = audioContext.createPeriodicWave(real, imag);  // cos,sine
            // oscillator.setPeriodicWave(customWave);
            // // oscillator.frequency.setValueAtTime(300, audioContext.currentTime); // value in hertz
            // oscillator.connect(audioContext.destination);
            // oscillator.start()
        }else{
            audioAllowed = false;
            // oscillator.stop()
        }
    }
};



// //dropdowns
// const theMenuDiv = document.getElementById('themenu')
// const difficultyDiv = document.getElementById('difficulty')
// const gametypeDiv = document.getElementById('gametype')

// difficultyDiv.onchange = ()=>{  
//     // difficulty = difficultyDiv.selectedIndex
//     // if(gameGrids[difficulty*typesOfGoals.length + typeOfGoalNum][0]){
//     //     gameGrid = JSON.parse(JSON.stringify(gameGrids[difficulty*typesOfGoals.length + typeOfGoalNum]))
//     //     currentGoal = goals[difficulty*typesOfGoals.length + typeOfGoalNum]
//     // }else{
//     //     genGrid()
//     // }
// }

// gametypeDiv.onchange = ()=>{
//     // var ind = gametypeDiv.selectedIndex
//     // typeOfGoal = typesOfGoals[ind]
//     // typeOfGoalNum = ind
//     // console.log("game type changed", typeOfGoal)
//     // if(gameGrids[difficulty*typesOfGoals.length + typeOfGoalNum][0]){
//     //     gameGrid = JSON.parse(JSON.stringify(gameGrids[difficulty*typesOfGoals.length + typeOfGoalNum]))
//     //     currentGoal = goals[difficulty*typesOfGoals.length + typeOfGoalNum]
//     // }else{
//     //     genGrid()
//     // }
// }


