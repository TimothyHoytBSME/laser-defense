
const Version = "1.0-alpha-laserdefense"


var backColor = [20,20,20];
var gridDims = [15,13]


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
var startGold = 40  ;
var gold = startGold;
var numEnemies = 100;
var theEnemies = [];   //gets calculated
var enemyDelay = 50;
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

//Main Animation Loop
const mainLoop = function(){
    const currTime = new Date();
    const lapse = currTime - startTime
    ctx.fillStyle = "rgb(0, 0, 0)"; ctx.fillRect(0, 0, cWidth, cHeight);
    fillRec(gameRec, colText(backColor))

    /////////////////////////draw/////////////////////////

    if(gameActive){
        drawBoard()
        if(waveRunning){
            activateEnemy()
        }

        drawEnemies()

        drawLasers()

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
        fillCir([mX, mY, 12], 'rgba(0,0,0,0.5)')
        fillCir([mX, mY, 10], 'rgba(255,255,255,0.5)')
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
    window.requestAnimationFrame(mainLoop);
    dlastLapse = lapse;
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
        eDelayCount++
    }else{
        sDelayCount++
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        fillText( gameCent[0], gridPos[1]+textH, "GET READY!", textH/3 , "red")
        ctx.textAlign = "left"
        ctx.textBaseline = "bottom"

        var timerRec = [gameCent[0]-gridSizePix[0]/5/2, gridPos[1]+textH*1.5, gridSizePix[0]/5,textH/6 ]
        fillRec(timerRec,colText([100,100,100]))
        fillRec([timerRec[0],timerRec[1],timerRec[2]*sDelayCount/startDelay,timerRec[3]],"red")
    }
    
    if(eDelayCount>enemyDelay){
        if(activeEnemies < theEnemies.length){
            activeEnemies++
            var activatedEnemy = theEnemies[activeEnemies-1]
            // activatedEnemy.left = (200+10*activeEnemies)
            // activatedEnemy.top = (100+20*activeEnemies)
            // console.log('activating', activatedEnemy)
            // console.log('its path', activatedEnemy.pathNum)
            var activePath = [...paths[activatedEnemy.pathNum]]
            var startP = activePath[activePath.length -1]
            var nextP = activePath[activePath.length -2]
            activatedEnemy.from = [...startP]
            activatedEnemy.to = [...nextP]
            // console.log(activatedEnemy.to)
            activatedEnemy.left = gameGrid[startP[0]][startP[1]].left+pieceSize/4
            activatedEnemy.top = gameGrid[startP[0]][startP[1]].top+ pieceSize/4

        }
        eDelayCount = 0
    }
}

const drawEnemies = function(){
    for(var i=0; i<theEnemies.length; i++){
        theEnemies[i].draw()
    }
}

