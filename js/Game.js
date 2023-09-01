// Export the GameObj class as the default export of this module.
export default class GameObj {
  // Constructor initializes the game state.
  constructor() {
    // Indicates whether the game is currently active.
    this.active = false
    // Player One's all-time wins.
    this.p1AllTime = 0
    // Computer Player's all-time wins.
    this.cpAllTime = 0
    // Player One's wins for the current session.
    this.p1Session = 0
    // Computer Player's wins for the current session.
    this.cpSession = 0
  }

  // Returns the current game's active status.
  getActiveStatus() {
    return this.active
  }

  // Starts a new game by setting the active status to true.
  startGame() {
    this.active = true
  }

  // Ends the current game by setting the active status to false.
  endGame() {
    this.active = false
  }

  // Returns the total number of Player One's all-time wins.
  getP1AllTime() {
    return this.p1AllTime
  }

  // Sets the total number of Player One's all-time wins.
  setP1AllTime(number) {
    this.p1AllTime = number
  }

  // Returns the total number of Computer Player's all-time wins.
  getCpAllTime() {
    return this.cpAllTime
  }

  // Sets the total number of Computer Player's all-time wins.
  setCpAllTime(number) {
    this.cpAllTime = number
  }

  // Returns the number of Player One's wins for the current session.
  getP1Session() {
    return this.p1Session
  }

  // Returns the number of Computer Player's wins for the current session.
  getCpSession() {
    return this.cpSession
  }

  // Records a win for Player One in the current session and updates all-time wins.
  p1Wins() {
    this.p1Session += 1
    this.p1AllTime += 1
  }

  // Records a win for Computer Player in the current session and updates all-time wins.
  cpWins() {
    this.cpSession += 1
    this.cpAllTime += 1
  }
}
