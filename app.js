const game = {
    // rounds: 3,
    // message: "",
    // timer: 10,
    // life: 100,
    playerChoice: "",
    computerChoice: ""
};

const elements = ["scissors","paper","stone"] //"fire","earth","water","air","metal"

//handler
const showPChoice = (event) => { //display Player Choice
    const pChoicev = $(event.target).text();
    game.playerChoice = pChoicev
    render();
}

// const lockPChoice = () => {//TO DO -> locked down message "you chose xx"? and clicking on the elements dont work anymore
// }

const showCChoice = () => { //display C's choice
    let cChoicev = elements[Math.floor(Math.random()*elements.length)] //C random choice
   console.log(cChoicev);
    game.computerChoice = cChoicev
    render();
}

const gameLogic = ( var1, var2) => {
if 
}

//set up (clicks)
const setup = () => {
    $(".pOptionBtn").on("click", showPChoice);
    $("#confirmChoiceBtn").on("click", showCChoice) 
};

//draw on screen
const render = () => {
    $("#pChoice").text(game.playerChoice); //want to add in sound here
    $("#cChoice").text(game.computerChoice);
}

$(() => {
setup()
})