const drawLasers = function(){
    if(waveRunning){
        for(var i=0; i<theDefences.length; i++){
            theDefences[i].drawLaser()
        }
        theBase.drawLaser()
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
        fillRec(popUpRec,colText([0,0,0,0.75]))
    }
    if(choosing){
        fillRec(popUpRec,colText([0,0,0,0.75]))

        sellButtonRec = [popUpRec[0],popUpRec[1]+popUpRec[3]*0.8,popUpRec[2]/2.2, popUpRec[3]*0.2]
        fillRec(sellButtonRec,colText([100,100,100,popUpAlpha]))

        cancelButtonRec = [popUpRec[0]+popUpRec[3]-popUpRec[2]/2.2,popUpRec[1]+popUpRec[3]*0.8,popUpRec[2]/2.2, popUpRec[3]*0.2]
        fillRec(cancelButtonRec,colText([100,100,100,popUpAlpha]))

        optionsRecs = new Array(options.length)
        for(var i=0; i<options.length; i++){
            var opwid = popUpRec[2]*(0.75/(options.length))
            var opleft = popUpRec[0] + popUpRec[2]*(0.25/(options.length+1))*(i+1)+opwid*i
            
            optionsRecs[i] = [opleft,popUpRec[1]+popUpRec[3]*0.35,opwid,popUpRec[3]*0.3]
            var opRec = optionsRecs[i]
            fillRec(opRec, colText([100,100,100,popUpAlpha])) 

            if(options[i] == "basic" || options[i] == "slow"){
                var col = (options[i] == "basic")? [100,100,0,popUpAlpha] : (options[i] == "slow")? [0,100,100,popUpAlpha] : [255,255,255]
                fillRec([opRec[0]+opRec[2]/4, opRec[1]+opRec[3]/2-opRec[2]/4, opRec[2]/2,opRec[2]/2],colText([50,50,50,popUpAlpha]))
                fillCir([opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/2, opRec[2]/6], colText(col)) 
            }
            
        }

        if((choosingFor.left+pieceSize/2)>gameCent[0]){
            fillTri([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2],[popUpRec[0],popUpRec[1]],[popUpRec[0],popUpRec[1]+popUpRec[3]/4],colText([0,200,0,0.25]))
        }else{
            fillTri([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2],[popUpRec[0]+popUpRec[2],popUpRec[1]],[popUpRec[0]+popUpRec[2],popUpRec[1]+popUpRec[3]/4],colText([0,200,0,0.25]))
        }
        strokeRec(popUpRec,3,colText([0,200,0,0.25]))
        fillCir([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2,pieceSize*0.5],colText([0,200,0,0.25]))

    }
}

const moveEnemies = function(){
    for(var i=0; i<theEnemies.length; i++){
        theEnemies[i].move()
    }
}

