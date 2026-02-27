import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");

loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = "./pages/dashborard.html";
        })
        .catch(() => {
            alert("Invalid email or password");
        });
});


registerBtn.addEventListener("click", () => {
    window.location.href = "./pages/register.html";
});


onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "./pages/dashborard.html";
    }
});