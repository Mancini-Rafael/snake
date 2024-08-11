$(document).ready(function () {
  const config = {
    initialSpeed: 100,
    speed: 100,
    sizex: 50,
    sizey: 30,
    threshold: -80,
    directions: {
      37: "left",
      38: "up",
      39: "right",
      40: "down",
    },
  };

  let gameState = {
    snakeBody: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
    ],
    snakeHead: [0, 5],
    direction: "right",
    score: 0,
    lastKeyPressTime: 0,
    fruitCell: [],
  };

  const $welcomeScreen = $("#welcomeScreen");
  const $gameBoard = $("#gameBoard");
  const $infoScore = $("#infoScore");

  $welcomeScreen.click(startGame);

  $(document).on("keydown", (event) => changeDirection(event.keyCode));

  function startGame() {
    $welcomeScreen.hide("slow");
    $gameBoard.show("slow");
    $infoScore.show("slow");
    initializeGame();
  }

  function initializeGame() {
    gameState = {
      ...gameState,
      score: 0,
      direction: "right",
      speed: config.initialSpeed,
    };
    gameState.snakeBody = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
    ];
    gameState.snakeHead = [0, 5];
    $infoScore.html("Your Score: " + gameState.score);
    renderBoard();
    generateFruit();
    renderSnake();
    startAnimation();
  }

  function startAnimation() {
    gameState.timer = setInterval(animateSnake, config.speed);
  }

  function resetGame() {
    clearInterval(gameState.timer);
    initializeGame();
  }

  function generateFruit() {
    let fruitPosition;
    do {
      fruitPosition = [
        Math.floor(Math.random() * config.sizey),
        Math.floor(Math.random() * config.sizex),
      ];
    } while (isCellOccupied(fruitPosition));

    gameState.fruitCell = fruitPosition;
    renderFruit();
  }

  function renderFruit() {
    $("td").removeClass("fruitCell");
    getCell(gameState.fruitCell).addClass("fruitCell");
  }

  function renderSnake() {
    $("td").removeClass("snakeBody snakeHead");
    gameState.snakeBody.forEach((cell) => getCell(cell).addClass("snakeBody"));
    getCell(gameState.snakeHead).addClass("snakeHead");
  }

  function renderBoard() {
    const rowsHtml = Array.from(
      { length: config.sizey },
      () =>
        "<tr>" +
        Array(config.sizex).fill('<td class="boardCell"> </td>').join("") +
        "</tr>"
    ).join("\n");
    $gameBoard.html('<table id="gridMovement">' + rowsHtml + "</table>");
    generateFruit();
  }

  function changeDirection(keyCode) {
    const currentTime = Date.now();
    if (currentTime - gameState.lastKeyPressTime < config.threshold) return;

    const newDirection = config.directions[keyCode];
    if (newDirection && isValidDirectionChange(newDirection)) {
      gameState.direction = newDirection;
      gameState.lastKeyPressTime = currentTime;
    }
  }

  function isValidDirectionChange(newDirection) {
    return !(
      (gameState.direction === "left" && newDirection === "right") ||
      (gameState.direction === "right" && newDirection === "left") ||
      (gameState.direction === "up" && newDirection === "down") ||
      (gameState.direction === "down" && newDirection === "up")
    );
  }

  function animateSnake() {
    // Calculate the new head position
    const nextHead = getNextHeadPosition();

    // Check for collisions with walls or self
    if (isCollision(nextHead)) {
      resetGame();
      return;
    }

    // Track the current tail (last segment) before moving
    const previousTail = gameState.snakeBody[gameState.snakeBody.length - 1];

    // Move the snake: Shift the body and update the head
    gameState.snakeBody.pop(); // Remove the tail segment
    gameState.snakeBody.unshift(nextHead); // Add the new head position
    gameState.snakeHead = nextHead;

    // If the snake eats the fruit, add a new segment to the body
    if (arraysEqual(nextHead, gameState.fruitCell)) {
      gameState.snakeBody.push(previousTail); // Add the previous tail back as a new segment
      generateFruit();
      updateScore();
      adjustSpeed();
    }

    // Clear the previous tail cell (remove the snakeBody class)
    getCell(previousTail).removeClass("snakeBody");

    // Render the snake in the new position
    renderSnake();
  }

  function getNextHeadPosition() {
    const [row, col] = gameState.snakeHead;
    switch (gameState.direction) {
      case "right":
        return [row, col + 1];
      case "left":
        return [row, col - 1];
      case "up":
        return [row - 1, col];
      case "down":
        return [row + 1, col];
    }
  }

  function isCollision(position) {
    const [row, col] = position;
    return (
      row < 0 ||
      col < 0 ||
      row >= config.sizey ||
      col >= config.sizex ||
      isCellOccupied(position)
    );
  }

  function isCellOccupied(position) {
    return gameState.snakeBody.some(
      (segment) => segment[0] === position[0] && segment[1] === position[1]
    );
  }

  function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  function updateScore() {
    gameState.score += 100;
    $infoScore.html("Your Score: " + gameState.score);
  }

  function adjustSpeed() {
    if (gameState.speed > 5) {
      gameState.speed -= 1;
      clearInterval(gameState.timer);
      startAnimation();
    }
  }

  function getCell([row, col]) {
    return $("tr").eq(row).find("td").eq(col);
  }
});
