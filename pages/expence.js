import { auth, app } from "./firebase.js";
import { getDatabase, ref, set, onValue, remove } 
  from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const db = getDatabase(app);

const nameEl = document.querySelector("#ExpenseName");
const catEl = document.querySelector("#ExpenseCatagorie");
const dateEl = document.querySelector("#Date");
const amountEl = document.querySelector("#Amount");
const frmEl = document.querySelector("#frm");
const tblBody = document.querySelector("#tblBody");

let userUID = null;

// 1️⃣ Auth check and load project
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../index.html";
    } else {
        userUID = user.uid;
        renderTable(); // load table
    }
});

// 2️⃣ Submit form
frmEl.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!nameEl.value || !catEl.value || !dateEl.value || !amountEl.value) {
        alert("Please fill all fields");
        return;
    }
    const userRef = ref(db, "expenses/" + userUID);

    // Check if user already has a project
    onValue(userRef, (snap) => {
        if (snap.exists() && !snap.val().allowEdit) {
            alert("You already have a project. Cannot create another.");
            return;
        } else {
            const data = {
                name: nameEl.value,
                catagorie: catEl.value,
                date: dateEl.value,
                amount: amountEl.value,
                allowEdit: true // flag to allow edit later
            };
            set(userRef, data).then(() => {
                clearForm();
                renderTable(); // reload table immediately
            });
        }
    }, { onlyOnce: true });
});

// 3️⃣ Load/render table
function renderTable() {
    const userRef = ref(db, "expenses/" + userUID);

    onValue(userRef, (snap) => {
        tblBody.innerHTML = "";
        if (snap.exists()) {
            const exp = snap.val();
            tblBody.innerHTML = `
                <tr>
                    <td>1</td>
                    <td>${exp.name}</td>
                    <td>${exp.catagorie}</td>
                    <td>${exp.date}</td>
                    <td>${exp.amount}</td>
                    <td><button class="edit">Edit</button></td>
                    <td><button class="delete">Delete</button></td>
                </tr>
            `;
        } else {
            tblBody.innerHTML = "<tr><td colspan='7'>No Record Found</td></tr>";
        }
    });
}

// 4️⃣ Clear form
function clearForm() {
    nameEl.value = "";
    catEl.value = "";
    dateEl.value = "";
    amountEl.value = "";
}

// 5️⃣ Edit/Delete
document.addEventListener("click", (e) => {
    if (!userUID) return;
    const userRef = ref(db, "expenses/" + userUID);

    if (e.target.classList.contains("edit")) {
        onValue(userRef, (snap) => {
            if (snap.exists()) {
                const exp = snap.val();
                nameEl.value = exp.name;
                catEl.value = exp.catagorie;
                dateEl.value = exp.date;
                amountEl.value = exp.amount;
            }
        }, { onlyOnce: true });
    }

    if (e.target.classList.contains("delete")) {
        if (confirm("Delete project?")) {
            remove(userRef).then(() => {
                clearForm();
                renderTable();
            });
        }
    }
});