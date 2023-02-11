
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
var gold = 120;
var numEnemies = 100;
var theEnemies = [];   //gets calculated
var enemyDelay = 50;
var startDelay = 500; 
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
var prices = [] //gets calculated
var popUpAlpha = 0.7 

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
        fillCir([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2,pieceSize*0.5],colText([0,200,0,0.25]))
        fillTri([choosingFor.left+pieceSize/2, choosingFor.top+pieceSize/2],[popUpRec[0],popUpRec[1]],[popUpRec[0],popUpRec[1]+popUpRec[3]/4],colText([0,200,0,0.25]))
        
        options = []
        if(choosingFor.type =="empty"){
            options = [...subtypes]
        }else if(choosingFor.type == "base"){
            options = ["upgrade", "repair"]
        }else if(choosingFor.type == "defense"){
            options = ["upgrade"]
            for(var i=0; i<subtypes.length; i++){
                if(subtypes[i] != choosingFor.subtype){
                    options.push(subtypes[i])
                }
            }
        }


        sellButtonRec = [popUpRec[0],popUpRec[1]+popUpRec[3]*0.8,popUpRec[2]/2.2, popUpRec[3]*0.2]
        fillRec(sellButtonRec,colText([100,100,100,popUpAlpha]))

        cancelButtonRec = [popUpRec[0]+popUpRec[3]-popUpRec[2]/2.2,popUpRec[1]+popUpRec[3]*0.8,popUpRec[2]/2.2, popUpRec[3]*0.2]
        fillRec(cancelButtonRec,colText([100,100,100,popUpAlpha]))

        optionsRecs = new Array(options.length)
        for(var i=0; i<options.length; i++){
            var opwid = popUpRec[2]*(0.75/(options.length))
            var opleft = popUpRec[0] + popUpRec[2]*(0.25/(options.length+1))*(i+1)+opwid*i
            
            optionsRecs[i] = [opleft,popUpRec[1]+popUpRec[3]*0.3,opwid,popUpRec[3]*0.3]
            fillRec(optionsRecs[i], colText([100,100,100,popUpAlpha]))  
        }
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
    
    if (confirm('This will erase your score for the current game type. Are you sure?')) {
        console.log('clicked okay')
        score = 0;
        gold = 600;
        theDefences = [];
        theEnemies = [];
        activeEnemies = []
        sDelayCount = 0
        eDelayCount = 0
        paths = []
        waveRunning = true; 
        theBase = {};    //gets calculated
        gameOver = false; 

        theGrid = []
        console.log("gamecleared")
        genGrid()
        sizeCanvas()

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
        }else{

            if(isInside([mdX,mdY],cancelButtonRec)){
                choosing = false;
                choosingFor = null
                console.log('cancel clicked')
                options=[]
                waveRunning = true;
            }
            if(isInside([mdX,mdY],sellButtonRec)){
                choosing = false;
                console.log('sell clicked')
                gold+=choosingFor.cost/2;
                choosingFor.type = "empty"
                theDefences.splice(theDefences.indexOf(choosingFor),1)
                choosingFor = null

                options=[]
                waveRunning = true;
            }
            for(var i=0; i<options.length; i++){
                if(isInside([mdX,mdY],optionsRecs[i])){
                    console.log('option '+i.toString()+" clicked")
                    if(gold >= prices[i]){
                        if(choosingFor.type == "empty"){
                            if(options[i] == "basic"){
                                choosingFor.type = "defense"
                                choosingFor.subtype = "basic"
                                choosingFor.cost = prices[i]
                                theDefences.push(choosingFor)
                            }else if(options[i] == "slow"){
                                choosingFor.type = "defense"
                                choosingFor.subtype = "slow"
                                choosingFor.cost = prices[i]
                                theDefences.push(choosingFor)
                            }
                        }else if(choosingFor.type == "defense"){
                            if(options[i] == "upgrade"){
                                //todo upgrades...
                            }else if(options[i] == "slow"){
                                //todo change type
                                choosingFor.subtype = "slow"
                            }else if(options[i] == "basic"){
                                //todo change type
                                choosingFor.subtype = "basic"
                            }
                        }
                        gold-= prices[i]
                        choosing = false;
                        choosingFor = null;
                        options=[]
                        console.log("option "+options[i]+" clicked")
                        waveRunning = true;
                    }
                }
            }
        }
    }else{
        if(isInside([mdX,mdY],returnButtonRec)){
            console.log("return clicked")
            gameActive = true;
        }
    }
}

