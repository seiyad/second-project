// imports required from firebase
import { auth, db } from "./firebase.js";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// this is from my landing page
const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login");
const signUpBtn = document.getElementById("register");

// this is from my dashboard page
// todo
const signOutBtn = document.getElementById("logout");

// destructuring
const [email, password] = [emailInput.value, passwordInput.value];
// action handling

if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      // User is logged in, setup Expense Tracker
      // todo
      console.log(user);
    }
  });
} else {
  //   there will be two actions
  //   one can be signIn
  //   one can be signUp
  loginBtn.addEventListener("click", () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        alert("invalid username (or) password");
      });
  });

  signUpBtn.addEventListener("click", () => {
    createUserWithEmailAndPassword(auth, email, password).then((user) => {
      window.location.href = "dashboard.html";
    });
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "index.html";
    }
  });
}