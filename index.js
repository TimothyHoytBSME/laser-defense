
const Version = "1.0-alpha-laserdefense"


var backColor = [20,20,20];
var gridDims = [13,11]


var gridSize = [1,1] //gets calculated
var size = 10;  //gets calculated
var selected = [-1,-1]  //gets calculated
var target = [-1,-1]    //gets calculated
var pieceSize = 1; //gets calculated
var textW = 1;  //gets calculated
var textH = 10 //gets calculated
var gameCent = [] //gets calculated
var gameGrid = [] //gets calculated
var newButtonRec = [] //gets calculated
var menuButtonRec = [] //gets calculated
var sellButtonRec = [] //gets calculated
var doubletimeRec = [] //gets calculated
var fivetimeRec = [] //gets calculated

var cancelButtonRec = [] //gets calculated
var optionsRecs = [] //gets calculated
var changeRecs = [] //gets calculated
var popUpRec = [] //getscalculated
var returnButtonRec = [] //gets calculated
var gameActive = true; //gets calculated
var score = 0; //gets calculated
var justScored = false; //gets calculated
var gridSizePix = [1,1] //gets calculated
var gridPos = [10,10] //gets calculated
var numPaths = 2;
var paths = new Array(numPaths).fill([]); //gets calculated
var startGold = 100000  ; //100
var gold = startGold;
var numEnemies = 20; //gets calculated
var theEnemies = [];   //gets calculated
var enemyDelay = 90;
var startDelay = 100; //500
var eDelayCount = 0;    //gets calculated
var sDelayCount = 0;    //gets calculated
var activeEnemies = 0;   //gets calculated
var theDefenses = [];    //gets calculated
var waveRunning = true;   //gets calculated
var waveNum = 1;    //gets calculated
var theBase = {};    //gets calculated
var gameOver = false;    //gets calculated
var choosing = false;    //gets calculated
var changing = false;    //gets calculated
var choosingFor = null   //gets calculated
var subtypes = ["basic","slow", "ion", "phaser"]
var startPrices = [20, 5, 50, 100]
var popUpAlpha = 0.7 
var towerColors = [[100,100,0],[0,100,100],[150,50,0], [50,15,255]]
var options = [] //gets calculated
var changeOps = [] //gets calculated
var prices = new Array(10).fill(0) //gets calculated
var gameSpeedMult = 1;

var focused = false;
var startTime = new Date();
var lapse = 0;
var unfocusedLapse = 0;
var unfocusedTime = new Date();
var nowaveLapse = 0;
var nowaveTime = new Date();

var lastTime = 0;
var currTime = new Date()
var fps = 0;


//Main Animation Loop
const mainLoop = function(){
    lastTime = currTime;
    currTime = new Date();
    fps = 1/((currTime.getTime()-lastTime.getTime())/1000)
    
    
    ctx.fillStyle = "rgb(0, 0, 0)"; ctx.fillRect(0, 0, cWidth, cHeight);
    fillRec(gameRec, (backColor))

    /////////////////////////draw/////////////////////////

    if(gameActive){
        if(waveRunning){
            // console.warn(unfocusedLapse, nowaveLapse)
            lapse = (currTime.getTime() - startTime.getTime() -unfocusedLapse -nowaveLapse)*gameSpeedMult/1000
            // unfocusedLapse = 0;
            // nowaveLapse = 0;
        }

        drawBoard()
        if(waveRunning){
            activateEnemy()
        }

        drawEnemies()
        findTheEnemies()
        drawLasers()
        doDamages()
        drawPopup()

        if(waveRunning){
            moveEnemies();
        }
    }else{
        console.log('Game Paused')
    }


    /////////////////////////////text/////////////////////////////////////
    
    drawTexts()

    //////////////////////////////////////////cursor////////////////////////////
    if(!isMobileDevice){
        fillCir([mX, mY, 12], [0,0,0,0.5])
        fillCir([mX, mY, 10], [255,255,255,0.5])
    }


    if((!soundPlayed)&&(audioAllowed)){
        
        //     if(justScored){
        //         pop_high.play();
        //         justScored = false;
        //     }else{
        //         pop_low.play();
        // }else{
        //     pop_mid.play();
        // }
        
        soundPlayed = true;
    }




    if (!document.hidden) {
        focused = true
    }





    //////////////////////////////next frame////////////////////////////////
    const fpsMax = 60;

    
    setTimeout(() => {
        window.requestAnimationFrame(mainLoop);
    }, 1000 / fpsMax);

    // window.requestAnimationFrame(mainLoop);

}

