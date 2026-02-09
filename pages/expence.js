 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
 import { getDatabase,ref,push ,onValue,remove,set } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
const appSetting = {
    databaseURL:"https://expense-trakker-default-rtdb.firebaseio.com/"
};