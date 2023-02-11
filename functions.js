

//imported functions
const abs = Math.abs; const sign = Math.sign; const atan2  = Math.atan2; 
const PI  = Math.PI;  const sqrt = Math.sqrt; const random = Math.random; 
const sin = Math.sin; const cos  = Math.cos;  const ceil   = Math.ceil;
const floor = Math.floor; const round = Math.round

//////////////////
//functions
///////////////////


const checkVerticalOrien = function(){if(wWidth >= wHeight) {verticalOrien = false} else {verticalOrien = true};}
const readWindowSize = function(){ wWidth = window.innerWidth; wHeight = window.innerHeight;}

onkeydown = (e) =>{ /* console.log(e.key) */}

const degToRad = function(deg){return (deg/180*PI)%(2*PI)};
const radToDeg = function(rad){return (rad/PI*180)%(360)};

const degAtan2 = function(P1, P2){ 
    var ang = radToDeg(atan2(P2[1]-P1[1], P2[0]-P1[0]))
    if (ang < 0){ang+=360}
    if (ang >=360){ang-=360}
    return ang
}

const dist = function(a,b){
    return sqrt((b[0]-a[0])**2 + (b[1]-a[1])**2)
}

const avg = function(a,b){
    return (a+b)/2
}

function isInt(n) {
    return n % 1 === 0;
 }
 
const arrEq = function(a,b){ 
    const as = a.length
    const bs = b.length
    if(as != bs) return false
    for(var i=0; i<as; i++){
        if(isNaN(a[i])) return false
    }
    for(var i=0; i<bs; i++){
        if(isNaN(b[i])) return false
    }
    for(var i=0; i<as; i++){
        if(a[i] != b[i]) return false
    }
    return true
}

const isInside = function(p,r){
    return  (p[0]>(r[0])) && (p[1]>r[1]) && (p[0]<(r[0]+r[2])) && (p[1]<(r[1]+r[3])) 
}

const deepClone = function(toClone){
    return JSON.parse(JSON.stringify(toClone))
}

const includesPoint = function(arr, point){
    if(point.length != 2) return false
    if(!arr[0]) return false
    if(arr[0].length != 2) return false
    for(var i=0; i<arr.length; i++){
        if(arr[i][0]==point[0]){
            if(arr[i][1]==point[1]){
                return true
            }
        }
    }
    return false
}

const getNeighbors = function(point){
    var potentials = [
        [point[0],point[1]+1],
        [point[0],point[1]-1],
        [point[0]-1,point[1]-1],
        [point[0]-1,point[1]],
        [point[0]-1,point[1]+1],
        [point[0]+1,point[1]-1],
        [point[0]+1,point[1]],
        [point[0]+1,point[1]+1]
    ]

    var neighbors = []

    for(var i=0; i<potentials.length; i++){
        if(gameGrid[potentials[i][0]]){
            if(gameGrid[potentials[i][0]][potentials[i][1]]){
                neighbors.push(potentials[i])
            }
        }
    }
    return neighbors
}

const getRandomNeighbor = function(point){

    return getNeighbors(point)[floor(random()*choices.length)]
}

const isEven = function(num){
    if(num % 2==0){
        return true
    }else {
        return false
    }
    return null
}

// const colEq = function(a,b, tol){
//     const as = a.length
//     const bs = b.length
//     if(as != bs) return false
//     for(var i=0; i<as; i++){
//         if(isNaN(a[i])) return false
//     }
//     for(var i=0; i<bs; i++){
//         if(isNaN(b[i])) return false
//     }
//     for(var i=0; i<as; i++){
//         if(abs(round(a[i]) - round(b[i])) > tol) return false
//     }
//     return true
// }


// const rand255 = function(){
//     return floor(random()*256)
// }

// const randCol = function(){
//     return [rand255(),rand255(),rand255()]
// }

// const colMix = function(a,b){
//     var c = [0,0,0]
    
//     c[0] = avg(a[0],b[0]);
//     c[1] = avg(a[1],b[1]);  
//     c[2] = avg(a[2],b[2]);

//     return c
// }

// const invertCol = function(col){
//     return [255 - col[0], 255 - col[1], 255 - col[2]]
// }

const colText = function(col){
    var CCC = [...col]

    if(CCC.length == 3) return 'rgb(' + CCC[0].toString() + ',' + CCC[1].toString() + ',' + CCC[2].toString() +')'
    if(CCC.length == 4) return 'rgba(' + CCC[0].toString() + ',' + CCC[1].toString() + ',' + CCC[2].toString() + ',' + CCC[3].toString() +')'
    console.error('whoops')
    return 'rgb(255,255,255)'
}

