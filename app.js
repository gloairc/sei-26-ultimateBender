const game = {
    rounds: 1,
    message: "",
    timer: 5, //also in newRound function
    playerHp: 100,
    computerHp: 100,
    playerChoice: "To be decided",
    computerChoice: "To be decided",
    lockMessage: "",
    damage: 30
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

const damageIncurredToPlayer = () => {//damage to player, cap at 0
    game.playerHp = game.playerHp - game.damage;
    if (game.playerHp <=0){
        game.playerHp = 0
    }
}

const damageIncurredToComputer = () => {//damage to computer, cap at 0
    game.computerHp = game.computerHp - game.damage;
    if (game.playerHp <=0){
        game.playerHp = 0
    }
}

// const showNextRoundBtn =() => {

// }

const showRound = () => {//show match screen and start timer for Round 1
    $(".container").show();
    $("#startMatch").css("visibility", "hidden");
    game.message = "You have 10 seconds to make a move!";
    startRoundTimer();
    render()
}

const playRound = () => {//showCChoice, gameLogic & render
    // startRoundTimer();
    lockPChoice();
    showCChoice();
    gameLogic();
    render()
}

const newRound = () => {//reset the messages & buttons
    game.message = "You have 10 seconds to make a move";
    game.lockMessage = "";
    game.playerChoice = "To be decided";
    game.computerChoice = "To be decided";
    game.timer = 5;
    game.rounds++;

    $(".pOptionBtn").attr("disabled", false);
    $("#confirmChoiceBtn").attr("disabled", true);
    $("#nextRoundBtn").css("visibility", "hidden");
    startRoundTimer();
    render()
}

const startRoundTimer = () => {
    let startRoundTimev = setInterval(() => {
        $("#timer").text(game.timer);
        game.timer--;
    }, 1000);
}

// const stopRoundTimer = () => {
//     if (game.timer <= 0) {
//         clearInterval(startRoundTimev)
//     }
// }

//set up (clicks)
const setup = () => {
    // $("#startMatch").on("click", startRoundTimer);
    $(".container").hide();
    $("#nextRoundBtn").css("visibility", "hidden");

    $("#startMatch").on("click", showRound);
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
    // $("#lockMessage").text(game.lockMessage)
    // if () {
    //     $("#nextRoundBtn").show() //show after result is computered
    // };
    $("#timer").text(game.timer)
    $("#roundNum").text(game.rounds);
    $("#playerHp").text(game.playerHp);
    $("#computerHp").text(game.computerHp);

}

$(() => {
    setup();
    render()
})

