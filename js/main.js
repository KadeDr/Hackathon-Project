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

function redirectUser(link) {
    window.location.href = link;
}

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

    if (playerName === '') {
        alert('Please enter a player name');
        return;
    }

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

    currentGame.players.push({
        name: playerName,
        score: parseInt(playerScore)
    });

    var playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.innerHTML = `
    <div class="player-header">
        <div class="player-name">${playerName}</div>
        <div class="player-score">${playerScore}</div>
    </div>
    <div class="player-actions">
        <button class="btn btn-primary btn-small" onclick="addScore('${playerName}', 10, '${currentGameName}')">+10</button>
        <button class="btn btn-secondary btn-small" onclick="addScore('${playerName}', -10, '${currentGameName}')">-10</button>
        <button class="btn btn-danger btn-small" onclick="deletePlayer('${playerName}', '${currentGameName}')">Delete</button>
    </div>
    <div class="custom-score-section">
        <input type="number" class="custom-score-input" placeholder="Custom amount" id="custom-${playerName}">
        <button class="btn btn-primary btn-small" onclick="addCustomScore('${playerName}', '${currentGameName}')">Add</button>
    </div>
`;

    var playersGrid = document.getElementById('playersGrid');
    playersGrid.appendChild(playerCard);

    var gameItem = document.getElementById(currentGameName);
    if (gameItem) {
        gameItem.querySelector('p').textContent = currentGame.players.length + ' Players';
    }

    document.getElementById('playerNameInput').value = '';
    document.getElementById('playerScore').value = '0';
    disableModal('addPlayerModal');

    console.log(games);
}

var currentGame = null;

function openGame(gameName) {
    console.log("Opening game:", gameName);
    const gameDisplay = document.getElementById('gameDisplay');
    var players = []

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
            </div>
        </div>
    `;

    currentGame = gameName;

    // Render existing players
    renderPlayers(gameName, players);
}

function renderPlayers(gameName, players) {
    var playersGrid = document.getElementById('playersGrid');
    playersGrid.innerHTML = '';

    players.forEach(function (player) {
        var playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
        <div class="player-header">
            <div class="player-name">${player.name}</div>
            <div class="player-score">${player.score}</div>
        </div>
        <div class="player-actions">
            <button class="btn btn-primary btn-small" onclick="addScore('${player.name}', 10, '${gameName}')">+10</button>
            <button class="btn btn-secondary btn-small" onclick="addScore('${player.name}', -10, '${gameName}')">-10</button>
            <button class="btn btn-danger btn-small" onclick="deletePlayer('${player.name}', '${gameName}')">Delete</button>
        </div>
        <div class="custom-score-section">
            <input type="number" class="custom-score-input" placeholder="Custom amount" id="custom-${player.name}">
            <button class="btn btn-primary btn-small" onclick="addCustomScore('${player.name}', '${gameName}')">Add</button>
        </div>
        `;
        playersGrid.appendChild(playerCard);
    });
}

function deleteGame(gameID) {
    enableModal('deleteConfirmModal');
}

function confirmDelete() {
    var gameHTML = document.getElementById(currentGame)
    gameHTML.remove();

    for (var i = 0; i < games.length; i++) {
        if (games[i].name == currentGame) {
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
    value = parseInt(value);

    for (var i = 0; i < games.length; i++) {
        if (games[i].name === gameName) {
            for (var j = 0; j < games[i].players.length; j++) {
                if (games[i].players[j].name === playerName) {
                    games[i].players[j].score = games[i].players[j].score + value;

                    var playerCards = document.querySelectorAll('.player-card');
                    playerCards.forEach(function (card) {
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

function addCustomScore(playerName, gameName) {
    var customInput = document.getElementById('custom-' + playerName);
    var value = parseInt(customInput.value);

    if (isNaN(value) || value === 0) {
        return;
    }

    addScore(playerName, value, gameName);
    customInput.value = '';
}

var playerToDelete = null;

function deletePlayer(playerName, gameName) {
    playerToDelete = playerName;
    enableModal('deleteConfirmPlayerModal');
}

function confirmDeletePlayer() {
    for (var i = 0; i < games.length; i++) {
        if (games[i].name === currentGame) {
            for (var j = 0; j < games[i].players.length; j++) {
                if (games[i].players[j].name === playerToDelete) {
                    games[i].players.splice(j, 1);
                    break;
                }
            }
            break;
        }
    }

    // Re-render the game to update the display
    openGame(currentGame);
    disableModal('deleteConfirmPlayerModal');
}
