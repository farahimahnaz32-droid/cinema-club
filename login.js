
// ==========================================
// GET ELEMENTS
// ==========================================

const signInTab = document.getElementById("signInTab");
const logInTab = document.getElementById("logInTab");

const signInForm = document.getElementById("signInForm");
const logInForm = document.getElementById("logInForm");


// ==========================================
// SWITCH BETWEEN SIGN IN AND LOG IN
// ==========================================

// SIGN IN TAB

signInTab.addEventListener("click", function () {

    signInTab.classList.add("active");
    logInTab.classList.remove("active");

    signInForm.classList.add("active-form");
    logInForm.classList.remove("active-form");

});


// LOG IN TAB

logInTab.addEventListener("click", function () {

    logInTab.classList.add("active");
    signInTab.classList.remove("active");

    logInForm.classList.add("active-form");
    signInForm.classList.remove("active-form");

});


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

const passwordButtons = document.querySelectorAll(".show-password");

passwordButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const targetId = button.getAttribute("data-target");

        const passwordInput = document.getElementById(targetId);

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            button.textContent = "Hide";

        } else {

            passwordInput.type = "password";

            button.textContent = "Show";

        }

    });

});


// ==========================================
// SIGN IN FORM VALIDATION
// ==========================================

signInForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // GET INPUT VALUES

    const name = document.getElementById("signName").value.trim();

    const email = document.getElementById("signEmail").value.trim();

    const password = document.getElementById("signPassword").value;

    const confirmPassword = document.getElementById("confirmPassword").value;


    // GET ERROR ELEMENTS

    const nameError = document.getElementById("nameError");

    const emailError = document.getElementById("signEmailError");

    const passwordError = document.getElementById("signPasswordError");

    const confirmError = document.getElementById("confirmPasswordError");


    // CLEAR PREVIOUS ERRORS

    nameError.textContent = "";

    emailError.textContent = "";

    passwordError.textContent = "";

    confirmError.textContent = "";


    let valid = true;


    // NAME VALIDATION

    if (name === "") {

        nameError.textContent = "Please enter your full name.";

        valid = false;

    }


    // EMAIL VALIDATION

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        emailError.textContent = "Please enter a valid email.";

        valid = false;

    }


    // PASSWORD VALIDATION

    if (password.length < 6) {

        passwordError.textContent =
            "Password must be at least 6 characters.";

        valid = false;

    }


    // CONFIRM PASSWORD VALIDATION

    if (password !== confirmPassword) {

        confirmError.textContent = "Passwords do not match.";

        valid = false;

    }


    // REDIRECT TO HOME PAGE

    if (valid) {

        window.location.href = "home.html";

    }

});


// ==========================================
// LOG IN FORM VALIDATION
// ==========================================

logInForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // GET INPUT VALUES

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;


    // GET ERROR ELEMENTS

    const emailError = document.getElementById("loginEmailError");

    const passwordError = document.getElementById("loginPasswordError");


    // CLEAR PREVIOUS ERRORS

    emailError.textContent = "";

    passwordError.textContent = "";


    let valid = true;


    // EMAIL VALIDATION

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        emailError.textContent = "Please enter a valid email.";

        valid = false;

    }


    // PASSWORD VALIDATION

    if (password.length < 6) {

        passwordError.textContent =
            "Password must be at least 6 characters.";

        valid = false;

    }


    // REDIRECT TO HOME PAGE

    if (valid) {

        window.location.href = "home.html";

    }

});
