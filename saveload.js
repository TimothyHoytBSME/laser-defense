
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