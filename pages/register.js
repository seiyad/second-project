import { auth } from "./firebase.js";
import { 
    createUserWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("register");


onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "./dashborard.html";
    }
});

registerBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        
        const budget = prompt("Welcome! Enter your monthly budget (₹):");
        if (budget && !isNaN(budget) && Number(budget) > 0) {
            localStorage.setItem(`monthlySalary_${user.uid}`, Number(budget));
        }

        alert("Registration successful! Welcome to Xpense 🎉");
        window.location.href = "./dashborard.html";

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered. Please login.");
        } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email address.");
        } else {
            alert(error.message);
        }
    }
});