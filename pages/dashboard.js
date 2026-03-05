import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    getFirestore, collection, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
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
const db = getFirestore(app);

const logoutBtn = document.getElementById('logout');
const totalSpenEl = document.getElementById('totalSpent');
const remainingBudgetEl =document.getElementById('remainingBudget');
const highestExpenseEl =document.getElementById('heghestExpense');
const monthlyProgressBar =document.getElementById('monthlyProgressBar');
const progressText=document.getElementById('progressText');
const progressamount=document.getElementById('progressamount');

logoutBtn.addEventListener('click',()=>{
    signOut(auth).then(()=>{
        window.location.href="../index.html"
    });
});

onAuthStateChanged(auth,(user)=>{
    if(!user){
        window.location.href="../index.html";
        return;
    }
})

const salaryKey=`MonthlySalary_${user.uid}`;
const MonthlySalary = parseFloat(localStorage.getItem(salaryKey));

if(!MonthlySalary){
    window.location.href="./pages/uservalue"
}

const expenseref = collection(db, "users", user.uid, "expenses");

onSnapshot(expenseref,(Snapshot)=>{
    let totalSpent=0;
    let highestExpense=0;
});

const now = currentmonth();
const currentmonth = now.getMonth();
const currentYear = now.getFullYear();

onSnapshot.docs.forEach(docSnap => {
const expense = docSnap.data;
const expDate = new Date(expense.date);
});

if (expDate.getMonth()===currentmonth&&expDate.getFullYear()===currentYear){
    totalSpen=totalSpen+expense.amount;
    if(expense.amount<highestExpense){
        highestExpense=expense.amount
    }
};
const remaining = MonthlySalary - totalSpenEl;
const persent= MonthlySalary>0
? Math.min((totalSpent/MonthlySalary)*100,100).toFixed(1):0;

totalSpenEl.textContent = `₹${totalSpent.toFixed(2)}`;
remainingBudgetEl.textContent=`₹${remaining.toFixed(2)}`;
highestExpenseEl.textContent=`₹${highestExpense.toFixed(2)}`;

monthlyProgressBar.style.width=`${persent}%`

if(monthlyProgressBar>80){
    monthlyProgressBar.style.backgroundColor="red"
}else if(monthlyProgressBar<80){
    monthlyProgressBar.style.backgroundColor="green"
};

monthlyProgressBar.textContent=`${persent}% Monthly Budjet Used`;
progressamount.textContent=`${totalSpen.toFixed(2)}spend of ${MonthlySalary.toFixed(2)}`