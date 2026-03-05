import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } 
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

const emailInput = emailInput.value.trim();
const passwordInput=passwordInput.value.trim();
const registerBtn=registerBtn.value.trim();

onAuthStateChanged(auth,(user)=>{
    window.location.href="./dashborard.html"
});

 registerBtn.addEventListener('click',async ()=>{
    const email = emailInput.value.trim();
    const password=passwordInput.value.trim();
    
    if (!email){
        alert("Invalid email")
        return;
    }else if(!password){
        alert("Invalid password")
        return;
    }else if(length.password<6){
        alert("Password must above 6 cheracters")
        return;
    }
    try {
        const userCreaditcial =  await createUserWithEmailAndPassword(auth,email,password);

        const user = userCreaditcial.user;

        const salary = prompt("Enter Your Monthly Salary:(₹)");
        const MonthlySalary = parseFloat(salary);

        if(!isNaN(MonthlySalary) ||  MonthlySalary>0){
            
            localStorage.setItem(`MonthlySalary_${user.uid}MonthlySalary`);

            alert("Registration is succsus !Welcome to Expanse Trakker")

            window.location.href="./pages/dashborard"
        };
    }catch{
        if(error.code === "auth/email-aleady-use"){
            alert("already Register This account")
        }else if(error.code === "auth/invalid-email"){
            alert("Invalid Email")
        }else{
            alert(error.message)
        }

    };
 });
