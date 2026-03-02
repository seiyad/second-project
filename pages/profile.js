import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";


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

const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayUserId = document.getElementById("displayUserId");
const displayCreatedDate = document.getElementById("displayCreatedDate");
const logoutButton = document.getElementById("logoutButton");
const profileAvatar = document.getElementById("profileAvatar");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../index.html";
    } else {
        const name = user.email.split("@")[0];

        
        displayName.textContent = name;
        displayEmail.textContent = user.email;
        displayUserId.textContent = user.uid;
        displayCreatedDate.textContent =
            new Date(user.metadata.creationTime).toLocaleDateString();

        
        profileAvatar.textContent = name.charAt(0).toUpperCase();
    }
});

logoutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "../index.html";
    });
});