var errors = [];

var loggedInAccount = null;

loggedInAccount = localStorage.getItem("loggedInAccount");

var currentUserData = {
    username: "",
    email: "",
    password: "",
};
var users = [];

// Load saved users from localStorage
var savedUsers = localStorage.getItem("users");

if (savedUsers) {
    users = JSON.parse(savedUsers);
}

function handleLogin() {
    if (errors.length > 0) { return; }

    var correctInformation = false;
    var errorCodeFound = false;

    // Check credientials
    for (var i = 0; i < users.length; i++) {
        if (currentUserData.username == users[i].username || currentUserData.email == users[i].email) {
            if (currentUserData.password == users[i].password) {
                correctInformation = true;
                currentUserData.username = users[i].username;
                currentUserData.email = users[i].email;
                break;
            }
            correctInformation = false;
            break;
        }
    }

    // Check password
    if (!correctInformation) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Username, Email, or Password is incorrect.') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Username, Email, or Password is incorrect');
        }

        displayError('errorMessage', 'Username, Email, or Password is incorrect');
        return;
    }

    for (var i = 0; i < errors.length; i++) {
        if (errors[i] == 'Username, Email, or Password is incorrect') {
            errors.splice(i, 1);
        }
    }

    if (errors.length == 0) {
        disableError('errorMessage');
    } else {
        displayError('errorMessage', errors[errors.length - 1]);
    }

    loggedInAccount = currentUserData.username;

    localStorage.setItem("loggedInAccount", currentUserData.username);

    displayError('errorMessage', 'Account credentials approved!');

    window.location.href = "index.html";
}

function handleEmailOrUsername(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var errorCodeFound = false;

    if (inputBoxText == "") {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Email or Username cannot be empty') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Email or Username cannot be empty');
        }

        displayError('errorMessage', 'Email or Username cannot be empty');
        return;
    }

    for (var i = 0; i < errors.length; i++) {
        if (errors[i] == 'Email or Username cannot be empty') {
            errors.splice(i, 1);
        }
    }

    if (errors.length == 0) {
        disableError('errorMessage');
    } else {
        displayError('errorMessage', errors[errors.length - 1]);
    }

    if (emailPattern.test(inputBoxText)) {
        currentUserData.email = inputBoxText
    } else {
        currentUserData.username = inputBoxText;
    }
}

function handlePassword(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;

    var errorCodeFound = false;

    if (inputBoxText == "") {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Password cannot be empty') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Password cannot be empty');
        }

        displayError('errorMessage', 'Password cannot be empty');
        return;
    }

    for (var i = 0; i < errors.length; i++) {
        if (errors[i] == 'Password cannot be empty') {
            errors.splice(i, 1);
        }
    }

    if (errors.length == 0) {
        disableError('errorMessage');
    } else {
        displayError('errorMessage', errors[errors.length - 1]);
    }

    currentUserData.password = inputBoxText;
}

function handleSignup() {
    if (errors.length > 0) {
        return;
    }

    for (var i= 0; i < users.length; i++) {
        user = users[i];
        if (currentUserData.username == user.username) {
            displayError('errorMessage', 'Username already taken');
            return;
        }
        if (currentUserData.email == user.email) {
            displayError('errorMessage', 'Email already registered');
            return;
        }
    }

    var newUser = {
        username: currentUserData.username,
        email: currentUserData.email,
        password: currentUserData.password
    };

    users.push(newUser);
    
    localStorage.setItem("users", JSON.stringify(users));

    currentUserData.username = "";
    currentUserData.email = "";
    currentUserData.password = "";
}

function handleNewUser(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;
    var namePattern = /^[a-zA-Z0-9_]+$/;

    var errorCodeFound = false;

    if (!namePattern.test(inputBoxText)) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Username cannot contain any special characters') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Username cannot contain any special characters');
        }

        displayError('errorMessage', 'Username cannot contain any special characters');
        return;
    }

    if (inputBoxText == '') {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'emptyUsername') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('emptyUsername');
        }

        displayError('errorMessage', 'Username cannot be empty');
        return;
    }

    currentUserData.username = inputBoxText;

    for (var i = 0; i < errors.length; i++) {
        if (errors[i] == 'emptyUsername' || errors[i] == 'Username cannot contain any special characters') {
            errors.splice(i, 1);
        }
    }

    if (errors.length == 0) {
        disableError('errorMessage');
    } else {
        displayError('errorMessage', errors[0]);
    }
}

function handleNewEmail(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var errorCodeFound = false;

    if (!emailPattern.test(inputBoxText)) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Please enter a valid email address') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Please enter a valid email address');
        }

        displayError('errorMessage', 'Please enter a valid email address');
        return;
    }

    currentUserData.email = inputBoxText;

    for (var i = 0; i < errors.length; i++) {
        if (errors[i] == 'Please enter a valid email address') {
            errors.splice(i, 1);
        }
    }

    if (errors.length == 0) {
        disableError('errorMessage');
    } else {
        displayError('errorMessage', errors[errors.length - 1]);
    }
}

function handleNewPassword(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;

    var errorCodeFound = false;

    if (inputBoxText.length < 8) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Password must be at least 8 characters long') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Password must be at least 8 characters long');
        }

        displayError('errorMessage', 'Password must be at least 8 characters long');
        return;
    }

    if (/[A-Z]/.test(inputBoxText) == false) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Password must contain at least one uppercase letter') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Password must contain at least one uppercase letter');
        }

        displayError('errorMessage', 'Password must contain at least one uppercase letter');
        return;
    }

    if (/[0-9]/.test(inputBoxText) == false) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Password must contain at least one number') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Password must contain at least one number');
        }

        displayError('errorMessage', 'Password must contain at least one number');
        return;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(inputBoxText) == false) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Password must contain at least one special character') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Password must contain at least one special character');
        }

        displayError('errorMessage', 'Password must contain at least one special character');
        return;
    }

    currentUserData.password = inputBoxText;

    for (var i = 0; i < errors.length; i++) {
        if (errors[i] == 'Password must be at least 8 characters long' || errors[i] == 'Password must contain at least one uppercase letter' || errors[i] == 'Password must contain at least one number' || errors[i] == 'Password must contain at least one special character') {
            errors.splice(i, 1);
        }
    }

    if (errors.length == 0) {
        disableError('errorMessage');
    } else {
        displayError('errorMessage', errors[errors.length - 1]);
    }
}

function handleConfirmPassword(passwordBoxId, confirmBoxId) {
    var passwordText = document.getElementById(passwordBoxId).value;
    var confirmText = document.getElementById(confirmBoxId).value;

    var errorCodeFound = false;

    if (passwordText !== confirmText) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] == 'Passwords do not match') {
                errorCodeFound = true;
            }
        }

        if (!errorCodeFound) {
            errors.push('Passwords do not match');
        }

        displayError('errorMessage', 'Passwords do not match');
        return;
    }

    for (var i = 0; i < errors.length; i++) {
        if (errors[i] == 'Passwords do not match') {
            errors.splice(i, 1);
        }
    }

    if (errors.length == 0) {
        disableError('errorMessage');
    } else {
        displayError('errorMessage', errors[errors.length - 1]);
    }

    disableError('errorMessage');
}

function displayError(errorId, message) {
    var errorDiv = document.getElementById(errorId);
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

function disableError(errorId) {
    var errorDiv = document.getElementById(errorId);
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
}
