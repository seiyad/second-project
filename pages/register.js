// ==========================================
// register.js - Register Page JavaScript
// ==========================================

// Firebase core import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// Auth functions import - புதுசா account create பண்ண
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } 
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
const emailInput = document.getElementById("email");         // Email input
const passwordInput = document.getElementById("password");   // Password input
const registerBtn = document.getElementById("register");     // Register button

// Already login ஆகி இருந்தால் dashboard க்கு போகணும்
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User already logged in - dashboard க்கு redirect
        window.location.href = "./dashborard.html";
    }
});

// Register button click ஆனா
registerBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();       // Email value எடுக்கிறோம்
    const password = passwordInput.value.trim(); // Password value எடுக்கிறோம்

    // Fields காலியா இருந்தா
    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    // Password 6 characters க்கு குறைவா இருந்தா
    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    try {
        // Firebase ல் புதுசா account create பண்றோம்
        await createUserWithEmailAndPassword(auth, email, password);

        alert("Registration successful! Welcome to Xpense 🎉");

        // Register success - salary enter பண்ண uservalue page க்கு போகணும்
        window.location.href = "./uservalue.html";

    } catch (error) {
        // Error handle பண்றோம்
        if (error.code === "auth/email-already-in-use") {
            // இந்த email already registered
            alert("This email is already registered. Please login.");
        } else if (error.code === "auth/invalid-email") {
            // தப்பான email format
            alert("Please enter a valid email address.");
        } else {
            // வேற error
            alert(error.message);
        }
    }
});