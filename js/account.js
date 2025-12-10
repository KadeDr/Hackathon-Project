// ============================================
// AUTHENTICATION SYSTEM
// ============================================
// This file handles user signup, login, and validation
// Uses localStorage to persist user accounts
// Implements form validation with real-time error messages

// ============================================
// DATA STRUCTURES
// ============================================

// Array to store validation errors
var errors = [];

// Variable to track logged in account
var loggedInAccount = null;

// Get logged in account from localStorage
loggedInAccount = localStorage.getItem("loggedInAccount");

// Object to store current user's input data
var currentUserData = {
    username: "",
    email: "",
    password: "",
};

// Array to store all registered users
var users = [];

// Load saved users from localStorage
var savedUsers = localStorage.getItem("users");

if (savedUsers) {
    users = JSON.parse(savedUsers);
}

// ============================================
// LOGIN FUNCTION
// ============================================

/**
 * Handles user login
 * Validates credentials against stored users in localStorage
 */
function handleLogin() {
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

    if (errors.length > 0) { return; }

    var correctInformation = false;
    var errorCodeFound = false;

    // TRAVERSAL: Check credentials against all users
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

    // Check if credentials are correct
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

    loggedInAccount = currentUserData.username;

    // Save logged in account to localStorage
    localStorage.setItem("loggedInAccount", currentUserData.username);

    displayError('errorMessage', 'Account credentials approved!');

    // Redirect to main page
    window.location.href = "index.html";
}


// ============================================
// REDIRECT FUNCTION
// ============================================

/**
 * Redirects user to specified link
 * @param {string} link - URL to redirect to
 */
function redirectUser(link) {
    window.location.href = link;
}

// ============================================
// LOGIN INPUT VALIDATION
// ============================================

/**
 * Validates email or username input on login page
 * Determines if input is email or username based on format
 * @param {string} inputBoxId - ID of input field
 */
function handleEmailOrUsername(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var errorCodeFound = false;

    // Check if input is empty
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

    // Remove error if input is valid
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

    // Determine if input is email or username
    if (emailPattern.test(inputBoxText)) {
        currentUserData.email = inputBoxText
    } else {
        currentUserData.username = inputBoxText;
    }
}

/**
 * Validates password input on login page
 * @param {string} inputBoxId - ID of password input field
 */
function handlePassword(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;

    var errorCodeFound = false;

    // Check if password is empty
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

    // Remove error if password is valid
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

// ============================================
// SIGNUP FUNCTION
// ============================================

/**
 * Handles user signup
 * Checks for duplicate users and creates new account
 */
function handleSignup() {
    if (errors.length > 0) {
        return;
    }

    // TRAVERSAL: Check if username or email already exists
    for (var i = 0; i < users.length; i++) {
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

    // Create new user object
    var newUser = {
        username: currentUserData.username,
        email: currentUserData.email,
        password: currentUserData.password
    };

    // Add user to users array
    users.push(newUser);

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Clear current user data
    currentUserData.username = "";
    currentUserData.email = "";
    currentUserData.password = "";
}

// ============================================
// SIGNUP INPUT VALIDATION
// ============================================

/**
 * Validates username input on signup page
 * Checks for special characters and empty input
 * @param {string} inputBoxId - ID of username input field
 */
function handleNewUser(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;
    // Pattern allows only letters, numbers, and underscores
    var namePattern = /^[a-zA-Z0-9_]+$/;

    var errorCodeFound = false;

    // Check for special characters
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

    // Check if username is empty
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

    // Remove username errors if valid
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

/**
 * Validates email input on signup page
 * Checks for proper email format
 * @param {string} inputBoxId - ID of email input field
 */
function handleNewEmail(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;
    // Pattern checks for valid email format
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var errorCodeFound = false;

    // Check if email format is valid
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

    // Remove email error if valid
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

/**
 * Validates password input on signup page
 * Checks for minimum length, uppercase, number, and special character
 * @param {string} inputBoxId - ID of password input field
 */
function handleNewPassword(inputBoxId) {
    var inputBoxText = document.getElementById(inputBoxId).value;

    var errorCodeFound = false;

    // Check minimum length
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

    // Check for uppercase letter
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

    // Check for number
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

    // Check for special character
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

    // Remove password errors if valid
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

/**
 * Validates that password and confirm password match
 * @param {string} passwordBoxId - ID of password input field
 * @param {string} confirmBoxId - ID of confirm password input field
 */
function handleConfirmPassword(passwordBoxId, confirmBoxId) {
    var passwordText = document.getElementById(passwordBoxId).value;
    var confirmText = document.getElementById(confirmBoxId).value;

    var errorCodeFound = false;

    // Check if passwords match
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

    // Remove password mismatch error if they match
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

// ============================================
// ERROR DISPLAY FUNCTIONS
// ============================================

/**
 * Displays an error message to the user
 * @param {string} errorId - ID of error message div
 * @param {string} message - Error message to display
 */
function displayError(errorId, message) {
    var errorDiv = document.getElementById(errorId);
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

/**
 * Hides the error message div
 * @param {string} errorId - ID of error message div
 */
function disableError(errorId) {
    var errorDiv = document.getElementById(errorId);
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

/**
 * Toggles password visibility between hidden and visible
 * Changes input type between 'password' and 'text'
 * @param {string} inputId - ID of password input field to toggle
 */
function togglePassword(inputId) {
    var passwordInput = document.getElementById(inputId);

    // Toggle between password and text type
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}