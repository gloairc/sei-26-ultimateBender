const game = {
    // rounds: 3,
    message: "",
    // timer: 10,
    // life: 100,
    playerChoice: "",
    computerChoice: ""
};

const elements = ["Scissor", "Paper", "Stone"] //"fire","earth","water","air","metal"

//handler
const showPChoice = (event) => { //display Player Choice
    const pChoicev = $(event.target).text();
    game.playerChoice = pChoicev
    render();
}

// const lockPChoice = () => {//TO DO -> locked down message "you chose xx"? and clicking on the elements dont work anymore
// }

const showCChoice = () => { //display C's choice
    let cChoicev = elements[Math.floor(Math.random() * elements.length)] //C random choice
    console.log(cChoicev);
    game.computerChoice = cChoicev
    }

const gameLogic = () => {//compare P&C and prepare message
    if (game.playerChoice === game.computerChoice) {
        game.message = "It's a tie!"
    } else if (game.playerChoice === elements[0] && game.computerChoice === elements[1]) {
        game.message = "You won the round"
    } else if (game.playerChoice === elements[1] && game.computerChoice === elements[2]) {
        game.message = "You won the round"
    } else if (game.playerChoice === elements[3] && game.computerChoice === elements[0]) {
        game.message = "You won the round"
    } else {
        game.message = "You lost the round"
    }
}

const playRound = () => {//showCChoice, gameLogic & render
    showCChoice();
    gameLogic();
    render()
}

//set up (clicks)
const setup = () => {
    $(".pOptionBtn").on("click", showPChoice);
    $("#confirmChoiceBtn").on("click", playRound);
};

//draw on screen
const render = () => {
    $("#pChoice").text(game.playerChoice); //want to add in sound here
    $("#cChoice").text(game.computerChoice);
    $("#message").text(game.message)
}

$(() => {
    setup()
})