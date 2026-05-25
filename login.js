if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.replace("home.html");
}

var myForm = document.getElementById("login");
var myEmail = document.getElementById("Email");
var myPassword = document.getElementById("Password");
var togglePasswordBtn = document.getElementById("togglePassword");
var eyeIcon = document.getElementById("eyeIcon");
var eyeOffIcon = document.getElementById("eyeOffIcon");

togglePasswordBtn.addEventListener("click", function (e) {
  e.preventDefault();

  var type = myPassword.getAttribute("type");
  if (type === "password") {
    myPassword.setAttribute("type", "text");
    eyeOffIcon.classList.add("hidden");
    eyeIcon.classList.remove("hidden");
  } else {
    myPassword.setAttribute("type", "password");
    eyeOffIcon.classList.remove("hidden");
    eyeIcon.classList.add("hidden");
  }
});

myEmail.addEventListener("input", function () {
  document.getElementById("emailError").innerHTML = "";
  myEmail.classList.remove("input-error", "input-success");
});

myPassword.addEventListener("input", function () {
  document.getElementById("passwordError").innerHTML = "";
  myPassword.classList.remove("input-error", "input-success");
});

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  var emailValue = myEmail.value;
  var passwordValue = myPassword.value;
  var hasError = false;

  document.getElementById("emailError").innerText = "";
  document.getElementById("passwordError").innerText = "";
  myEmail.classList.remove("input-error");
  myPassword.classList.remove("input-error");

  var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailValue.match(emailRegex)) {
    document.getElementById("emailError").innerText = "Invalid email format";
    myEmail.classList.add("input-error");
    hasError = true;
  }

  if (passwordValue === "") {
    document.getElementById("passwordError").innerText = "Password is required";
    myPassword.classList.add("input-error");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  var usersJSON = localStorage.getItem("examhub_users");

  if (!usersJSON) {
    document.getElementById("emailError").innerText =
      "No account found. Please sign up first.";
    myEmail.classList.add("input-error");
    return;
  }

  var users = JSON.parse(usersJSON);
  var foundUser = null;

  for (var i = 0; i < users.length; i++) {
    if (users[i].email === emailValue) {
      foundUser = users[i];
      break;
    }
  }

  if (!foundUser) {
    document.getElementById("emailError").innerText =
      "Email not found. Please sign up first.";
    myEmail.classList.add("input-error");
    return;
  }

  if (foundUser.password !== passwordValue) {
    document.getElementById("passwordError").innerText = "Incorrect password";
    myPassword.classList.add("input-error");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", JSON.stringify(foundUser));

  window.location.replace("home.html");
});
