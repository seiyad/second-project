import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    push, 
    onValue, 
    remove, 
    set 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { 
    getAuth, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// ✅ Firebase config directly here - no import needed
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
const database = getDatabase(app);
const auth = getAuth(app);

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#ExpenseName");
const catagorieEl = document.querySelector("#ExpenseCatagorie");
const dateEl = document.querySelector("#Date");
const amountEl = document.querySelector("#Amount");
const frmEl = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

let currentUserId = null;
let expenseListRef = null;

// ✅ Wait for login - if not logged in go back to login page
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    currentUserId = user.uid;

    // ✅ THIS is the fix - expenses stored under user's UID
    expenseListRef = ref(database, `expenses/${currentUserId}`);

    // ✅ Load ONLY this user's expenses
    onValue(expenseListRef, function(snapshot) {
        tblBodyEl.innerHTML = "";

        if (snapshot.exists()) {
            let expenseArray = Object.entries(snapshot.val());

            expenseArray.forEach((item, index) => {
                const expenseID = item[0];
                const expense = item[1];

                tblBodyEl.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${expense.name}</td>
                        <td>${expense.catagorie}</td>
                        <td>${expense.date}</td>
                        <td>₹${expense.amount}</td>
                        <td>
                            <button type="button" class="btn-edit" data-id="${expenseID}">edit</button>
                        </td>
                        <td>
                            <button type="button" class="btn-delete" data-id="${expenseID}">delete</button>
                        </td>
                    </tr>
                `;
            });

        } else {
            tblBodyEl.innerHTML = "<tr><td colspan='7'>No Record Found</td></tr>";
        }
    });
});

// ✅ Add or Update expense
frmEl.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!currentUserId) {
        alert("You must be logged in");
        return;
    }

    if (!nameEl.value.trim() || !catagorieEl.value.trim() || !dateEl.value.trim() || !amountEl.value.trim()) {
        alert("Please fill all details");
        return;
    }

    const expenseData = {
        name: nameEl.value.trim(),
        catagorie: catagorieEl.value.trim(),
        date: dateEl.value.trim(),
        amount: Number(amountEl.value.trim()),
        time: new Date().toLocaleTimeString()
    };

    if (idEl.value) {
        // ✅ Update - inside user's own folder
        set(ref(database, `expenses/${currentUserId}/${idEl.value}`), expenseData);
    } else {
        // ✅ Add new - inside user's own folder
        push(expenseListRef, expenseData);
    }

    clearElements();
});

function clearElements() {
    nameEl.value = "";
    catagorieEl.value = "";
    dateEl.value = "";
    amountEl.value = "";
    idEl.value = "";
}

// ✅ Edit and Delete
document.addEventListener("click", function(e) {
    const editBtn = e.target.closest(".btn-edit");
    const deleteBtn = e.target.closest(".btn-delete");

    if (editBtn) {
        const id = editBtn.dataset.id;
        const row = editBtn.closest("tr").children;

        idEl.value = id;
        nameEl.value = row[1].textContent;
        catagorieEl.value = row[2].textContent;
        dateEl.value = row[3].textContent;
        amountEl.value = row[4].textContent.replace("₹", "");
    }

    if (deleteBtn) {
        if (confirm("Are you sure to delete?")) {
            const id = deleteBtn.dataset.id;
            // ✅ Delete from user's own folder only
            remove(ref(database, `expenses/${currentUserId}/${id}`));
        }
    }
});