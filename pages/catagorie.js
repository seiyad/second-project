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


frm.addEventListener("submit",function(e){
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
    push(userListInDp,newUser);
    clearElements();
    
});
function clearElements(){
    catagorieEl.value="";
}

onValue(userListInDp,function(snapshot){
    if(snapshot.exists()) {
        let userArray = Object.entries(snapshot.val());
        // console.log(userArray);
        tblBodyEl.innerHTML="";
        for (let i = 0; i<userArray.length; i++) {
            let currentUser = userArray[i];
            // console.log(currentUser)
            let currentUserID = currentUser[0];
            let currentUserValue = currentUser[1];

            tblBodyEl.innerHTML +=`
            <tr>
            <td>${i+1}</td>
            <td>${currentUserValue.catagorie}</td>
            <td><button class="btn-edit"><ion-icon name="create-outline" data-id="${currentUserID}"></ion-icon></button></td>
                        <td> <button class="btn-delete"><ion-icon name="trash-outline" data-id="${currentUserID}"></ion-icon></button></td>
          </tr>`
        }
    }else{
        tblBodyEl.innerHTML = "<tr><td>No Record Found</td></tr>";
    }
});
document.addEventListener("click", function (e) {
    if(e.target.classList.contains("btn-edit")){
        console.log("Edit");
    }else if (e.target.classList.contains("btn-delete")){
        console.log("Delete")
    }
});
// function deleteRow(btn) {
//     let row = btn.closest("tr");
//     let name = row.children[0].innerText;

//     let catagorie = JSON.parse(localStorage.getItem("catagorie")) || [];
//     catagorie = catagorie.filter(cat => cat.name !== name);
//     localStorage.setItem("catagorie", JSON.stringify(catagorie));

//     row.remove();
    
// }