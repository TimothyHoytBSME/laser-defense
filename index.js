
const Version = "1.0-alpha-gamename"


var backColor = [20,20,20];
var gridDims = [11,9]


var gridSize = [1,1] //gets calculated
var size = 10;  //gets calculated
var selected = [-1,-1]  //gets calculated
var target = [-1,-1]    //gets calculated
var pieceSize = 1; //gets calculated
var textW = 1;  //gets calculated
var textH = 10 //gets calculated
var gameCent = [] //gets calculated
var gameGrid = [] //gets calculated
var newBox = [] //gets calculated
var menuBox = [] //gets calculated
var returnBox = [] //gets calculated
var gameActive = true; //gets calculated
var difficulty = 0 //gets calculated
var difficulties = ["EASY","CHALLENGE","IMPOSSIBLE"]
var score = 0; //gets calculated
var justScored = false; //gets calculated
var gridSizePix = [1,1] //gets calculated
var gridPos = [10,10] //gets calculated
var numPaths = 2;
var paths = new Array(numPaths).fill([]);
var gold = 100;
var numEnemies = 30;
var theEnemies = []
var enemyDelay = 100;
var eDelayCount = 0;
var activeEnemies = 0;
var theDefences = [];
var waveRunning = true;


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
    eDelayCount++
    if(eDelayCount>enemyDelay){
        if(activeEnemies < theEnemies.length){
            activeEnemies++
            var activatedEnemy = theEnemies[activeEnemies-1]
            // activatedEnemy.left = (200+10*activeEnemies)
            // activatedEnemy.top = (100+20*activeEnemies)
            console.log('activating', activatedEnemy)
            console.log('its path', activatedEnemy.pathNum)
            var activePath = [...paths[activatedEnemy.pathNum]]
            var startP = activePath[activePath.length -1]
            var nextP = activePath[activePath.length -2]
            activatedEnemy.from = [...startP]
            activatedEnemy.to = [...nextP]
            console.log(activatedEnemy.to)
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
    for(var i=0; i<theDefences.length; i++){
        theDefences[i].drawLaser()
    }
}

const moveEnemies = function(){
    for(var i=0; i<theEnemies.length; i++){
        theEnemies[i].move()
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
        
        newBox = [gameRec[0]+textXoff, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(newBox[0], newBox[1]+newBox[3], "NEW", newBox[3], "black")
        fillText(newBox[0], newBox[1]+newBox[3], "NEW", newBox[3], "white")

        menuBox = [gameRec[0]+gameRec[2]-textXoff*2-textW, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(menuBox[0], menuBox[1]+menuBox[3], "MENU", menuBox[3], "black")
        fillText(menuBox[0], menuBox[1]+menuBox[3], "MENU", menuBox[3], "white")

        ctx.textAlign = "center"
        ctx.textBaseline = 'middle'
        if(verticalOrien){
            shadowText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1], "SCORE", textH*0.75, "black")
            fillText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1], "SCORE", textH*0.75, "white")
            shadowText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1]+textH, score.toString(), textH*0.75, "black")
            fillText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1]+textH, score.toString(), textH*0.75, "white")

            shadowText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1], difficulties[difficulty], textH*0.75, "black")
            fillText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1], difficulties[difficulty], textH*0.75, "white")

        }else{
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "white")
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*2, score.toString(), textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*2, score.toString(), textH*0.75, "white")

            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]+textH, "GOLD", textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]+textH, "GOLD", textH*0.75, "white")
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]+textH*2, gold.toString(), textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]+textH*2, gold.toString(), textH*0.75, "white")

            shadowText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*3, difficulties[difficulty], textH*0.75, "black")
            fillText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*3, difficulties[difficulty], textH*0.75, "white")
        }
        ctx.textAlign = "left"
        ctx.textBaseline = 'bottom'
        
    }else{
        //paused
        returnBox = [gameRec[0]+gameRec[2]-textXoff*5-textW, gameRec[1]+gameRec[3]-textH, textW*2, textH]
        shadowText(returnBox[0], returnBox[1]+returnBox[3], "RETURN", returnBox[3], "black")
        fillText(returnBox[0], returnBox[1]+returnBox[3], "RETURN", returnBox[3], "white")

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

const checkRelease = function(){
    if(gameActive){
        //     soundPlayed = false
        // justScored = true
        if(selected[0]>-1){
            var sPiece = gameGrid[selected[0]][selected[1]]
            if(arrEq(selected, target)&&!(sPiece.type == "path")&&waveRunning){
                var cost= 20;
                if(gold>=cost){
                    sPiece.type = "defense"
                    gold-= cost;
                    theDefences.push(sPiece)
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
    
    if (confirm('This will erase your score for the current game type. Are you sure?')) {
        score = 0;
        genGrid()
    }
}


const click = function(){
    if(gameActive){


        if((mdX > (newBox[0]))&&(mdY > newBox[1])&&(mdX < (newBox[0]+newBox[2]))&&(mdY<(newBox[1]+newBox[3]))){
            console.log("new clicked")
            doNew()
        }


        if((mdX > (menuBox[0]))&&(mdY > menuBox[1])&&(mdX < (menuBox[0]+menuBox[2]))&&(mdY<(menuBox[1]+menuBox[3]))){
            console.log("menu clicked")
            gameActive = false;
            theMenuDiv.style.visibility = "visible"
        }


        for(var i=0; i<gridDims[0]; i++){
            for(var j=0; j<gridDims[1]; j++){
                var piece = gameGrid[i][j]
                if(piece.isOver(mdX,mdY)){
                    selected = [i,j]
                    piece.isSelected = true;
                }else{
                    piece.isSelected = false;
                }
            }
        }


    }else{
        if((mdX > (returnBox[0]))&(mdY > returnBox[1])&&(mdX < (returnBox[0]+returnBox[2]))&&(mdY<(returnBox[1]+returnBox[3]))){
            console.log("return clicked")
            theMenuDiv.style.visibility = "hidden"
            gameActive = true;
        }
    }
}

class Piece {
    constructor(i, j, type) {
        this.type = type
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
        this.draw = () => {
            
            this.color = (this.type=="base")? [0,0,123] : (this.type=="defense")? [160,160,160] : (this.type=="path")? [123, 123, 123]  : this.color
            var col = this.isSelected? [0,123,0] : this.isTarget? [123,123,0] : this.color
            
            fillRec([this.left, this.top, pieceSize, pieceSize], colText(col));
            
            if(this.type == "base" || this.type == "defense"){
            fillRec([this.left, this.top+pieceSize*0.9, pieceSize, pieceSize*0.1], colText([123,255,0]))

            }
        }
        this.isOver = (xx, yy)=>{
            return (((xx >= this.left)&&(xx <= (this.left+pieceSize)))&&((yy >= this.top)&&(yy <= (this.top+pieceSize))))
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
                drawLine(sor,tar,3,colText([0,200,200]))
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
        this.pathNum = pathnum;
        console.log(paths)
        console.log(pathnum)
        this.pathStep = paths[pathnum].length -1
        this.visible = false;
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
                fillRec([this.left, this.top+pieceSize/2*0.9, pieceSize/2, pieceSize/2*0.1], colText([123,255,0]))
            }

        }
        this.move = ()=>{
            var dir = [ this.to[0]-this.from[0] , this.to[1] - this.from[1]  ]
            var spDir = dir
            if(verticalOrien){
                spDir = [ -spDir[1], spDir[0]]
            }

            this.left= this.left + this.speed*spDir[0]*pieceSize
            this.top= this.top + this.speed*spDir[1]*pieceSize

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
            console.log("enemy removed", theEnemies)
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

    var thebase = [floor(gridDims[0]/2),floor(gridDims[1]/2)]//[floor(random()*gridDims[0]),floor(random()*gridDims[1])]
    gameGrid[thebase[0]][thebase[1]].type = "base"

    //todo generate paths
    
    for(var p=0; p<numPaths; p++){
        var path = []
        var xd = p*2-1;
        var yd = 0;
        path.push([...thebase])
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
        console.log("path",p,path)
    }

    console.log("paths",paths)

    genEnemies()
    saveGame()
}


const genEnemies = function(){
    for(var i=0; i<numEnemies; i++){
        var newEn = new Enemy("grunt",floor(random()*numPaths))
        theEnemies.push(newEn)

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

loadGameDataIfAble()




