// ==========================================
// script.js - Login Page JavaScript
// ==========================================

// Firebase core import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// Auth functions import
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

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

// HTML elements எடுக்கிறோம்
const emailInput = document.getElementById("username");       // Email input
const passwordInput = document.getElementById("password");   // Password input
const loginBtn = document.getElementById("login");           // Login button
const registerBtn = document.getElementById("register");     // Register button

// ஒருவர் already login ஆகி இருந்தால் dashboard க்கு போகணும்
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User logged in - dashboard க்கு redirect
        window.location.href = "./pages/dashborard.html";
    }
    // User இல்லன்னா - login page லயே இருக்கணும்
});

// Login button click ஆனா
loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();       // Email value எடுக்கிறோம்
    const password = passwordInput.value.trim(); // Password value எடுக்கிறோம்

    // Email அல்லது Password காலியா இருந்தா
    if (!email || !password) {
        alert("Please enter email and password");
        return; // Function நிறுத்துறோம்
    }

    // Firebase ல் login try பண்றோம்
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            // Login success - dashboard க்கு போகணும்
            window.location.href = "./pages/dashborard.html";
        })
        .catch((error) => {
            // Login fail - error காட்டுறோம்
            console.error(error);
            alert("Invalid email or password");
        });
});

// Register button click ஆனா - register page க்கு போகணும்
registerBtn.addEventListener("click", () => {
    window.location.href = "./pages/register.html";
});