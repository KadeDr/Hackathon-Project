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
    if (gameName == "") {return;}
    disableModal('addGameModal');

    var gameItem = document.createElement('div');
    gameItem.className = 'game-item';
    gameItem.innerHTML = `
        <h3>${gameName}</h3>
        <p>0 Players</p>
    `;
    
    var gamesList = document.getElementById('gamesList');
    gamesList.appendChild(gameItem);

    document.getElementById(gameButton).value = "";
}