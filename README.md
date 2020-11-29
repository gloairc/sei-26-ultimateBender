# ultimateBender
Be master of all 5 elements!


## Project 1 Objectives 
- Display a game in the browser
- Game is interactive
- Include separate HTML / CSS / JavaScript files
- Use Javascript for DOM manipulation that is triggered by a browser event

## Description
The main concept of the game is Ultimate Scissor, Paper, Stone (5 options to choose from instead of 3).
I got the inspiration from a website link I found when reading this article in the Project 1 instructional page under "Potential Project Ideas": http://www.thegamesjournal.com/articles/GameSystems4.shtml

However, in my game, the 5 options will be the 5 elements - Fire, Metal, Wood, Earth and Water and their attack/harm/heal relationship is illustrated in the diagram below, losely based on the 5 elements theory of Chinese Philosophy.

<img src= "https://imperialcombatarts.com/uploads/3/5/3/1/35318375/2472116_orig.jpg">
Image taken from https://imperialcombatarts.com/5-elements-martial-arts--wu-xing--wu-hsing.html

Player plays against the computer.
Both player and computer have Health Points (HP).
To win the match, Player have to attack/ harm the Computer (win consecutive rounds of Ultimate Scissor Paper Stone) until it's HP is 0. 
Another factor that comes into play is the Damaging Power of each element of the Player and Computer.

For every round in a match, there is 3 possible outcomes:
  - Tie: both choose the same element -> The Damaging Power of the Player and Computer is compared and the person will the lower Damaging Power will lose the round and loses the HP equivalent to the absolute difference between both Damaging Power. If the Damaging Power is equally matched, neither loses nor gain HP.
  - Damage: Loser loses HP, Winner's HP remains unchanged.
  - Harm/Heal: Loser (healer) loses HP, while winner (harmer) gains HP.
  
  
  ## MVP Features (Typical Ultimate Scissors Paper Stone)
  - A game screen of fixed dimension.
  - 5 element options for Player to click to select his choice for the round.
  - Computer to randomly choice its option.
  - Javascript that picks up Player's choice and match it against Computer's choice => arrives at and outcome
  - Result screen to show outcome of the round (e.g show  message of who 'win' and 'lose')
  - Next button to appear for next round of the match and number of rounds to be reflected.
  
  
  ## Other Game Features
   - Health Points (HP): both Player and Computer have HP which changes throughout the game depending on the results of each round.
     - Game to end when either Player's of Computer's HP is 0.
   - Damaging Power : Winning a match increase Player's Damaging Power of the element which the Player is in (e.g in the Fire Faction,   Fire Damaging Power will increase)
   - Overarching storyline to make the game a little more interesting.
  
  
  ## Future Game Development Plans (for own reference to work on this in future)
 - Remove the Player input name when returning to Start Page after ending the Game
 - Make Computer/ Opponenet smarter by increasing probability of them chosing the element they are stronger in more than the rest.
 - Polish up on story
 - Add in pictures in the story
 - Add in Sound effects
 - Add End Game button at each page which shows a dialouge box for Player to confirm decision to end game
 - Add Timer which starts when Player press "Start Game" and ends when player completes the game or decides to end game pre-maturely.
 - Play time captured by the Timer to be reflected in the End Game Page to show the time Player has spent on playing the game. 
 - End Game Page to show number of match played, number of rematch etc
  
 - To think of a more interesting game concept (cause essentially Player is playing Ultimate Scissor Paper Stone throughout the entire game :/) other than revealing opponent's choice and having a countdown for player to choose (game design becomes about memorising the relationship between the 5 elements).
