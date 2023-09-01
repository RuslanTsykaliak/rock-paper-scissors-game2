import GameObj from "./Game.js"
// Import the GameObj class from the Game.js module.

const Game = new GameObj()
// Create a new instance of the GameObj class.

const initApp = () => {
  initAllTimeData()
  // Initialize all-time data from local storage.

  updateScoreBoard()
  // Update the scoreboard with the initial scores.

  listenForPlayerChoice()
  // Listen for player's choice (clicking on game images).

  listenForEnterKey()
  // Listen for the Enter key press when a game image is focused.

  listenForPlayAgain()
  // Listen for the "Play Again?" button click.

  lockComputerGameBoardHeight()
  // Lock the height of the computer's game board for smoother animations.

  document.querySelector("h1").focus()
  // Focus on the main heading for better accessibility.
}

document.addEventListener("DOMContentLoaded", initApp)
// When the DOM is fully loaded, call initApp to initialize the game.

const initAllTimeData = () => {
  // Initialize all-time data from local storage or set it to 0 if not available.
  Game.setP1AllTime(parseInt(localStorage.getItem("p1AllTime")) || 0)
  Game.setCpAllTime(parseInt(localStorage.getItem("cpAllTime")) || 0)
}

const updateScoreBoard = () => {
  // Update the scores displayed on the scoreboard.
  const p1Ats = document.getElementById("p1_all_time_score")
  p1Ats.textContent = Game.getP1AllTime()
  p1Ats.ariaLabel = `Player One has ${Game.getP1AllTime()} all time wins.`

  const cpAts = document.getElementById("cp_all_time_score")
  cpAts.textContent = Game.getCpAllTime()
  cpAts.ariaLabel = `Computer Player has ${Game.getCpAllTime()} all time wins.`

  const p1s = document.getElementById("p1_session_score")
  p1s.textContent = Game.getP1Session()
  p1s.ariaLabel = `Player One has ${Game.getP1Session()} wins this session.`

  const cps = document.getElementById("cp_session_score")
  cps.textContent = Game.getCpSession()
  cps.ariaLabel = `Computer Player has ${Game.getCpSession()} wins this session.`
}

const listenForPlayerChoice = () => {
  // Add click event listeners to player's choice images.
  const p1Images = document.querySelectorAll(
    ".playerBoard .gameboard__square img"
  )
  p1Images.forEach((img) => {
    img.addEventListener("click", (event) => {
      if (Game.getActiveStatus()) return
      // If the game is already in progress, do nothing.

      Game.startGame()
      // Start the game.

      const playerChoice = event.target.parentElement.id
      // Get the player's choice based on the clicked image's parent ID.

      updateP1Message(playerChoice)
      // Update the message for Player One's choice.

      p1Images.forEach((img) => {
        if (img === event.target) {
          img.parentElement.classList.add("selected")
        } else {
          img.parentElement.classList.add("not-selected")
        }
      })
      // Apply styling to the selected and not-selected choices.

      computerAnimationSequence(playerChoice)
      // Start the computer's choice animation sequence.
    })
  })
}

const listenForEnterKey = () => {
  // Listen for the Enter key press when a game image is focused.
  window.addEventListener("keydown", (event) => {
    if (event.code === "Enter" && event.target.tagName === "IMG") {
      event.target.click()
      // Simulate a click when Enter key is pressed on a focused image.
    }
  })
}

const listenForPlayAgain = () => {
  // Listen for the "Play Again?" button click.
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
    // Prevent the default form submission behavior.

    resetBoard()
    // Reset the game board for a new game.
  })
}

const lockComputerGameBoardHeight = () => {
  // Lock the height of the computer's game board for smoother animations.
  const cpGameBoard = document.querySelector(".computerBoard .gameboard")
  const cpGBStyles = getComputedStyle(cpGameBoard)
  const height = cpGBStyles.getPropertyValue("height")
  cpGameBoard.style.minHeight = height
}

const updateP1Message = (choice) => {
  // Update the message for Player One's choice.
  let p1msg = document.getElementById("p1msg").textContent
  p1msg += ` ${properCase(choice)}!`
  document.getElementById("p1msg").textContent = p1msg
}

// This function orchestrates the sequence of animations and actions for the computer's turn.
const computerAnimationSequence = (playerChoice) => {
  let interval = 1000
  // Define an initial interval.

  // Start animations for computer choices with different delays.
  setTimeout(() => computerChoiceAnimation("cp_rock", 1), interval)
  setTimeout(() => computerChoiceAnimation("cp_paper", 2), (interval += 500))
  setTimeout(() => computerChoiceAnimation("cp_scissors", 3), (interval += 500))

  // Trigger the countdown fade animation.
  setTimeout(() => countdownFade(), (interval += 750))

  // Perform actions after the animations and countdown.
  setTimeout(() => {
    deleteCountdown()
    finishGameFlow(playerChoice)
  }, (interval += 1000))

  // Ask the user to play again after a brief pause.
  setTimeout(() => askUserToPlayAgain(), (interval += 1000))
}

// This function animates the computer's choice by replacing the image with a number.
const computerChoiceAnimation = (elementId, number) => {
  const element = document.getElementById(elementId)
  element.firstElementChild.remove()
  const p = document.createElement("p")
  p.textContent = number
  element.appendChild(p)
}

// This function fades out the countdown numbers displayed for the computer's choice.
const countdownFade = () => {
  const countdown = document.querySelectorAll(
    ".computerBoard .gameboard__square p"
  )
  countdown.forEach((el) => {
    el.className = "fadeOut"
  })
}

