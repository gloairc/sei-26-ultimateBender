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

const hideAllPWeapons = () => {
    $("#pFire").hide();
    $("#pMetal").hide();
    $("#pWood").hide();
    $("#pEarth").hide();
    $("#pWater").hide()
}

const hideAllCWeapons = () => {
    $("#cFire").hide();
    $("#cMetal").hide();
    $("#cWood").hide();
    $("#cEarth").hide();
    $("#cWater").hide()
}

const hideAllPAvatar = () => {
    $("#pNeutral").hide();
    $("#pAttack").hide();
    $("#pHappy").hide();
    $("#pSad").hide();
    $("#pBlink").hide();
}

const hideAllCAvatar = () => {
    $("#cNeutral").hide();
    $("#cAttack").hide();
    $("#cHappy").hide();
    $("#cSad").hide();
    $("#cBlink").hide();
}

const showPWeapon = () => {
    if (game.player.avatarChoice === elements[0]) {
        $("#pFire").show()
    } else if (game.player.avatarChoice === elements[1]) {
        $("#pMetal").show()
    } else if (game.player.avatarChoice === elements[2]) {
        $("#pWood").show()
    } else if (game.player.avatarChoice === elements[3]) {
        $("#pEarth").show()
    } else if (game.player.avatarChoice === elements[4]) {
        $("#pWater").show()
    }
}

const showCWeapon = () => {
    if (game.computer.avatarChoice === elements[0]) {
        $("#cFire").show()
    } else if (game.computer.avatarChoice === elements[1]) {
        $("#cMetal").show()
    } else if (game.computer.avatarChoice === elements[2]) {
        $("#cWood").show()
    } else if (game.computer.avatarChoice === elements[3]) {
        $("#cEarth").show()
    } else if (game.computer.avatarChoice === elements[4]) {
        $("#cWater").show()
    }
}

const showPChoice = (event) => { //display Player Choice
    const pChoicev = $(event.currentTarget).attr("id")
    game.player.avatarChoice = pChoicev;
    hideAllPWeapons();
    hideAllPAvatar();
    $("#pAttack").show();
    showPWeapon();
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

    hideAllCWeapons();
    hideAllCAvatar();
    $("#cAttack").show();
    showCWeapon();
}

const updatePlayerDamagingPower = () => {//update faction power by +5
    game.player.avatarDamagingPower[game.faction] += 10
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
        hideAllPAvatar();
        $("#pHappy").show();
        hideAllCAvatar();
        $("#cSad").show()
    } else if (computerPower > playerPower) {
        game.player.avatarHp = game.player.avatarHp - diffInPower
        game.message = "Both of you chose " + playerChoice + ". But " + game.computer.avatarName + "'s" + playerChoice + " power is stronger and inflicted some damange on you.";
        if (game.player.avatarHp <= 0) {
            game.player.avatarHp = 0
        }
        hideAllPAvatar();
        $("#pSad").show();
        hideAllCAvatar();
        $("#cHappy").show()
    } else {
        game.message = "It's a tie! Both of your " + playerChoice + " power are equally matched!"
        hideAllPAvatar();
        $("#pNeutral").show();
        hideAllCAvatar();
        $("#cNeutral").show()
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
        console.log("player being damaged, player chose " + playerChoice + ", computer chose " + computerChoice);
        game.message = "You lost the round. You suffered damange by your opponent."
        hideAllPAvatar();
        $("#pSad").show();
        hideAllCAvatar();
        $("#cHappy").show()
    } else if (destroyPair[playerChoice][computerChoice] === "destroys") {
        damageIncurredToComputer()
        game.message = "You won the round. You caused damaged to your opponent.";
        hideAllPAvatar();
        $("#pHappy").show();
        hideAllCAvatar();
        $("#cSad").show()
        console.log("Computer being damaged, player chose " + playerChoice + ", computer chose " + computerChoice);
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
        game.message = "You won the round. You hurt your opponent and got healed in return.";
        console.log("player hurt opponent and got healed, player chose " + playerChoice + ", computer chose " + computerChoice)
        hideAllPAvatar();
        $("#pHappy").show();
        hideAllCAvatar();
        $("#cSad").show()
    } else if (weakenHealPair[playerChoice][computerChoice] === "heals") {
        weakenPlayer();
        healComputer();
        game.message = "You lost the round. Your opponent hurt you and was healed in return.";
        console.log("opponent hurt player and got healed, player chose " + playerChoice + ", computer chose " + computerChoice)
        hideAllPAvatar();
        $("#pSad").show();
        hideAllCAvatar();
        $("#cHappy").show()
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
    $("#pHealthBar").css("width", game.player.avatarHp + "%");
    $("#cHealthBar").css("width", game.computer.avatarHp + "%");
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
    $("#pChoiceWeaponDiv").addClass("horizTranslate")
    $("#cChoiceWeaponDiv").addClass("horizTranslate")
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
    hideAllPAvatar()
    $("#pNeutral").show()
    hideAllPWeapons()
    hideAllCAvatar()
    $("#cNeutral").show()
    hideAllCWeapons()
    $("#pChoiceWeaponDiv").removeClass("horizTranslate")
    $("#cChoiceWeaponDiv").removeClass("horizTranslate")
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
        game.message = "You lost the round and have been defeated. But do not worry. Success doesn’t always come easily and we have to learn from our mistakes. Let us try again.";
        disableOptAndConfirmBtn();
        hideAllPAvatar();
        $("#pBlink").show();
        hideAllCAvatar();
        $("#cHappy").show()
        $(".nextRoundBtnDiv").hide()
        $(".rematchBtnDiv").show();

    } else if (game.computer.avatarHp === 0) {//player wins!
        game.message = "You won the round and defeated your opponent. Congratulations! You also improved your " + game.faction + " power by 10xp";
        updatePlayerDamagingPower();
        disableOptAndConfirmBtn();
        hideAllPAvatar();
        $("#pHappy").show();
        hideAllCAvatar();
        $("#cBlink").show()
        $(".nextRoundBtnDiv").hide()
        $(".nextBtnsDiv").show();
        // game.storyText = "and the adventure continues"
    }
}