const drawBoard = function(){
    for(var i = 0; i<gridDims[0]; i++){
        for(var j = 0; j<gridDims[1]; j++){
            var piece = gameGrid[i][j];
            piece.draw();
        }
    }
}

const activateEnemy = function(){
    if(sDelayCount > startDelay){
        eDelayCount+=gameSpeedMult
    }else{
        sDelayCount+=gameSpeedMult

        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        fillText( gameCent[0], gridPos[1]+textH, "GET READY!", textH/3 , [255,0,0])
        ctx.textAlign = "left"
        ctx.textBaseline = "bottom"

        var timerRec = [gameCent[0]-gridSizePix[0]/5/2, gridPos[1]+textH*1.5, gridSizePix[0]/5,textH/6 ]
        progressBar(timerRec, sDelayCount/startDelay,[255,0,0])
    }
    
    if(eDelayCount>enemyDelay){
        if(activeEnemies < theEnemies.length){
            activeEnemies++
            var activatedEnemy = theEnemies[activeEnemies-1]
            var activePath = [...paths[activatedEnemy.pathNum]]
            var startP = activePath[activePath.length -1]
            var nextP = activePath[activePath.length -2]
            activatedEnemy.from = [...startP]
            activatedEnemy.to = [...nextP]

            var enMarg = (pieceSize - activatedEnemy.size)/2

            activatedEnemy.left = gameGrid[startP[0]][startP[1]].left + enMarg
            activatedEnemy.top = gameGrid[startP[0]][startP[1]].top + enMarg

            

        }
        eDelayCount = 0
    }
}

const findTheEnemies = function(){
    if(waveRunning){
        for(var i=0; i<theDefenses.length; i++){
            theDefenses[i].findEnemies()
        }
        theBase.findEnemies()
    }
}

const drawEnemies = function(){
    for(var i=0; i<theEnemies.length; i++){
        theEnemies[i].draw()
    }

    var waveRec = [  -gameRec[2]/13+gameRec[0]+gameRec[2]-textH*1.5, gameCent[1]-textH*1.5 , textH*3  ,  textH/10 ]
    if(verticalOrien){
        waveRec = [gameCent[0]-textH*4-textH*1.5, gameRec[3]/10+gameRec[1]+textH*1.5, textH*3, textH/10]
    }
    //draw wave progress
    progressBar(waveRec, theEnemies.length/numEnemies,  [0,200,0])
    
}

const drawLasers = function(){
    if(waveRunning){
        for(var i=0; i<theDefenses.length; i++){
            theDefenses[i].drawLaser()
        }
        theBase.drawLaser()
    }
    
}

const doDamages = function(){
    if(waveRunning){
        for(var i=0; i<theDefenses.length; i++){
            theDefenses[i].doDamage()
        }
        theBase.doDamage()
    }
}

