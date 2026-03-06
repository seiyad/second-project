import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWfXbLyYQKrWfnZPdpo25WOr7n9N4M78c",
  authDomain: "expense-trakker.firebaseapp.com",
  projectId: "expense-trakker",
  storageBucket: "expense-trakker.firebasestorage.app",
  messagingSenderId: "654573857096",
  appId: "1:654573857096:web:a07423978542be8a086b7d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const registerBtn = document.getElementById('registerBtn');

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "./dashboard.html";
  }
});

registerBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const salary = prompt("Enter Your Monthly Salary (₹):");
    const monthlySalary = parseFloat(salary);

    if (!isNaN(monthlySalary) && monthlySalary > 0) {
      localStorage.setItem(`MonthlySalary_${user.uid}`, monthlySalary);
    }

    alert("Registration successful! Welcome to Expense Tracker.");
    window.location.href = "./pages/dashboard.html";

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email address.");
    } else {
      alert(error.message);
    }
  }
});