// ============================================
// GAME SCORE TRACKER - MAIN APPLICATION
// ============================================
// This file handles all game and player management functionality
// Uses arrays and nested data structures for storing game/player data
// Implements traversal algorithms to search and manipulate data

// ============================================
// DATA STRUCTURES
// ============================================

// Main games array - stores all game objects with nested player arrays
// Structure: [{name: "GameName", players: [{name: "Player", score: 0}]}]
var games = [];

// Get logged in user or default to guest account
// Guest account uses reserved name that can't be registered
var loggedInUser = localStorage.getItem("loggedInAccount") || "guest_user_no_account";

// Load games for current user from localStorage
// All user data stored in single object: {username1: [games], username2: [games]}
var allUserGames = JSON.parse(localStorage.getItem("allUserGames")) || {};
if (allUserGames[loggedInUser]) {
    games = allUserGames[loggedInUser];
}

// ============================================
// UI INITIALIZATION
// ============================================

// Get UI elements for user display
var loginElement = document.querySelector(".account-btn");
var welcomeMessageElement = document.querySelector(".custom-welcome-message");

// Update welcome message and login button based on login status
if (loggedInUser && loggedInUser !== "guest_user_no_account") {
    welcomeMessageElement.textContent = 'Welcome back, ' + loggedInUser + "!";
    loginElement.textContent = 'Sign Out';
} else {
    welcomeMessageElement.textContent = 'Welcome back!';
    loginElement.textContent = 'Login';
}

// ============================================
// INITIAL RENDER
// ============================================

// Clear games list to prevent duplicates on reload
var gamesList = document.getElementById('gamesList');
gamesList.innerHTML = '';

// TRAVERSAL: Loop through games array and render each game item
for (var i = 0; i < games.length; i++) {
    renderGameItem(games[i].name, games[i].players.length);
}

// Update stats after initial render
updateStats();

// ============================================
// SAVE FUNCTION
// ============================================

/**
 * Saves current user's games to localStorage
 * Updates the allUserGames object with current user's data
 */
function saveGames() {
    var allUserGames = JSON.parse(localStorage.getItem("allUserGames")) || {};
    allUserGames[loggedInUser] = games;
    localStorage.setItem("allUserGames", JSON.stringify(allUserGames));
}

// ============================================
// STATS UPDATE FUNCTION
// ============================================

/**
 * Updates the statistics displayed in the header
 * Calculates total games and total players across all games
 */
function updateStats() {
    // Update total games count
    document.getElementById('totalGames').textContent = games.length;
    
    // Calculate total players across all games
    var totalPlayers = 0;
    for (var i = 0; i < games.length; i++) {
        totalPlayers += games[i].players.length;
    }
    document.getElementById('totalPlayers').textContent = totalPlayers;
}

// ============================================
// EVENT LISTENERS
// ============================================

// Close modal when clicking outside of modal content
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        disableModal(e.target.id);
    }
});

// Close all active modals when Escape key is pressed
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        var modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            disableModal(modal.id);
        });
    }
});

// Submit modal form when Enter key is pressed
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

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Redirects user to specified page
 * @param {string} link - URL to redirect to
 */
function redirectUser(link) {
    window.location.href = link;
}

/**
 * Opens a modal and auto-focuses first text input
 * @param {string} modalID - ID of modal element to open
 */
function enableModal(modalID) {
    var modal = document.getElementById(modalID);
    modal.classList.add('active');

    // Auto-focus on first text input for better UX
    var inputField = modal.querySelector('input[type="text"]');
    if (inputField) {
        inputField.focus();
    }
}

/**
 * Closes a modal by removing active class
 * @param {string} modalID - ID of modal element to close
 */
function disableModal(modalID) {
    var modal = document.getElementById(modalID);
    modal.classList.remove('active');
}

// ============================================
// GAME MANAGEMENT FUNCTIONS
// ============================================