const checkRelease = function(){
    if(gameActive){
        //     soundPlayed = false
        // justScored = true
        if(selected[0]>-1){
            var sPiece = gameGrid[selected[0]][selected[1]]
            if(arrEq(selected, target)&&!(sPiece.type == "path")&&waveRunning){
                
                choosing = true;
                console.log("opening options for",sPiece)
                choosingFor = sPiece
                waveRunning = false;


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
                
                for (var i = 0; i< options.length; i++){
                    switch(options[i]){
                        case "upgrade1":
                            prices[i] = choosingFor.cost
                            break;
                        case "upgrade2":
                            prices[i] = floor(choosingFor.cost/2)
                            break;
                        case "upgrade3":
                            prices[i] = floor(choosingFor.cost*1.5)
                            break;
                        case "slow":
                            prices[i] = (choosingFor.type == "empty")? startPrices[1] : floor(choosingFor.cost)
                            
                            break;
                        case "basic":
                            prices[i] = (choosingFor.type == "empty")? startPrices[0] : floor(choosingFor.cost)
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
            sPiece.isSelected = false;
            selected = [-1,-1]
        }
        
        if(target[0]>-1){
            gameGrid[target[0]][target[1]].isTarget = false;
            target = [-1,-1]
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
                    piece.isTarget = false;
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

        if(waveRunning){
            for(var i=0; i<gridDims[0]; i++){
                for(var j=0; j<gridDims[1]; j++){
                    var piece = gameGrid[i][j]
                    if(isInside([mdX,mdY],[piece.left,piece.top,pieceSize,pieceSize])){
                        selected = [i,j]
                        piece.isSelected = true;
                    }else{
                        piece.isSelected = false;
                    }
                }
            }
        }else if(!gameOver){

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
                theDefences.splice(theDefences.indexOf(choosingFor),1)
                choosingFor = null

                options=[]
                waveRunning = true;
            }
            
            console.log(
                "calculating costs"
            )
            

            for(var i=0; i<options.length; i++){
                if(isInside([mdX,mdY],optionsRecs[i])){
                    console.log('option '+i.toString()+" clicked")
                    var thePrice = prices[i]

                    if(gold >= thePrice){
                        if(choosingFor.type == "empty"){


                            if(options[i] == "basic"){
                                choosingFor.type = "defense"
                                choosingFor.subtype = "basic"
                                choosingFor.cost = startPrices[0]
                                theDefences.push(choosingFor)
                            }else if(options[i] == "slow"){
                                choosingFor.type = "defense"
                                choosingFor.subtype = "slow"
                                choosingFor.numLasers = 3;
                                choosingFor.cost = startPrices[1]
                                theDefences.push(choosingFor)
                            }
                        }else if(choosingFor.type == "defense"){
                            if(options[i] == "upgrade1"){
                                choosingFor.numLasers++
                                choosingFor.cost += thePrice
                                console.log("dfghmfghjmghk,")
                            }else if(options[i] == "upgrade2"){
                                if(choosingFor.subtype == "slow"){
                                    choosingFor.power/=2
                                }else{
                                    choosingFor.power++
                                }
                                choosingFor.cost += thePrice
                            }else if(options[i] == "upgrade3"){
                                choosingFor.range++
                                choosingFor.cost += thePrice
                            }else if(options[i] == "slow"){
                                choosingFor.subtype = "slow"
                                choosingFor.cost = thePrice
                            }else if(options[i] == "basic"){
                                choosingFor.subtype = "basic"
                                choosingFor.cost = thePrice

                            }
                        }else if(choosingFor.type == "base"){
                            if(options[i] == "repair"){
                                console.log('repairing base')
                                
                                theBase.health+= thePrice
                                
                            }if(options[i] == "upgrade1"){
                                choosingFor.numLasers ++
                                choosingFor.cost += thePrice
                            }else if(options[i] == "upgrade2"){
                                choosingFor.power++
                                choosingFor.cost += thePrice
                            }else if(options[i] == "upgrade3"){
                                choosingFor.range++
                                choosingFor.cost += thePrice
                            }
                        }
                        gold-= thePrice
                        choosing = false;
                        choosingFor = null;
                        options=[]
                        console.log("option "+options[i]+" clicked")
                        waveRunning = true;
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

const genGrid = function(){

    console.log('generating new grid')
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

    var baseP = [floor(gridDims[0]/2),floor(gridDims[1]/2)]//[floor(random()*gridDims[0]),floor(random()*gridDims[1])]
    
    theBase = gameGrid[baseP[0]][baseP[1]]
    theBase.type = "base"
    theBase.cost = 100
    //todo generate paths
    
    for(var p=0; p<numPaths; p++){
        var path = []
        var xd = p*2-1;
        var yd = 0;
        path.push([...baseP])
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

    genEnemies()
    saveGame()
}


const genEnemies = function(){
    for(var i=0; i<numEnemies; i++){
        var newEn = new Enemy("grunt",floor(random()*numPaths))
        theEnemies.push(newEn)

    }

    
}









const drawTexts = function(){
    if(verticalOrien){
        textW = gameRec[2]/5
    }else{
        textW = gameRec[3]/5
    }
    
    const textXoff = textW/8
    textH = textW*0.375

    if(gameActive){
        
        newButtonRec = [gameRec[0]+textXoff, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(newButtonRec[0], newButtonRec[1]+newButtonRec[3], "NEW", newButtonRec[3], "black")
        fillText(newButtonRec[0], newButtonRec[1]+newButtonRec[3], "NEW", newButtonRec[3], "white")

        menuButtonRec = [gameRec[0]+gameRec[2]-textXoff*2-textW, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(menuButtonRec[0], menuButtonRec[1]+menuButtonRec[3], "MENU", menuButtonRec[3], "black")
        fillText(menuButtonRec[0], menuButtonRec[1]+menuButtonRec[3], "MENU", menuButtonRec[3], "white")

        ctx.textAlign = "center"
        ctx.textBaseline = 'middle'
        if(verticalOrien){
            shadowText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1], "SCORE", textH*0.75, "black")
            fillText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1], "SCORE", textH*0.75, "white")
            shadowText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1]+textH, score.toString(), textH*0.75, "black")
            fillText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1]+textH, score.toString(), textH*0.75, "white")

            shadowText(gameCent[0], gameRec[3]/10+gameRec[1], "GOLD", textH*0.75, "black")
            fillText(gameCent[0], gameRec[3]/10+gameRec[1], "GOLD", textH*0.75, "white")
            shadowText(gameCent[0], gameRec[3]/10+gameRec[1]+textH, gold.toString(), textH*0.75, "black")
            fillText(gameCent[0], gameRec[3]/10+gameRec[1]+textH, gold.toString(), textH*0.75, "white")

            shadowText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1], "WAVE", textH*0.75, "black")
            fillText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1], "WAVE", textH*0.75, "white")
            shadowText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1]+textH, waveNum.toString(), textH*0.75, "black")
            fillText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1]+textH, waveNum.toString(), textH*0.75, "white")

        }else{
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "white")
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*2, score.toString(), textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*2, score.toString(), textH*0.75, "white")

            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]+textH, "GOLD", textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]+textH, "GOLD", textH*0.75, "white")
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]+textH*2, gold.toString(), textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]+textH*2, gold.toString(), textH*0.75, "white")

            shadowText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*3, "WAVE", textH*0.75, "black")
            fillText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*3, "WAVE", textH*0.75, "white")
            shadowText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*2, waveNum.toString(), textH*0.75, "black")
            fillText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*2, waveNum.toString(), textH*0.75, "white")
        }
        ctx.textAlign = "left"
        ctx.textBaseline = 'bottom'
        
        if(gameOver){
            // fillRec([gridPos[0]+gridSizePix[0]/4, gridPos[1]+gridSizePix[1]/4, gridSizePix[0]/2, gridSizePix[1]/2],colText([0,0,0]))
            ctx.textAlign = "center"
            ctx.textBaseline = 'middle'
            fillText(gameCent[0], gameCent[1], "GAME OVER", textH*0.75, "white")
            ctx.textAlign = "left"
            ctx.textBaseline = 'bottom'
        }


        if(choosing){
            ctx.textAlign = "center"
            ctx.textBaseline = 'middle'
            var chTyp = choosingFor.type
            var chSubT = choosingFor.subtype
            var title = (chTyp == "empty")? chTyp.toUpperCase() + " SPACE" : (chTyp == "base")? "YOUR BASE" : chSubT.toUpperCase() + " " + chTyp.toUpperCase()
            if(chTyp == "defense"){
                title+= " TOWER"
            }
            fillText(gameCent[0], popUpRec[1]+textH*0.75, title, textH*0.5, "white")
            

            //todo stats

            //numLasers
            var numLText = choosingFor.numLasers.toString()
            
            //power
            var powText = choosingFor.power.toString()

            //range
            var ranText = choosingFor.range.toString()

            var top1 = popUpRec[1] + textH*2;
            var top2 = popUpRec[1] + textH*2.5;
            var leftInc = popUpRec[2]/4;
            var tsize = textH/2;

            if(chTyp == "base"){
                leftInc = popUpRec[2]/5;
                //health
                fillText(popUpRec[0] + leftInc*4,top1,"HEALTH",tsize,"white")
                fillText(popUpRec[0] + leftInc*4,top2, floor(choosingFor.health).toString(),tsize,"white")
            }

            fillText(popUpRec[0] + leftInc,top1, "LASERS" ,tsize, "white")
            fillText(popUpRec[0] + leftInc,top2, numLText,tsize, "white")

            fillText(popUpRec[0] + leftInc*2,top1, "POWER",tsize, "white")
            fillText(popUpRec[0] + leftInc*2,top2, powText,tsize, "white")
            
            fillText(popUpRec[0] + leftInc*3,top1, "RANGE",tsize, "white")
            fillText(popUpRec[0] + leftInc*3,top2,ranText ,tsize, "white")


            for(var i=0; i<options.length; i++){
                var opRec = optionsRecs[i]
                var optionText = "BUILD " + options[i].toUpperCase()
                if(chTyp == "base"){
                    optionText = options[i].toUpperCase()
                    
                }else if(chTyp == "defense"){
                    if(options[i] == "upgrade"){
                        optionText = options[i].toUpperCase()
                    }else{
                        optionText = "CHANGE"
                    }
                }
                if(options[i] == "upgrade1" || options[i] == "upgrade2" || options[i] == "upgrade3"){
                    optionText = ""
                }
                
                fillText(opRec[0]+opRec[2]/2, opRec[1], optionText, textH*0.5, "white")

                

                var optionText2 = prices[i].toString() + " G"

                fillText(opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/8, optionText2, textH*0.5, "white")

                if(options[i] == "repair"){
                    fillText(opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/2.25,"+",textH*1.5,"red")
                    fillText(opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/1.25, prices[i].toString(),textH, "red")
                }else if(options[i] == "upgrade1"){ //lasers
                    fillText(opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/1.8,"+1",textH*1.5,colText([200,200,200,0.75]))
                }else if(options[i] == "upgrade2"){ //power
                    fillText(opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/1.8,"+1",textH*1.5,colText([200,200,200,0.75]))
                }else if(options[i] == "upgrade3"){ //range
                    fillText(opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/1.8,"+1",textH*1.5,colText([200,200,200,0.75]))

                    
                }
                
            }

            var sellText = "SELL (" + floor((choosingFor.cost/2)).toString() + " G)"
            if(chTyp != "defense"){
                sellText = "CANNOT SELL"
            }
            fillText(sellButtonRec[0]+sellButtonRec[2]/2, sellButtonRec[1]+sellButtonRec[3]/2, sellText, textH*0.5, "white")
            fillText(cancelButtonRec[0]+cancelButtonRec[2]/2, cancelButtonRec[1]+cancelButtonRec[3]/2, "EXIT", textH*0.5, "white")

            ctx.textAlign = "left"
            ctx.textBaseline = 'bottom'
        }

    }else{
        //paused
        returnButtonRec = [gameRec[0]+gameRec[2]-textXoff*5-textW, gameRec[1]+gameRec[3]-textH, textW*2, textH]
        shadowText(returnButtonRec[0], returnButtonRec[1]+returnButtonRec[3], "RETURN", returnButtonRec[3], "black")
        fillText(returnButtonRec[0], returnButtonRec[1]+returnButtonRec[3], "RETURN", returnButtonRec[3], "white")

        ctx.textAlign = 'center'
        var message1 = "Instructions line 1".toUpperCase()
        shadowText(gameCent[0], gameCent[1]-gameRec[3]/3, message1, textH, "black")
        fillText(gameCent[0], gameCent[1]-gameRec[3]/3, message1, textH, "white")

        var message2 = "Instructions line 2".toUpperCase()
        shadowText(gameCent[0], gameCent[1]+textH-gameRec[3]/3, message2, textH, "black")
        fillText(gameCent[0], gameCent[1]+textH-gameRec[3]/3, message2, textH, "white")
        ctx.textAlign = 'left'
    }
}










const saveGame = function(){
    // const gameObj = {\
    //     "gameGrid": deepClone(gameGrid)
    //     "difficulty": difficulty,
    //     "score": [...score],
    //     "gridDims": [...gridDims],
    // }

    // const gameString = JSON.stringify(gameObj)
    // window.localStorage.setItem(Version,gameString)
    // console.log("GAME SAVED")
}


const loadGameDataIfAble = function(){
    if (!(localStorage.getItem(Version) === null)) {
        const gameObj = JSON.parse(window.localStorage.getItem(Version))
        // difficulty = gameObj.difficulty
        // difficultyDiv.selectedIndex = difficulty
        // score = [...gameObj.score]
        // gridDims = [...gameObj.gridDims]
        // gameGrid = deepClone(gameObj.gameGrid)

        console.log('GAME LOADED FROM STORAGE')
    }else{
    
        genGrid()
    }
}





