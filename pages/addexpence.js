function addExpense(){
    let name = document.getElementById("user").value.trim();
    let type = document.getElementById("catagorie").value.trim();
    let date = document.getElementById("Date").value.trim();
    let amount = document.getElementById("amount").value.trim();
    let msg = document.getElementById("msg");

    if (name === "") {
        msg.innerHTML = "Please enter expense";
        msg.className = "error";
        return;
    }

    if (type === "") {
        msg.innerHTML = "Please enter category";
        msg.className = "error";
        return;
    }

    let datePattern = /^\d{2}\/\d{2}\/\d{2}$/;
    if (!datePattern.test(date)) {
        msg.innerHTML = "Enter valid date (dd/mm/yy)";
        msg.className = "error";
        return;
    }

    let amountPattern = /^\d+(\.\d{1,2})?$/;
    if (!amountPattern.test(amount)) {
        msg.innerHTML = "Enter valid amount";
        msg.className = "error";
        return;
    }

    let expense = {
        name: name,
        category: type,
        date: date,
        amount: "₹" + amount
    };
    msg.innerText = "Expence added successfully";
    msg.style.color = "green";

    document.getElementById("user").value = "";

    setTimeout(() => {
        window.location.href = "expence.html";
    }, 800);
}