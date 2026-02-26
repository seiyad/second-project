import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("register");

registerBtn.addEventListener("click", async () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email === "" || password === "") {
    alert("Please enter email and password");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    alert("Registration successful");
    window.location.href = "../index.html";

  } catch (error) {
    alert("Registration failed: " + error.message);
  }

});