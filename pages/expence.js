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

// Wait for user login
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../index.html";
    } else {
        userUID = user.uid;
        loadExpenses();
    }
});

// Submit or update project
frmEl.addEventListener("submit", async function(e) {
    e.preventDefault();

    if (!nameEl.value.trim() || !catagorieEl.value.trim() || !dateEl.value.trim() || !amountEl.value.trim()) {
        alert("Please fill all details");
        return;
    }

    if (!userUID) {
        alert("User not logged in");
        return;
    }

    const userExpenseRef = ref(database, "expenses/" + userUID);

    // Check if user already has a project
    const snapshot = await new Promise((resolve) => onValue(userExpenseRef, resolve, { onlyOnce: true }));
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

    set(userExpenseRef, expenseData);
    clearElements();
});

// Clear form
function clearElements() {
    nameEl.value = "";
    catagorieEl.value = "";
    dateEl.value = "";
    amountEl.value = "";
    idEl.value = "";
}

// Load user project
function loadExpenses() {
    const userExpenseRef = ref(database, "expenses/" + userUID);

    onValue(userExpenseRef, (snapshot) => {
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
                    <td>
                        <button type="button" class="btn-edit">
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn-delete">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </td>
                </tr>
            `;
            idEl.value = userUID;
        } else {
            tblBodyEl.innerHTML = "<tr><td colspan='7'>No Record Found</td></tr>";
        }
    });
}

// Delete project
document.addEventListener("click", function (e) {
    const editBtn = e.target.closest(".btn-edit");
    const deleteBtn = e.target.closest(".btn-delete");

    const userExpenseRef = ref(database, "expenses/" + userUID);

    if (editBtn) {
        onValue(userExpenseRef, (snapshot) => {
            const expense = snapshot.val();
            nameEl.value = expense.name;
            catagorieEl.value = expense.catagorie;
            dateEl.value = expense.date;
            amountEl.value = expense.amount;
        }, { onlyOnce: true });
    }

    if (deleteBtn) {
        if (confirm("Are you sure to delete?")) {
            remove(userExpenseRef);
            clearElements();
        }
    }
});