const drawPopup = function(){
    
    if(verticalOrien){
        var ww = gridSizePix[1]*0.75
        var left = gridPos[0]+(gridSizePix[0]-ww)/2
        var top =  gridPos[1]+(gridSizePix[1]-ww)/2
        popUpRec = [left, top, ww, ww]
    }else{
        var ww = gridSizePix[0]*0.75
        var left = gridPos[0]+(gridSizePix[0]-ww)/2
        var top =  gridPos[1]+(gridSizePix[1]-ww)/2
        popUpRec = [left, top, ww, ww]
    }

    if(gameOver){
        fillRec(popUpRec,[0,0,0,0.75])
    }
    if(choosing){
        fillRec(popUpRec,[0,0,0,0.75])

        sellButtonRec = [popUpRec[0],popUpRec[1]+popUpRec[3]*0.8,popUpRec[2]/2.2, popUpRec[3]*0.2]
        var sellC = (choosingFor.type == "defense")? [100,100,100,popUpAlpha] : [50,50,50,popUpAlpha]
        fillRec(sellButtonRec,(sellC))

        cancelButtonRec = [popUpRec[0]+popUpRec[3]-popUpRec[2]/2.2,popUpRec[1]+popUpRec[3]*0.8,popUpRec[2]/2.2, popUpRec[3]*0.2]
        fillRec(cancelButtonRec,[100,100,100,popUpAlpha])

        optionsRecs = new Array(options.length)
        for(var i=0; i<options.length; i++){
            var opwid = popUpRec[2]*(0.75/(options.length))
            var opleft = popUpRec[0] + popUpRec[2]*(0.25/(options.length+1))*(i+1)+opwid*i
            
            optionsRecs[i] = [opleft,popUpRec[1]+popUpRec[3]*0.35,opwid,popUpRec[3]*0.3]
            var opRec = optionsRecs[i]
            var backC = [100,100,100,popUpAlpha]
            if((gold < prices[i]) ||((options[i]=="repair")&&(prices[i]==0))){
                backC = [50,50,50,popUpAlpha]
            }
            fillRec(opRec, (backC)) 


            //draw subtype in options
            if(subtypes.includes(options[i])){
                var col = towerColors[i]
                fillRec([opRec[0]+opRec[2]/4, opRec[1]+opRec[3]/2-opRec[2]/4, opRec[2]/2,opRec[2]/2],([50,50,50,popUpAlpha]))
                fillCir([opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/2, opRec[2]/6], (col)) 
            }
            
        }


        //background indicator of selected
        if((choosingFor.left+pieceSize/2)>gameCent[0]){
            fillTri([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2],[popUpRec[0],popUpRec[1]],[popUpRec[0],popUpRec[1]+popUpRec[3]/4],([0,200,0,0.25]))
        }else{
            fillTri([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2],[popUpRec[0]+popUpRec[2],popUpRec[1]],[popUpRec[0]+popUpRec[2],popUpRec[1]+popUpRec[3]/4],([0,200,0,0.25]))
        }
        strokeRec(popUpRec,3,([0,200,0,0.25]))
        fillCir([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2,pieceSize*0.5],([0,200,0,0.25]))

        //draw over current menu it change option is picked
        if(changing){
            fillRec(popUpRec,[0,0,0])
            var otherTypes = [...subtypes]
            removeFromArray(otherTypes,choosingFor.subtype)
            changeOps = otherTypes;
            for(var i=0; i<otherTypes.length; i++){
                // changeRecs[i] = [12,12,123,23]
                var c = i;
                if(!(i<subtypes.indexOf(choosingFor.subtype))){
                    c++
                }
                var col = towerColors[c]
                var chwid = popUpRec[2]*(0.75/(otherTypes.length))
                var chleft = popUpRec[0] + popUpRec[2]*(0.25/(otherTypes.length+1))*(i+1)+chwid*i
                changeRecs[i] = [chleft,popUpRec[1]+popUpRec[3]*0.35,chwid,popUpRec[3]*0.3]
                var theRec = changeRecs[i]
                var backC = [100,100,100,popUpAlpha]
                if(gold < prices[i]){
                    backC = [50,50,50,popUpAlpha]
                }
                fillRec(theRec, (backC)) 
                var towScale = 0.75;
                fillRec([ theRec[0] + (theRec[2]*(1-towScale))/2, theRec[1]+theRec[3]/2-theRec[2]*towScale/2, theRec[2]*towScale, theRec[2]*towScale],[50,50,50,popUpAlpha])
                fillCir([theRec[0]+theRec[2]/2, theRec[1]+theRec[3]/2, theRec[2]/6], (col)) 
            }
        }
    }
}

const moveEnemies = function(){
    for(var i=0; i<theEnemies.length; i++){
        theEnemies[i].move()
    }
}

const towerOptions = function(){
    options = []
    if(choosingFor.type =="empty"){
        options = [...subtypes]
    }else if(choosingFor.type == "base"){
        options = ["upgrade1", "upgrade2", "upgrade3", "repair"]
    }else if(choosingFor.type == "defense"){
        options = ["upgrade1", "upgrade2", "upgrade3", "change"]

    }

    calcPrices()

}


