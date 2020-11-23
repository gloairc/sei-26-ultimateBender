const game = {
    rounds: 1,
    message: "",
    playerHp: 100,
    computerHp: 100,
    playerChoice: "To be decided",
    computerChoice: "To be decided",
    lockMessage: "",
    damage: 30,
    harm: 10
    // fireDamage: 30,
    // metalDamage: 30,
    // woodDamage: 30,
    // earthDamage: 30,
    // waterDamage: 30
};

const elements = ["Fire", "Metal", "Wood", "Earth", "Water"]

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

const disableOptAndConfirmBtn = () => {//disable option & confirm choice btn after confirming
    // game.lockMessage = "" //only need message here if we are delaying computer's choice & result"
    $(".pOptionBtn").attr("disabled", true);
    $("#confirmChoiceBtn").attr("disabled", true)
}

const showCChoice = () => { //display C's choice
    let cChoicev = elements[Math.floor(Math.random() * elements.length)] //C random choice
    game.computerChoice = cChoicev
}

const destroyPairing = {
    [elements[0]]: { [elements[4]]: "victimTo", [elements[1]]: "destroys" },
    [elements[1]]: { [elements[0]]: "victimTo", [elements[2]]: "destroys" },
    [elements[2]]: { [elements[1]]: "victimTo", [elements[3]]: "destroys" },
    [elements[3]]: { [elements[2]]: "victimTo", [elements[4]]: "destroys" },
    [elements[4]]: { [elements[3]]: "victimTo", [elements[0]]: "destroys" }
}
// console.log(destroyPairing[elements[0]]) //returns {victimTo: "Water", destorys:"Metal"}
// console.log(destroyPairing[elements[0]]["victimTo"]) //returns Water
// console.log(Object.keys(destroyPairing)[0]) //returns Fire

// const destroyKeys = Object.keys(destroyPairing)
// console.log(destroyKeys) //return keys in array
// console.log(destroyKeys[0])//returns fire 
// console.log(destroyPairing[destroyKeys[0]])
// console.log(destroyPairing[destroyKeys[0]]["victimTo"]) // return water

const destroyLogic = (playerChoice, computerChoice) => {//if pC and cC are in a destroy relationship
    if (destroyPairing[playerChoice][computerChoice] === "victimTo") {
        damageIncurredToPlayer();
        game.message = "You lost the round/ You are being destroyed by your opponent";
    } else if (destroyPairing[playerChoice][computerChoice] === "destroys") {
        damageIncurredToComputer()
        game.message = "You won the round/ You destroy your opponent";
    } else {
        game.message = "harm/heal relationship"
    }
}

const tieLogic = (playerChoice, computerChoice) => {//message for a tie
    if (playerChoice === computerChoice) {
        game.message = "It's a tie!"
    }
}

// const destroyLogicLongForm = (playerChoice, computerChoice) => {//find if pC and cC are in a destroy relationship
//     const destroyKeys = Object.keys(destroyPairing) //array of keys
//     for (let i = 0; i < destroyKeys.length; i++) { 
//         if (playerChoice === destroyKeys[i]) { //go through each key to check
//             if (computerChoice === destroyPairing[destroyKeys[i]]["victimTo"]) {
//                 damageIncurredToPlayer();
//                 game.message = "You lost the round/ You are being destroyed by your opponent";
//             } else {
//                 damageIncurredToComputer()
//                 game.message = "You won the round/ You destroy your opponent";
//             }
//         }
//     }
// }

// const destroyLogic = () => {//compare P&C and prepare message
//     if (game.playerChoice === game.computerChoice) {// need to code tie again when have different power
//         game.message = "It's a tie!"
//     } else if (game.playerChoice === elements[0] && game.computerChoice === elements[1]) {
//         game.message = "You won the round";
//         damageIncurredToComputer()
//     } else if (game.playerChoice === elements[1] && game.computerChoice === elements[2]) {
//         game.message = "You won the round";
//         damageIncurredToComputer()
//     } else if (game.playerChoice === elements[2] && game.computerChoice === elements[3]) {
//         game.message = "You won the round";
//         damageIncurredToComputer()
//     } else if (game.playerChoice === elements[3] && game.computerChoice === elements[4]) {
//         game.message = "You won the round";
//         damageIncurredToComputer()
//     } else if (game.playerChoice === elements[4] && game.computerChoice === elements[0]) {
//         game.message = "You won the round";
//         damageIncurredToComputer()
//     } else {
//         game.message = "You lost the round"; //need to work on this
//         damageIncurredToPlayer()
//     }
// }

