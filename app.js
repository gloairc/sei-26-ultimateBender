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
    player: createPlayer("", 100, 100, 100, 100, 100, 100),
    computer: createPlayer("placeholder", 100, 30, 30, 30, 30, 30),
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

const showPChoice = (event) => { //display Player Choice
    const pChoicev = $(event.currentTarget).attr("id")
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

    if (playerPower > computerPower) {
        game.computer.avatarHp = game.computer.avatarHp - diffInPower
        game.message = "Both of you chose " + playerChoice + ". But your " + playerChoice + " power is stronger and inflicted some damange on " + game.computer.avatarName + ".";
        if (game.computer.avatarHp <= 0) {
            game.computer.avatarHp = 0
        }
    } else if (computerPower > playerPower) {
        game.player.avatarHp = game.player.avatarHp - diffInPower
        game.message = "Both of you chose " + playerChoice + ". But " + game.computer.avatarName + "'s" + playerChoice + " power is stronger and inflicted some damange on you.";
        if (game.player.avatarHp <= 0) {
            game.player.avatarHp = 0
        }
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
    return (game.player.avatarHp <= 0 || game.computer.avatarHp <= 0);
}

//CHANGES TO HEALTHPOINTS - DAMAGE, HARM, HEAL
const damageIncurredToPlayer = () => {//damage to player, cap at 0
    game.player.avatarHp = game.player.avatarHp - game.computer.avatarDamagingPower[game.computer.avatarChoice];
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

//PLAY ROUND
const playRound = () => {//click confirmChoice -> showCChoice, gameLogic & render
    disableOptAndConfirmBtn();
    showCChoice();
    render() 
    gameLogic();//tie, destroy, weaken/harm
    $(".nextRoundBtnDiv").show();
    $("#nextRoundBtn").show();
    if (isMatchEnd()) {
        endMatch(game.player.avatarChoice, game.computer.avatarChoice);
        render()
        console.log("match has ended")
    }
}

const newRound = () => {//reset the messages & buttons
    game.player.avatarChoice = "To be decided";
    game.computer.avatarChoice = "To be decided";
    game.rounds++;
    game.message = "" 

    $(".pOptionBtn").attr("disabled", false);
    $("#confirmChoiceBtn").attr("disabled", true);
    $(".nextRoundBtnDiv").hide();
    render()
}

const endMatch = () => {//when hp=0, win or loss message, disable opt&confirm btn, show nextBtn
    if (game.player.avatarHp === 0) {//player lose
        game.message = "You lost the round and have been defeated. Try harder next time!";
        disableOptAndConfirmBtn();
        $(".nextRoundBtnDiv").hide()
        $(".rematchBtnDiv").show();
        
    } else if (game.computer.avatarHp === 0) {//player wins!
        game.message = "You won the round and defeated your opponent. Congratulations! You also improved your " + game.faction + " power by 5xp";
        updatePlayerDamagingPower();
        disableOptAndConfirmBtn();
        $(".nextRoundBtnDiv").hide()
        $(".nextBtnsDiv").show();
        // game.storyText = "and the adventure continues"
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
    $(".nextRoundBtnDiv").hide();
    $("#nextBtnsDiv").hide();
    $(".rematchBtnDiv").hide();
    render()
}

//SHOW BATTLE/MATCH
//SHOW PAGE

const hideAllBtnAndDivInBtnConsole = () => {//leaves empty divs
    // hide all btns except one button in nextRound and Rematch
    $(".nextBtns").hide();
    $(".startMatchBtns").hide();
    //hide all divs
    $(".nextBtnsDiv").hide();
    $(".startMatchBtnsDiv").hide();
    $(".nextRoundBtnDiv").hide();
    $(".rematchBtnDiv").hide();
}

const showStoryWithNextBtnDiv = () => {//show only storyContainer
    $(".startContainer").hide();
    $(".matchContainer").hide();
    $(".storyContainer").show();
    $("#btnConsoleDiv").show();
    hideAllBtnAndDivInBtnConsole();
    $(".nextBtnsDiv").show();
}

const showStoryWithMatchBtnDiv = () => {//show only story container and match btn
    $(".startContainer").hide();
    $(".matchContainer").hide();
    $(".storyContainer").show();
    $("#btnConsoleDiv").show();
    hideAllBtnAndDivInBtnConsole();
    $(".startMatchBtnsDiv").show();
}

const showMatchContainer = () => {//show match container with empty console
    $(".matchContainer").show();
    $("#btnConsoleDiv").show();
    hideAllBtnAndDivInBtnConsole();

    $(".startContainer").hide();
    $(".storyContainer").hide();
}

const showStory0Backstory = () => {// update player name, backstory 
    showStoryWithNextBtnDiv();
    $("#nextBtnToS1").show();
    const story0Text = "This is the 1st story. Explain backstory and being teleported."
    game.storyText = story0Text;
    updatePlayerName();
    resetMatch();
    render()
}

const showStory1RealizedMissionAndInFire = () => {//intro to FIRE and before match
    showStoryWithMatchBtnDiv();
    $("#startMatchBtn1").show();

    $("#factionHeaderDiv").css("visibility", "visible");
    $("#header").css("background-color", "red");
    game.faction = elements[0];
    $("#message").css("background-color", "lightpink");

    game.computer = createPlayer("Fire Opponent", 100, 30, 30, 30, 30, 30);
    const story1Text = "Urgh my head feels heavy and gorgy. what just happened? where am i? IN THE FIRE NATION? and im supposed to be the ultimate bender to save the world? friendly guy came to spare with me"
    game.storyText = story1Text;
    updatePlayerName();
    resetMatch();
    render()
}

const showMatch1Easy = () => {//show match screen for Round 1
    showMatchContainer() //show with empty console
    game.computer = createPlayer("First Fire Opponent", 100, 30, 30, 30, 30, 30);
    $("#nextBtnToS2").show()
    render()
}

const showStory2AfterFirstMatchNowFireBattle = () => {//before fighting fire shifu
    showStoryWithMatchBtnDiv();
    $("#startMatchBtn2").show();
    resetMatch();
    game.computer = createPlayer("Fire Shifu", 100, 80, 50, 50, 50, 30);
    const story2Text = "first match wasnt that bad xxxx.Its time for my first battle with " + game.computer.avatarName + ". Turn up the heat!"
    game.storyText = story2Text;
    render()
}

const showMatch2withFireShiFu = () => {//Fight fire shifu
    showMatchContainer() //show with empty console
    $("#nextBtnToS3").show(); 
    render()
}

const showStory3AfterFireBattleMoveToMetal = () => {//after defeat fire, move onto metal
    showStoryWithNextBtnDiv();
    $("#nextBtnToS4").show();
    resetMatch();
    const story3Text = "Now that I've mastered " + elements[0] + ". It's time to move on in my journey to " + elements[1] + "."
    game.storyText = story3Text
    render()
}

const showStory4IntroMetalBeforeBattle = () => {//intro to metal before the match
    $("#header").css("background-color", "darkgrey");
    game.faction = elements[1]
    $("#message").css("background-color", "lightgrey");
    
    showStoryWithMatchBtnDiv();
    $("#startMatchBtn3").show();
    game.computer = createPlayer("Metal Shifu", 100, 50, 60, 30, 30, 30);
    const story4Text = "I arrived at Metal Faction. Things are different here. xxxx After weeks for training, its time to put my skills to the test with " + game.computer.avatarName + ". Hope im ready for this"
    game.storyText = story4Text
    render()
}

const showMatch3withMetalShiFu = () => {//Fight metal shifu
    showMatchContainer() //show with empty console
    $("#nextBtnToS5").show(); 
    render()
}

const showStory5AfterMetalBattleMoveToWood = () => {//after defeat metal, move onto wood
    showStoryWithNextBtnDiv();
    $("#nextBtnToS6").show();
    resetMatch();
    const story5Text = "Now that I've mastered " + elements[1] + ". It's time to move on in my journey to " + elements[2] + "."
    game.storyText = story5Text
    render()
}

const showStory6IntroWoodBeforeBattle = () => {//intro to wood before the match
    $("#header").css("background-color", "green");
    game.faction = elements[2]
    $("#message").css("background-color", "lightgreen");
    
    showStoryWithMatchBtnDiv();
    $("#startMatchBtn4").show();
    game.computer = createPlayer("Wood ShiFu", 100, 50, 50, 60, 30, 30);
    const story6Text = "Wood Faction. Well, all things woody. As you would expect, forested area. xxxx After weeks for training, its time to put my skills to face " + game.computer.avatarName + ". Ready to be an Axe-men!"
    game.storyText = story6Text
    render()
}

const showMatch4withWoodShiFu = () => {//Fight wood shifu
    showMatchContainer() //show with empty console
    $("#nextBtnToS7").show(); 
    render()
}

const showStory7AfterWoodBattleMoveToEarth = () => {//after defeat wood, move onto earth
    showStoryWithNextBtnDiv();
    $("#nextBtnToS8").show();
    resetMatch();
    const story7Text = "Now that I've mastered " + elements[2] + ", i'm halfway to becoming the Ultimate Bender to defeat the evil lord. It's not easy, but i'm going to persevere on! Moving onto " + elements[3] + "."
    game.storyText = story7Text
    render()
}

const showStory8IntroEarthBeforeBattle = () => {//intro to wood before the match
    $("#header").css("background-color", "brown");
    game.faction = elements[3]
    $("#message").css("background-color", "burlywood");

    showStoryWithMatchBtnDiv();
    $("#startMatchBtn5").show();
    game.computer = createPlayer("Earth Shifu", 100, 50, 50, 50, 60, 30);
    const story8Text = "Earth. Dig deep. xxxx After weeks for training, its time to put my skills to face " + game.computer.avatarName + ". Tractor on!"
    game.storyText = story8Text
    render()
}

const showMatch5withEarthShiFu = () => {//Fight earth shifu
    showMatchContainer() //show with empty console
    $("#nextBtnToS9").show(); 
    render()
}

const showStory9AfterEarthBattleMoveToWater = () => {//after defeat earth, move onto water
    showStoryWithNextBtnDiv();
    $("#nextBtnToS10").show();
    resetMatch();
    const story9Text = "Now that I've mastered " + elements[3] + ", just one more element to master. Just one more. " + elements[4] + " faction, here i come!"
    game.storyText = story9Text
    render()
}

const showStory10IntroWaterBeforeBattle = () => {//intro to water before the match
    $("#header").css("background-color", "blue");
    game.faction = elements[4];
    $("#message").css("background-color", "lightskyblue");
    
    showStoryWithMatchBtnDiv();
    $("#startMatchBtn6").show();
    game.computer = createPlayer("Water Shifu", 100, 50, 50, 50, 50, 60);
    const story10Text = "Water. The flow of..... But there's no time to waste.  xxxx The last master to battle before i become a full-fledge elemental bender." + game.computer.avatarName + ", its time to go against the tide!"
    game.storyText = story10Text
    render()
}

const showMatch6withWaterShiFu = () => {//Fight water shifu
    showMatchContainer() //show with empty console
    $("#nextBtnToS11").show(); 
    render()
}

const showStory11AfterWaterBattleRest = () => {//after defeat water, learnt all 5. Rest
    showStoryWithNextBtnDiv();
    $("#nextBtnToS12").show();
    resetMatch();
    const story11Text = "mastered all 5! time to recupurate and prepare myself for the ultimate showdown!"
    game.storyText = story11Text
    render()
}

const showStory12DarkLordAppears = () => {//evil lord appears
    $("#header").css("background-color", "purple");
    game.faction = "unknown";
    $("#message").css("background-color", "rgb(248, 117, 248)");
    
    showStoryWithMatchBtnDiv();
    $("#startMatchBtn7").show();
    const story12Text = "But time waits for no man. The skies turn grey, the surrounding changed... and there in front of me stood someone with an ominious powerful presence. Could it be...? He spoke. I sensed an aura of a new ultimate bender. do you think you can overthrow me? im going to destory you before you have a chance"
    game.storyText = story12Text
    resetMatch();
    game.computer = createPlayer("Dark Lord", 100, 60, 60, 60, 60, 60);
    render()
}

const showMatch7withDarkLord = () => {//Fight water shifu
    showMatchContainer() //show with empty console
    $("#nextBtnToS13").show(); 
    render()
}

const showStory13AfterFinalShowdownWithDarkLord = () => {//after defeat evil lord
    showStoryWithNextBtnDiv();
    $("#nextBtnToEndGamePage").show();
    resetMatch();
    const story13Text = "That was a tough battle. but im glad to make it out alive. with evil lord defeated, the people celebrated. i can finally rest. Peace has return!"
    game.storyText = story13Text
    render()
}

const showEndGamePage = () => {
    $(".startContainer").hide();
    $(".matchContainer").hide();
    $(".storyContainer").hide();
    $("#btnConsoleDiv").hide();

    $(".endGameContainer").show()
}

const restartTheGame = () =>{
$(".startContainer").show();
    $("#btnConsoleDiv").hide();
    $(".matchContainer").hide();
    $(".storyContainer").hide();
    $(".endGameContainer").hide();
    enableStartGameBtn()
    $("#btnConsoleDiv").hide()
}

//set up (clicks)
const setup = () => {
    //HIDE SHOW PAGE AT THE START
    $(".startContainer").show();
    $("#btnConsoleDiv").hide();
    $(".matchContainer").hide();
    $(".storyContainer").hide();
    $(".endGameContainer").hide();
    enableStartGameBtn()
    $("#btnConsoleDiv").hide()

    //CSS AND ATTR EVENT
    $("#factionHeaderDiv").css("visibility", "hidden");
    $("#startGameBtn").attr("disabled", true);
    $("#confirmChoiceBtn").attr("disabled", true);

    //CLICK EVENT
    $("#startGameBtn").on("click", showStory0Backstory);
    $(".pOptionBtn").on("click", showPChoice);
    enableConfirmChoiceBtn();
    render();
    $("#confirmChoiceBtn").on("click", playRound);
    $("#nextRoundBtn").on("click", newRound);
    $(".rematchBtnDiv").on("click", resetMatch);

    //GETTING INTO THE MATCH
    $("#startMatchBtn1").on("click", showMatch1Easy);
    $("#startMatchBtn2").on("click", showMatch2withFireShiFu);
    $("#startMatchBtn3").on("click", showMatch3withMetalShiFu);
    $("#startMatchBtn4").on("click", showMatch4withWoodShiFu);
    $("#startMatchBtn5").on("click", showMatch5withEarthShiFu);
    $("#startMatchBtn6").on("click", showMatch6withWaterShiFu);
    $("#startMatchBtn7").on("click", showMatch7withDarkLord);

    //MOVING FROM ONE PAGE TO ANOTHER
    $("#nextBtnToS1").on("click", showStory1RealizedMissionAndInFire)
    $("#nextBtnToS2").on("click", showStory2AfterFirstMatchNowFireBattle)
    $("#nextBtnToS3").on("click", showStory3AfterFireBattleMoveToMetal)
    $("#nextBtnToS4").on("click", showStory4IntroMetalBeforeBattle)
    $("#nextBtnToS5").on("click", showStory5AfterMetalBattleMoveToWood)
    $("#nextBtnToS6").on("click", showStory6IntroWoodBeforeBattle)
    $("#nextBtnToS7").on("click", showStory7AfterWoodBattleMoveToEarth)
    $("#nextBtnToS8").on("click", showStory8IntroEarthBeforeBattle)
    $("#nextBtnToS9").on("click", showStory9AfterEarthBattleMoveToWater)
    $("#nextBtnToS10").on("click", showStory10IntroWaterBeforeBattle)
    $("#nextBtnToS11").on("click", showStory11AfterWaterBattleRest)
    $("#nextBtnToS12").on("click", showStory12DarkLordAppears)
    $("#nextBtnToS13").on("click", showStory13AfterFinalShowdownWithDarkLord)
    $("#nextBtnToEndGamePage").on("click", showEndGamePage)

    $("#returnToStartGamePage").on("click", restartTheGame)

    
};


//draw on screen
const render = () => {
    $("#storyText").text(game.storyText)
    $("#message").text(game.message)
    $("#roundNum").text(game.rounds);
    $("#factionHeader").text(game.faction)

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
    $(".matchContainer").show(); // skip the name part for now CSS
    render();
})