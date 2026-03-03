// ==========================================
// dashboard.js - Dashboard Page JavaScript
// ==========================================

// Firebase core import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// Auth functions import
import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Firestore functions import
import { 
  getFirestore,
  collection,   // Collection reference எடுக்க
  onSnapshot    // Real-time data கேக்க
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAWfXbLyYQKrWfnZPdpo25WOr7n9N4M78c",
  authDomain: "expense-trakker.firebaseapp.com",
  projectId: "expense-trakker",
  storageBucket: "expense-trakker.firebasestorage.app",
  messagingSenderId: "654573857096",
  appId: "1:654573857096:web:a07423978542be8a086b7d"
};

// Firebase initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// HTML elements எடுக்கிறோம் - Dashboard cards
const logoutBtn = document.getElementById("logout");
const totalSpentEl = document.getElementById("totalSpent");         // Total செலவு card
const remainingBudgetEl = document.getElementById("remainingBudget"); // மீதி budget card
const highestExpenseEl = document.getElementById("highestExpense");   // அதிக செலவு card
const progressBar = document.getElementById("monthlyProgressBar");    // Progress bar
const progressText = document.getElementById("progressText");         // Progress % text
const progressAmount = document.getElementById("progressamount");     // Progress amount text

// Logout button click ஆனா
logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        // Logout success - login page க்கு போகணும்
        window.location.href = "../index.html";
    });
});

// User login status check பண்றோம்
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Login இல்லன்னா - login page க்கு redirect
        window.location.href = "../index.html";
        return;
    }

    // இந்த user ஓட salary எடுக்கிறோம்
    // Key: monthlySalary_uid - ஒவ்வொரு user க்கும் தனி key
    const salaryKey = `monthlySalary_${user.uid}`;
    const monthlySalary = parseFloat(localStorage.getItem(salaryKey)) || 0;

    if (!monthlySalary) {
        // Salary set பண்ணலன்னா - uservalue page க்கு போகணும்
        window.location.href = "./uservalue.html";
        return;
    }

    // Firestore ல் இந்த user ஓட expenses path
    // Structure: users → {uid} → expenses
    const expenseRef = collection(db, "users", user.uid, "expenses");

    // Real-time listener - data மாறும்போது automatically update ஆகும்
    onSnapshot(expenseRef, (snapshot) => {
        let totalSpent = 0;      // இந்த month மொத்த செலவு
        let highestExpense = 0;  // இந்த month அதிக செலவு

        // இந்த month எது என்று check பண்றோம்
        const now = new Date();
        const currentMonth = now.getMonth();   // 0-11 (Jan=0, Dec=11)
        const currentYear = now.getFullYear(); // 2026

        // ஒவ்வொரு expense-யும் check பண்றோம்
        snapshot.docs.forEach((docSnap) => {
            const expense = docSnap.data();
            const expDate = new Date(expense.date);

            // இந்த expense இந்த month-ஓடதா என்று check
            if (
                expDate.getMonth() === currentMonth &&
                expDate.getFullYear() === currentYear
            ) {
                totalSpent += expense.amount; // Total கூட்டுறோம்

                // Highest expense update பண்றோம்
                if (expense.amount > highestExpense) {
                    highestExpense = expense.amount;
                }
            }
        });

        // கணக்கு போடுறோம்
        const remaining = monthlySalary - totalSpent; // மீதி பணம்
        const percent = monthlySalary > 0
            ? Math.min((totalSpent / monthlySalary) * 100, 100).toFixed(1)
            : 0; // % கணக்கு (max 100%)

        // Dashboard cards update பண்றோம்
        totalSpentEl.textContent      = `₹${totalSpent.toFixed(2)}`;
        remainingBudgetEl.textContent = `₹${remaining.toFixed(2)}`;
        highestExpenseEl.textContent  = `₹${highestExpense.toFixed(2)}`;

        // Progress bar update பண்றோம்
        progressBar.style.width = `${percent}%`;

        // 80% கடந்தா red, இல்லன்னா green
        progressBar.style.backgroundColor = percent > 80 ? "#e74c3c" : "#2ecc71";

        progressText.textContent   = `${percent}% of monthly budget used`;
        progressAmount.textContent = `₹${totalSpent.toFixed(2)} spent of ₹${monthlySalary.toFixed(2)}`;
    });
});