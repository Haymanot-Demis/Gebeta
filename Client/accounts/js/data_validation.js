var usernameField = document.getElementById("username");
var passwordField = document.getElementById("password");
const submit = document.getElementById("submit");
const form = document.querySelector("form");
let username = "";
let password = "";
import escapeHtml from "../../script/escapeHTML.js";

const usernameRgExp = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;

submit.onclick = async (e) => {
  console.log(usernameField.value, passwordField.value);
  e.preventDefault();
  const result = validatePassword() && validateUsername();
  console.log(result);
  if (result) {
    try {
      const response = await axios.post(
        form.action,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer Token",
          },
        }
      );
      const small = form.parentNode.querySelector("small");
      console.log(small, response.data.success);
      if (response.data.success) {
        small.classList.remove("err");
        small.classList.add("success");
        small.innerText = "Successfully Logged In";
        console.log(small.innerHTML);
        // window.location.href = "http://127.0.0.1:5500/Gebeta/Client/index.html";
      }
    } catch (e) {
      const small = form.parentNode.querySelector("small");
      small.classList.remove("success");
      small.classList.add("err");
      small.innerText = "Username or Passowrd is Incorrect";
      console.log(small.innerHTML);
      console.log(e.response.data);
    }
  }
};

function validate() {
  validatePassword();
  validateUsername();
  return validatePassword() && validateUsername();
}

function validateUsername() {
  username = usernameField.value.trim();
  username = escapeHtml(username);
  console.log(username);
  if (!username) {
    setError(usernameField, "Username Field is Required");
    return false;
  } else if (!usernameRgExp.test(username)) {
    setError(usernameField, "Username must contain only alphanumeric values");
    return false;
  } else {
    const parent = usernameField.parentNode;
    const small = parent.querySelector("span");
    small.innerText = "";
    small.classList.remove("error");
    small.classList.add("success");
    return true;
  }
}

function validatePassword() {
  password = passwordField.value.trim();
  password = escapeHtml(password);
  console.log(password);
  if (password.length == 0) {
    setError(passwordField, "Password Field is Required");
    return false;
  } else {
    const parent = passwordField.parentNode;
    const small = parent.querySelector("span");
    small.innerText = "";
    small.classList.remove("error");
    small.classList.add("success");
    return true;
  }
}

function setError(inputField, error) {
  const parent = inputField.parentNode;
  const small = parent.querySelector("span");
  small.innerText = error;
  small.classList.remove("success");
  small.classList.add("error");
}