/**
 * Adds a new game to the games array
 * Validates input, checks for duplicates, and saves to localStorage
 * @param {string} gameButton - ID of input field containing game name
 */
function addGame(gameButton) {
    var gameName = document.getElementById(gameButton).value.trim();
    
    // Validate input is not empty
    if (gameName == "") { 
        return; 
    }
    
    // TRAVERSAL: Check if game with same name already exists
    var gameExists = games.find(g => g.name === gameName);
    if (gameExists) {
        alert('A game with this name already exists');
        return;
    }
    
    disableModal('addGameModal');
    
    // Add new game object to games array with empty players array
    games.push({
        name: gameName,
        players: []
    });
    
    // Clear input field
    document.getElementById(gameButton).value = "";
    
    // Save to localStorage
    saveGames();
    
    // Render the new game item in sidebar
    renderGameItem(gameName, 0);
    
    // Update stats display
    updateStats();
}

/**
 * Creates and displays a game item in the sidebar
 * @param {string} gameName - Name of the game
 * @param {number} playerCount - Number of players in the game
 */
function renderGameItem(gameName, playerCount) {
    // Create div element for game item
    var gameItem = document.createElement('div');
    gameItem.className = 'game-item';
    gameItem.id = gameName;
    gameItem.innerHTML = `
        <h3>${gameName}</h3>
        <p>${playerCount} Players</p>
    `;
    
    // Add click handler to open game when clicked
    gameItem.addEventListener('click', function () {
        openGame(gameName);
    });

    // Append to games list in sidebar
    var gamesList = document.getElementById('gamesList');
    gamesList.appendChild(gameItem);
}

/**
 * Deletes the currently selected game
 * Shows confirmation modal before deletion
 * @param {string} gameID - ID of game to delete
 */
function deleteGame(gameID) {
    enableModal('deleteConfirmModal');
}

/**
 * Confirms and executes game deletion
 * Removes from DOM, games array, and localStorage
 */
function confirmDelete() {
    // Remove game item from sidebar
    var gameHTML = document.getElementById(currentGame)
    gameHTML.remove();

    // TRAVERSAL: Find and remove game from games array
    for (var i = 0; i < games.length; i++) {
        if (games[i].name == currentGame) {
            games.splice(i, 1);
            break;
        }
    }

    // Save updated games array
    saveGames();
    
    // Update stats display
    updateStats();

    // Reset display to empty state
    document.getElementById('gameDisplay').innerHTML = `
        <div class="empty-state">
            <h2>No game selected</h2>
            <p>Select a game from the sidebar or add a new one to get started</p>
        </div>
    `;

    disableModal('deleteConfirmModal');
}

/**
 * Opens a game and displays its details and players
 * @param {string} gameName - Name of game to open
 */
function openGame(gameName) {
    console.log("Opening game:", gameName);
    const gameDisplay = document.getElementById('gameDisplay');
    var players = []

    // TRAVERSAL: Find game in games array and get its players
    for (var i = 0; i < games.length; i++) {
        if (games[i].name == gameName) {
            players = games[i].players;
            break;
        }
    }

    // Build game display HTML with header and player grid
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

    // Set current game for other functions to reference
    currentGame = gameName;
    
    // Render all players for this game
    renderPlayers(gameName, players);
}

// ============================================
// PLAYER MANAGEMENT FUNCTIONS
// ============================================

// Variable to track currently opened game
var currentGame = null;

/**
 * Adds a new player to the current game
 * Validates input, adds to game's players array, and saves to localStorage
 */
