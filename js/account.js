var errors = [];

function handleLogin() {

}

function handleSignup() {
    if (errors.length > 0) {
        return;
    }
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

    for (var i = 0; i < errors.length; i++) {
        if (errors[i] == 'emptyUsername' || errors[i] == 'Username cannot contain any special characters') {
            errors.splice(i, 1);
        }
    }

    console.log(errors);

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