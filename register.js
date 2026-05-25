var firstName = document.getElementById("fName");
var lastName = document.getElementById("lName");
var emailInput = document.getElementById("email");
var myPass = document.getElementById("psw");
var confirmPass = document.getElementById("confirmPsw");

var firstNameError = document.getElementById("firstNameValidateError");
var lastNameError = document.getElementById("lastNameValidateError");
var emailError = document.getElementById("emailValidateError");
var passError = document.getElementById("passValidateError");
var confirmPassError = document.getElementById("confirmPassValidateError");

var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var special = document.getElementById("special");
var length = document.getElementById("length");
var container = document.getElementById("message");

var form = document.getElementById("regForm");
var formCard = document.getElementById("formCard");
var successCard = document.getElementById("successCard");
var successName = document.getElementById("successName");

var firstNamePressed = false;
var lastNamePressed = false;
var emailPressed = false;
var confirmPressed = false;

function validateFirstName() {
  firstNamePressed = true;
  firstNameError.textContent = "";
  firstName.classList.remove("input-error", "input-success");

  if (firstName.value == "") {
    firstNameError.textContent = "First name must not be empty";
    firstName.classList.add("input-error");
    return 0;
  }

  if (isFinite(firstName.value)) {
    firstNameError.textContent = "Name must be a string not a number";
    firstName.classList.add("input-error");
    return 0;
  }

  var namePattern = /^[a-zA-Z\s'\-]+$/;
  if (!firstName.value.match(namePattern)) {
    firstNameError.textContent = "Name can only contain letters";
    firstName.classList.add("input-error");
    return 0;
  }

  firstName.classList.add("input-success");
  return 1;
}

// ============================================
//  Last Name Validation
// ============================================

function validateLastName() {
  lastNamePressed = true;
  lastNameError.textContent = "";
  lastName.classList.remove("input-error", "input-success");

  if (lastName.value == "") {
    lastNameError.textContent = "Last name must not be empty";
    lastName.classList.add("input-error");
    return 0;
  }

  if (isFinite(lastName.value)) {
    lastNameError.textContent = "Name must be a string not a number";
    lastName.classList.add("input-error");
    return 0;
  }

  if (!lastName.value.match(/^[a-zA-Z\s'\-]+$/)) {
    lastNameError.textContent = "Name can only contain letters";
    lastName.classList.add("input-error");
    return 0;
  }

  lastName.classList.add("input-success");
  return 1;
}

function validateEmail() {
  emailPressed = true;
  emailError.textContent = "";
  emailInput.classList.remove("input-error", "input-success");

  if (emailInput.value == "") {
    emailError.textContent = "Email must not be empty";
    emailInput.classList.add("input-error");
    return 0;
  }

  if (!emailInput.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    emailError.textContent = "Please enter a valid email (e.g. jane@example.com)";
    emailInput.classList.add("input-error");
    return 0;
  }

  emailInput.classList.add("input-success");
  return 1;
}

function showMsg() {
  container.classList.remove("hidden");
}

function hideMsg() {
  container.classList.add("hidden");
}

function validatePass() {
  passError.textContent = "";
  myPass.classList.remove("input-error", "input-success");

  var hasLower = 0;
  var hasUpper = 0;
  var hasNumber = 0;
  var hasSpecial = 0;
  var hasLength = 0;

  if (myPass.value.match(/[a-z]/g)) {
    letter.classList.remove("text-error");
    letter.classList.add("text-success");
    letter.querySelector("span").classList.remove("bg-error");
    letter.querySelector("span").classList.add("bg-success");
    hasLower = 1;
  } else {
    letter.classList.remove("text-success");
    letter.classList.add("text-error");
    letter.querySelector("span").classList.remove("bg-success");
    letter.querySelector("span").classList.add("bg-error");
  }

  if (myPass.value.match(/[A-Z]/g)) {
    capital.classList.remove("text-error");
    capital.classList.add("text-success");
    capital.querySelector("span").classList.remove("bg-error");
    capital.querySelector("span").classList.add("bg-success");
    hasUpper = 1;
  } else {
    capital.classList.remove("text-success");
    capital.classList.add("text-error");
    capital.querySelector("span").classList.remove("bg-success");
    capital.querySelector("span").classList.add("bg-error");
  }

  if (myPass.value.match(/[0-9]/g)) {
    number.classList.remove("text-error");
    number.classList.add("text-success");
    number.querySelector("span").classList.remove("bg-error");
    number.querySelector("span").classList.add("bg-success");
    hasNumber = 1;
  } else {
    number.classList.remove("text-success");
    number.classList.add("text-error");
    number.querySelector("span").classList.remove("bg-success");
    number.querySelector("span").classList.add("bg-error");
  }

  if (myPass.value.match(/[^a-zA-Z0-9]/g)) {
    special.classList.remove("text-error");
    special.classList.add("text-success");
    special.querySelector("span").classList.remove("bg-error");
    special.querySelector("span").classList.add("bg-success");
    hasSpecial = 1;
  } else {
    special.classList.remove("text-success");
    special.classList.add("text-error");
    special.querySelector("span").classList.remove("bg-success");
    special.querySelector("span").classList.add("bg-error");
  }

  if (myPass.value.length >= 8) {
    length.classList.remove("text-error");
    length.classList.add("text-success");
    length.querySelector("span").classList.remove("bg-error");
    length.querySelector("span").classList.add("bg-success");
    hasLength = 1;
  } else {
    length.classList.remove("text-success");
    length.classList.add("text-error");
    length.querySelector("span").classList.remove("bg-success");
    length.querySelector("span").classList.add("bg-error");
  }

  if (hasLower & hasUpper & hasNumber & hasSpecial & hasLength) {
    myPass.classList.add("input-success");
    return 1;
  } else {
    if (myPass.value.length > 0) {
      passError.textContent = "Password does not meet all requirements";
      myPass.classList.add("input-error");
    }
    return 0;
  }
}

function showPass() {
  var eyeOpen = document.getElementById("eyeOpenPass");
  var eyeClosed = document.getElementById("eyeClosedPass");

  if (myPass.type === "password") {
    myPass.type = "text";
    eyeOpen.classList.add("hidden");
    eyeClosed.classList.remove("hidden");
  } else {
    myPass.type = "password";
    eyeOpen.classList.remove("hidden");
    eyeClosed.classList.add("hidden");
  }
}

function showConfirmPass() {
  var eyeOpen = document.getElementById("eyeOpenConfirm");
  var eyeClosed = document.getElementById("eyeClosedConfirm");

  if (confirmPass.type === "password") {
    confirmPass.type = "text";
    eyeOpen.classList.add("hidden");
    eyeClosed.classList.remove("hidden");
  } else {
    confirmPass.type = "password";
    eyeOpen.classList.remove("hidden");
    eyeClosed.classList.add("hidden");
  }
}

function comparePass() {
  confirmPressed = true;
  confirmPassError.textContent = "";
  confirmPass.classList.remove("input-error", "input-success");

  if (confirmPass.value == "") {
    confirmPassError.textContent = "Please confirm your password";
    confirmPass.classList.add("input-error");
    return 0;
  }

  if (myPass.value != confirmPass.value) {
    confirmPassError.textContent = "Passwords do not match!";
    confirmPass.classList.add("input-error");
    return 0;
  }

  confirmPass.classList.add("input-success");
  return 1;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var valid =
    validateFirstName() &
    validateLastName() &
    validateEmail() &
    validatePass() &
    comparePass();

  if (!valid) {
    return;
  }

  var newUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: emailInput.value,
    password: myPass.value,
    registeredAt: new Date().toISOString(),
  };

  var existingUsers = JSON.parse(localStorage.getItem("examhub_users") || "[]");
  existingUsers.push(newUser);
  localStorage.setItem("examhub_users", JSON.stringify(existingUsers));

  successName.textContent = newUser.firstName;
  formCard.classList.add("hidden");
  successCard.classList.remove("hidden");
});

function resetForm() {
  firstName.value = "";
  lastName.value = "";
  emailInput.value = "";
  myPass.value = "";
  confirmPass.value = "";

  firstNameError.textContent = "";
  lastNameError.textContent = "";
  emailError.textContent = "";
  passError.textContent = "";
  confirmPassError.textContent = "";

  firstName.classList.remove("input-error", "input-success");
  lastName.classList.remove("input-error", "input-success");
  emailInput.classList.remove("input-error", "input-success");
  myPass.classList.remove("input-error", "input-success");
  confirmPass.classList.remove("input-error", "input-success");

  firstNamePressed = false;
  lastNamePressed = false;
  emailPressed = false;
  confirmPressed = false;

  myPass.type = "password";
  confirmPass.type = "password";

  document.getElementById("eyeOpenPass").classList.remove("hidden");
  document.getElementById("eyeClosedPass").classList.add("hidden");
  document.getElementById("eyeOpenConfirm").classList.remove("hidden");
  document.getElementById("eyeClosedConfirm").classList.add("hidden");

  container.classList.add("hidden");

  var items = [letter, capital, number, special, length];
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove("text-success");
    items[i].classList.add("text-error");
    items[i].querySelector("span").classList.remove("bg-success");
    items[i].querySelector("span").classList.add("bg-error");
  }

  successCard.classList.add("hidden");
  formCard.classList.remove("hidden");
}