const fillCir = function (cir,c){ctx.beginPath(); ctx.arc(cir[0], cir[1], cir[2], 0, 2 * Math.PI, false);ctx.fillStyle = c;  ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,0)';  ctx.stroke();}

const fillGradCir = function(cir,inner, outer, c1,c2){
    var gradient = ctx.createRadialGradient(cir[0], cir[1], inner, cir[0], cir[1], outer);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);

    ctx.arc(cir[0], cir[1], cir[2], 0, 2*PI);

    ctx.fillStyle = gradient;
    ctx.fill();
}

const fillRec = function (rect,c){
    ctx.fillStyle = c;
    ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
}

const strokeRec = function (rect,w,c){
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
}

const fillTri = function(p1,p2,p3,c){
    ctx.fillStyle = c;
    ctx.beginPath()
    ctx.moveTo(p1[0],p1[1])
    ctx.lineTo(p2[0],p2[1])
    ctx.lineTo(p3[0],p3[1])
    ctx.lineTo(p1[0],p1[1])
    ctx.fill()
    ctx.closePath()
}

const drawLine = function (from, to, lineWidth, c){
    ctx.strokeStyle = c;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.lineCap = "round"
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.stroke();
}

const fillText = function(xx,yy,tt,ss,c){
    ctx.font = ss.toString() + "px bold arial";
    ctx.fillStyle = c;
    ctx.fillText(tt, xx, yy);
}

const shadowText = function(xx,yy,tt,ss,c){
    ctx.font = ss.toString() + "px bold arial";
    ctx.lineWidth = 1
    ctx.shadowColor = c
    ctx.shadowBlur = 2;
    ctx.strokeStyle = c;
    ctx.strokeText(tt, xx, yy);
    ctx.shadowBlur = 0
}

const onMouseDownCanvas = function(){ 
    mouseDownCan = true;
    mX = mdX;
    mY = mdY;
    click();
}

ontouchstart = (e) =>{
    isTouchDevice = true;
    onmousedown(e)
}

ontouchmove = (e) =>{
    isTouchDevice = true;
    onmousemove(e)
}

ontouchend = (e) =>{
    isTouchDevice = true;
    onmouseup(e)
}


onmousedown = (e) => {

    if(isTouchDevice){
        if(!(e.touches)) return
        if(e.touches.length == 0) return
        e.button = 0
        e.clientX = e.touches[0].clientX
        e.clientY = e.touches[0].clientY
    }
    if(e.button == 0){
        mdX = e.clientX*dvp; mdY = e.clientY*dvp;
        mdX = (mdX < 0)? -1 : mdX;  mdX = (mdX > brect.right*dvp)? -1 : mdX;
        mdY = (mdY < 0)? -1 : mdY;  mdY = (mdY > brect.bottom*dvp)? -1 : mdY;
        if((mdX >= 0) && (mdY >= 0)) { onMouseDownCanvas(); }
    }
}

onmouseup = (e) => {
    if(isTouchDevice){
        if(!(e.changedTouches)) return
        if(e.changedTouches.length == 0) return
        e.clientX = e.changedTouches[0].clientX
        e.clientY = e.changedTouches[0].clientY
    }
    if(mouseDownCan){
        muX = e.clientX*dvp; muY = e.clientY*dvp;
        muX = (muX < 0)? 0 : muX;  muX = (muX > brect.right*dvp)? brect.right*dvp : muX;
        muY = (muY < 0)? 0 : muY;  muY = (muY > brect.bottom*dvp)? brect.bottom*dvp : muY;
        mouseDownCan = false; 
    }
    checkRelease();
}

onmousemove = (e) => {
    if(isTouchDevice){
        if(!(e.touches)) return
        if(e.touches.length == 0) return
        e.clientX = e.touches[0].clientX
        e.clientY = e.touches[0].clientY
    }
    mX = e.clientX*dvp; mY = e.clientY*dvp;
    
    mX = (mX < 0)? 0 : mX;  mX = (mX > brect.right*dvp)? brect.right*dvp : mX;
    mY = (mY < 0)? 0 : mY;  mY = (mY > brect.bottom*dvp)? brect.bottom*dvp : mY;

    onMoveMouse()
    
}