class Piece {
    constructor(i, j, type) {
        this.type = type
        this.cost = 20
        this.subtype = "basic"
        this.color = [40,40,40]
        this.left = 0;
        this.top = 0;
        this.px = i;
        this.py = j;
        this.isSelected = false;
        this.isTarget = false;
        this.health = 100;
        this.enemyNum = -1;
        this.range = 4;
        this.damage = 0.5;
        this.level = 1;

        this.draw = () => {
            
            this.color = (this.type=="base")? [0,0,123] : (this.type=="defense")? [160,160,160] : (this.type=="path")? [123, 123, 123]  : [40,40,40]
            var col = this.isSelected? [0,123,0] : this.isTarget? [123,123,0] : this.color
            
            fillRec([this.left, this.top, pieceSize, pieceSize], colText(col));
            
            if(this.type == "base"){
                fillRec([this.left, this.top+pieceSize*0.9, pieceSize*this.health/100, pieceSize*0.1], colText([123,255,0]))

            }
            if(this.type == "defense"){
                var col = (this.subtype == "basic")? [100,100,0] : (this.subtype == "slow")? [0,100,100] : [255,255,255]
                    fillCir([this.left+pieceSize/2, this.top+pieceSize/2, pieceSize*0.75/2], colText(col))
            }
        }
        this.drawLaser = ()=>{
            //todo find nearest enemy and qualify
            //todo draw line to enemy
            this.enemy = -1
            var tar = []
            var sor = [this.left+pieceSize/2, this.top + pieceSize/2]
            var tarPind = 100000

            for(var ei=activeEnemies - 1; ei>=0; ei--){
                var tartar = [theEnemies[ei].left+pieceSize/4, theEnemies[ei].top + pieceSize/4]
                var dis = dist(sor,tartar)
                if(dis <= this.range*pieceSize){
                    //enemy found

                    if(tarPind > theEnemies[ei].pathStep){
                        this.enemy = ei
                        tar = [...tartar]
                    }
                    
                }
            }

            if(this.enemy > -1){
                var sz = 3; var co = [200,180,0,0.8]
                if(this.type == "base"){
                    sz = 5; co = [200,123,50,0.8]
                }
                if(this.subtype == "slow"){
                    co = [0,200,200,0.8]
                }
                drawLine(sor,tar,sz,colText(co))
                var theenemy = theEnemies[this.enemy]
                
                if(this.subtype == "basic"){
                    if(theenemy.health > this.damage){
                        theenemy.health-=this.damage
                    }else{
                        theenemy.health = 0
                        theenemy.destroy()
                        score++
                        this.enemy = -1;
                    }
                }else if(this.subtype == "slow"){
                    theenemy.speedMod = 0.25;
                }
                

            }
        }
    }
}

