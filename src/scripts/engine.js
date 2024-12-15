const state = {
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox: document.querySelector("#score-points")
    },
    cardsSprites:{
        avatar: document.querySelector("#card-image"),
        name: document.querySelector("#card-name"),
        type: document.querySelector("#card-type")
    },
    playerSide: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computerBox: document.querySelector("#computer-cards"),
        computer: "computer-cards",
    },
    fieldCards:{
        player: document.querySelector("#player-field-card"),
        computer: document.querySelector("#computer-field-card")
    },
    actions:{
        button: document.querySelector("#next-duel")
    }
}

const pathData = "./src/assets/icons/"
const cardData =[
    {
        id:0,
        name:"Blues eyes White Dragon",
        type:"Paper",
        img:`${pathData}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name:"Dark Magician",
        type:"Rock",
        img:`${pathData}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name:"Exodia",
        type:"Scissors",
        img:`${pathData}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    }
    
]



async function getRandowCardId() {
    const randowIndex = Math.floor(Math.random()* cardData.length)
    return cardData[randowIndex].id
}

async function createCardImage(IdCard,fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height","100px")
    cardImage.setAttribute("src","./src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id",IdCard)
    cardImage.classList.add("card")

    if (fieldSide === state.playerSide.player1) {
        cardImage.addEventListener('mouseover',() => {
            drawSelectCard(IdCard)
        })
        cardImage.addEventListener('click',()=>{
            setCardsFields(cardImage.getAttribute("data-id"))
        })
    }

    return cardImage
}

async function setCardsFields(cardId) {
    await removeAllCardsImages()

    let computerCardId = await getRandowCardId()

    await showHiddenCardFieldsImages(true)

    await hiddenCardsDetails()


    drawCardsInfield(cardId,computerCardId)

    let duelResults = await checkResults(cardId,computerCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function drawCardsInfield(cardId,computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img
}

async function showHiddenCardFieldsImages(boleanus) {
    if (boleanus===true) {
        state.fieldCards.player.style.display ="block"
        state.fieldCards.computer.style.display ="block"
    }else{
        state.fieldCards.player.style.display="none"
        state.fieldCards.computer.style.display="none"
    }
}

async function hiddenCardsDetails() {
    state.cardsSprites.name.innerText = ""
    state.cardsSprites.type.innerText = ""
    state.cardsSprites.avatar.src=""
}

async function checkResults(playerCard,computerCard) {
    let duelResults = "Draw"
    let playernotCard = cardData[playerCard]
    if (playernotCard.WinOf.includes(computerCard)) {
        duelResults = "win"
        state.score.playerScore++
        await playAudio(duelResults)
    }
    if(playernotCard.LoseOf.includes(computerCard)){
        duelResults = "lose"
        state.score.computerScore++
        await playAudio(duelResults)
    }

    return duelResults
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore}
     | Lose : ${state.score.computerScore}`
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase()
    state.actions.button.style.display = "block"

}

async function removeAllCardsImages() {
    let {computerBox,player1Box} = state.playerSide
    let imgElements = computerBox.querySelectorAll('img')
    imgElements.forEach((img)=> img.remove())

    imgElements = player1Box.querySelectorAll('img')
    imgElements.forEach((img)=> img.remove())
}

async function drawCards(cardNumbers, fieldSide) {
    
    for (let index = 0; index < cardNumbers; index++) {
 
        const randowIdCard = await getRandowCardId()
        const cardImage = await createCardImage(randowIdCard,fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img
    state.cardsSprites.name.innerText = cardData[index].name
    state.cardsSprites.type.innerText = "Atribute : " + cardData[index].type
}

async function resetDuel() {
    state.cardsSprites.avatar.src=''
    state.actions.button.style.display='none'

    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'

    init()
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

function init() {
    showHiddenCardFieldsImages(false)

    drawCards(5,state.playerSide.player1)
    drawCards(5,state.playerSide.computer)

    const bgm = document.getElementById('bgm')
    // bgm.play()
}

init();