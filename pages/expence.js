// ==========================================
// expence.js - Expense Page JavaScript
// ==========================================

// Firebase core import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// Auth functions import
import { getAuth, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Firestore functions import
import { 
  getFirestore,
  collection,  // Collection reference எடுக்க
  addDoc,      // புதுசா document add பண்ண
  onSnapshot,  // Real-time data கேக்க
  deleteDoc,   // Document delete பண்ண
  doc,         // Specific document reference எடுக்க
  updateDoc,   // Document update பண்ண
  query,       // Query build பண்ண
  orderBy      // Sort பண்ண
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

// HTML form elements எடுக்கிறோம்
const idEl = document.querySelector("#id");                   // Hidden ID field (edit க்கு)
const nameEl = document.querySelector("#ExpenseName");        // Expense name input
const catagorieEl = document.querySelector("#ExpenseCatagorie"); // Category input
const dateEl = document.querySelector("#Date");               // Date input
const amountEl = document.querySelector("#Amount");           // Amount input
const frmEl = document.querySelector("#frm");                 // Form element
const tblBodyEl = document.querySelector("#tblBody");         // Table body

// Current user ID - global variable
let currentUserId = null;

// User login check பண்றோம்
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Login இல்லன்னா - login page க்கு redirect
        window.location.href = "../index.html";
        return;
    }

    // Logged in user ஓட UID save பண்றோம்
    currentUserId = user.uid;

    // Firestore path: users → {uid} → expenses
    // Date order ல் sort பண்றோம் (latest first)
    const expenseRef = collection(db, "users", currentUserId, "expenses");
    const q = query(expenseRef, orderBy("date", "desc"));

    // Real-time listener - data மாறும்போது table automatically update ஆகும்
    onSnapshot(q, (snapshot) => {
        tblBodyEl.innerHTML = ""; // Table clear பண்றோம்

        if (!snapshot.empty) {
            // Data இருந்தா table row add பண்றோம்
            snapshot.docs.forEach((docSnap, index) => {
                const expense = docSnap.data(); // Expense data எடுக்கிறோம்
                const expenseID = docSnap.id;   // Document ID எடுக்கிறோம்

                // Table row create பண்றோம்
                tblBodyEl.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${expense.name}</td>
                        <td>${expense.catagorie}</td>
                        <td>${expense.date}</td>
                        <td>₹${expense.amount}</td>
                        <td>
                            <button type="button" class="btn-edit" data-id="${expenseID}">
                                edit
                            </button>
                        </td>
                        <td>
                            <button type="button" class="btn-delete" data-id="${expenseID}">
                                delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        } else {
            // Data இல்லன்னா message காட்டுறோம்
            tblBodyEl.innerHTML = "<tr><td colspan='7'>No Record Found</td></tr>";
        }
    });
});

// Form submit ஆனா (Add அல்லது Update)
frmEl.addEventListener("submit", async function(e) {
    e.preventDefault(); // Page reload ஆகாம இருக்க

    // Login இல்லன்னா stop
    if (!currentUserId) {
        alert("You must be logged in");
        return;
    }

    // Fields காலியா இருந்தா stop
    if (!nameEl.value.trim() || !catagorieEl.value.trim() || 
        !dateEl.value.trim() || !amountEl.value.trim()) {
        alert("Please fill all details");
        return;
    }

    // Expense data object create பண்றோம்
    const expenseData = {
        name: nameEl.value.trim(),           // Expense name
        catagorie: catagorieEl.value.trim(), // Category
        date: dateEl.value.trim(),           // Date
        amount: Number(amountEl.value.trim()), // Amount (number ஆக)
        time: new Date().toLocaleTimeString()  // Current time
    };

    // Firestore collection reference
    const expenseRef = collection(db, "users", currentUserId, "expenses");

    if (idEl.value) {
        // ID இருந்தா - existing expense UPDATE பண்றோம்
        await updateDoc(
            doc(db, "users", currentUserId, "expenses", idEl.value), 
            expenseData
        );
    } else {
        // ID இல்லன்னா - புதுசா expense ADD பண்றோம்
        await addDoc(expenseRef, expenseData);
    }

    // Form clear பண்றோம்
    clearElements();
});

// Form fields clear பண்றோம்
function clearElements() {
    nameEl.value = "";
    catagorieEl.value = "";
    dateEl.value = "";
    amountEl.value = "";
    idEl.value = ""; // Hidden ID-யும் clear பண்றோம்
}

// Edit மற்றும் Delete buttons click handle பண்றோம்
document.addEventListener("click", async function(e) {
    const editBtn = e.target.closest(".btn-edit");     // Edit button
    const deleteBtn = e.target.closest(".btn-delete"); // Delete button

    // Edit button click ஆனா
    if (editBtn) {
        const id = editBtn.dataset.id;               // Expense ID எடுக்கிறோம்
        const row = editBtn.closest("tr").children;  // Row cells எடுக்கிறோம்

        // Form fields-ல existing data போடுறோம்
        idEl.value = id;                                      // Hidden ID set
        nameEl.value = row[1].textContent;                    // Name
        catagorieEl.value = row[2].textContent;               // Category
        dateEl.value = row[3].textContent;                    // Date
        amountEl.value = row[4].textContent.replace("₹", ""); // Amount (₹ எடுத்துட்டு)
    }

    // Delete button click ஆனா
    if (deleteBtn) {
        if (confirm("Are you sure to delete?")) {
            const id = deleteBtn.dataset.id; // Delete பண்ண expense ID

            // Firestore ல் document delete பண்றோம்
            // Path: users/{uid}/expenses/{expenseId}
            await deleteDoc(doc(db, "users", currentUserId, "expenses", id));
        }
    }
});