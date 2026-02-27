import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const logoutBtn = document.getElementById("logout");
const userEmail = document.getElementById("userEmail");

const totalSpentEl = document.getElementById("totalSpent");
const remainingBudgetEl = document.getElementById("remainingBudget");
const progressBar = document.getElementById("monthlyProgressBar");
const progressText = document.getElementById("progressText");
const progressAmount = document.getElementById("progressamount");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "../index.html";
  } else {
    userEmail.textContent = user.email;

    const monthlySalary = parseFloat(localStorage.getItem("monthlySalary")) || 0;
    let totalSpent = 0;

    totalSpentEl.textContent = "₹" + totalSpent.toFixed(2);

    const remaining = monthlySalary - totalSpent;
    remainingBudgetEl.textContent = "₹" + remaining.toFixed(2);

    let percentUsed = 0;
    if (monthlySalary > 0) {
      percentUsed = (totalSpent / monthlySalary) * 100;
    }

    progressBar.style.width = percentUsed + "%";
    progressText.textContent = percentUsed.toFixed(0) + "% of monthly budget used";
    progressAmount.textContent = "Monthly Budget: ₹" + monthlySalary.toFixed(2);
  }

});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("monthlySalary");
    window.location.href = "../index.html";
  });
}); 