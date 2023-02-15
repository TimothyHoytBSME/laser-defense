
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

var cancelButtonRec = [] //gets calculated
var optionsRecs = [] //gets calculated
var popUpRec = [] //getscalculated
var returnButtonRec = [] //gets calculated
var gameActive = true; //gets calculated
var score = 0; //gets calculated
var justScored = false; //gets calculated
var gridSizePix = [1,1] //gets calculated
var gridPos = [10,10] //gets calculated
var numPaths = 2;
var paths = new Array(numPaths).fill([]); //gets calculated
var startGold = 100  ;
var gold = startGold;
var numEnemies = 20; //gets calculated
var theEnemies = [];   //gets calculated
var enemyDelay = 90;
var startDelay = 100; //500
var eDelayCount = 0;    //gets calculated
var sDelayCount = 0;
var activeEnemies = 0;   //gets calculated
var theDefences = [];    //gets calculated
var waveRunning = true;   //gets calculated
var waveNum = 1;    //gets calculated
var theBase = {};    //gets calculated
var gameOver = false;    //gets calculated
var choosing = false;    //gets calculated
var choosingFor = null   //gets calculated
var subtypes = ["basic","slow"]
var options = [] //gets calculated
var prices = new Array(10).fill(0) //gets calculated
var popUpAlpha = 0.7 
var startPrices = [20,5]
var lapse = 0;
var startTime = new Date();

var gameSpeedMult = 1;
// var gameTime = 0;
;
//Main Animation Loop
const mainLoop = function(){
    const currTime = new Date();
    
    
    ctx.fillStyle = "rgb(0, 0, 0)"; ctx.fillRect(0, 0, cWidth, cHeight);
    fillRec(gameRec, (backColor))

    /////////////////////////draw/////////////////////////

    if(gameActive){
        if(waveRunning){
            lapse = (currTime.getTime()/1000 - startTime.getTime()/1000)*gameSpeedMult 
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

    //////////////////////////////next frame////////////////////////////////
    const fpsMax = 25;

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
        for(var i=0; i<theDefences.length; i++){
            theDefences[i].findEnemies()
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
        for(var i=0; i<theDefences.length; i++){
            theDefences[i].drawLaser()
        }
        theBase.drawLaser()
    }
    
}

const doDamages = function(){
    if(waveRunning){
        for(var i=0; i<theDefences.length; i++){
            theDefences[i].doDamage()
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

            if(options[i] == "basic" || options[i] == "slow"){
                var col = (options[i] == "basic")? [100,100,0,popUpAlpha] : (options[i] == "slow")? [0,100,100,popUpAlpha] : [255,255,255]
                fillRec([opRec[0]+opRec[2]/4, opRec[1]+opRec[3]/2-opRec[2]/4, opRec[2]/2,opRec[2]/2],([50,50,50,popUpAlpha]))
                fillCir([opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/2, opRec[2]/6], (col)) 
            }
            
        }

        if((choosingFor.left+pieceSize/2)>gameCent[0]){
            fillTri([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2],[popUpRec[0],popUpRec[1]],[popUpRec[0],popUpRec[1]+popUpRec[3]/4],([0,200,0,0.25]))
        }else{
            fillTri([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2],[popUpRec[0]+popUpRec[2],popUpRec[1]],[popUpRec[0]+popUpRec[2],popUpRec[1]+popUpRec[3]/4],([0,200,0,0.25]))
        }
        strokeRec(popUpRec,3,([0,200,0,0.25]))
        fillCir([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2,pieceSize*0.5],([0,200,0,0.25]))

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
        options = ["upgrade1", "upgrade2", "upgrade3"]
        for(var i=0; i<subtypes.length; i++){
            if(subtypes[i] != choosingFor.subtype){
                options.push(subtypes[i])
            }
        }
    }

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
            case "slow":    //build or change
                prices[i] = (choosingFor.type == "empty")? startPrices[1] : floor(choosingFor.cost/(startPrices[0]/startPrices[1]))
                
                break;
            case "basic":   //build or change
                prices[i] = (choosingFor.type == "empty")? startPrices[0] : floor(choosingFor.cost*(startPrices[0]/startPrices[1]))
                break;  
            case "repair":
                prices[i] = 100;
                var maxPrice = prices[i]
                maxPrice *= (100-theBase.health)/100
                maxPrice = ceil(maxPrice )
                if(maxPrice > gold){maxPrice = gold}
                prices[i] = maxPrice
                break;
            default:
                break;
        }
    }
}





