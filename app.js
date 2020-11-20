const game = {
    // rounds: 3,
    message: "",
    // timer: 10,
    // life: 100,
    playerChoice: "",
    computerChoice: "",
    lockMessage: ""
};

const elements = ["Scissor", "Paper", "Stone"] //"fire","earth","water","air","metal"

//handler
const showPChoice = (event) => { //display Player Choice
    const pChoicev = $(event.target).text();
    game.playerChoice = pChoicev
    render();
}

const lockPChoice = () => {//disable option & confirm choice btn after confirming
    game.lockMessage = "You have locked your choice. There's no turning back now!"
    $(".pOptionBtn").attr("disabled", true);
    $("#confirmChoiceBtn").attr("disabled", true)
}

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
    } else if (game.playerChoice === elements[2] && game.computerChoice === elements[0]) {
        game.message = "You won the round"
    } else {
        game.message = "You lost the round"
    }
}

const playRound = () => {//showCChoice, gameLogic & render
    lockPChoice();
    showCChoice();
    gameLogic();
    render()
}

const newRound = () => {
    game.message= "";
    game.lockMessage = "";
    game.playerChoice = "";
    game.computerChoice = "";
   
    $(".pOptionBtn").attr("disabled", false);
    $("#confirmChoiceBtn").attr("disabled", false);
    $("#nextRoundBtn").hide();
    render()
}

//nextRound enable option $(".pOptionBtn").attr("disabled", true)

//set up (clicks)
const setup = () => {
    $("#nextRoundBtn").hide();
    $(".pOptionBtn").on("click", showPChoice);
    $("#confirmChoiceBtn").on("click", playRound);
    $("#nextRoundBtn").on("click", newRound)
};

//draw on screen
const render = () => {
    $("#pChoice").text(game.playerChoice); //want to add in sound here
    $("#cChoice").text(game.computerChoice);
    $("#message").text(game.message)
    $("#lockMessage").text(game.lockMessage)
    if (game.message !== ""){
        $("#nextRoundBtn").show()
}
}

$(() => {
    setup()
})