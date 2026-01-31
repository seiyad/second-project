 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
 import { getDatabase,ref,push ,onValue,remove,set } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
const appSetting = {
    databaseURL:"https://expense-trakker-default-rtdb.firebaseio.com/"
};

const app=initializeApp(appSetting);
const database=getDatabase(app);
const userListInDp=ref(database,"users");

const idEl = document.querySelector("#id");
const catagorieEl = document.querySelector("#catagorie");
const frmEl = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

frmEl.addEventListener("submit",function(e){
    e.preventDefault();

    if (idEl.value){
        //ubdate Record
        return
    }
    if(!catagorieEl.value.trim()){
        alert("pleae fill all Details");
        return;
    }
    //insert
    const newUser = {
        catagorie:catagorieEl.value.trim()
    };
    push(serListInDp,newUser);
})


// function addCatagorie() {
//     let name = document.getElementById("catagorie").value.trim();
//     let msg = document.getElementById("msg");

//     if (name === "") {
//         msg.innerText = "Category enter pannunga";
//         msg.style.color = "red";
//         return;
//     }
//     msg.innerText = "Category added successfully";
//     msg.style.color = "green";

//     document.getElementById("catagorie").value = "";

//     setTimeout(() => {
//         window.location.href = "catagorie.html";
//     }, 800);
// }