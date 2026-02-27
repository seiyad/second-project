import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const logoutBtn = document.getElementById("logout");
const userEmail = document.getElementById("userEmail");

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("monthlySalary");
    window.location.href = "../index.html";
  });
}); 