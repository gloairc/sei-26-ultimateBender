const game = {
    rounds: 1,
    message: "",
    // timer: 3, //also in newRound function
    playerHp: 100,
    computerHp: 100,
    playerChoice: "",
    computerChoice: "",
    lockMessage: ""
};

const elements = ["Scissor", "Paper", "Stone"] //"fire","earth","water","air","metal"

//handler
const showPChoice = (event) => { //display Player Choice
    const pChoicev = $(event.target).text();
    game.playerChoice = pChoicev
    enableConfirmChoiceBtn();
    render();
}

const enableConfirmChoiceBtn = () => {
    if (game.playerChoice !== "") {
        $("#confirmChoiceBtn").attr("disabled", false);
    }
}

const lockPChoice = () => {//disable option & confirm choice btn after confirming
    // game.lockMessage = "" //only need message here if we are delaying computer's choice & result"
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
        game.message = "You won the round";
        damageIncurredToComputer()
    } else if (game.playerChoice === elements[1] && game.computerChoice === elements[2]) {
        game.message = "You won the round";
        damageIncurredToComputer()
    } else if (game.playerChoice === elements[2] && game.computerChoice === elements[0]) {
        game.message = "You won the round";
        damageIncurredToComputer()
    } else {
        game.message = "You lost the round";
        damageIncurredToPlayer()
    }
}

const damageIncurredToPlayer = () => {
    game.playerHp = game.playerHp - 30
}

const damageIncurredToComputer = () => {
    game.computerHp = game.computerHp - 30
}

const playRound = () => {//showCChoice, gameLogic & render
    // startRoundTimer();
    lockPChoice();
    showCChoice();
    gameLogic();
    render()
}

const newRound = () => {//reset the messages & buttons
    game.message = "";
    game.lockMessage = "";
    game.playerChoice = "";
    game.computerChoice = "";
    game.timer = 10;
    game.rounds ++;

    $(".pOptionBtn").attr("disabled", false);
    $("#confirmChoiceBtn").attr("disabled", false);
    $("#nextRoundBtn").hide();
    // startRoundTimer();
    render()
}

// const startRoundTimer = () => {
//     let startRoundTimev = setInterval(() => {
//         $("#timer").text(game.timer);
//         game.timer--;
//     }, 1000);
// }

// const stopRoundTimer = () => {
//     if (game.timer <= 0) {
//         clearInterval(startRoundTimev)
//     }
// }

//set up (clicks)
const setup = () => {
    // $("#startMatch").on("click", startRoundTimer);
    $("#nextRoundBtn").hide();
    $("#confirmChoiceBtn").attr("disabled", true);
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
    if (game.message !== "") {
        $("#nextRoundBtn").show()
    };
    // $("#timer").text(game.timer)
    $("#roundnum").text(game.rounds);
    $("#playerHp").text(game.playerHp);
    $("#computerHp").text(game.playerHp);

}

$(() => {
    setup();
    render()
})