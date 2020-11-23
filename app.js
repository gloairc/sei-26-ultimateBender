const game = {
    rounds: 1,
    message: "",
    playerHp: 100,
    computerHp: 100,
    playerChoice: "To be decided",
    computerChoice: "To be decided",
    lockMessage: "",
    damage: 30,
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
    } else if (game.playerChoice === "You didn't choose your move in time!") {
        game.message = "Your opponent attacked you. You quickly dogded the attack. Some harm was inflicted, but you managed to escape from a full-force attack"
        damageIncurredToPlayerAuto()
    } else {game.message = "You lost the round";
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
    if (game.computerHp <=0){
        game.computerHp = 0
    }
}

const damageIncurredToPlayerAuto = () => {//damage to player, cap at 0
    game.playerHp = game.playerHp - game.damage + game.selfDefence;
    if (game.playerHp <=0){
        game.playerHp = 0
    }
}

const showNextRoundBtn =() => {
    $("#nextRoundBtn").css("visibility", "visible");
}

const showRound = () => {//show match screen for Round 1
    $(".container").show();
    $("#startMatch").css("visibility", "hidden");
    game.message = "You have 10 seconds to make a move!";
    render()
}

const playRound = () => {//showCChoice, gameLogic & render
    lockPChoice();
    showCChoice();
    gameLogic();
    endMatch();
    render()
}

const newRound = () => {//reset the messages & buttons
    game.message = "You have 10 seconds to make a move";
    game.lockMessage = "";
    game.playerChoice = "To be decided";
    game.computerChoice = "To be decided";
    game.rounds++;

    $(".pOptionBtn").attr("disabled", false);
    $("#confirmChoiceBtn").attr("disabled", true);
    $("#nextRoundBtn").css("visibility", "hidden");
    render()
}

const showNextBtn = () => {//visible nextBtn to click
    $("#nextBtn").css("visibility", "visible");
}

const endMatch = () =>{//when hp=0, win or loss message, show nextBtn
    if (game.playerHp === 0) {
        game.message = "You lost the round and have been defeated. Try harder next time!";
        showNextBtn();
    } else if (game.computerHp === 0) {
        game.message = "You won the round and defeated your opponent. Congratulations!";
        showNextBtn();
    } 
}

const showStoryScreen = () => {
    $(".container").hide();
    $(".storyContainer").show();
}

const playAutoRound = () => {
    game.playerChoice = "You didn't choose your move in time!"
    lockPChoice();
    showCChoice();
    gameLogic();
    endMatch();
    render()
}
//set up (clicks)
const setup = () => {
    $(".container").hide();
    $(".storyContainer").hide();
    $("#nextRoundBtn").css("visibility", "hidden");
    $("#nextBtn").css("visibility", "hidden");

    $("#startMatch").on("click", showRound);
    $("#confirmChoiceBtn").attr("disabled", true);
    $(".pOptionBtn").on("click", showPChoice);
    $("#confirmChoiceBtn").on("click", playRound);
    $("#nextRoundBtn").on("click", newRound);
    $("#nextBtn").on("click",showStoryScreen)
};

//draw on screen
const render = () => {
    $("#pChoice").text(game.playerChoice); //want to add in sound here
    $("#cChoice").text(game.computerChoice);
    $("#message").text(game.message)
    // $("#lockMessage").text(game.lockMessage)
    if (game.message == "It's a tie!" || game.message == "You won the round" || game.message == "You lost the round") {
       showNextRoundBtn()
    };
    $("#roundNum").text(game.rounds);
    $("#playerHp").text(game.playerHp);
    $("#computerHp").text(game.computerHp);

}

$(() => {
    setup();
    render();
})

