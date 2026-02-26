import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("register");

registerBtn.addEventListener("click", () => {

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Registration Successful");
      window.location.href = "../index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});