const elements = ["Fire", "Metal", "Wood", "Earth", "Water"]

const createPlayer = (name, hp, dFire, dMetal, dWood, dEarth, dWater) => {
    let avatar = {
        avatarName: name,
        avatarHp: hp,
        avatarChoice: "Not decided yet",
        avatarDamagingPower: {
            [elements[0]]: dFire,
            [elements[1]]: dMetal,
            [elements[2]]: dWood,
            [elements[3]]: dEarth,
            [elements[4]]: dWater
        },
        avatarWeakeningPower: {// 2/3 of damagerPower
            [elements[0]]: Math.ceil(dFire / 3 * 2),
            [elements[1]]: Math.ceil(dMetal / 3 * 2),
            [elements[2]]: Math.ceil(dWood / 3 * 2),
            [elements[3]]: Math.ceil(dEarth / 3 * 2),
            [elements[4]]: Math.ceil(dWater / 3 * 2)
        },
        avatarHealingPower: {// 1/3 of damagerPower
            [elements[0]]: Math.ceil(dFire / 3),
            [elements[1]]: Math.ceil(dMetal / 3),
            [elements[2]]: Math.ceil(dWood / 3),
            [elements[3]]: Math.ceil(dEarth / 3),
            [elements[4]]: Math.ceil(dWater / 3)
        }
    }
    return avatar;
}

const game = {
    rounds: 1,
    message: "Message at the start of the Match",
    player: createPlayer("", 100, 30, 30, 30, 30, 30),
    computer: createPlayer("tutorial", 100, 30, 30, 30, 30, 30),
    storyText: "",
    faction: elements[0] //which element country are we in
};

//if another opponent
// game.computer = createPlayer("opponentname","hp",dF, dM, dWood, dE, dWater)

//handler
const enableStartAdventureBtn = () => {
    $( "#inputName" ).keydown(function() {
        $("#startAdventureBtn").attr("disabled", false);
      });
}

const updatePlayerName = () => {
    game.player.avatarName = $("#inputName").val()
}

// const updateElementFaction = () => {
//     game.faction = elements[0] 
// }

const showPChoice = (event) => { //display Player Choice
    const pChoicev = $(event.target).text();
    game.player.avatarChoice = pChoicev
    enableConfirmChoiceBtn();
    render();
}

const enableConfirmChoiceBtn = () => {
    if (game.player.avatarChoice !== "") {
        $("#confirmChoiceBtn").attr("disabled", false);
    }
}

const disableOptAndConfirmBtn = () => {//disable option & confirm choice btn after confirming
    $(".pOptionBtn").attr("disabled", true);
    $("#confirmChoiceBtn").attr("disabled", true)
}

const showCChoice = () => { //display C's choice
    let cChoicev = elements[Math.floor(Math.random() * elements.length)] //C random choice
    game.computer.avatarChoice = cChoicev
}

const updatePlayerDamagingPower = () => {//update faction power by +5
    game.player.avatarDamagingPower[game.faction] += 5
}

//GAME LOGIC FOR THE ULTIMATE SCISSORS PAPER STONE
const tieLogic = (playerChoice, computerChoice) => {//message for a tie
    if (playerChoice === computerChoice) {
        game.message = "It's a tie!"
    }
}

const isTie = () => {//returns playerC === cChoice
    return (game.player.avatarChoice === game.computer.avatarChoice)
}

const destroyPair = { //key is victim to 1st item in object, key destroys 2nd itme
    [elements[0]]: { [elements[4]]: "victimTo", [elements[1]]: "destroys" },
    [elements[1]]: { [elements[0]]: "victimTo", [elements[2]]: "destroys" },
    [elements[2]]: { [elements[1]]: "victimTo", [elements[3]]: "destroys" },
    [elements[3]]: { [elements[2]]: "victimTo", [elements[4]]: "destroys" },
    [elements[4]]: { [elements[3]]: "victimTo", [elements[0]]: "destroys" }
}

const isDestroyPair = () => {
    return (destroyPair[game.player.avatarChoice][game.computer.avatarChoice] === "victimTo") || (destroyPair[game.player.avatarChoice][game.computer.avatarChoice] === "destroys")
}

