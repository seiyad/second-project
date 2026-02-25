import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");

// 🔐 LOGIN
loginBtn.addEventListener("click", () => {

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "./pages/dashboard.html";
    })
    .catch(() => {
      alert("Invalid email or password");
    });
});


// 🆕 REGISTER
registerBtn.addEventListener("click", () => {

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Registration Successful!");
      window.location.href = "dashborard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});


// 🔄 Auto Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "../dashboarard.html";
  }
});