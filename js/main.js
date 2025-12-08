var games = [

]

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        disableModal(e.target.id);
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        var modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            disableModal(modal.id);
        });
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        var activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            var addButton = activeModal.querySelector('.btn-primary');
            if (addButton) {
                addButton.click();
            }
        }
    }
});

function enableModal(modalID) {
    var modal = document.getElementById(modalID);
    modal.classList.add('active');

    var inputField = modal.querySelector('input[type="text"]');
    if (inputField) {
        inputField.focus();
    }
}

function disableModal(modalID) {
    var modal = document.getElementById(modalID);
    modal.classList.remove('active');
}

function addGame(gameButton) {
    var gameName = document.getElementById(gameButton).value;
    if (gameName == "") { return; }
    disableModal('addGameModal');

    var gameItem = document.createElement('div');
    gameItem.className = 'game-item';
    gameItem.id = gameName;
    gameItem.innerHTML = `
        <h3>${gameName}</h3>
        <p>0 Players</p>
    `;
    gameItem.addEventListener('click', function () {
        openGame(gameName);
    });

    var gamesList = document.getElementById('gamesList');
    gamesList.appendChild(gameItem);

    games.push({
        name: gameName,
        players: []
    });

    document.getElementById(gameButton).value = "";
}

function addPlayer() {
    var playerName = document.getElementById('playerNameInput').value;
    var playerScore = document.getElementById('playerScore').value;

    console.log(playerName);

    if (playerName === '') {
        alert('Please enter a player name');
        return;
    }

    // Find the currently open game
    var currentGameName = document.querySelector('.game-title h1').textContent;
    var currentGame = null;

    for (var i = 0; i < games.length; i++) {
        if (games[i].name == currentGameName) {
            currentGame = games[i];
            break;
        }
    }

    if (!currentGame) {
        alert('No game selected');
        return;
    }

    // Add player to the game's players array
    currentGame.players.push({
        name: playerName,
        score: parseInt(playerScore)
    });

    // Create player card
    var playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.innerHTML = `
    <div class="player-header">
        <div class="player-name">${playerName}</div>
        <div class="player-score">${playerScore}</div>
    </div>
    <div class="player-actions">
        <button class="btn btn-primary btn-small" onclick="addScore('${playerName}', '10', '')">+10</button>
        <button class="btn btn-secondary btn-small">-10</button>
        <button class="btn btn-danger btn-small">Delete</button>
    </div>
    <div class="custom-score-section">
        <input type="number" class="custom-score-input" placeholder="Custom amount">
        <button class="btn btn-primary btn-small">Add</button>
    </div>
`;

    // Add to the players grid
    var playersGrid = document.getElementById('playersGrid');
    playersGrid.appendChild(playerCard);

    // Update the player count in the game item
    var gameItem = document.getElementById(currentGameName);
    if (gameItem) {
        gameItem.querySelector('p').textContent = currentGame.players.length + ' Players';
    }

    // Clear inputs and close modal
    document.getElementById('playerNameInput').value = '';
    document.getElementById('playerScore').value = '0';
    disableModal('addPlayerModal');

    console.log(games);
}

function openGame(gameName) {
    console.log("Opening game:", gameName);
    const gameDisplay = document.getElementById('gameDisplay');
    var players = []

    console.log(games);

    for (var i = 0; i < games.length; i++) {
        if (games[i].name == gameName) {
            players = games[i].players;
            break;
        }
    }

    gameDisplay.innerHTML = `
        <div class="game-header">
            <div class="game-title">
                <h1>${gameName}</h1>
                <p>${players.length} players tracking their scores</p>
            </div>
            <div class="game-actions">
                <button class="btn btn-primary" onclick="enableModal('addPlayerModal')">+ Add Player</button>
                <button class="btn btn-danger" onclick="deleteGame('${gameName}')">Delete Game</button>
            </div>
        </div>
        
        <div class="players-section">
            <h2 class="section-title">Players & Scores</h2>
            <div class="players-grid" id="playersGrid">
                <!-- Your player cards here -->
            </div>
        </div>
    `;
}

function deleteGame(gameID) {
    var confirmationModal = document.getElementById('deleteConfirmModal');
    confirmationModal.addEventListener("click", function() {
        confirmDelete(gameID);
    });

    enableModal('deleteConfirmModal');
}

function confirmDelete(gameID) {
    var gameHTML = document.getElementById(gameID)
    gameHTML.remove();

    for (var i = 0; i < games.length; i++) {
        if (games[i].name == gameID) {
            games.splice(i, 1);
            break;
        }
    }

    document.getElementById('gameDisplay').innerHTML = `
        <div class="empty-state">
            <h2>No game selected</h2>
            <p>Select a game from the sidebar or add a new one to get started</p>
        </div>
    `;

    disableModal('deleteConfirmModal');
}

function addScore(playerName, value, gameName) {
    // If value is 0, it means we need to get it from the custom input
    if (value === 0) {
        // This will be handled by a different approach - see below
        return;
    }

    // Find the game and update the player's score
    for (var i = 0; i < games.length; i++) {
        if (games[i].name === gameName) {  // ✅ Changed = to ===
            for (var j = 0; j < games[i].players.length; j++) {
                if (games[i].players[j].name === playerName) {  // ✅ Changed == to === and added .name
                    games[i].players[j].score = games[i].players[j].score + value;  // ✅ Changed == to = and .value to .score
                    
                    // Update the HTML - find the player card and update the score display
                    var playerCards = document.querySelectorAll('.player-card');
                    playerCards.forEach(function(card) {
                        var cardName = card.querySelector('.player-name').textContent;
                        if (cardName === playerName) {
                            card.querySelector('.player-score').textContent = games[i].players[j].score;
                        }
                    });
                    
                    return;
                }
            }
        }
    }
}
