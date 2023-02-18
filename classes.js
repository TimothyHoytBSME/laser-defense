
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
        this.chargeRate = 0.3
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
                            this.charge += this.chargeRate;
                        }
                        console.log('charging')
                    }
                }

                var chargeRec = [this.left, this.top+pieceSize*0.9, pieceSize*(this.charge/100), pieceSize*0.1]
                
                fillRec(chargeRec,[255,50,10])

                
            }

            
        }
        this.findEnemies = ()=>{
            if (this.subtype == "ion"){
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
            
            console.log('drawing lasers for', this.enemies)
            var pointcount = 0;
            for(var i=0; i<this.enemies.length; i++){
                if(this.enemies[i].length == 2){
                    pointcount++
                }
            }
            if(pointcount > 0){

                for(var i=0; i<this.enemies.length; i++){
                    if(this.enemies[i].length == 2){ //path point [x,y]
                        if(this.timers[i]>0){
                            this.timers[i]--
                            // console.log()
                            if(this.subtype == "ion"){
                                // console.warn('oh yea')
                                var paCo = this.enemies[i];
                                var enem = gameGrid[paCo[0]][paCo[1]]
                                // console.log("firing at",enem)
            
                                drawLine([enem.left+pieceSize/2,enem.top + pieceSize/2],[enem.left+pieceSize/3,enem.top-cHeight],20,[255,120,40,0.375])
                                drawLine([enem.left+pieceSize/2,enem.top + pieceSize/2],[enem.left+pieceSize-pieceSize/3,enem.top-cHeight],20,[255,120,40,0.375])
                                drawLine([enem.left+pieceSize/2,enem.top + pieceSize/2],[enem.left+pieceSize/2,enem.top-cHeight],8,[255,120,40,0.375])
        
                                //ION laser
                                //ion tower fires its laser from space, and is larger
                                //tower has limited shot count(lasers)
                                //tower must charge up (power) for each shot
                                //CANNOT TARGET OWN BASE
                                //limited target range
                                //only attacks path point
        
        
        
                            }else if(this.subtype == "phaser"){
                                // if(this.charge < 100){
                                //     this.charge += this.chargeRate;
                                // }else{
                                //     this.charge = 100
                                // }
        
                                //phaser laser
                                //with more overall power than ion
                                //travels in opposite direction along chosen path
                                //attacking all enemeies in the path
                                //moves faster than the enemies on average
                                //Always only 1 shot, but it is effective
                                //laser count is actually speed
                                //recharge slightly faster than ion
                                //
        
        
                            }
                        }else{
                            this.enemies[i] = -1
                        }
                        
    
                    }
                }
                


            }else if(this.enemies[0] != -1){
                // console.log(this.enemies[0])

            
                var sor = [this.left+pieceSize/2, this.top + pieceSize/2]
                for(var ei=this.enemies.length -1; ei>=0; ei--){
                    if(this.enemies[ei]<0){
                        console.warn(this.enemies[ei])
                    }else if(this.enemies[ei] > (theEnemies.length-1)){
                        console.warn(this.enemies[ei])
                    }
                    console.log(this.enemies[ei])
                    var theenemy = theEnemies[this.enemies[ei]]
                    console.log(theenemy)
                    var tar = [theenemy.left+theenemy.size/2, theenemy.top + theenemy.size/2]

                    var sz = 3+this.power; 
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

            
            if(this.enemies[0] > -1){
                if(this.enemies[0].subtype == "path"){
                    //todo
                    //ion
                    //phaser

                    // if(this.subtype == "ion")
                    //while firing ion, enemies who cross into beam get damaged.


                }else{
                    for(var ei=this.enemies.length -1; ei>=0; ei--){
                        var theenemy = theEnemies[this.enemies[ei]]
                        if(theenemy != undefined){
                            if(this.subtype == "basic"){
                                if(theenemy.health > this.power){
                                    var attackOffset = 0.75;
                                    var hit = (this.power+attackOffset-theenemy.armor)*gameSpeedMult/2
                                    theenemy.health -= (hit >0)? hit : 0
                                }else{
                                    theenemy.health = 0
                                    theenemy.destroy()
                                    score+=theenemy.reward
                                    gold+=theenemy.reward
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
                strokeRec(enRec, 1, [0,0,0]);
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