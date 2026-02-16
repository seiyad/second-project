import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
const appSetting = {
    databaseURL: "https://expense-trakker-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const expenseListInDp = ref(database, "expences");

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#name");
const catagorieEl = document.querySelector("#catagorie");
const dateEl = document.querySelector("#date");
const amountEl = document.querySelector("#amount");
const frmEl = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

frmEl.addEventListener("submit", function (e) {

    e.preventDefault();
    if (!nameEl.value.trim() || !catagorieEl.value.trim() || !dateEl.value.trim() || !amountEl.value.trim()) {
        alert("pleae fill all Details");
        return;
    }
    if (idEl.value) {
        //ubdate Record
        set(ref(database, "expences/" + idEl.value), {
            name: nameEl.value.trim(),
            catagorie: catagorieEl.value.trim(),
            date: dateEl.value.trim(),
            amount: amountEl.value.trim()
        })
        clearElements();
        return;
    }
    //insert
    const newExpense = {
        name: nameEl.value.trim(),
        catagorie: catagorieEl.value.trim(),
        date: dateEl.value.trim(),
        amount: amountEl.value.trim()
    };
    push(expenseListInDp, newExpense);
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
    if (snapshot.exists()) {
        let expenseArray = Object.entries(snapshot.val());
        tblBodyEl.innerHTML = "";
        for (let i = 0; i < expenseArray.length; i++) {
            let currentExpense = expenseArray[i];
            let currentExpenseID = currentExpense[0];
            let currentExpenseValue = currentExpense[1];
            let currentExpenseName = currentExpenseValue.name[2];
            let currentExpenseCatagorie = currentExpenseValue.catagorie[3];
            let currentExpenseDate = currentExpenseValue.date[3];
            let currentExpenseAmount = currentExpenseValue.amount[4];
            tblBodyEl.innerHTML += `
            <tr>
            <td>${i + 1}</td>  
            <td>${currentExpenseName.name}</td>
            <td>${currentExpenseCatagorie.catagorie}</td>
            <td>${currentExpenseDate.date}</td>
            <td>${currentExpenseAmount.amount}</td>
             <td><button type="button" class="btn-edit" data-id="${currentExpenseID}">
            <ion-icon name="create-outline"></ion-icon>
            </button>
            </td>
            <td>
            <button type="button" class="btn-delete" data-id="${currentExpenseID}">
            <ion-icon name="trash-outline" ></ion-icon>
            </button>
            </td>
            </tr>`
        };

    } else {
        tblBodyEl.innerHTML = "<tr><td colspan='7'>No Record Found</td></tr>";

    }

});
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-edit")) {
        const id = e.target.dataset.id;
        const tdElements = e.target.closest("tr").children;
        idEl.value = id;
        catagorieEl.value = tdElements[1].textContent;
        nameEl.value = tdElements[2].textContent;
        dateEl.value = tdElements[3].textContent;
        amountEl.value = tdElements[4].textContent;
    } else if (e.target.classList.contains("btn-delete")) {

        if (confirm("Are sure to delete?")) {
            const id = e.target.dataset.id;
            let data = ref(database, `expences/${id}`);
            remove(data);
        }
    }
});