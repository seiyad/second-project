import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const appSetting = {
    databaseURL: "https://expense-trakker-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const expenseListInDp = ref(database, "expenses");

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#name");
const catagorieEl = document.querySelector("#catagorie");
const dateEl = document.querySelector("#date");
const amountEl = document.querySelector("#amount");
const frmEl = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

frmEl.addEventListener("submit", function (e) {
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

    const expenseData = {
        name: nameEl.value.trim(),
        catagorie: catagorieEl.value.trim(),
        date: dateEl.value.trim(),
        amount: amountEl.value.trim()
    };

    if (idEl.value) {
        set(ref(database, "expenses/" + idEl.value), expenseData);
    } else {
        push(expenseListInDp, expenseData);
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

onValue(expenseListInDp, function (snapshot) {
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
                    <td>${expense.amount}</td>
                    <td>
                        <button type="button" class="btn-edit" data-id="${expenseID}">
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn-delete" data-id="${expenseID}">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        tblBodyEl.innerHTML = "<tr><td colspan='7'>No Record Found</td></tr>";
    }
});

document.addEventListener("click", function (e) {
    const editBtn = e.target.closest(".btn-edit");
    const deleteBtn = e.target.closest(".btn-delete");

    if (editBtn) {
        const id = editBtn.dataset.id;
        const row = editBtn.closest("tr").children;

        idEl.value = id;
        nameEl.value = row[1].textContent;
        catagorieEl.value = row[2].textContent;
        dateEl.value = row[3].textContent;
        amountEl.value = row[4].textContent;
    }

    if (deleteBtn) {
        if (confirm("Are you sure to delete?")) {
            const id = deleteBtn.dataset.id;
            remove(ref(database, `expenses/${id}`));
        }
    }
});
