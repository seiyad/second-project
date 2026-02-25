import { auth } from "../firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const logoutBtn = document.getElementById("logout");
const userEmail = document.getElementById("userEmail");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "../index.html";
  } else {
    userEmail.textContent = user.email;
  }

});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "../index.html";
  });
});