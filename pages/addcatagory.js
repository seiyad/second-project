function addCatagorie() {
    let name = document.getElementById("catagorie").value.trim();
    let msg = document.getElementById("msg");

    if (name === "") {
        msg.innerText = "Category enter pannunga";
        msg.style.color = "red";
        return;
    }
    msg.innerText = "Category added successfully";
    msg.style.color = "green";

    document.getElementById("catagorie").value = "";

    setTimeout(() => {
        window.location.href = "catagorie.html";
    }, 800);
}