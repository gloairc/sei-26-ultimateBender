const game = {
    rounds: 1,
    message: "Message at the start of the Match",
    playerHp: 100,
    computerHp: 100,
    playerChoice: "To be decided",
    computerChoice: "To be decided",
    lockMessage: "",
    damage: 30,
    harm: 20,
    heal: 10
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

const tieLogic = (playerChoice, computerChoice) => {//message for a tie
    if (playerChoice === computerChoice) {
        game.message = "It's a tie!"
    }
}

const isTie = () => {//returns playerC === cChoice
    return (game.playerChoice === game.computerChoice)
}

const destroyPair = { //key is victim to 1st item in object, key destroys 2nd itme
    [elements[0]]: { [elements[4]]: "victimTo", [elements[1]]: "destroys" },
    [elements[1]]: { [elements[0]]: "victimTo", [elements[2]]: "destroys" },
    [elements[2]]: { [elements[1]]: "victimTo", [elements[3]]: "destroys" },
    [elements[3]]: { [elements[2]]: "victimTo", [elements[4]]: "destroys" },
    [elements[4]]: { [elements[3]]: "victimTo", [elements[0]]: "destroys" }
}

const isDestroyPair = () => {
    return ((destroyPair[game.playerChoice][game.computerChoice] === "victimTo") || (destroyPair[game.playerChoice][game.computerChoice] === "destroys"))
}

const destroyLogic = (playerChoice, computerChoice) => {//if pC and cC are in a destroy relationship
    if (destroyPair[playerChoice][computerChoice] === "victimTo") {
        damageIncurredToPlayer();
        game.message = "You lost the round/ You are being destroyed by your opponent";
    } else if (destroyPair[playerChoice][computerChoice] === "destroys") {
        damageIncurredToComputer()
        game.message = "You won the round/ You destroy your opponent";
    }
}

const isweakenHealPair = () => {
    return ((weakenHealPair[game.playerChoice][game.computerChoice] === "weakens") || (weakenHealPair[game.playerChoice][game.computerChoice] === "heals"))
}
const weakenHealPair = {//key weakens 1st item in object and heals the 2nd item
    [elements[0]]: { [elements[2]]: "weakens", [elements[3]]: "heals" },
    [elements[1]]: { [elements[3]]: "weakens", [elements[4]]: "heals" },
    [elements[2]]: { [elements[4]]: "weakens", [elements[0]]: "heals" },
    [elements[3]]: { [elements[0]]: "weakens", [elements[1]]: "heals" },
    [elements[4]]: { [elements[1]]: "weakens", [elements[2]]: "heals" }
}

const weakenHealLogic = (playerChoice, computerChoice) => {//if pC and cC are in a hurt-heal relationship
    if (weakenHealPair[playerChoice][computerChoice] === "weakens") {
        weakenComputer();
        healPlayer();
        game.message = "You won the round/ You hurt your opponent and got healed in return";
    } else if (weakenHealPair[playerChoice][computerChoice] === "heals") {
        weakenPlayer();
        healComputer();
        game.message = "You lost the round/ Your opponent hurt you and was healed in return";
    }
}

const gameLogic = () => {//destroy, tie, endMatch
    if (isTie()) {
        tieLogic(game.playerChoice, game.computerChoice)
        console.log("pair is a tie")
    } else if (isDestroyPair()) {
        destroyLogic(game.playerChoice, game.computerChoice)
        console.log("pair is a destroy pair")
    } else {
        weakenHealLogic(game.playerChoice, game.computerChoice)
        console.log("pair is a weaken-heal pair")
    }
    render()
}


//CHANGES TO HEALTHPOINTS - DAMAGE, HARM, HEAL
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

const weakenPlayer = () => {//harm to player, cap at 0
    game.playerHp = game.playerHp - game.harm;
    if (game.playerHp <= 0) {
        game.playerHp = 0
    }
}

const weakenComputer = () => {//harm to computer, cap at 0
    game.computerHp = game.computerHp - game.harm;
    if (game.computerHp <= 0) {
        game.computerHp = 0
    }
}

const healPlayer = () => {//add heal to max 100
    game.playerHp = game.playerHp + game.heal;
    if (game.playerHp >= 100) {
        game.playerHp = 100
    }
}

const healComputer = () => {//add heal to max 100
    game.computerHp = game.computerHp + game.heal;
    if (game.computerHp >= 100) {
        game.computerHp = 100
    }
}

//SHOW BUTTONS
const showNextRoundBtn = () => {
    $("#nextRoundBtn").css("visibility", "visible");
}

const showNextBtn = () => {//visible nextBtn to click
    $("#nextBtn").css("visibility", "visible");
}

const showRound = () => {//show match screen for Round 1
    $(".container").show();
    $("#startMatch").css("visibility", "hidden");
    // game.message = "You have 10 seconds to make a move";
    render()
}


const playRound = () => {//click confirmChoice -> showCChoice, gameLogic & render
    disableOptAndConfirmBtn();
    showCChoice();
    showNextRoundBtn();
    console.log("i have played round")
    gameLogic();//tie, destroy, weaken/harm
    console.log("run gameLogic")
    if (isMatchEnd()) {
        endMatch(game.playerChoice, game.computerChoice);
        render()
        console.log("isMatchend")
    }
}

const newRound = () => {//reset the messages & buttons
    // game.message = "You have 10 seconds to make a move";
    game.lockMessage = "";
    game.playerChoice = "To be decided";
    game.computerChoice = "To be decided";
    game.rounds++;

    $(".pOptionBtn").attr("disabled", false);
    $("#confirmChoiceBtn").attr("disabled", true);
    $("#nextRoundBtn").css("visibility", "hidden");
    render()
}

const isMatchEnd = () => {
    return (game.playerHp === 0 || game.computerHp === 0);
}

const endMatch = () => {//when hp=0, win or loss message, disable opt&confirm btn, show nextBtn
    if (game.playerHp === 0) {
        game.message = "You lost the round and have been defeated. Try harder next time!";
        showNextBtn();
        disableOptAndConfirmBtn();
        $("#nextRoundBtn").css("visibility", "hidden");

    } else if (game.computerHp === 0) {
        game.message = "You won the round and defeated your opponent. Congratulations!";
        showNextBtn();
        disableOptAndConfirmBtn()
        $("#nextRoundBtn").css("visibility", "hidden");
    }
}

//SHOW PAGE
const showStoryScreen = () => {
    $(".container").hide();
    $(".storyContainer").show();
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

    $("#roundNum").text(game.rounds);
    $("#playerHp").text(game.playerHp);
    $("#computerHp").text(game.computerHp);

}


$(() => {
    setup();
    render();
})

