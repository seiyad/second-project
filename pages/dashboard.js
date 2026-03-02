import { auth, database } from "./firebase.js";
import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { ref, onValue } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const logoutBtn = document.getElementById("logout");
const totalSpentEl = document.getElementById("totalSpent");
const remainingBudgetEl = document.getElementById("remainingBudget");
const highestExpenseEl = document.getElementById("highestExpense");
const progressBar = document.getElementById("monthlyProgressBar");
const progressText = document.getElementById("progressText");
const progressAmount = document.getElementById("progressamount");

// Monthly budget - stored per user in localStorage
let monthlySalary = 0;

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("monthlySalary");
    window.location.href = "../index.html";
  });
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    // Load salary specific to this user
    const salaryKey = `monthlySalary_${user.uid}`;
    monthlySalary = parseFloat(localStorage.getItem(salaryKey)) || 0;

    if (!monthlySalary) {
        const input = prompt("Enter your monthly budget (₹):");
        monthlySalary = parseFloat(input) || 0;
        localStorage.setItem(salaryKey, monthlySalary);
    }

    // Listen to THIS user's expenses only
    const expenseRef = ref(database, `expenses/${user.uid}`);

    onValue(expenseRef, (snapshot) => {
        let totalSpent = 0;
        let highestExpense = 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (snapshot.exists()) {
            const expenses = Object.values(snapshot.val());

            expenses.forEach((expense) => {
                // Filter only this month's expenses
                const expDate = new Date(expense.date);
                if (
                    expDate.getMonth() === currentMonth &&
                    expDate.getFullYear() === currentYear
                ) {
                    totalSpent += expense.amount;
                    if (expense.amount > highestExpense) {
                        highestExpense = expense.amount;
                    }
                }
            });
        }

        const remaining = monthlySalary - totalSpent;
        const percent = monthlySalary > 0 
            ? Math.min((totalSpent / monthlySalary) * 100, 100).toFixed(1) 
            : 0;

        // Update UI
        totalSpentEl.textContent = `₹${totalSpent.toFixed(2)}`;
        remainingBudgetEl.textContent = `₹${remaining.toFixed(2)}`;
        highestExpenseEl.textContent = `₹${highestExpense.toFixed(2)}`;
        progressBar.style.width = `${percent}%`;
        progressBar.style.backgroundColor = percent > 80 ? "#e74c3c" : "#2ecc71";
        progressText.textContent = `${percent}% of monthly budget used`;
        progressAmount.textContent = `₹${totalSpent.toFixed(2)} spent of ₹${monthlySalary.toFixed(2)}`;
    });
});