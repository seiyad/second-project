// ==========================================
// profile.js - Profile Page JavaScript
// ==========================================

// Firebase core import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// Auth functions import
import { getAuth, onAuthStateChanged, signOut } 
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
const displayName = document.getElementById("displayName");           // பெயர் காட்ட
const displayEmail = document.getElementById("displayEmail");         // Email காட்ட
const displayUserId = document.getElementById("displayUserId");       // UID காட்ட
const displayCreatedDate = document.getElementById("displayCreatedDate"); // Account create date
const logoutButton = document.getElementById("logoutButton");         // Logout button
const profileAvatar = document.getElementById("profileAvatar");       // Avatar circle

// User login status check
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Login இல்லன்னா - login page க்கு redirect
        window.location.href = "../index.html";
    } else {
        // Email ல் @ க்கு முன்னாடி இருக்கதை பெயரா use பண்றோம்
        // Example: "john@gmail.com" → "john"
        const name = user.email.split("@")[0];

        // Profile details காட்டுறோம்
        displayName.textContent = name;                    // பெயர்
        displayEmail.textContent = user.email;             // Email
        displayUserId.textContent = user.uid;              // Unique ID

        // Account create ஆன date format பண்றோம்
        displayCreatedDate.textContent =
            new Date(user.metadata.creationTime).toLocaleDateString();

        // Avatar - பெயரோட முதல் letter காட்டுறோம் (uppercase)
        // Example: "john" → "J"
        profileAvatar.textContent = name.charAt(0).toUpperCase();
    }
});

// Logout button click ஆனா
logoutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
        // Logout success - login page க்கு போகணும்
        window.location.href = "../index.html";
    });
});