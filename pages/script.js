import{initialaizeApp} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js"
import{getAuth , signInWithEmailAndPassword,onAuthSyatechanged}
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWfXbLyYQKrWfnZPdpo25WOr7n9N4M78c",
  authDomain: "expense-trakker.firebaseapp.com",
  projectId: "expense-trakker",
  storageBucket: "expense-trakker.firebasestorage.app",
  messagingSenderId: "654573857096",
  appId: "1:654573857096:web:a07423978542be8a086b7d"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput=document.getElementById('username');
const passwordInput=document.getElementById('password');
const loginBtn=document.getElementById('login');
const registerBtn=document.getElementById('register');


onAuthSyatechanged(auth,(user)=>{
    if (user){
        window.location.href="./pages/dashborard.html"
    }
});

loginBtn.addEventListener('click',() => {
    const email =emailInput.value.trim();
    const password = passwordInput.value.trim();

    if(!email){
        alert("please fill the valid email")
        return
    }else if(!password){
        alert("plaese fill the valid password")
        return
    };

    signInWithEmailAndPassword(auth ,email,password)
        .then(()=>{
            window.location.href="./page/dashborard.html"
        })
        .catch(error);
            console.error(
                alert("invalid  email and password")
            );

    registerBtn.addEventListener('click',()=>{
        window.location.href="./page/register.html"
    })
})