const destroyLogic = (playerChoice, computerChoice) => {//if pC and cC are in a destroy relationship
    if (destroyPair[playerChoice][computerChoice] === "victimTo") {
        damageIncurredToPlayer();
        console.log("player being destroyed, player chose " + playerChoice + ", computer chose " + computerChoice);
        game.message = "You lost the round/ You are being destroyed by your opponent";
    } else if (destroyPair[playerChoice][computerChoice] === "destroys") {
        damageIncurredToComputer()
        game.message = "You won the round/ You destroy your opponent";
        console.log("computer being destroyed, player chose " + playerChoice + ", computer chose " + computerChoice);
    }
}

const isweakenHealPair = () => {
    return ((weakenHealPair[game.player.avatarChoice][game.computer.avatarChoice] === "weakens") || (weakenHealPair[game.player.avatarChoice][game.computer.avatarChoice] === "heals"))
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
        console.log("player hurt opponent and got healed, player chose " + playerChoice + ", computer chose " + computerChoice)
    } else if (weakenHealPair[playerChoice][computerChoice] === "heals") {
        weakenPlayer();
        healComputer();
        game.message = "You lost the round/ Your opponent hurt you and was healed in return";
        console.log("opponent hurt player and got healed, player chose " + playerChoice + ", computer chose " + computerChoice)
    }
}

const gameLogic = () => {//destroy, tie, endMatch
    if (isTie()) {
        tieLogic(game.player.avatarChoice, game.computer.avatarChoice)
        console.log("pair is a tie")
    } else if (isDestroyPair()) {
        destroyLogic(game.player.avatarChoice, game.computer.avatarChoice)
        console.log("pair is a destroy pair")
    } else {
        weakenHealLogic(game.player.avatarChoice, game.computer.avatarChoice)
        console.log("pair is a weaken-heal pair")
    }
    render()
}

const isMatchEnd = () => {
    return (game.player.avatarHp === 0 || game.computer.avatarHp === 0);
}

const endMatch = () => {//when hp=0, win or loss message, disable opt&confirm btn, show nextBtn
    if (game.player.avatarHp === 0) {
        game.message = "You lost the round and have been defeated. Try harder next time!";
        showNextBtn();
        disableOptAndConfirmBtn();
        $("#nextRoundBtn").css("visibility", "hidden");
        game.storyText = "and the adventure continues"

    } else if (game.computer.avatarHp === 0) {
        game.message = "You won the round and defeated your opponent. Congratulations! You also improved your " + game.faction + " power by 5xp";
        updatePlayerDamagingPower();
        showNextBtn();
        disableOptAndConfirmBtn();

        $("#nextRoundBtn").css("visibility", "hidden");
        game.storyText = "and the adventure continues"
    }
}

//CHANGES TO HEALTHPOINTS - DAMAGE, HARM, HEAL
const damageIncurredToPlayer = () => {//damage to player, cap at 0
    game.player.avatarHp = game.player.avatarHp - game.computer.avatarDamagingPower[game.computer.avatarChoice]; // player.playerDamagingPower
    if (game.player.avatarHp <= 0) {
        game.player.avatarHp = 0
    }
}

const damageIncurredToComputer = () => {//damage to computer, cap at 0
    game.computer.avatarHp = game.computer.avatarHp - game.player.avatarDamagingPower[game.player.avatarChoice];
    if (game.computer.avatarHp <= 0) {
        game.computer.avatarHp = 0
    }
}

const weakenPlayer = () => {//harm to player, cap at 0
    game.player.avatarHp = game.player.avatarHp - game.computer.avatarWeakeningPower[game.computer.avatarChoice];
    if (game.player.avatarHp <= 0) {
        game.player.avatarHp = 0
    }
}

const weakenComputer = () => {//harm to computer, cap at 0
    game.computer.avatarHp = game.computer.avatarHp - game.player.avatarWeakeningPower[game.player.avatarChoice];
    if (game.computer.avatarHp <= 0) {
        game.computer.avatarHp = 0
    }
}

const healPlayer = () => {//add heal to max 100
    game.player.avatarHp = game.player.avatarHp + game.computer.avatarHealingPower[game.computer.avatarChoice];
    if (game.player.avatarHp >= 100) {
        game.player.avatarHp = 100
    }
}