function addPlayer() {
    var playerName = document.getElementById('playerNameInput').value.trim();
    var playerScore = document.getElementById('playerScore').value;

    // Validate player name is not empty
    if (playerName === '') {
        alert('Please enter a player name');
        return;
    }

    // Get current game name from display
    var currentGameName = document.querySelector('.game-title h1').textContent;
    var currentGame = null;

    // TRAVERSAL: Find current game in games array
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

    // Add player object to game's players array
    currentGame.players.push({
        name: playerName,
        score: parseInt(playerScore)
    });

    // Save to localStorage
    saveGames();

    // Create player card element
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

    // Add player card to display
    var playersGrid = document.getElementById('playersGrid');
    playersGrid.appendChild(playerCard);

    // Update player count in sidebar
    var gameItem = document.getElementById(currentGameName);
    if (gameItem) {
        gameItem.querySelector('p').textContent = currentGame.players.length + ' Players';
    }

    // Clear input fields and close modal
    document.getElementById('playerNameInput').value = '';
    document.getElementById('playerScore').value = '0';
    disableModal('addPlayerModal');
    
    // Update stats display
    updateStats();
}

/**
 * Renders all player cards for a game
 * @param {string} gameName - Name of the game
 * @param {Array} players - Array of player objects to render
 */
function renderPlayers(gameName, players) {
    var playersGrid = document.getElementById('playersGrid');
    playersGrid.innerHTML = '';

    // TRAVERSAL: Loop through players array and create card for each
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

// Variable to store which player is being deleted (for confirmation modal)
var playerToDelete = null;

/**
 * Shows confirmation modal before deleting a player
 * @param {string} playerName - Name of player to delete
 * @param {string} gameName - Name of game player belongs to
 */
function deletePlayer(playerName, gameName) {
    playerToDelete = playerName;
    enableModal('deleteConfirmPlayerModal');
}

/**
 * Confirms and executes player deletion
 * Removes from players array and saves to localStorage
 */
function confirmDeletePlayer() {
    // NESTED TRAVERSAL: Find game, then find player within that game
    for (var i = 0; i < games.length; i++) {
        if (games[i].name === currentGame) {
            for (var j = 0; j < games[i].players.length; j++) {
                if (games[i].players[j].name === playerToDelete) {
                    // Remove player from players array
                    games[i].players.splice(j, 1);
                    break;
                }
            }
            break;
        }
    }

    // Save and refresh display
    saveGames();
    
    // Update stats display
    updateStats();
    
    openGame(currentGame);
    disableModal('deleteConfirmPlayerModal');
}

// ============================================
// SCORE MANAGEMENT FUNCTIONS
// ============================================

/**
 * Adds or subtracts from a player's score
 * @param {string} playerName - Name of player to update
 * @param {number} value - Amount to add (positive) or subtract (negative)
 * @param {string} gameName - Name of game player belongs to
 */
function addScore(playerName, value, gameName) {
    value = parseInt(value);

    // NESTED TRAVERSAL: Find game, then find player, then update score
    for (var i = 0; i < games.length; i++) {
        if (games[i].name === gameName) {
            for (var j = 0; j < games[i].players.length; j++) {
                if (games[i].players[j].name === playerName) {
                    // Update score in data structure
                    games[i].players[j].score = games[i].players[j].score + value;

                    // Save to localStorage
                    saveGames();

                    // Update score display in UI
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

/**
 * Adds a custom score amount from input field
 * @param {string} playerName - Name of player to update
 * @param {string} gameName - Name of game player belongs to
 */
function addCustomScore(playerName, gameName) {
    var customInput = document.getElementById('custom-' + playerName);
    var value = parseInt(customInput.value);

    // Validate input is a valid number
    if (isNaN(value) || value === 0) {
        return;
    }

    // Use existing addScore function
    addScore(playerName, value, gameName);
    
    // Clear input field
    customInput.value = '';
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Handles login/logout button click
 * Signs out if logged in, redirects to login if not
 * @param {string} link - URL to redirect to
 */
function loginUser(link) {
    // If user is logged in, sign them out
    if (loggedInUser && loggedInUser !== "guest_user_no_account") {
        localStorage.removeItem("loggedInAccount");
    }
    redirectUser(link);
}