class Enemy {
    constructor(type, pathnum){
        this.type = type
        this.color = [123,0,0]
        this.speed = 0.1;
        this.left = 50;
        this.top = 50;
        this.from = [-1,-1]
        this.to  = [-1,-1]
        this.health = 100;
        this.damage = 10;
        this.pathNum = pathnum;
        // console.log(paths)
        // console.log(pathnum)
        this.pathStep = paths[pathnum].length -1
        this.visible = false;
        this.speedMod = 1;

        this.draw = ()=>{
            if((this.to[0]<0)||(this.from[0]<0)){
                if(this.visible){
                    this.visible = false
                }
            }else{
                this.visible = true;
            }

            if(this.visible){
                fillRec([this.left, this.top, pieceSize/2, pieceSize/2], colText(this.color));
                fillRec([this.left, this.top+pieceSize/2*0.9, (pieceSize/2)*this.health/100, pieceSize/2*0.1], colText([123,255,0]))
            }

        }
        this.move = ()=>{
            var dir = [ this.to[0]-this.from[0] , this.to[1] - this.from[1]  ]
            var spDir = dir
            if(verticalOrien){
                spDir = [ -spDir[1], spDir[0]]
            }

            this.left= this.left + this.speed*spDir[0]*pieceSize*this.speedMod
            this.top= this.top + this.speed*spDir[1]*pieceSize*this.speedMod
            this.speedMod = 1;

            if(this.to[0]>-1){
                var destPiece = gameGrid[this.to[0]][this.to[1]]
                var pastLeft = spDir[0]*((destPiece.left + pieceSize/2) - (this.left + pieceSize/4)) <= 0
                var pastTop = spDir[1]*((destPiece.top + pieceSize/2) - (this.top + pieceSize/4)) <= 0

                if(pastLeft){
                    this.left = destPiece.left + pieceSize/4
                }
                if(pastTop){
                    this.top = destPiece.top + pieceSize/4
                }

                if(pastLeft&&pastTop){
        
                    this.pathStep = this.pathStep - 1;
                    if(this.pathStep < - 0){
                        //hit base
                        if(theBase.health > this.damage){
                            theBase.health-= this.damage
                        }else{
                            theBase.health = 0
                            waveRunning = false;
                            gameOver = true;

                        }


                        this.destroy()
                    }else{
                        
                        this.from = [...this.to]
                        this.to = [...paths[this.pathNum][this.pathStep]]
                    }
                    
                }
                // console.log('moving', dir, this.speed, this.left, this.top)
            }
            
        }
        this.destroy = ()=>{
            this.speed = 0;
            this.to = [-1,-1]
            this.from = [-1,-1]
            this.left = 0;
            this.top = 0;
            activeEnemies--
            theEnemies.splice(theEnemies.indexOf(this),1)
            // console.log("enemy removed", theEnemies)
            if(theEnemies.length == 0){
                waveRunning = false
            }
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
    theBase.damage = 1;
    theBase.range = 8
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

            shadowText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1], "WAVE #", textH*0.75, "black")
            fillText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1], "WAVE #", textH*0.75, "white")

        }else{
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "white")
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*2, score.toString(), textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*2, score.toString(), textH*0.75, "white")

            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]+textH, "GOLD", textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]+textH, "GOLD", textH*0.75, "white")
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]+textH*2, gold.toString(), textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]+textH*2, gold.toString(), textH*0.75, "white")

            shadowText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*3, "WAVE #", textH*0.75, "black")
            fillText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*3, "WAVE #", textH*0.75, "white")
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
            //todo title
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

            //todo options
            for(var i=0; i<options.length; i++){
                var opRec = optionsRecs[i]
                var optionText = "BUILD " + options[i].toUpperCase()
                if(chTyp == "base"){
                    optionText = options[i].toUpperCase()
                }else if(chTyp == "defense"){
                    if(options[i] == "upgrade"){
                        optionText = options[i].toUpperCase()
                    }else{
                        optionText = "CHANGE" //options[i].toUpperCase()
                        // fillText(opRec[0]+opRec[2]/2, opRec[1]-textH*0.5, "CHANGE TO", textH*0.5, "white")
                        var col = (options[i] == "basic")? [100,100,0,popUpAlpha] : (options[i] == "slow")? [0,100,100,popUpAlpha] : [255,255,255]
                        fillRec([opRec[0]+opRec[2]/4, opRec[1]+opRec[3]/2-opRec[2]/4, opRec[2]/2,opRec[2]/2],colText([50,50,50,popUpAlpha]))
                        fillCir([opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/2, opRec[2]/6], colText(col))
                    }
                }
                fillText(opRec[0]+opRec[2]/2, opRec[1], optionText, textH*0.5, "white")

                prices[i] = 20;
                var optionText2 = prices[i].toString() + " G"
                fillText(opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/8, optionText2, textH*0.5, "white")

                if(chTyp == "empty"){
                    var col = (options[i] == "basic")? [100,100,0,popUpAlpha] : (options[i] == "slow")? [0,100,100,popUpAlpha] : [255,255,255]
                    fillRec([opRec[0]+opRec[2]/4, opRec[1]+opRec[3]/2-opRec[2]/4, opRec[2]/2,opRec[2]/2],colText([50,50,50,popUpAlpha]))
                    fillCir([opRec[0]+opRec[2]/2, opRec[1]+opRec[3]/2, opRec[2]/6], colText(col))
                }
                
            }

            //todo sell/cancel

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





