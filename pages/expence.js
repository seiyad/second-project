 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
 import { getDatabase,ref,push ,onValue,remove,set } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
const appSetting = {
    databaseURL:"https://expense-trakker-default-rtdb.firebaseio.com/"
};

const app=initializeApp(appSetting);
const database=getDatabase(app);
const userListInDp=ref(database,"Expence");

const idEl = document.querySelector("#id");
const catagorieEl = document.querySelector("#catagorie");
const frmEl = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");


frm.addEventListener("submit",function(e){
    e.preventDefault();
    if(!catagorieEl.value.trim()){
        alert("pleae fill all Details");
        return;
    }
    if (idEl.value){
        //ubdate Record
        set(ref(database,"users/"+idEl.value),{
            catagorie:catagorieEl.value.trim()

        })
        clearElements();
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
    idEl.value="";
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
            <td><button type="button" class="btn-edit" data-id="${currentUserID}">
            <ion-icon name="create-outline"></ion-icon>
            </button>
            </td>
            <td>
            <button type="button" class="btn-delete" data-id="${currentUserID}">
            <ion-icon name="trash-outline" ></ion-icon>
            </button>
            </td>
          </tr>`
        }
    }else{
        tblBodyEl.innerHTML = "<tr><td>No Record Found</td></tr>";
    }
});
document.addEventListener("click", function (e) {
    if(e.target.classList.contains("btn-edit")){
        const id =e. target .dataset.id;
        const tdElements=e.target.closest("tr").children;
        idEl.value = id;
        catagorieEl.value=tdElements[1].textContent;
    }else if (e.target.classList.contains("btn-delete")){

        if(confirm("Are sure to delete?")){
            const id =e. target .dataset.id;
            let data =ref(database,`users/${id}`);
            remove(data);
        }
    }
});