// const harmLogic = () => {//compare P&C and prepare message
//    if (game.playerChoice === elements[0] && game.computerChoice === elements[3]) {
//         game.message = "You hurt your opponent, and got healed in return";
//         harmIncurredToComputer()
//     } else if (game.playerChoice === elements[1] && game.computerChoice === elements[4]) {
//         game.message = "You hurt your opponent, and got healed in return";
//         harmIncurredToComputer()
//     } else if (game.playerChoice === elements[2] && game.computerChoice === elements[0]) {
//         game.message = "You hurt your opponent, and got healed in return";
//         harmIncurredToComputer()
//     } else if (game.playerChoice === elements[3] && game.computerChoice === elements[1]) {
//         game.message = "You hurt your opponent, and got healed in return";
//         harmIncurredToComputer()
//     } else if (game.playerChoice === elements[4] && game.computerChoice === elements[2]) {
//         game.message = "You hurt your opponent, and got healed in return";
//         harmIncurredToComputer()
//     // } else if (game.message = "You healed your opponent and got hurt in return")
//     else {game.message = "You lost the round"; //need to work on this
//         harmIncurredToPlayer()
//     }

const gameLogic = () => {//destroy, tie, endMatch
    //if either is 0, message, exit this fn
    //else check if tie, message, exit this fn
    //else check if destroy, exit this fn
    // else its a hurt/heal relationship
    destroyLogic(game.playerChoice, game.computerChoice);
    // harmLogic()
    tieLogic(game.playerChoice, game.computerChoice); //so that override message if its a tie
    endMatch()
}

const damageIncurredToPlayer = () => {//damage to player, cap at 0
    game.playerHp = game.playerHp - game.damage;
    if (game.playerHp <= 0) {
        game.playerHp = 0
    }
}

const damageIncurredToComputer = () => {//damage to computer, cap at 0
    game.computerHp = game.computerHp - game.damage;
    if (game.computerHp <= 0) {
        game.computerHp = 0
    }
}

// const harmIncurredToPlayer = () => {//harm to player, cap at 0
//     game.playerHp = game.playerHp - game.harm;
//     if (game.playerHp <=0){
//         game.playerHp = 0
//     }
// }

// const harmIncurredToComputer = () => {//harm to computer, cap at 0
//     game.computerHp = game.computerHp - game.harm;
//     if (game.computerHp <=0){
//         game.computerHp = 0
//     }
// }

const showNextRoundBtn = () => {
    $("#nextRoundBtn").css("visibility", "visible");
}

const showRound = () => {//show match screen for Round 1
    $(".container").show();
    $("#startMatch").css("visibility", "hidden");
    game.message = "You have 10 seconds to make a move";
    console.log("showRound BEFORE render" + game.message)
    render()
    console.log("showRound AFTER render" + game.message)
}

const playRound = () => {//click confirmChoice -> showCChoice, gameLogic & render
    disableOptAndConfirmBtn();
    showCChoice();
    gameLogic();
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

const endMatch = () => {//when hp=0, win or loss message, disable opt&confirm btn, show nextBtn
    if (game.playerHp === 0) {
        game.message = "You lost the round and have been defeated. Try harder next time!";
       showNextBtn();
        disableOptAndConfirmBtn()
    } else if (game.computerHp === 0) {
        game.message = "You won the round and defeated your opponent. Congratulations!";
        showNextBtn();
        disableOptAndConfirmBtn()
    }
}

const showStoryScreen = () => {
    $(".container").hide();
    $(".storyContainer").show();
}

const playAutoRound = () => {
    game.playerChoice = "You didn't choose your move in time!"
    disableOptAndConfirmBtn();
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
    $("#nextBtn").on("click", showStoryScreen)
};

//draw on screen
const render = () => {
    $("#pChoice").text(game.playerChoice); //want to add in sound here
    $("#cChoice").text(game.computerChoice);
    $("#message").text(game.message)
    // $("#lockMessage").text(game.lockMessage)
    // if (game.message !== "You have 10 seconds to make a move") {
    //     showNextRoundBtn() //need for computer too
    // };
    $("#roundNum").text(game.rounds);
    $("#playerHp").text(game.playerHp);
    $("#computerHp").text(game.computerHp);

}


$(() => {
    setup();
    render();
})

