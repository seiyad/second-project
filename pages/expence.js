import { auth, app } from "./firebase.js";
import { getDatabase, ref, set, onValue, remove } 
  from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const database = getDatabase(app);

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#ExpenseName");
const catagorieEl = document.querySelector("#ExpenseCatagorie");
const dateEl = document.querySelector("#Date");
const amountEl = document.querySelector("#Amount");
const frmEl = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

let userUID = null;

// 1️⃣ Check login and load project
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../index.html";
    } else {
        userUID = user.uid;
        loadExpense();
    }
});

// 2️⃣ Add or update project
frmEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!nameEl.value.trim() || !catagorieEl.value.trim() || !dateEl.value.trim() || !amountEl.value.trim()) {
        alert("Please fill all details");
        return;
    }

    if (!userUID) return;

    const userRef = ref(database, "expenses/" + userUID);

    // Check if project already exists
    const snapshot = await new Promise((resolve) => onValue(userRef, resolve, { onlyOnce: true }));

    if (!idEl.value && snapshot.exists()) {
        alert("You already have a project. Cannot create another.");
        return;
    }

    const expenseData = {
        name: nameEl.value.trim(),
        catagorie: catagorieEl.value.trim(),
        date: dateEl.value.trim(),
        amount: amountEl.value.trim()
    };

    set(userRef, expenseData).then(() => {
        clearElements();
        loadExpense(); // refresh table
    });
});

// 3️⃣ Load table for logged-in user
function loadExpense() {
    if (!userUID) return;

    const userRef = ref(database, "expenses/" + userUID);

    onValue(userRef, (snapshot) => {
        tblBodyEl.innerHTML = "";
        if (snapshot.exists()) {
            const expense = snapshot.val();
            tblBodyEl.innerHTML = `
                <tr>
                    <td>1</td>
                    <td>${expense.name}</td>
                    <td>${expense.catagorie}</td>
                    <td>${expense.date}</td>
                    <td>${expense.amount}</td>
                    <td><button type="button" class="btn-edit">Edit</button></td>
                    <td><button type="button" class="btn-delete">Delete</button></td>
                </tr>
            `;
            idEl.value = userUID;
        } else {
            tblBodyEl.innerHTML = "<tr><td colspan='7'>No Record Found</td></tr>";
            idEl.value = "";
        }
    });
}

// 4️⃣ Clear input
function clearElements() {
    nameEl.value = "";
    catagorieEl.value = "";
    dateEl.value = "";
    amountEl.value = "";
}

// 5️⃣ Edit/Delete
document.addEventListener("click", (e) => {
    if (!userUID) return;
    const userRef = ref(database, "expenses/" + userUID);

    if (e.target.classList.contains("btn-edit")) {
        onValue(userRef, (snap) => {
            if (snap.exists()) {
                const exp = snap.val();
                nameEl.value = exp.name;
                catagorieEl.value = exp.catagorie;
                dateEl.value = exp.date;
                amountEl.value = exp.amount;
            }
        }, { onlyOnce: true });
    }

    if (e.target.classList.contains("btn-delete")) {
        if (confirm("Delete project?")) {
            remove(userRef).then(() => {
                clearElements();
                loadExpense();
            });
        }
    }
});