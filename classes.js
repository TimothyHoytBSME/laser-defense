
/////////////////////////////////
//overlay text draw calls only
///////////////////////////////

//Class of object to be stored as tile object in gamegrid
class Piece {
    constructor(i, j, type) {
        this.type = type
        this.cost = 0;
        this.subtype = "basic"
        this.color = [5,5,5]
        this.left = 0;
        this.top = 0;
        this.px = i;
        this.py = j;
        this.isSelected = false;
        this.isTarget = false;
        this.health = 100;
        this.enemies = new Array(1).fill(-1);
        this.range = 4;
        this.numLasers = 1;
        this.power = 1
        this.charge = 0
        this.numShots = 0
        this.chargeRate = 1
        this.timers = []

        this.draw = () => {
            
            this.color = (this.type=="base")? [126*(1-this.health/100),0,123*this.health/100] : 
                (this.type=="defense")? [160,160,160] : (this.type=="path")? [50,50,50]  : this.color
            var col = this.isSelected? [0,123,0] : this.isTarget? [123,123,0] : this.color
            
            fillRec([this.left, this.top, pieceSize, pieceSize], col);
            
            if(this.type == "base"){
                fillRec([this.left, this.top+pieceSize*0.9, pieceSize*this.health/100, pieceSize*0.1], [123,255,0])

            }
            if(this.type == "defense"){
                var col = towerColors[subtypes.indexOf(this.subtype)]
                fillCir([this.left+pieceSize/2, this.top+pieceSize/2, pieceSize*0.75/2], col)
            }

            if(this.subtype == "ion" || this.subtype == "phaser"){
                if(this.charge >= 100 && this.numShots < this.numLasers){
                    this.numShots++
                    this.charge = 0
                }else{
                    if(this.numShots == this.numLasers){
                        this.charge = 100
                    }else{
                        if(waveRunning){
                            if(this.subtype == "ion"){
                                this.charge += (0.25+(this.chargeRate**3-1)*0.01)*gameSpeedMult;
                            }else if(this.subtype == "phaser"){
                                this.charge += (0.15+(this.chargeRate**3-1)*0.003)*gameSpeedMult;
                                
                            }
                        }
                        // console.log('charging')
                    }
                }

                var chargeRec = [this.left, this.top+pieceSize*0.9, pieceSize*(this.charge/100), pieceSize*0.1]
                
                fillRec(chargeRec,[255,50,10])

                
                // console.log(this.numShots)
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                fillText(this.left+pieceSize/2,this.top+pieceSize/2,this.numShots.toString(),pieceSize/2,[255,255,255,0.5])
                ctx.textAlign = "left"
                ctx.textBaseline = "top"
                
            }

        }
        this.findEnemies = ()=>{
            if ((this.subtype == "ion")||(this.subtype == "phaser")){
                //do nothing, enemy set as path coordinate when drag and drop
                
            }else{
                this.enemies = new Array(1).fill(-1)

                var sor = [this.left+pieceSize/2, this.top + pieceSize/2]
                
                for(var li = 0; li<this.numLasers; li++){
                    var tarPind = 1000000
                    var closest = 1000000;
                    for(var ei=(activeEnemies - 1); ei>=0; ei--){
                        if(!this.enemies.includes(ei)){
                            var tartar = [theEnemies[ei].left+pieceSize/4, theEnemies[ei].top + pieceSize/4]
                            var dis = dist(sor,tartar)
                            
                            if(dis <= this.range*pieceSize){
                                if(this.subtype == "slow"){
                                    if(dis<(closest-pieceSize/20)){
                                        closest = dis
                                        this.enemies[li] = ei
                                    }
                                }else{
                                    if(tarPind > theEnemies[ei].pathStep){
                                        this.enemies[li] = ei
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
        }
        this.drawLaser = ()=>{
            var pointcount = 0;
            for(var i=0; i<this.enemies.length; i++){
                if(this.enemies[i].length == 2){
                    pointcount++
                    
                }
            }
            if(pointcount > 0){
                for(var i=0; i<this.enemies.length; i++){
                    console.log('enemy', i, 'is', this.enemies[i])
                    if(this.enemies[i].length == 2){ //path point [x,y]
                        if(this.timers[i]>0){
                            this.timers[i]-= gameSpeedMult
                            if(this.subtype == "ion"){
                                var paCo = this.enemies[i];
                                var pathT = gameGrid[paCo[0]][paCo[1]]
                                drawLine([pathT.left+pieceSize/2,pathT.top + pieceSize/2],[pathT.left+pieceSize/3,pathT.top-cHeight],pieceSize/3,[255,120,40,0.375])
                                drawLine([pathT.left+pieceSize/2,pathT.top + pieceSize/2],[pathT.left+pieceSize-pieceSize/3,pathT.top-cHeight],pieceSize/3,[255,120,40,0.375])
                                drawLine([pathT.left+pieceSize/2,pathT.top + pieceSize/2],[pathT.left+pieceSize/2,pathT.top-cHeight],pieceSize/6,[255,120,40,0.375])
                            }else if(this.subtype == "phaser"){
                                var paCo = this.enemies[i];
                                var paCoIn = undefined
                                var pathNum = undefined
                                for(var p=0; p<paths.length; p++){
                                    for(var t=0; t<paths[p].length; t++){
                                        if(arrEq(paths[p][t],paCo)){
                                            pathNum = p
                                            paCoIn = t
                                        }
                                    }
                                }
                                if(pathNum != undefined){
                                    var path = paths[0]
                                    var nextP = path[paCoIn+1]
                                    var dir = [nextP[0]-paCo[0],nextP[1]-paCo[1]]
                                    console.log('dir',dir)
                                    var pathT = gameGrid[paCo[0]][paCo[1]]
                                    var lasC = [pathT.left+pieceSize/2, pathT.top + pieceSize/2]
                                    drawLine(lasC,[pathT.left+pieceSize/3,pathT.top-cHeight],pieceSize/3,[12,100,255,0.375])
                                    drawLine(lasC,[pathT.left+pieceSize-pieceSize/3,pathT.top-cHeight],pieceSize/3,[12,100,255,0.375])
                                    drawLine(lasC,[pathT.left+pieceSize/2,pathT.top-cHeight],pieceSize/6,[12,100,255,0.375])
    
                                    //phaser laser
                                    //with more overall power than ion
                                    //travels in opposite direction along chosen path
                                    //attacking all enemeies in the path
                                    //moves faster than the enemies on average
                                    //Always only 1 shot, but it is effective
                                    //laser count is actually speed
                                    //recharge slightly faster than ion
                                    //
                                }else{
                                    console.log('pathNum invalid',pathNum)
                                }
        
        
                            }
                        }else{
                            this.enemies[i] = -1
                        }
                    }
                }
            }else if(this.enemies[0] != -1){
                var sor = [this.left+pieceSize/2, this.top + pieceSize/2]
                for(var ei=this.enemies.length -1; ei>=0; ei--){
                    if(this.enemies[ei]<0){
                        console.warn(this.enemies[ei])
                    }else if(this.enemies[ei] > (theEnemies.length-1)){
                        console.warn(this.enemies[ei])
                    }
                    // console.log(this.enemies[ei])
                    var theenemy = theEnemies[this.enemies[ei]]
                    // console.log(theenemy)
                    var tar = [theenemy.left+theenemy.size/2, theenemy.top + theenemy.size/2]

                    var sz = (3+this.power)*pieceSize/60; 
                    var co = [200,180,0,0.8]
                    if(this.type == "base"){
                        co = [200,123,50,0.8]
                    }
                    if(this.subtype == "slow"){
                        co = [0,200,200,0.8]
                    }
                    // console.log('herereer')
                    drawLine(sor,tar,sz,co)
                }
            
            }
        }
        this.doDamage = function(){


            // console.log('drawing lasers for', this.enemies)
            var pointcount = 0;
            for(var i=0; i<this.enemies.length; i++){
                if(this.enemies[i].length == 2){
                    pointcount++
                }
            }
            if(pointcount > 0){
                if(this.subtype == "ion"){
                    for(var i=0; i<activeEnemies; i++){
                        for(var j = 0; j<this.enemies.length; j++){
                            var theE = theEnemies[i] //for each active enemy
                            if(theE){
                                
                                var pC = this.enemies[j] 
                                if(pC.length == 2){ //path point?
                                    var pathTile = gameGrid[pC[0]][pC[1]]
                                    var pTC = [pathTile.left+pieceSize/2,pathTile.top+pieceSize/2] //center
                                    var lw = pieceSize/3 //laser width
                                    if((theE.left < pTC[0]+lw/2)&&(theE.left+theE.size > pTC[0]-lw/2)){//is enemy within L/R
                                        if((theE.top < pTC[1]+lw/2)&&(theE.top+theE.size > pTC[1]-lw/2)){//is enemy within T/B
                                            strokeRec([theE.left,theE.top,theE.size,theE.size],pieceSize/50,[255,150,40])//damage highligt
                                            var hp = (this.power*3-theE.armor)*gameSpeedMult // hitpoints
                                            theE.hit(hp)    //apply the damage
                                        }
                                    }
                                }
                                
                            }
                        }
                    }
                }

                if(this.subtype == "phaser"){
                    //todo
                }
            }else if(this.enemies[0] > -1){
                for(var ei=this.enemies.length -1; ei>=0; ei--){
                    var theenemy = theEnemies[this.enemies[ei]]
                    if(theenemy != undefined){
                        if(this.subtype == "basic"){
                            var aO = 0.75
                            var hp = (this.power+aO-theenemy.armor)*gameSpeedMult/2
                            // console.log(hp)
                            var dead = theenemy.hit(hp)
                            if(dead){
                                if(ei > 0){
                                    this.enemies.pop()
                                }else{
                                    this.enemies[0] = -1
                                }
                            }
                        }else if(this.subtype == "slow"){
                            theenemy.speedMod /= (this.power+1.25);
                        }
                    }
                }
            }
        }

        
    }
}

//class of object to be array of current theEnemies
class Enemy { 
    constructor(type, pathnum){
        this.type = type
        this.color = [123,0,0]
        if(type == "brute"){
            this.color = [123, 160, 10]
        }
        this.speed = 0.01 + 0.01*waveNum;
        if(type == "brute"){
            this.speed*=0.6
        }
        this.left = 0;
        this.top = 0;
        this.size = 500;
        if(type == "brute"){this.size = 500}
        this.from = [-1,-1] 
        this.to  = [-1,-1]
        this.health = 100;
        this.armor = 1.5 +0.075*(waveNum-1);
        if(type == "brute"){ this.armor = 1.7+(0.5*(waveNum-1));}
        this.damage = 10+(waveNum); 
        this.pathNum = pathnum;
        this.reward = waveNum*3;
        if(type == "brute"){
            this.reward = waveNum*8;
        }
        this.pathStep = paths[pathnum].length -1
        this.visible = false;
        this.speedMod = 1; //ratio of 1 changed by lasers

        this.draw = ()=>{
            // this.size =pieceSize/2;
            
            if((this.to[0]<0)||(this.from[0]<0)){
                if(this.visible){
                    this.visible = false
                }
            }else{
                this.visible = true;
            }

            if(this.visible){
                
                // console.log(this.size)
                var enRec = [this.left, this.top, this.size, this.size]
                // if(this.type == "brute"){
                //     var enRec = [this.left, this.top, this.size, this.size]
                // }
                fillRec(enRec, this.color);
                fillRec([enRec[0], enRec[1]+enRec[3]*0.9, enRec[2]*this.health/100, enRec[3]*0.1], [123,255,0])
                strokeRec(enRec, enRec[2]/20, [0,0,0]);
            }

        }
        this.move = ()=>{
            if(this.from[0] >-1){
                var dir = [ this.to[0]-this.from[0] , this.to[1] - this.from[1]  ]
            var spDir = dir
            if(verticalOrien){
                spDir = [ -spDir[1], spDir[0]]
            }

            

            this.left= this.left + this.speed*spDir[0]*pieceSize*this.speedMod*gameSpeedMult
            this.top= this.top + this.speed*spDir[1]*pieceSize*this.speedMod*gameSpeedMult
            this.speedMod = 1;

            if(this.to[0]>-1){
                var destPiece = gameGrid[this.to[0]][this.to[1]]
                var pastLeft = ((spDir[0]*((destPiece.left + pieceSize/2) - (this.left + this.size/2)) )<= 0)
                var pastTop = ((spDir[1]*((destPiece.top + pieceSize/2) - (this.top + this.size/2))) <= 0)

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
            }
            }
            
            
        }
        this.hit = function(hitp){
            var dead = false
            if(this.health > hitp){
                this.health -= (hitp >0)? hitp : 0
            }else{
                console.warn('enemy killed')
                this.health = 0
                this.destroy()
                score+=this.reward
                gold+=this.reward
                var dead = true
            }
            return dead
        }
        this.destroy = ()=>{
            this.speed = 0;
            this.to = [-1,-1]
            this.from = [-1,-1]
            this.left = 0;
            this.top = 0;
            activeEnemies--
            removeFromArray(theEnemies,this)
            if(theEnemies.length == 0){
                waveNum++
                genEnemies()
                sizeCanvas()
                eDelayCount = 0
                sDelayCount = 0;

            }
        }

    }
}