const resetMatch = () => {//hp 100, round 1
    hideAllPAvatar()
    $("#pNeutral").show()
    hideAllPWeapons()
    hideAllCAvatar()
    $("#cNeutral").show()
    hideAllCWeapons()
    $("#pChoiceWeaponDiv").removeClass("horizTranslate")
    $("#cChoiceWeaponDiv").removeClass("horizTranslate")
    game.message = "Time for battle!"
    game.player.avatarHp = 100;
    game.computer.avatarHp = 100;
    game.player.avatarChoice = "To be decided";
    game.computer.avatarChoice = "To be decided";
    game.rounds = 1;
    $("#pHealthBar").css("width", game.player.avatarHp + "%");
    $("#cHealthBar").css("width", game.computer.avatarHp + "%");
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
    const story0Text = "This is the world of the 5 elements: Fire, Metal, Wood, Earth and Water. Most people are born with an aptitude for one element, but a rare few are blessed with more. The rarest of them all are the ones who possess all 5, and those who have successfully bended all 5 are called the Ultimate Bender, the strongest of the strongest."
+ " But the recent years have taken a dark turn when the only known Ultimate Bender alive at this moment has turned to the dark side, and has brought about calamity and oppression to this world. Many high - level benders are desperate to train and fight against him, but none prevailed."
 +
" Every year, children are brought to the faction leaders to check their aptitudes, and can choose the faction of the element that they have an aptitude for to bend their element. This year, your parents decided that it was time to check your aptitude."
+ 
" Your parents bring you to the Fire faction leader, the faction closest to your home. Dozens of children were queuing up for their turn with their parents, and you are one of them."
+
" Finally, it was your turn."
+
" You approach the Fire faction leader, Fire shifu, nervous, but excited.He greets you, gives a warm smile, and places his hand on your head before closing his eyes."
+
" Suddenly, his eyes flew open, his face alight."
+
" Fire shifu: Congratulations child! You seem to have good aptitude for all 5 elements, a miracle! As someone who possesses has the possibility to bend the 5 elements, you have a chance to defeat the dark one. Are you willing to live up to your calling?";
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

    game.computer = createPlayer("Zuko", 100, 40, 30, 30, 30, 30);
    updatePlayerName();
    const story1Text = "You: I will try. Fire shifu: Great. Come back tomorrow and we shall begin your first lesson on the Wood element!"
    + "Feeling a little shocked, you bid the Fire shifu farewell and went home with your parents."
    
    + "The next day, you woke up bright and early to meet Fire shifu."
    + "Fire shifu: Good morning" + game.player.avatarname +
    "Before I  teach you on the ways of the Fire faction so you can bend your Fire element, let us review the relationship between the 5 elements. Study the image below. There is 2 cycles which balances all the 5 elements - the overacting cycle (where one element overwhelms or dominates the other) and the weaken-heal cycle (where one element strengthens or heals the other elements while it is being weakened). Having this knowledge is crucial in your preparation to become the Ultimate Bender as whether you win or lose a battle hinges on how well-versed you are with this. Analyze your opponent’s stance to determine the element he’s using and counterattack with an element which dominates or weaken it."
    
    + "Once you have studied the relationship, we may begin our first lesson, a battle with one of my disciple, Zuko."
    game.storyText = story1Text; 
    $("#cycleImg").show()
    resetMatch();
    render()
}

const showMatch1Easy = () => {//show match screen for Round 1
    showMatchContainer() //show with empty console
    game.computer = createPlayer("Zuko", 100, 40, 30, 30, 30, 30);
    $("#nextBtnToS2").show()
    render()
}