const doNew = function(){
    
    const doreset = function(){
        console.log('game resetting')
        score = 0;
        gold = startGold;
        theDefences = [];
        theEnemies = [];
        activeEnemies = []
        sDelayCount = 0
        eDelayCount = 0
        paths = []
        waveRunning = true; 
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


const click = function(){
    if(gameActive){
        

        if(isInside([mdX,mdY],newButtonRec)){
            console.log("new clicked")
            doNew()
        }


        if(isInside([mdX,mdY],menuButtonRec)){
            console.log("menu clicked")
            gameActive = false;
            // theMenuDiv.style.visibility = "visible"
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
                console.warn('gamespeedchanged')
                if(gameSpeedMult == 2){
                    gameSpeedMult = 1
                }else{
                    gameSpeedMult = 2
                }
            }

            
        }else if(!gameOver){
            //popup clicked
            if(isInside([mdX,mdY],cancelButtonRec)||(!isInside([mdX,mdY],popUpRec)&&!isInside([mdX,mdY],menuButtonRec))){
                choosing = false;
                choosingFor = null
                console.log('cancel clicked')
                options=[]
                waveRunning = true;
            }
            if(isInside([mdX,mdY],sellButtonRec)&&(choosingFor.type == "defense")){
                choosing = false;
                console.log('sell clicked')
                gold+=choosingFor.cost/2;
                choosingFor.type = "empty"
                choosingFor.color = [5,5,5]
                theDefences.splice(theDefences.indexOf(choosingFor),1)


                choosingFor = null

                options=[]
                waveRunning = true;
            }
            if(choosingFor){
                if(isInside([mdX,mdY],sellButtonRec)&&(choosingFor.type != "defense")){
                    splashText(sellButtonRec[0]+textH/4, sellButtonRec[1]+textH/1.5,"CAN NOT SELL THIS",textH/2,100,[255,0,0])
    
                }
            }
            
            
            //option clicked
            // console.log('checking options', options, optionsRecs)
            var done = false
            for(var i=0; i<options.length; i++){
                if(!done){
                    // console.log('checking', i)
                    // console.log(options,optionsRecs)
                    
                    if((optionsRecs[i])&&isInside([mdX,mdY],optionsRecs[i])){
                        // console.log('option '+i.toString()+" clicked")
                        var thePrice = prices[i]

                        if(gold >= thePrice){

                            if(choosingFor.type == "empty"){


                                if(options[i] == "basic"){
                                    choosingFor.type = "defense"
                                    choosingFor.subtype = "basic"
                                    choosingFor.cost = startPrices[0]
                                    theDefences.push(choosingFor)
                                    console.log('built tower ',choosingFor.subtype)

                                }else if(options[i] == "slow"){
                                    choosingFor.type = "defense"
                                    choosingFor.subtype = "slow"
                                    choosingFor.numLasers = 3;
                                    choosingFor.cost = startPrices[1]
                                    theDefences.push(choosingFor)
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
                                    choosingFor.cost += thePrice
                                    console.log('upgraded tower range',choosingFor)

                                }else if(options[i] == "slow"){
                                    var lastSub = choosingFor.subtype
                                    choosingFor.subtype = "slow"
                                    choosingFor.cost = thePrice
                                    console.log('changed tower',choosingFor.subtype,lastSub)

                                }else if(options[i] == "basic"){
                                    choosingFor.subtype = "basic"
                                    choosingFor.cost = thePrice

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
                            

                            
                            console.log("option "+options[i]+" purchased for " + prices[i])
                            console.log("purchase for:", choosingFor)

                            gold -= prices [i]

                            options=[]
                            done = true;
                            towerOptions()
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
            if(isInside([mdX,mdY],popUpRec)){
                doNew()
            }
        }
    }else{
        if(isInside([mdX,mdY],returnButtonRec)){
            console.log("return clicked")
            gameActive = true;
        }
    }
}


const checkRelease = function(){
    if(gameActive){
        //     soundPlayed = false
        // justScored = true
        if(selected[0]>-1){

            var sPiece = gameGrid[selected[0]][selected[1]]
            console.log(selected,target)
            
            sPiece.isSelected = false;

            if(target[0]>-1){
                gameGrid[target[0]][target[1]].isTarget = false;
                if(arrEq(selected, target)&&!(sPiece.type == "path")&&waveRunning){
                    if(choosing == false){
                        choosing = true;
                        console.log("opening options for",sPiece)
                        choosingFor = sPiece
                        waveRunning = false;
                    }
                    
    
                    //available option names
                    towerOptions()
                    
                }
                
                console.log(selected,target)
                console.log(selected,target,gameGrid)
                var thesel = gameGrid[selected[0]][selected[1]]
                var thetar = gameGrid[target[0]][target[1]]
                console.log()
                console.log(thesel, "dropped on", thetar)
            }

        }

        
        target = [-1,-1]
        selected = [-1,-1]
        console.log('tracking cleared')
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
    //todo generate paths
    
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