const calcPrices = function(){
    console.log('setting prices')
    //set prices
    for (var i = 0; i< options.length; i++){
        switch(options[i]){
            case "upgrade1": //laserCount
                prices[i] = choosingFor.cost*2
                break;
            case "upgrade2": //power
                prices[i] = floor(choosingFor.cost*1.75)
                break;
            case "upgrade3": //range
                prices[i] = floor(choosingFor.cost/2)
                break;
             
            case "repair":
                prices[i] = 100;
                var maxPrice = prices[i]
                maxPrice *= (100-theBase.health)/100
                maxPrice = ceil(maxPrice )
                if(maxPrice > gold){maxPrice = gold}
                prices[i] = maxPrice
                break;

            case "change":
                prices[i] = 0;
                break;

            default:
                break;
        }
        
        
        if(subtypes.includes(options[i])&&!changing){
            console.log('subtype detected', subtypes[i])
            
            prices[i] = startPrices[i]                 
        }

        if(changing){
            console.log('prices for changing')
            var chst =choosingFor.subtype
            var j = subtypes.indexOf(chst)
            if(j > i){
                prices[i] = ceil(startPrices[i] / startPrices[j]*choosingFor.cost - choosingFor.cost/2)
                if(prices[i]<0){
                    prices[i] = 0
                }
            } else if (j<i){
                prices[i-1] = ceil(startPrices[i] / startPrices[j]*choosingFor.cost - choosingFor.cost/2)
                if(prices[i-1]<0){
                    prices[i-1] = 0
                }
            }

        }

              
    }
    console.log(prices)

}


const doNew = function(){
    
    const doreset = function(){
        console.log('game resetting')
        score = 0;
        gold = startGold;
        theDefenses = [];
        theEnemies = [];
        activeEnemies = []
        sDelayCount = 0
        eDelayCount = 0
        paths = []
        waveRunning = true; 
        nowaveLapse =0
        lapse = 0
        startTime = new Date()
        nowaveTime = new Date()
        unfocusedLapse = 0
        unfocusedTime = new Date()
        waveNum = 1;
        theBase = {};    //gets calculated
        gameOver = false; 
        choosing = false;
        choosingFor = null
        options=[]
        theGrid = []
        console.log("gamecleared")
        genGrid()
        sizeCanvas()
    }

    if(!gameOver){
        if (confirm('This will erase your score for the current game type. Are you sure?')) {
            doreset()
    
        }
    }else{
        doreset()
    }

    
    
}

const onMoveMouse = function(){
    if(waveRunning){
        for(var i=0; i<gridDims[0]; i++){
            for(var j=0; j<gridDims[1]; j++){
                var piece = gameGrid[i][j]
                if(isInside([mX,mY],[piece.left,piece.top,pieceSize,pieceSize])){//piece.isOver(mX,mY)){
                    target = [i,j]
                    piece.isTarget = true;
                }else{
                    piece.isTarget = false
                }
            }
        }
    }
    
}


