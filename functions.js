
//////////////////
//functions - no game-specific code allowed here
///////////////////


//imported math functions
const abs = Math.abs; const sign = Math.sign; const atan2  = Math.atan2; 
const PI  = Math.PI;  const sqrt = Math.sqrt; const random = Math.random; 
const sin = Math.sin; const cos  = Math.cos;  const ceil   = Math.ceil;
const floor = Math.floor; const round = Math.round

//external functions to execute after resize
const externalResizeFunctions = [] 


//////////////////////////globalSetters////////////////////////////

//sets wWidth and wHeight from window properties
const readWindowSize = function(){ wWidth = window.innerWidth; wHeight = window.innerHeight;}


//checks orientation and stores to verticalOren as boolean
const checkVerticalOrien = function(){if(wWidth >= wHeight) {verticalOrien = false} else {verticalOrien = true};}


//converts degrees to radians
const degToRad = function(deg){return (deg/180*PI)%(2*PI)};

//converts radians to degrees
const radToDeg = function(rad){return (rad/PI*180)%(360)};

//Full arctangent to get angle to point from origin and 0 degree axis
const degAtan2 = function(P1, P2){ 
    var ang = radToDeg(atan2(P2[1]-P1[1], P2[0]-P1[0]))
    if (ang < 0){ang+=360}
    if (ang >=360){ang-=360}
    return ang
}

//distance formula, input is two points [x1,y1], [x2,y2]
const dist = function(a,b){
    return sqrt(abs(b[0]-a[0])**2 + abs(b[1]-a[1])**2)
}

//average two integers
const avg = function(a,b){
    return (a+b)/2
}

//checks number for whole number
function isInt(n) {
    return n % 1 === 0;
 }
 
//compares two points [x1,y1],[x2,y2]
const arrEq = function(a,b){ 
    const as = a.length
    const bs = b.length
    if(as != bs) return false
    for(var i=0; i<as; i++){ if(isNaN(a[i])) return false }
    for(var i=0; i<bs; i++){ if(isNaN(b[i])) return false }
    for(var i=0; i<as; i++){ if(a[i] != b[i]) return false }
    return true
}

//checks if point [x,y] is inside rectangle [left,top,width,height]
const isInside = function(p,r){
    return  (p[0]>(r[0])) && (p[1]>r[1]) && (p[0]<(r[0]+r[2])) && (p[1]<(r[1]+r[3])) 
}

//deconstructs opbject to JSON then parsed back to new object with identical properties
const deepClone = function(toClone){
    return JSON.parse(JSON.stringify(toClone))
}

//checks if array of points [[x1],[y1], [x2]...] contains point [x, y]
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

//
const getNeighbors = function(point, grid){
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
        if(grid[potentials[i][0]]){
            if(grid[potentials[i][0]][potentials[i][1]]){
                neighbors.push(potentials[i])
            }
        }
    }
    return neighbors
}

//returns random adjacent point [x,y] withing 2D array grid[xi][y1]
const getRandomNeighbor = function(point, grid){

    return getNeighbors(point, grid)[floor(random()*choices.length)]
}

//checks if number is an even integer
const isEven = function(num){
    if(num % 2==0){
        return true
    }else {
        return false
    }
    return null
}

//compares two colors with a tolerance
const colEq = function(a,b, tol){
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
        if(abs(round(a[i]) - round(b[i])) > tol) return false
    }
    return true
}

//random integer 0 to 255
const rand255 = function(){
    return floor(random()*256)
}

//random color [r,g,b]
const randCol = function(){
    return [rand255(),rand255(),rand255()]
}

//avg two colors ([r1,g1,b1, (a1)] + [r2,g2,b2, (a2)])/2
const colMix = function(a,b){
    var c = [0,0,0,0];
    c[0] = avg(a[0],b[0]);
    c[1] = avg(a[1],b[1]);  
    c[2] = avg(a[2],b[2]);
    if(a[3] != undefined && b[3] != undefined){
        c[3] = avg(a[3],b[3])
    }
    return c
}

//inverts [r,g,b, (a)] to [255-r,255-g,255-b, (1-a)]
const invertCol = function(col){
    var ret = [255 - col[0], 255 - col[1], 255 - col[2]]
    if(col[3] != undefined){
        ret.push(1-col[3])
    }
    return ret
}

//converts [r,g,b] to 'rgb(r,g,b)' and [r,g,b,a] to 'rgba(r,g,b,a)'
const colText = function(col){
    var CCC = [...col]
    // console.log(col)
    if(CCC.length == 3) return 'rgb(' + CCC[0].toString() + ',' + CCC[1].toString() + ',' + CCC[2].toString() +')'
    if(CCC.length == 4) return 'rgba(' + CCC[0].toString() + ',' + CCC[1].toString() + ',' + CCC[2].toString() + ',' + CCC[3].toString() +')'
    console.error('whoops')
    return 'rgb(255,100,100)'
}

//fills [x,y,r] with [r,g,b (a)]
const fillCir = function (cir,c){ctx.beginPath(); ctx.arc(cir[0], cir[1], cir[2], 0, 2 * Math.PI, false);ctx.fillStyle = colText(c);  ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,0)';  ctx.stroke();}

