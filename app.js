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
    message: "",
    player: createPlayer("", 100, 30, 30, 30, 30, 30),
    computer: "",
    storyText: "",
    faction: elements[0] //which element country are we in
};

//if another opponent
// game.computer = createPlayer("opponentname","hp",dF, dM, dWood, dE, dWater)

//handler
const enableStartGameBtn = () => {
    $("#inputName").keydown(function () {
        $("#startGameBtn").attr("disabled", false);
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
    let playerPower = game.player.avatarDamagingPower[playerChoice]
    let computerPower = game.computer.avatarDamagingPower[computerChoice]
    let diffInPower = Math.abs(playerPower - computerPower);

    if (playerPower> computerPower) {
        game.computer.avatarHp = game.computer.avatarHp - diffInPower
        game.message = "Both of you chose " + playerChoice + ". But your " + playerChoice + " power is stronger and inflicted some damange on " + game.computer.avatarName + ".";
    } else if (computerPower > playerPower) {
        game.player.avatarHp = game.player.avatarHp - diffInPower
        game.message = "Both of you chose " + playerChoice + ". But " + game.computer.avatarName + "'s" + playerChoice + " power is stronger and inflicted some damange on you.";
    } else {
        game.message = "It's a tie! Both of your " + playerChoice + " power are equally matched!"
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

const showRound1 = () => {//show match screen for Round 1
    $(".matchContainer").show();
    $("#startMatchBtn").css("visibility", "hidden");
    // $(".startContainer").hide(); //dont need since not shown
    $(".storyContainer").hide();
    game.computer = createPlayer("First Fire Opponent", 100, 30, 30, 30, 30, 30);
    $("#header").css("background-color","red");
    $("#factionHeaderDiv").css("visibility", "visible");
    $("factionHeader").text(game.faction)
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

const resetMatch = () => {//hp 100, round 1
    game.message = "Time for battle!"
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
const showStoryWithNextBtn = () => {//show only story container and next btn
    $(".startContainer").hide();
    $(".matchContainer").hide();
    $(".storyContainer").show();
    showNextBtn()
    $("#startMatchBtn").css("visibility", "hidden");
}

const showStoryWithMatchBtn = () => {//show only story container and match btn
    $(".startContainer").hide();
    $(".matchContainer").hide();
    $(".storyContainer").show();
    $("#startMatchBtn").css("visibility", "visible");
    $("#nextBtn").css("visibility", "hidden");
}

const showStory0Backstory = () => {// update player name, backstory and intro to FIRE
    showStoryWithNextBtn();
    const story0Text = "This is the 1st story. Explain backstory and what the game is about."
    game.storyText = story0Text;
    updatePlayerName();
    resetMatch();
    render()
}

const showStory1BeforeFireBattle = () => {// update player name, backstory and intro to FIRE
    showStoryWithMatchBtn();
    $("#factionHeaderDiv").css("visibility", "visible");
    game.computer = createPlayer("Fire Shifu", 100, 80, 50, 50, 50, 30);
    const story1Text = "Urgh my head feels heavy and gorgy. what just happened? where am i? xxxx.First match with " + game.computer.avatarName + ". Turn up the heat!"
    game.storyText = story1Text;
    updatePlayerName();
    resetMatch();
    render()
}

const showStory2AfterFireBattleMoveToMetal = () => {//after defeat fire, move onto metal
    showStoryWithNextBtn();
    const story2Text = "Now that I've mastered " + element[0] + ". It's time to move on in my journey to " + elements[1] + "."
    game.storyText = story2Text
    resetMatch();
    render()
}

const showStory3IntroMetalBeforeBattle = () => {//intro to metal before the match
    showStoryWithMatchBtn();
    game.computer = createPlayer("Metal Shifu", 100, 50, 60, 30, 30, 30);
    const story3Text = "I arrived at Metal Faction. Things are different here. xxxx After weeks for training, its time to put my skills to the test with " + game.computer.avatarName + ". Hope im ready for this"
    game.storyText = story3Text
    render()
}

const showStory4AfterMetalBattleMoveToWood = () => {//after defeat metal, move onto wood
    showStoryWithNextBtn();
    const story4Text = "Now that I've mastered " + element[1] + ". It's time to move on in my journey to " + elements[2] + "."
    game.storyText = story4Text
    resetMatch();
    render()
}

const showStory5IntroWoodBeforeBattle = () => {//intro to wood before the match
    showStoryWithMatchBtn();
    game.computer = createPlayer("Wood ShiFu", 100, 50, 50, 60, 30, 30);
    const story5Text = "Wood Faction. Well, all things woody. AS you would expect, forested area. xxxx After weeks for training, its time to put my skills to face " + game.computer.avatarName + ". Ready to be an Axe-men!"
    game.storyText = story5Text
    render()
}

const showStory6AfterWoodBattleMoveToEarth = () => {//after defeat wood, move onto earth
    showStoryWithNextBtn();
    const story6Text = "Now that I've mastered " + element[2] + ", i'm halfway to becoming the Ultimate Bender to defeat the evil lord. It's not easy, but i'm going to persevere on! Moving onto " + elements[3] + "."
    game.storyText = story6Text
    resetMatch();
    render()
}

const showStory7IntroEarthBeforeBattle = () => {//intro to wood before the match
    showStoryWithMatchBtn();
    game.computer = createPlayer("Earth Shifu", 100, 50, 50, 50, 60, 30);
    const story7Text = "Earth. Dig deep. xxxx After weeks for training, its time to put my skills to face " + game.computer.avatarName + ". Tractor on!"
    game.storyText = story7Text
    
    render()
}

const showStory8AfterEarthBattleMoveToWater = () => {//after defeat earth, move onto water
    showStoryWithNextBtn();
    const story8Text = "Now that I've mastered " + element[3] + ", just one more element to master. Just one more. " + elements[4] + " faction, here i come!"
    game.storyText = story8Text
    resetMatch();
    render()
}

const showStory8IntroWaterBeforeBattle = () => {//intro to water before the match
    showStoryWithMatchBtn();
    game.computer = createPlayer("Water Shifu", 100, 50, 50, 50, 50, 60);
    const story8Text = "Water. The flow of..... But there's no time to waste.  xxxx The last master to battle before i become a full-fledge elemental bender." + game.computer.avatarName + ", its time to go against the tide!"
    game.storyText = story8Text
    render()
}

const showStory9AfterWaterBattleRest = () => {//after defeat water, learnt all 5. Rest
    showStoryWithNextBtn();
    const story9Text = "mastered all 5! time to recupurate and prepare myself for the ultimate showdown!"
    game.storyText = story9Text
    resetMatch();
    render()
}

const showStory10EvilLordAppears = () => {//evil lord appears
    showStoryWithMatchBtn();
    const story10Text = "But time waits for no man. The skies turn grey, .... the evil lord is here. I sensed an aura of a new ultimate bender. do you think you can overthrow me? im going to destory you before you have a chance"
    game.storyText = story10Text
    resetMatch();
    render()
}

const showStory11AfterFinalShowdownWithEvilLord = () => {//after defeat evil lord
    showStoryWithNextBtn();
    const story11Text = "That was a tough battle. but im glad to make it out alive. with evil lord defeated, the people celebrated. i can finally rest. Peace has return!"
    game.storyText = story11Text
    render()
}

//set up (clicks)
const setup = () => {
    //HIDE SHOW PAGE AT THE START
    $(".startContainer").show();
    $(".matchContainer").hide();
    $(".storyContainer").hide();
    $(".endGameContainer").hide(); 
    enableStartGameBtn()   

//CSS AND ATTR EVENT
    $("#factionHeaderDiv").css("visibility", "hidden");
    $("#startMatchBtn").css("visibility", "hidden");
    $("#nextRoundBtn").css("visibility", "hidden");
    $("#nextBtn").css("visibility", "hidden");
    $("#startGameBtn").attr("disabled", true);
    $("#confirmChoiceBtn").attr("disabled", true);

//CLICK EVENT
    $("#startGameBtn").on("click", showStory0Backstory);
    $("#startMatchBtn").on("click", showRound1);
    $(".pOptionBtn").on("click", showPChoice);
    $("#confirmChoiceBtn").on("click", playRound);
    $("#nextRoundBtn").on("click", newRound);
    $("#nextBtn").on("click", showStory1BeforeFireBattle)
    //mutliple button each different ids -> show me different pages
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
    // $(".matchContainer").show(); // skip the name part for now CSS
    render();
})