const healComputer = () => {//add heal to max 100
    game.computer.avatarHp = game.computer.avatarHp + game.player.avatarHealingPower[game.player.avatarChoice];
    if (game.computer.avatarHp >= 100) {
        game.computer.avatarHp = 100
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

//PLAY ROUND
const playRound = () => {//click confirmChoice -> showCChoice, gameLogic & render
    disableOptAndConfirmBtn();
    showCChoice();
    render() //added in 11:33am
    showNextRoundBtn();
    gameLogic();//tie, destroy, weaken/harm
    if (isMatchEnd()) {
        endMatch(game.player.avatarChoice, game.computer.avatarChoice);
        render()
    }
}

const newRound = () => {//reset the messages & buttons
    game.player.avatarChoice = "To be decided";
    game.computer.avatarChoice = "To be decided";
    game.rounds++;

    $(".pOptionBtn").attr("disabled", false);
    $("#confirmChoiceBtn").attr("disabled", true);
    $("#nextRoundBtn").css("visibility", "hidden");
    render()
}

const resetMatch = () => {
    game.message = ""
    game.player.avatarHp = 100;
    game.computer.avatarHp = 100;
    game.player.avatarChoice = "To be decided";
    game.computer.avatarChoice = "To be decided";
    game.rounds = 1;

    $(".pOptionBtn").attr("disabled", false);
    $("#confirmChoiceBtn").attr("disabled", true);
    $("#nextRoundBtn").css("visibility", "hidden");
    $("#nextBtn").css("visibility", "hidden");
    render()
}

//SHOW PAGE
const showStoryScreen = () => {
    $(".startContainer").hide();
    $(".container").hide();
    $(".storyContainer").show();
    $("#startMatch").css("visibility", "visible");

    updatePlayerName();
    resetMatch();
    render()
}

//set up (clicks)
const setup = () => {
//HIDE SHOW PAGE AT THE START
    $(".startContainer").show();
    $(".container").hide();
    $(".storyContainer").hide();
    enableStartAdventureBtn()
//CSS AND ATTR EVENT
    $("#startMatch").css("visibility", "hidden");
    $("#nextRoundBtn").css("visibility", "hidden");
    $("#nextBtn").css("visibility", "hidden");
    $("#startAdventureBtn").attr("disabled", true);
    $("#confirmChoiceBtn").attr("disabled", true);
//CLICK EVENT
    $("#startAdventureBtn").on("click", showStoryScreen);
    $("#startMatch").on("click", showRound);
    $(".pOptionBtn").on("click", showPChoice);
    $("#confirmChoiceBtn").on("click", playRound);
    $("#nextRoundBtn").on("click", newRound);
    $("#nextBtn").on("click", showStoryScreen)
};


//draw on screen
const render = () => {
    $("#storyText").text(game.storyText)
    $("#message").text(game.message)
    $("#roundNum").text(game.rounds);
    $(".elementFaction").text(game.faction);

    $("#playerName").text(game.player.avatarName);
    $("#playerHp").text(game.player.avatarHp);
    $("#pChoice").text(game.player.avatarChoice); //want to add in sound here
    $("#pFireDamage").text(game.player.avatarDamagingPower[elements[0]]);
    $("#pMetalDamage").text(game.player.avatarDamagingPower[elements[1]]);
    $("#pWoodDamage").text(game.player.avatarDamagingPower[elements[2]]);
    $("#pEarthDamage").text(game.player.avatarDamagingPower[elements[3]]);
    $("#pWaterDamage").text(game.player.avatarDamagingPower[elements[4]]);

    $("#computerName").text(game.computer.avatarName);
    $("#computerHp").text(game.computer.avatarHp);
    $("#cChoice").text(game.computer.avatarChoice);
    $("#cFireDamage").text(game.computer.avatarDamagingPower[elements[0]]);
    $("#cMetalDamage").text(game.computer.avatarDamagingPower[elements[1]]);
    $("#cWoodDamage").text(game.computer.avatarDamagingPower[elements[2]]);
    $("#cEarthDamage").text(game.computer.avatarDamagingPower[elements[3]]);
    $("#cWaterDamage").text(game.computer.avatarDamagingPower[elements[4]]);

}


$(() => {
    setup();
    render();
})