class Piece {
    constructor(i, j, type) {
        this.type = type
        this.cost = 0;
        this.subtype = "basic"
        this.color = [40,40,40]
        this.left = 0;
        this.top = 0;
        this.px = i;
        this.py = j;
        this.isSelected = false;
        this.isTarget = false;
        this.health = 100;
        this.enemies = new Array([-1]);
        this.range = 4;
        this.numLasers = 1;
        this.power = 1

        this.draw = () => {
            
            this.color = (this.type=="base")? [126*(1-this.health/100),0,123*this.health/100] : (this.type=="defense")? [160,160,160] : (this.type=="path")? [123, 123, 123]  : [40,40,40]
            var col = this.isSelected? [0,123,0] : this.isTarget? [123,123,0] : this.color
            
            fillRec([this.left, this.top, pieceSize, pieceSize], colText(col));
            
            if(this.type == "base"){
                fillRec([this.left, this.top+pieceSize*0.9, pieceSize*this.health/100, pieceSize*0.1], colText([123,255,0]))
                // strokeCir([this.left+pieceSize/2, this.top+pieceSize/2, pieceSize*this.range], 3, colText(col))

            }
            if(this.type == "defense"){
                var col = (this.subtype == "basic")? [100,100,0] : (this.subtype == "slow")? [0,100,100] : [255,255,255]
                fillCir([this.left+pieceSize/2, this.top+pieceSize/2, pieceSize*0.75/2], colText(col))
                // strokeCir([this.left+pieceSize/2, this.top+pieceSize/2, pieceSize*this.range], 3, colText(col))
            }
        }
        this.drawLaser = ()=>{
            //todo find nearest enemy and qualify
            //todo draw line to enemy
            this.enemies = new Array([-1])

            
            var sor = [this.left+pieceSize/2, this.top + pieceSize/2]
            
            for(var li = 0; li<this.numLasers; li++){
                var tarPind = 1000000
                var closest = 1000000;
                for(var ei=(activeEnemies - 1); ei>=0; ei--){
                    if(!this.enemies.includes(ei)){
                        var tartar = [theEnemies[ei].left+pieceSize/4, theEnemies[ei].top + pieceSize/4]
                        var dis = dist(sor,tartar)
                        
                        if(dis <= this.range*pieceSize){
                            //enemy found
                            if(this.subtype == "slow"){
                                if(dis<closest){
                                    closest = dis
                                    this.enemies[li] = ei
                                    // console.log(dis, this.range, pieceSize)

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
            
            if(this.enemies[0] > -1){

                for(var ei=this.enemies.length -1; ei>=0; ei--){
                    if(this.enemies[ei]<0){
                        console.warn(this.enemies[ei])
                    }else if(this.enemies[ei] > (theEnemies.length-1)){
                        console.warn(this.enemies[ei])
                    }
                    var theenemy = theEnemies[this.enemies[ei]]
                    var tar = [theenemy.left+pieceSize/4, theenemy.top + pieceSize/4]
                    var sz = 3; var co = [200,180,0,0.8]
                    if(this.type == "base"){
                        sz = 5; co = [200,123,50,0.8]
                    }
                    if(this.subtype == "slow"){
                        co = [0,200,200,0.8]
                    }
                    drawLine(sor,tar,sz,colText(co))
                    
                    if(this.subtype == "basic"){
                        if(theenemy.health > this.power){
                            theenemy.health -= (this.power-theenemy.armor >0)? (this.power - theenemy.armor) : 0
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

class Enemy { 
    constructor(type, pathnum){
        this.type = type
        this.color = [123,0,0]
        this.speed = 0.03*(-.5+1.5*waveNum);
        this.left = 50;
        this.top = 50;
        this.from = [-1,-1]
        this.to  = [-1,-1]
        this.health = 100;
        this.armor = 0.5+(0.25*waveNum);
        this.damage = 10+(waveNum); 
        this.pathNum = pathnum;
        this.reward = waveNum;
        // console.log(paths)
        // console.log(pathnum)
        this.pathStep = paths[pathnum].length -1
        this.visible = false;
        this.speedMod = 1; //ratio of 1 changed by lasers

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
                waveNum++
                genEnemies()
                eDelayCount = 0
                sDelayCount = 0;

            }
        }

    }
}