//draws line around [x,y,r] of line width and [r,g,b, (a)]
const strokeCir = function(cir,w,c){
    ctx.beginPath(); ctx.arc(cir[0], cir[1], cir[2], 0, 2 * Math.PI, false);ctx.strokeStyle = colText(c); ctx.lineWidth = w; ctx.stroke();
}

//fills [x,y,r] with gradient r1 to r2 from [r1,g1,b1,(a1)] to [r2,g2,b2,(a2)]
const fillGradCir = function(cir,inner, outer, c1,c2){
    var gradient = ctx.createRadialGradient(cir[0], cir[1], inner, cir[0], cir[1], outer);
    gradient.addColorStop(0, colText(c1));
    gradient.addColorStop(1, colText(c2));
    ctx.arc(cir[0], cir[1], cir[2], 0, 2*PI);
    ctx.fillStyle = gradient;
    ctx.fill();
}

//fills [left, top, width, height] with [r,g,b,(a)]
const fillRec = function (rect,c){
    ctx.fillStyle = colText(c);
    ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
}

//draws [left,top,width, height] of line width and [r,g,b,(a)]
const strokeRec = function (rect,w,c){
    // console.log(rect, w, c)
    ctx.strokeStyle = colText(c);
    ctx.lineWidth = w;
    ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
}

//draws progress v 0 to 1 of [left,top,width,height] left to right with [r,g,b,(a)]
const progressBar = function(rect, v, c){
    fillRec(rect,[100,100,100])
    fillRec([rect[0],rect[1],rect[2]*v,rect[3]],c)
}

//fills [x1,y1],[x2,y2],[x3,y3] with [r,g,b,(a)]
const fillTri = function(p1,p2,p3,c){
    ctx.fillStyle = colText(c);
    ctx.beginPath()
    ctx.moveTo(p1[0],p1[1])
    ctx.lineTo(p2[0],p2[1])
    ctx.lineTo(p3[0],p3[1])
    ctx.lineTo(p1[0],p1[1])
    ctx.fill()
    ctx.closePath()
}

//draws line [x1,y1] to [x2,y2] with [r,g,b,(a)]
const drawLine = function (from, to, lineWidth, c){
    ctx.strokeStyle = colText(c);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.lineCap = "round"
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.stroke();
}

//draw x,y,text,size,[r,g,b,(a)]
const fillText = function(xx,yy,tt,ss,c){
    ctx.font = ss.toString() + "px bold arial";
    ctx.fillStyle = colText(c);
    ctx.fillText(tt, xx, yy);
}

//draw x,y,text,size,[r,g,b,(a)] with shadow blur
const shadowText = function(xx,yy,tt,ss,c){
    ctx.font = ss.toString() + "px bold arial";
    ctx.lineWidth = 1
    ctx.shadowColor = colText(c)
    ctx.shadowBlur = 2;
    ctx.strokeStyle = colText(c);
    ctx.strokeText(tt, xx, yy);
    ctx.shadowBlur = 0
}

//draw x,y,text,size, within maxWidth with [r,g,b,(a)]
const wrapText= function(x, y, text, ss, maxWidth, c){
    var words = text.split(' ');
    var line = '';
    ctx.fillStyle = colText(c);
    ctx.font = ss.toString() + "px bold arial";
  
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if(testWidth > maxWidth) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += ss;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    return(y);
  }



/////////////////////////event overrides/////////////////////

//override of native event for keydown
onkeydown = (e) =>{ /* console.log(e.key) */}

//override of native touchstart event
ontouchstart = (e) =>{
    isTouchDevice = true;
    onmousedown(e)
}

//override of native touchmove event
ontouchmove = (e) =>{
    isTouchDevice = true;
    onmousemove(e)
}

//override of native touchend event
ontouchend = (e) =>{
    isTouchDevice = true;
    onmouseup(e)
}

//override of native mousedown event
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

//override of native mouseup event
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
    mdX = -1;
    mdY = -1;
    checkRelease();
}

//override of native mousemove event
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


////////////////////event helpers///////////////////

//gets fired if mousedown is inside canvas
const onMouseDownCanvas = function(){ 
    mouseDownCan = true;
    mX = mdX;
    mY = mdY;
    click();
}


//Called anytime size needs adjusted to screen
//Executes externalResizeFunctions[i]() set from app for performace and dimensional calcs
const sizeCanvas = function(){
    readWindowSize(); checkVerticalOrien(); 

    //set bounding brect, extract dimensions and apply device pixel ratio for zoom lock
    brect = canvas.getBoundingClientRect(); dvp = window.devicePixelRatio || 1;
    cWidth = (brect.right - brect.left) * dvp; cHeight = (brect.bottom - brect.top) * dvp; 
    canvas.width = cWidth; canvas.height = cHeight; cAR = cWidth/cHeight
    console.log('new canvas dims:', cWidth, cHeight)
    root.style.setProperty('--sspx', 2/dvp + "px"); //shadow correction

    setAppArea()
    // resize menu dropdowns
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
    
    //execute app resizes
    for(var i= 0; i<externalResizeFunctions.length; i++){
        externalResizeFunctions[i]();
    }
}

//sets gameRec as [left,top,widht,height] for responsive app area and mute button
const setAppArea = function(){
    //calculate game rectnagle and mute button
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
    gameCent = [gameRec[0]+gameRec[2]/2, gameRec[1] + gameRec[3]/2]

}
