import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase, ref, onValue } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWfXbLyYQKrWfnZPdpo25WOr7n9N4M78c",
  authDomain: "expense-trakker.firebaseapp.com",
  databaseURL: "https://expense-trakker-default-rtdb.firebaseio.com",
  projectId: "expense-trakker",
  storageBucket: "expense-trakker.firebasestorage.app",
  messagingSenderId: "654573857096",
  appId: "1:654573857096:web:a07423978542be8a086b7d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const logoutBtn = document.getElementById("logout");
const totalSpentEl = document.getElementById("totalSpent");
const remainingBudgetEl = document.getElementById("remainingBudget");
const highestExpenseEl = document.getElementById("highestExpense");
const progressBar = document.getElementById("monthlyProgressBar");
const progressText = document.getElementById("progressText");
const progressAmount = document.getElementById("progressamount");

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "../index.html";
  });
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    // ✅ Check if salary is set for this user
    const salaryKey = `monthlySalary_${user.uid}`;
    const monthlySalary = parseFloat(localStorage.getItem(salaryKey)) || 0;

    if (!monthlySalary) {
        // ✅ Salary not set - go to uservalue page
        window.location.href = "./uservalue.html";
        return;
    }

    // ✅ Load this user's expenses only
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

        // ✅ Update dashboard cards
        totalSpentEl.textContent       = `₹${totalSpent.toFixed(2)}`;
        remainingBudgetEl.textContent  = `₹${remaining.toFixed(2)}`;
        highestExpenseEl.textContent   = `₹${highestExpense.toFixed(2)}`;

        // ✅ Progress bar
        progressBar.style.width           = `${percent}%`;
        progressBar.style.backgroundColor = percent > 80 ? "#e74c3c" : "#2ecc71";
        progressText.textContent          = `${percent}% of monthly budget used`;
        progressAmount.textContent        = `₹${totalSpent.toFixed(2)} spent of ₹${monthlySalary.toFixed(2)}`;
    });
});