const click = function(){ //mousedown
    if(gameActive){
        

        if(isInside([mdX,mdY],newButtonRec)){
            console.log("new clicked")
            doNew()
        }


        if(isInside([mdX,mdY],menuButtonRec)){
            console.log("menu clicked")
            gameActive = false;
            waveRunning = false;
            if(!choosing){
                // console.warn('menu paused the running game')
                nowaveTime = new Date()
                // console.log('nowavetime',nowaveTime)
            }
        }

        //grid clicked
        if(waveRunning){
            for(var i=0; i<gridDims[0]; i++){
                for(var j=0; j<gridDims[1]; j++){
                    var piece = gameGrid[i][j]
                    if(isInside([mdX,mdY],[piece.left,piece.top,pieceSize,pieceSize])){
                        selected = [i,j]
                        target = [i,j]
                        piece.isSelected = true;
                    }else{
                        piece.isSelected = false;
                    }
                }
            }
            
            if(isInside([mdX,mdY],doubletimeRec)){
                console.log('gamespeedchanged',gameSpeedMult)
                if(gameSpeedMult == 2){
                    gameSpeedMult = 1
                }else{
                    gameSpeedMult = 2
                }
            }

            if(isInside([mdX,mdY],fivetimeRec)){
                console.log('gamespeedchanged',gameSpeedMult)
                if(gameSpeedMult == 10){
                    gameSpeedMult = 1
                }else{
                    gameSpeedMult = 10
                }
            }

            
        }else if(!gameOver){


            //exit button
            if(isInside([mdX,mdY],cancelButtonRec)||(!isInside([mdX,mdY],popUpRec)&&!isInside([mdX,mdY],menuButtonRec))){
                console.log('cancel clicked')
                
                if(changing){
                    changing = false;
                    console.log('canceled changing')
                    towerOptions()
                }else{
                    console.log('exit build menu')
                    choosing = false;
                    choosingFor = null
                    options=[]
                    waveRunning = true;
                    nowaveLapse += new Date() - nowaveTime.getTime()
                }
                
            }
            //sell button
            if(isInside([mdX,mdY],sellButtonRec)&&(choosingFor.type == "defense")){
                if(changing){
                    //nada
                }else{
                    choosing = false;
                    console.log('sell clicked')
                    gold+=choosingFor.cost/2;
                    choosingFor.type = "empty"
                    choosingFor.color = [5,5,5]
                    removeFromArray(theDefenses,choosingFor)
                    choosingFor = null
                    options=[]
                    waveRunning = true;
                    nowaveLapse += new Date() - nowaveTime.getTime()
                }
            }
            if(choosingFor){
                if(isInside([mdX,mdY],sellButtonRec)&&(choosingFor.type != "defense"||(changing))){
                    splashText(sellButtonRec[0]+textH/4, sellButtonRec[1]+textH/1.5,"CAN NOT SELL THIS",textH/2,100,[255,0,0])
                }
            }
            //if not changing subtypes in popup check for option click
            if(!changing){
                var done = false
                for(var i=0; i<options.length; i++){
                    if(!done){
                        if((optionsRecs[i])&&isInside([mdX,mdY],optionsRecs[i])){
                            var thePrice = prices[i]
                            if(gold >= thePrice){
                                if(choosingFor.type == "empty"){
                                    if(subtypes.includes(options[i])){
                                        choosingFor.type = "defense"
                                        choosingFor.subtype = options[i]
                                        choosingFor.cost = startPrices[i]
                                        theDefenses.push(choosingFor)
                                        console.log('built tower ',choosingFor.subtype)
                                    }
                                }else if(choosingFor.type == "defense"){
                                    if(options[i] == "upgrade1"){
                                        choosingFor.numLasers++
                                        choosingFor.cost += thePrice
                                        console.log('upgraded laser count',choosingFor)
                                    }else if(options[i] == "upgrade2"){
                                        choosingFor.power++
                                        console.log('upgraded tower power',choosingFor)
                                        choosingFor.cost += thePrice
                                    }else if(options[i] == "upgrade3"){
                                        choosingFor.range++
                                        choosingFor.chargeRate++
                                        choosingFor.cost += thePrice
                                        console.log('upgraded tower range',choosingFor)
                                    }else if(options[i] == "change"){
                                        changing = true;
                                        console.log('change tower type menu')
                                    }
                                }else if(choosingFor.type == "base"){
                                    if(options[i] == "repair"){
                                        console.log('repairing base', thePrice)
                                        theBase.health+= thePrice
                                        
                                    }if(options[i] == "upgrade1"){
                                        choosingFor.numLasers ++
                                        choosingFor.cost += thePrice
                                        console.log('upgraded laser count',choosingFor)
                                    }else if(options[i] == "upgrade2"){
                                        choosingFor.power++
                                        choosingFor.cost += thePrice
                                        console.log('upgraded tower power',choosingFor)
                                    }else if(options[i] == "upgrade3"){
                                        choosingFor.range++
                                        choosingFor.cost += thePrice
                                        console.log('upgraded tower range',choosingFor)
                                    }
                                }
                                done = true; //clicked option found, don't continue checking
                                if(!changing){
                                    console.log("option "+options[i]+" purchased for " + prices[i])
                                    console.log("purchase for:", choosingFor)
                                    gold -= prices [i]
                                    options=[]
                                    towerOptions()
                                }else{
                                    console.warn('hmmmm')
                                    calcPrices()
                                }
                            }else{
                                console.log("CANNOT AFFORD")
                                if(optionsRecs[i]){
                                    splashText(optionsRecs[i][0]+optionsRecs[i][2]/5, optionsRecs[i][1]+textH*1.1,"GOLD",textH/2,50,[255,0,0])
                                }
                            }
                        }
                    }
                }
            }else{
                for(var i = 0; i< changeOps.length; i++){
                    if(isInside([mdX,mdY],changeRecs[i])){
                        console.log('a change clicked')
                        if(gold>=prices[i]){
                            console.log('changing',choosingFor.type, "to", changeOps[i])
                            choosingFor.subtype = changeOps[i]
                            choosingFor.cost += prices[i]
                            gold-=prices[i]
                            changing = false;
                            towerOptions()
                        }
                    }
                }
            }
            
        }else{
            if(isInside([mdX,mdY],popUpRec)){
                doNew()
            }
        }
    }else{
        if(isInside([mdX,mdY],returnButtonRec)){
            console.log("return clicked")
            gameActive = true;
            if(!choosing){
                nowaveLapse += new Date().getTime() - nowaveTime.getTime()
                // console.log('new nowavelapse', nowaveLapse)
                waveRunning = true;

            }
        }
    }
}


