
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
            if(chTyp != "empty"){
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
            }

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

        ctx.textAlign = "right"
        //gameTime
        var secText = ((lapse%60).toFixed(1)).toString()
        if(lapse%60<=9.95){
            secText = "0"+secText
        }
        fillText(gameRec[0]+gameRec[2]-textH*0.25,gameRec[1]+textH*1.25, secText,textH,colText([200,200,200]))
        if(lapse > 60){
            var minText = ((lapse - lapse%60)/60).toString() + ":";
            
            fillText(gameRec[0]+gameRec[2]-textH*2.1,gameRec[1]+textH*1.25, minText,textH,colText([200,200,200]))
        }
        ctx.textAlign = "left"
    }else{
        //paused
        returnButtonRec = [gameRec[0]+gameRec[2]-textXoff*5-textW, gameRec[1]+gameRec[3]-textH, textW*2, textH]
        shadowText(returnButtonRec[0], returnButtonRec[1]+returnButtonRec[3], "RETURN", returnButtonRec[3], "black")
        fillText(returnButtonRec[0], returnButtonRec[1]+returnButtonRec[3], "RETURN", returnButtonRec[3], "white")

        ctx.textAlign = 'center'
        var message1 = "Defend Your Base! Build defense towers, repair your base, and Upgrade everything. Increase laser count, power, and range".toUpperCase()
        var lastY1 = wrapText(gameCent[0], gameCent[1]-gameRec[3]/3, message1, textH/2, gameRec[2]/2, "white")

        var message2 = "Select a tower or empty space for actions. Find an effective order to build and upgrade towers to maximize success.".toUpperCase()
        wrapText(gameCent[0], lastY1+textH*2, message2, textH/2, gameRec[2]/2, "white")
        ctx.textAlign = 'left'
    }

    //todo draw the splashText from splash que

    if(drawTexts.splashQue){
        for(var i = drawTexts.splashQue.length-1; i>=0; i--){
            var theSplash = drawTexts.splashQue[i]
            // console.log(i,theSplash)
            var c = [...theSplash[5]]
            
            if(!drawTexts.timers){
                drawTexts.timers = new Array(drawTexts.splashQue.length).fill(0)
                console.log("created splash timers")
            }else{
                
                drawTexts.timers[i]++
                // console.log(drawTexts.timers)
            }

            if(drawTexts.timers[i]<theSplash[4]){
                var alph = 1 - drawTexts.timers[i]/theSplash[4]
                c.push(alph)

                fillText(theSplash[0],theSplash[1],theSplash[2],theSplash[3],colText(c))

            }else{
                drawTexts.splashQue.splice(i,1)
                drawTexts.timers.splice(i,1)
                i--
            }
        }
    }
    

}

const splashText = function(xx,yy,tt, ss, dur,c ){
    //todo add the event text to the splash que
    const theSplash = [xx,yy,tt,ss,dur,c]
    // console.log("queing splash", theSplash)
    if(!drawTexts.splashQue){
        drawTexts.splashQue = new Array(1).fill(theSplash)
    }else{
        drawTexts.splashQue.push(theSplash)
    }

    if(!drawTexts.timers){
        drawTexts.timers = new Array(drawTexts.splashQue.length).fill(0)
        console.log("created splash timers")
    }

    drawTexts.timers.push(0)
}
