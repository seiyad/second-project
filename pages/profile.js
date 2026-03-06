import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import{getAuth,onAuthStateChanged,signout}
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js"
const firebaseConfig = {
  apiKey: "AIzaSyAWfXbLyYQKrWfnZPdpo25WOr7n9N4M78c",
  authDomain: "expense-trakker.firebaseapp.com",
  projectId: "expense-trakker",
  storageBucket: "expense-trakker.firebasestorage.app",
  messagingSenderId: "654573857096",
  appId: "1:654573857096:web:a07423978542be8a086b7d"
};

const app = initializeApp(firebaseConfig);
const suth = getAuth(app);

const Profile = document.getElementById("ProfileAvatar")
const Name = document.getElementById("displayName");
const Email = document.getElementById("displayUserId");
const UserId=document.getElementById("displayUserId");
const CreateDate=document.getElementById("displayCreateDate");
const logoutBtn=document.getElementById("logoutButton");

if(!user){
    window.location.href="../index.html"
}else{

   const name=user.Email.split("@")[0];
   const  date=new Date(user.metaDate.creationTime).toLocaleDateString();
Name.textContent=name;
Email.textContent=user.Email;
UserId.textContent=user.UserId;
CreateDate.textContent= date;
Profile .textContent=name.charAt(0).toUppercase();
};

logoutBtn('click',()=>{
    signout(auth).then(()=>{
        window.location.href="../index.html"
    });
});
