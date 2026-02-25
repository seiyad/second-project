import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "../index.html";
  });
});

// Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../index.html";
  }
});