// This function deletes the countdown numbers after fading them out.
const deleteCountdown = () => {
  const countdown = document.querySelectorAll(
    ".computerBoard .gameboard__square p"
  )
  countdown.forEach((el) => {
    el.remove()
  })
}

// This function manages the flow of the game after both player and computer make their choices.
const finishGameFlow = (playerChoice) => {
  const computerChoice = getComputerChoice()
  const winner = determineWinner(playerChoice, computerChoice)
  const actionMessage = buildActionMessage(winner, playerChoice, computerChoice)

  // Display the action message, update accessibility attributes, and scoreboard.
  displayActionMessage(actionMessage)
  updateAriaResult(actionMessage, winner)
  updateScoreState(winner)
  updatePersistentData(winner)
  updateScoreBoard()
  updateWinnerMessage(winner)
  displayComputerChoice(computerChoice)
}

// This function randomly selects the computer's choice (rock, paper, or scissors).
const getComputerChoice = () => {
  const randomNumber = Math.floor(Math.random() * 3)
  const rpsArray = ["rock", "paper", "scissors"]
  return rpsArray[randomNumber]
}

// This function determines the winner of the game based on player and computer choices.
const determineWinner = (player, computer) => {
  if (player === computer) return "tie"
  if (
    (player === "rock" && computer === "paper") ||
    (player === "paper" && computer === "scissors") ||
    (player === "scissors" && computer === "rock")
  )
    return "computer"
  return "player"
}

// This function builds an action message to describe the game result.
const buildActionMessage = (winner, playerChoice, computerChoice) => {
  if (winner === "tie") return "Tie game!"
  if (winner === "computer") {
    const action = getAction(computerChoice)
    return `${properCase(computerChoice)} ${action} ${properCase(
      playerChoice
    )}.`
  } else {
    const action = getAction(playerChoice)
    return `${properCase(playerChoice)} ${action} ${properCase(
      computerChoice
    )}.`
  }
}

// This function returns an action verb based on the game choice (rock, paper, or scissors).
const getAction = (choice) => {
  return choice === "rock" ? "smashes" : choice === "paper" ? "wraps" : "cuts"
}

// This function converts the first letter of a string to uppercase (proper case).
const properCase = (string) => {
  return `${string[0].toUpperCase()}${string.slice(1)}`
}

// This function displays the action message in the computer's message area.
const displayActionMessage = (actionMessage) => {
  const cpmsg = document.getElementById("cpmsg")
  cpmsg.textContent = actionMessage
}

// This function updates the accessibility result message based on the game outcome.
const updateAriaResult = (result, winner) => {
  const ariaResult = document.getElementById("playAgain")
  const winMessage =
    winner === "player"
      ? "Congratulations, you are the winner."
      : winner === "computer"
      ? "The computer is the winner."
      : ""
  ariaResult.ariaLabel = `${result} ${winMessage} Click or press enter to play again.`
}

// This function updates the internal score state based on the game outcome.
const updateScoreState = (winner) => {
  if (winner === "tie") return
  winner === "computer" ? Game.cpWins() : Game.p1Wins()
}

// This function updates the persistent data (localStorage) with the game result.
const updatePersistentData = (winner) => {
  const store = winner === "computer" ? "cpAllTime" : "p1AllTime"
  const score =
    winner === "computer" ? Game.getCpAllTime() : Game.getP1AllTime()
  localStorage.setItem(store, score)
}

// This function updates the message for Player One based on the game outcome.
const updateWinnerMessage = (winner) => {
  if (winner === "tie") return
  const message =
    winner === "computer" ? "🤖 Computer wins! 🤖" : "🏆🔥 You Win! 🔥🏆"
  const p1msg = document.getElementById("p1msg")
  p1msg.textContent = message
}

// This function displays the computer's choice by replacing the image with the chosen icon.
const displayComputerChoice = (choice) => {
  const square = document.getElementById("cp_paper")
  createGameImage(choice, square)
}

// This function asks the user to play again by showing the "Play Again?" button.
const askUserToPlayAgain = () => {
  const playAgain = document.getElementById("playAgain")
  playAgain.classList.toggle("hidden")
  playAgain.focus()
}

// This function resets the game board for a new game.
const resetBoard = () => {
  const gameSquares = document.querySelectorAll(".gameboard div")
  gameSquares.forEach((el) => {
    el.className = "gameboard__square"
  })
  const cpSquares = document.querySelectorAll(
    ".computerBoard .gameboard__square"
  )
  cpSquares.forEach((el) => {
    if (el.firstElementChild) el.firstElementChild.remove()
    if (el.id === "cp_rock") createGameImage("rock", el)
    if (el.id === "cp_paper") createGameImage("paper", el)
    if (el.id === "cp_scissors") createGameImage("scissors", el)
  })
  document.getElementById("p1msg").textContent = "Player One Chooses..."
  document.getElementById("cpmsg").textContent = "Computer Chooses..."
  const ariaResult = document.getElementById("playAgain")
  ariaResult.ariaLabel = "Player One Chooses"
  document.getElementById("p1msg").focus()
  document.getElementById("playAgain").classList.toggle("hidden")
  Game.endGame()
}

// This function creates a game image (icon) and appends it to a specified element.
const createGameImage = (icon, appendToElement) => {
  const image = document.createElement("img")
  image.src = `img/${icon}.png`
  image.alt = icon
  appendToElement.appendChild(image)
}
