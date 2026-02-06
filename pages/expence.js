
// function deleteRow(btn) {
//     let row = btn.closest("tr");
//     let name = row.children[0].innerText;

//     let catagorie = JSON.parse(localStorage.getItem("catagorie")) || [];
//     catagorie = catagorie.filter(cat => cat.name !== name);
//     localStorage.setItem("catagorie", JSON.stringify(catagorie));

//     row.remove();
// }