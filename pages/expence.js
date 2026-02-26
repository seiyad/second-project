import { auth, app } from "./firebase.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const database = getDatabase(app);

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#ExpenseName");
const catagorieEl = document.querySelector("#ExpenseCatagorie");
const dateEl = document.querySelector("#Date");
const amountEl = document.querySelector("#Amount");
const frmEl = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

let userUID = null;

// 1️⃣ Check login and load expense
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../index.html";
  } else {
    userUID = user.uid;
    loadExpense();
  }
});

// 2️⃣ Add or update expense
frmEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (
    !nameEl.value.trim() ||
    !catagorieEl.value.trim() ||
    !dateEl.value.trim() ||
    !amountEl.value.trim()
  ) {
    alert("Please fill all details");
    return;
  }

  if (!userUID) return;

  const userRef = ref(database, "expenses/" + userUID);

  // Check if expense already exists (only block if adding new, not editing)
  const snapshot = await new Promise((resolve) =>
    onValue(userRef, resolve, { onlyOnce: true })
  );

  if (!idEl.value && snapshot.exists()) {
    alert("You already have an expense record. Please edit or delete it first.");
    return;
  }

  const expenseData = {
    name: nameEl.value.trim(),
    catagorie: catagorieEl.value.trim(),
    date: dateEl.value.trim(),
    amount: amountEl.value.trim(),
  };

  set(userRef, expenseData).then(() => {
    clearElements();
    loadExpense();
  });
});

// 3️⃣ Load table for logged-in user
function loadExpense() {
  if (!userUID) return;

  const userRef = ref(database, "expenses/" + userUID);

  onValue(
    userRef,
    (snapshot) => {
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
              <button class="btn btn-sm btn-warning btn-edit">Edit</button>
              <button class="btn btn-sm btn-danger btn-delete">Delete</button>
            </td>
          </tr>
        `;
        idEl.value = userUID;
      } else {
        tblBodyEl.innerHTML = `
          <tr>
            <td colspan="6" class="text-center">No Record Found</td>
          </tr>
        `;
        idEl.value = "";
      }
    },
    { onlyOnce: true }
  );
}

// 4️⃣ Clear input fields
function clearElements() {
  nameEl.value = "";
  catagorieEl.value = "";
  dateEl.value = "";
  amountEl.value = "";
  idEl.value = "";
}

// 5️⃣ Edit / Delete buttons
document.addEventListener("click", (e) => {
  if (!userUID) return;

  const userRef = ref(database, "expenses/" + userUID);

  // ✏️ Edit - fill form with existing data
  if (e.target.classList.contains("btn-edit")) {
    onValue(
      userRef,
      (snap) => {
        if (snap.exists()) {
          const exp = snap.val();
          nameEl.value = exp.name;
          catagorieEl.value = exp.catagorie;
          dateEl.value = exp.date;
          amountEl.value = exp.amount;
          idEl.value = userUID; // mark as editing
        }
      },
      { onlyOnce: true }
    );
  }

  // 🗑️ Delete - remove record from database
  if (e.target.classList.contains("btn-delete")) {
    if (confirm("Are you sure you want to delete this record?")) {
      remove(userRef).then(() => {
        clearElements();
        loadExpense();
      });
    }
  }
});