const checkRelease = function(){
    if(gameActive){
        //     soundPlayed = false
        // justScored = true
        if(selected[0]>-1){

            var sPiece = gameGrid[selected[0]][selected[1]]
            console.log("selected",selected)
            
            sPiece.isSelected = false;

            if(target[0]>-1){
                gameGrid[target[0]][target[1]].isTarget = false;
                if(arrEq(selected, target)&&!(sPiece.type == "path")&&waveRunning){
                    if(choosing == false){
                        choosing = true;
                
                        console.log("opening options for",sPiece)
                        choosingFor = sPiece
                        waveRunning = false;
                        nowaveTime = new Date()
                        // console.log('nowavetime', nowaveTime.getTime())
                    }
                    //available option names
                    towerOptions()
                }
                
                console.log("drag",selected,target)
                var thesel = gameGrid[selected[0]][selected[1]]
                var thetar = gameGrid[target[0]][target[1]]
                console.log(thesel, "dropped on", thetar)
                if(thesel.subtype == "ion" ||thesel.subtype == "phaser"){
                    if(thetar.type == "path"){
                        var newEn = true;
                        if(this.subtype == "ion"){
                            for(var i = 0; i<thesel.enemies.length; i++){
                                if(thesel.enemies[i].length == 2){
                                    console.log('previous path point found')
                                    if(arrEq(thesel.enemies[i],target)){
                                        console.warn('match found')
                                        newEn = false;
                                    }
                                }
                            }
                        }
                        
                        if(newEn){ //current target not already an enemy
                            console.warn('new path point detected')
                        
                            //path targetting tower dragged to pathpoint, set coods as enemy
                            if(thesel.numShots >0){
                                //add target to que and adjust numbers

                                //if existing enemy is path point
                                if(thesel.enemies[0].length == 2){ 
                                    thesel.enemies.push(target) //add current to que
                                    thesel.timers[thesel.enemies.length-1] = 100 + 50*thesel.power  //timer is [frames, index of piece.enemies[]]
                                    thesel.maxTimes[thesel.enemies.length-1] = 100 + 50*thesel.power
                                    console.log('path enemy added')
                                }else{ //first enemy not path point
                                    thesel.enemies[0] = target //set first enemy to current target
                                    thesel.timers[0]=100+50*thesel.power;
                                    thesel.maxTimes[0]=100+50*thesel.power;
                                    console.log('first path enemy')
                                }


                                //if shots are full, deplete to recharge
                                if(thesel.numShots == thesel.numLasers){
                                    thesel.charge = 0 //deplete charge
                                }
                                
                                thesel.numShots --

                                console.log('used shot')

                            }
                        }
                    }
                }
            }
        }
        
        target = [-1,-1]
        selected = [-1,-1]
        // console.log('tracking cleared')
    }
}

const genGrid = function(){
    console.time('Generating grid')
    lapse = 0
    startTime = new Date()
    gameGrid = []
    const ranGrid = function(){
        console.log('griddims',gridDims)
        for(var i=0; i<gridDims[0]; i++){
            const row = []
            for(var j=0; j<gridDims[1]; j++){
                var piece = new Piece(i,j, "empty")
                row.push(piece)
            }
            gameGrid.push(row)
        }

        
    }


    ranGrid()

    genBase()
    
    genPaths()

    genEnemies()

    sizeCanvas()
    console.timeEnd('Generating grid')

    saveGame()

}

