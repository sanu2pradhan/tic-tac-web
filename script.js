document.addEventListener("DOMContentLoaded", () => {
    let boxes = document.querySelectorAll(".box");
    let resetBtn = document.querySelector("#reset-btn");
    let newGameBtn = document.querySelector("#new-game-btn");
    let msgContainer = document.querySelector("#popup");
    let msg = document.querySelector("#popup-message");
    let playerScoreDisplay = document.querySelector("#player-score");
    let opponentScoreDisplay = document.querySelector("#opponent-score");
    let playerInput = document.querySelector("#player-name");
    let player2InputField = document.querySelector("#player2-name");
    let player2Input = document.querySelector("#player2-input");
    let startGameBtn = document.querySelector("#start-game");
    let mainGame = document.querySelector("main");
    let popupClose = document.querySelector("#popup-close");
    let modeSelection = document.querySelector(".mode-selection");
    let playerModeBtn = document.querySelector("#player-mode");
    let computerModeBtn = document.querySelector("#computer-mode");
    let changeModeBtn = document.querySelector("#change-mode");

    let player1Name = "Player 1";
    let player2Name = "Computer";
    let player1Wins = 0;
    let player2Wins = 0;
    let turnO = true;
    let gameMode = "computer";

    const winPatterns = [
        [0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7],
        [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]
    ];

    playerModeBtn.addEventListener("click", () => selectMode("player"));
    computerModeBtn.addEventListener("click", () => selectMode("computer"));
    changeModeBtn.addEventListener("click", toggleMode);

    function selectMode(mode) {
        gameMode = mode;
        modeSelection.classList.add("hide");
        document.querySelector(".player-input").classList.remove("hide");
        player2Input.classList.toggle("hide", mode === "computer");
    }

    startGameBtn.addEventListener("click", () => {
        player1Name = playerInput.value.trim() || "Player 1";
        player2Name = gameMode === "player" ? (player2InputField.value.trim() || "Player 2") : "Computer";

        playerScoreDisplay.innerText = `${player1Name}: 0`;
        opponentScoreDisplay.innerText = `${player2Name}: 0`;

        mainGame.classList.remove("hide");
        document.querySelector(".player-input").classList.add("hide");
    });

    function toggleMode() {
        gameMode = gameMode === "computer" ? "player" : "computer";
    
        // Show/hide player input fields
        player2Input.classList.toggle("hide", gameMode === "computer");
        
        // Reset player names
        player1Name = "Player 1";
        player2Name = gameMode === "computer" ? "Computer" : "Player 2";
        playerInput.value = "";
        player2InputField.value = "";
    
        // Reset the scoreboard
        player1Wins = 0;
        player2Wins = 0;
        playerScoreDisplay.innerText = `${player1Name}: 0`;
        opponentScoreDisplay.innerText = `${player2Name}: 0`;
    
        // Reset the board
        resetBoard();
    
        // Show mode selection screen again
        modeSelection.classList.remove("hide");
        mainGame.classList.add("hide");
    
        alert(`Switched to ${gameMode === "computer" ? "Play with Computer" : "Play with Friend"}`);
    }
    

    function resetBoard() {
        turnO = true;
        boxes.forEach(box => {
            box.innerText = "";
            box.disabled = false;
        });
        msgContainer.classList.add("hide");
    }

    boxes.forEach((box) => {
        box.addEventListener("click", () => {
            if (box.innerText === "" && turnO) {
                box.innerText = "O";
                box.disabled = true;
                turnO = false;
                checkWinner();
                if (!turnO && gameMode === "computer") {
                    setTimeout(computerMove, 1500);
                }
            } else if (box.innerText === "" && gameMode === "player") {
                box.innerText = turnO ? "O" : "X";
                box.disabled = true;
                turnO = !turnO;
                checkWinner();
            }
        });
    });

    function computerMove() {
        let availableBoxes = [...boxes].filter(box => box.innerText === "");
        if (availableBoxes.length === 0) return;
        
        let randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
        randomBox.innerText = "X";
        randomBox.disabled = true;
        turnO = true;
        checkWinner();
    }

    function checkWinner() {
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
                let winner = boxes[a].innerText === "O" ? player1Name : player2Name;
    
                // Ensure popup is visible
                msg.innerText = `${winner} Wins! 🎉`;
                msgContainer.classList.add("show"); // Fix applied
    
                // Update scores
                if (winner === player1Name) {
                    player1Wins++;
                    playerScoreDisplay.innerText = `${player1Name}: ${player1Wins}`;
                } else {
                    player2Wins++;
                    opponentScoreDisplay.innerText = `${player2Name}: ${player2Wins}`;
                }
    
                // Disable all boxes
                boxes.forEach(box => box.disabled = true);
                return; // Stop further execution
            }
        }
    
        // Check for a draw
        if ([...boxes].every(box => box.innerText !== "")) {
            msg.innerText = "It's a Draw! 🤝";
            msgContainer.classList.add("show");
            boxes.forEach(box => box.disabled = true);
        }
    }
    
    // Close popup properly
    popupClose.addEventListener("click", () => {
        msgContainer.classList.remove("show");
        resetBoard();
    });
    
    
    

    popupClose.addEventListener("click", resetBoard);
    resetBtn.addEventListener("click", resetBoard);
    newGameBtn.addEventListener("click", resetBoard);
});