const sizeCanvas = function(){
    readWindowSize(); checkVerticalOrien(); 
    brect = canvas.getBoundingClientRect(); dvp = window.devicePixelRatio || 1;
    cWidth = (brect.right - brect.left) * dvp; cHeight = (brect.bottom - brect.top) * dvp; 
    canvas.width = cWidth; canvas.height = cHeight; cAR = cWidth/cHeight
    console.log('new canvas dims:', cWidth, cHeight)
    root.style.setProperty('--sspx', 2/dvp + "px");


    if(verticalOrien){
        ar = cHeight/cWidth
        if(ar <= rat){
            gameRec[1] = marg;
            gameRec[3] = cHeight - gameRec[1]*2;
            gameRec[2] = gameRec[3]/rat;
            gameRec[0] = (cWidth - gameRec[2])/2;
        }else{
            gameRec[0] = marg;
            gameRec[2] = cWidth-gameRec[0]*2;
            gameRec[3] = gameRec[2]*rat;
            gameRec[1] = (cHeight-gameRec[3])/2
        }
        var miwid = gameRec[3]/20/dvp
        var mileft = wWidth/2 - miwid/2
        var mitop = gameRec[3]*19/20/dvp+gameRec[1]/dvp
        muteimages[0].style.width = (miwid).toString()+"px"
        muteimages[1].style.width = (miwid).toString()+"px"
        muteimages[0].style.height = (miwid).toString()+"px"
        muteimages[1].style.height = (miwid).toString()+"px"
        muteimages[0].style.left = (mileft).toString()+"px";
        muteimages[1].style.left = (mileft).toString()+"px";
        muteimages[0].style.top = (mitop).toString()+"px";
        muteimages[1].style.top = (mitop).toString()+"px";
    }else{
        ar = cWidth/cHeight
        if(ar <= rat){
            gameRec[0] = marg;
            gameRec[2] = cWidth-gameRec[0]*2;
            gameRec[3] = gameRec[2]/rat;
            gameRec[1] = (cHeight-gameRec[3])/2
        }else{
            gameRec[1] = marg;
            gameRec[3] = cHeight - gameRec[1]*2;
            gameRec[2] = gameRec[3]*rat;
            gameRec[0] = (cWidth - gameRec[2])/2;
        }
        var miwid = gameRec[2]/20/dvp
        var mitop = wHeight/2 + miwid*0.5
        var mileft = gameRec[2]*18/20/dvp + gameRec[0]/dvp
        muteimages[0].style.width = (miwid).toString()+"px"
        muteimages[1].style.width = (miwid).toString()+"px"
        muteimages[0].style.height = (miwid).toString()+"px"
        muteimages[1].style.height = (miwid).toString()+"px"
        muteimages[0].style.top = (mitop).toString()+"px";
        muteimages[1].style.top = (mitop).toString()+"px";
        muteimages[0].style.left = (mileft).toString()+"px";
        muteimages[1].style.left = (mileft).toString()+"px";
    }


    // if(verticalOrien){
    //     difficultyDiv.style.height = (gameRec[3]/15/dvp).toString() + "px"
    //     gametypeDiv.style.height = (gameRec[3]/15/dvp).toString() + "px"
    //     difficultyDiv.style.width = (gameRec[2]/1.8/dvp).toString() + "px"
    //     gametypeDiv.style.width = (gameRec[2]/1.8/dvp).toString() + "px"

    //     difficultyDiv.style.margin = (gameRec[3]/70/dvp).toString() + "px"
    //     gametypeDiv.style.margin = (gameRec[3]/70/dvp).toString() + "px"

    //     difficultyDiv.style.fontSize = (gameRec[2]/30/dvp).toString() + "px"
    //     gametypeDiv.style.fontSize = (gameRec[2]/30/dvp).toString() + "px"

    // }else{
    //     difficultyDiv.style.height = (gameRec[3]/10/dvp).toString() + "px"
    //     gametypeDiv.style.height = (gameRec[3]/10/dvp).toString() + "px"
    //     difficultyDiv.style.width = (gameRec[2]/3/dvp).toString() + "px"
    //     gametypeDiv.style.width = (gameRec[2]/3/dvp).toString() + "px"

    //     difficultyDiv.style.margin = (gameRec[2]/60/dvp).toString() + "px"
    //     gametypeDiv.style.margin = (gameRec[2]/60/dvp).toString() + "px"

    //     difficultyDiv.style.fontSize = (gameRec[2]/50/dvp).toString() + "px"
    //     gametypeDiv.style.fontSize = (gameRec[2]/50/dvp).toString() + "px"
    // }
    

    gameCent = [gameRec[0]+gameRec[2]/2, gameRec[1] + gameRec[3]/2]

    if(verticalOrien){
        gridSize[0] = gridDims[1]
        gridSize[1] = gridDims[0]
        marg = gameRec[2]/100;
        size = (gameRec[2]-marg*2)/gridSize[0]
    }else{
        gridSize[1] = gridDims[1]
        gridSize[0] = gridDims[0]
        marg = gameRec[3]/100;
        size = (gameRec[3]-marg*2)/gridSize[1]
    }

    gridSizePix = [gridSize[0]*size, gridSize[1]*size]
    gridPos = [gameCent[0]-gridSizePix[0]/2, gameCent[1]-gridSizePix[1]/2]
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
}