const genBase = function(){
    var baseP = [floor(gridDims[0]/2),floor(gridDims[1]/2)]//[floor(random()*gridDims[0]),floor(random()*gridDims[1])]
    
    theBase = gameGrid[baseP[0]][baseP[1]]
    theBase.type = "base"
    theBase.cost = 100
    // theBase.power = 2;
}

const genPaths = function(){
    
    for(var p=0; p<numPaths; p++){
        var path = []
        var xd = p*2-1;
        var yd = 0;
        path.push([...[theBase.px, theBase.py]])
        var done = false;

        while(!done){
            var prevP = path.length -1
            if(path.length == 5){
                yd = p*2-1; xd = 0;
            }
            if(path.length ==8){
                yd = 0; xd = -p*2+1;
            }
            var newP = [path[prevP][0]+xd, path[prevP][1]+yd]
            var lastP = path[prevP]
            
            if((lastP[0] < 0 )||(lastP[0]>=gridDims[0])||(lastP[1]<0)||(lastP[1]>=gridDims[1])){
                //outside grid
                path.pop()
                done = true
            }else{path.push([...newP])}
        }

        for(var i=0; i<path.length; i++){
            var piece = gameGrid[path[i][0]][path[i][1]]
            if(piece.type != "base"){
                piece.type = "path"
            }
             
        }
        paths[p] = path
        // console.log("path",p,path)
    }

    // console.log("paths",paths)
}

const genEnemies = function(){
    
    numEnemies = numEnemies + waveNum
    for(var i=0; i<numEnemies; i++){

        var type = ((waveNum>1)&& (random()>0.9**waveNum))? "brute" : "grunt"
        if ( i == numEnemies -1){
            type = "brute"
        }      
       // type = "brute" //debug  
        var pathnum = floor(random()*numPaths)
        var newEn = new Enemy(type,pathnum)
        theEnemies.push(newEn)

    }

    console.log('enemies', theEnemies)
}


//Sends to functions.js for execution upon resize
externalResizeFunctions.push(()=>{
    if(verticalOrien){
        gridSize[0] = gridDims[1]
        gridSize[1] = gridDims[0]
        marg = gameRec[2]/100;
        size = (gameRec[2]-marg*2)/gridSize[0]
        gridSizePix = [gridSize[0]*size, gridSize[1]*size]
        gridPos = [gameCent[0]-gridSizePix[0]/2, gameCent[1]-gridSizePix[1]/2.4]
    }else{
        gridSize[1] = gridDims[1]
        gridSize[0] = gridDims[0]
        marg = gameRec[3]/100;
        size = (gameRec[3]-marg*2)/gridSize[1]
        gridSizePix = [gridSize[0]*size, gridSize[1]*size]
        gridPos = [gameCent[0]-gridSizePix[0]/2, gameCent[1]-gridSizePix[1]/2]
    }

    
    if(!verticalOrien){
        gridPos = [gridPos[0], gridPos[1]]
    }
    pieceSize = size-marg;


    for(var i = 0; i<gridSize[0]; i++){
        for(var j = 0; j<gridSize[1]; j++){
            if(verticalOrien){
                pX = j
                pY = gridSize[0]-i-1
            }else{
                pX = i
                pY = j
                
            }
            var piece = gameGrid[pX][pY]
            piece.left = gridPos[0]+i*size+marg/2
            piece.top = gridPos[1]+j*size+marg/2
            console.log('calculated grid positions')
        }
    }
    for(var i=0; i<theEnemies.length; i++){
        if(theEnemies[i].type == "brute"){theEnemies[i].size = pieceSize/2*1.25}
        else{
            theEnemies[i].size = pieceSize/2
        }
        
    }
})

var ctimer = undefined
const onAppFocus = function(){
    focused = true
    if(gameActive&&waveRunning){
        unfocusedLapse += new Date().getTime() - unfocusedTime
        // console.log('unfocused running time', unfocusedLapse)
    }
}

const onAppUnfocus = function(){
    focused = false
    
    if(gameActive&&waveRunning){
        unfocusedTime = new Date();
    }

}