const showStory2AfterFirstMatchNowFireBattle = () => {//before fighting fire shifu
    showStoryWithMatchBtnDiv();
    $("#startMatchBtn2").show();
    resetMatch();
    $("#cycleImg").hide()
    game.computer = createPlayer("Fire Shifu", 100, 80, 50, 50, 50, 30);
    const story2Text = "First match wasnt that bad. After training under Fire Shifu and his disciple, it was time for my first battle with " + game.computer.avatarName + ". Turn up the heat!"
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
    const story3Text = "Congratulations " + game.player.avatarName + ", you have successfully bended your Fire element! I am very proud of you. Now, you have to go to the next shifu, Metal shifu, to bend your metal element. I wish you all the best and hope to see you at the final battle." 
+    "This is a teleportation stone. You just have to say out the name of the person you wish to teleport to and you will teleport there."
    +"*Hands stone over"
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
    const story4Text = "Hello " + game.player.avatarName + " , I am the Metal shifu. Metal element is about harvesting and collecting, learning how to take things and make use of them. I will now teach you how to bend the metal element."
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
    const story6Text = "Wood Faction. Well, all things woody. As expected, forested area. Wood Shifu told me that Wood element is about Growth and Vitality, Strength and Flexibility. After weeks for training, its time to put my skills to face " + game.computer.avatarName + ". Ready to be an Axe-men!"
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
    const story7Text = "Now that I've mastered " + elements[2] + ", i'm halfway to becoming the Ultimate Bender to defeat the dark lord. It's not easy, but i'm going to persevere on! Moving onto " + elements[3] + "."
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
    const story8Text = "Earth shifu: Welcome to the Earth faction. Wood shifu has told me about you. The Earth element is about fruition, making your actions have effects… Why not we have a battle to see how much you've learnt."
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
    const story10Text = "Water shifu: Welcome " + game.player.avatarName + " , I am Water shifu. The water element is about being still, and know when to retreat and recuperate. Let us begin the lesson..."
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
    const story11Text = "Congratulations, you have successfully bended the water element. Now, you have control of all 5 of your elements and are ready to face the dark lord. I wish you all the best."
   +"After saying your thanks and goodbyes, you left the Water faction and started to walk home. You've wanted some time to recupurate and prepare myself for the ultimate showdown."
    game.storyText = story11Text
    render()
}

const showStory12DarkLordAppears = () => {//dark lord appears
    $("#header").css("background-color", "purple");
    game.faction = "unknown";
    $("#message").css("background-color", "rgb(248, 117, 248)");

    showStoryWithMatchBtnDiv();
    $("#startMatchBtn7").show();
    const story12Text = "But time waits for no man. The skies turn grey, the surrounding changed... and there in front of me stood someone with an ominious powerful presence. Could it be...? He spoke. I sensed a growing aura of a new ultimate bender. Do you think you can overthrow me? I'm going to elimate you before you have a chance."
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

const showStory13AfterFinalShowdownWithDarkLord = () => {//after defeat dark lord
    showStoryWithNextBtnDiv();
    $("#nextBtnToEndGamePage").show();
    resetMatch();
    const story13Text = "Dark Lord: Noo! I am losing my bending power! How could I have lost?! The 5 shifus suddenly appear. Fire shifu: Congratulations " + game.player.avatarName + ", you have defeated the dark one! Thank you very much! Don’t worry, he has lost almost all his bending abilities, and his core has been destroyed and will no longer be able to attain the power he once had. The other shifus and I will take it from here. Rest well child!";
    game.storyText = story13Text
    render()
}

const showEndGamePage = () => {
    $(".startContainer").hide();
    $(".matchContainer").hide();
    $(".storyContainer").hide();
    $("#btnConsoleDiv").hide();

    $(".endGameContainer").show()
    $("#inputName").val() = ""
    render();
}

const restartTheGame = () => {
    $(".startContainer").show();
    $("#btnConsoleDiv").hide();
    $(".matchContainer").hide();
    $(".storyContainer").hide();
    $(".endGameContainer").hide();
    enableStartGameBtn()
    $("#btnConsoleDiv").hide()

    $("#header").css("background-color", "black");
    game.faction = elements[0];
    $("#factionHeaderDiv").css("visibility", "hidden");
    $("#message").css("background-color", " rgb(247, 108, 247)");
    game.player = createPlayer("", 100, 30, 30, 30, 30, 30);
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
    $("#cycleImg").hide()

    //CSS AND ATTR EVENT
    $("#factionHeaderDiv").css("visibility", "hidden");
    $("#startGameBtn").attr("disabled", true);
    $("#confirmChoiceBtn").attr("disabled", true);

    //AVATARS
    hideAllPAvatar();
    $("#pNeutral").show();
    hideAllCAvatar();
    $("#cNeutral").show();

    //WEAPON
    hideAllPWeapons(); //does not hide the div, hide the weapons
    hideAllCWeapons();

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
    // $(".matchContainer").show(); // skip the name part for now CSS
    render();
})