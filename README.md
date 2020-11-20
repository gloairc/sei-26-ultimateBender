# ultimateBender
Be master of all 5 elements!


## Project 1 Objectives 
- Display a game in the browser
- Game is interactive
- Include separate HTML / CSS / JavaScript files
- Use Javascript for DOM manipulation that is triggered by a browser event

## Description
The main concept of the game is Ultimate Scissor, Paper, Stone (5 options to choose from instead of 3).
User plays against the computer.
Both player and computer have Health Points (HP).
To win the game, you have to attack/ harm the Computer until it's HP is 0. (Hence there is no fix number of rounds per game) 

 Drawing inspiration from the 5 elements of Tranditional Chinese Medicine (TCM), the 5 options are Earth, Fire, Water, Air and Metal.
 Their attack/harm/heal relationship is illustrated in the diagram below:

<img src= "https://imperialcombatarts.com/uploads/3/5/3/1/35318375/2472116_orig.jpg">
Image taken from https://imperialcombatarts.com/5-elements-martial-arts--wu-xing--wu-hsing.html


For every round, there is 3 possible outcomes:
  - Tie: both choose the same element (choice) -> Neither loses nor win HP.
  - Attack: Loser loses HP, Winner's HP remains unchanged.
  - Harm/Heal: Healer loses HP (since healer hears his opponent), the same HP is transferred to the Harmer.
  
  ## MVP Features (Typical Scissors Paper Stone)
  - A game screen of fixed dimension
  - Element options for Player click to select his choice for the round.
  - Computer to randomly choice its option.
  - Javascript that picks up Player's choice and match it against Computer's choice => arrives at and outcome
  - Result screen to show outcome of the round (e.g reduce number of rounds, show 'win' and 'lose')
  
  ## Other Game Features
   - Timer: Countdown for each round
   - Health Points (HP): both Player and Computer have HP which changes throughout the game depending on the results of each round.
     - Game to end when either Player's of Computer's HP is 0.
   - Experience Point (XP): Winning a match earns Player XP -> for what? (TO BE CONCEPTUALIZED)
   - Storyline to encourage players to continue playing (TO BE CONCEPTUALIZED)
  
  
  ## Good-To-Have Extended Game Features (if there is time) 
  Basically, additional things that will make the UX/UI more engaging/attractive
   - "End Round screen": after each round, screen to show what Player and Computer choice (e.g Player choice of Water defeats Computer choice of Fire) with sound effect and nice animation/pic
