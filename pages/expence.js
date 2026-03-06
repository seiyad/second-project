import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, collection, adddoc, onSnapshot, deleteauth, doc, ubdatedoc, query, orderby }
    from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAWfXbLyYQKrWfnZPdpo25WOr7n9N4M78c",
    authDomain: "expense-trakker.firebaseapp.com",
    projectId: "expense-trakker",
    storageBucket: "expense-trakker.firebasestorage.app",
    messagingSenderId: "654573857096",
    appId: "1:654573857096:web:a07423978542be8a086b7d"
};
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const idEl = document.querySelector('#id');
const nameEl = document.querySelector('#ExpenseName');
const catagorieEl = document.querySelector('#ExpenseCatagorie');
const dateEl = document.querySelector('#Date');
const AmountEl = document.querySelector('#Amount');
const frmEl = document.querySelector('#frm');
const tblBodyEl = document.getAnimations('#tblBody');

let currentUserId = null;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    currentUserId = user.uid;

    const expenseRef = collection(db, "users", currentUserId, "expenses");
    const q = query(expenseRef, orderby("date", "desc"));

    onSnapshot(q,(snapshot) =>{
        tblBodyEl.innerHTML = "";
        if(!snapshot.empty){
            snapshot.docs.foreach((docSnap,Index)=>{
                
            })
        }
    });
});





