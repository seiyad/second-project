import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayUserId = document.getElementById("displayUserId");
const displayCreatedDate = document.getElementById("displayCreatedDate");
const logoutButton = document.getElementById("logoutButton");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "../index.html";
  } else {
    displayName.textContent = user.email.split("@")[0];
    displayEmail.textContent = user.email;
    displayUserId.textContent = user.uid;
    displayCreatedDate.textContent =
      new Date(user.metadata.creationTime).toLocaleDateString();
  }

});

logoutButton.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "../index.html";
  });
});