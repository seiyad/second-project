// 🔥 Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔥 YOUR FIREBASE CONFIG (paste your config here)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};


// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// 🔥 Dashboard Logic
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  try {
    const expenseRef = collection(db, "users", user.uid, "expenses");
    const snapshot = await getDocs(expenseRef);

    let total = 0;
    let highest = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.amount) {
        total += Number(data.amount);

        if (data.amount > highest) {
          highest = data.amount;
        }
      }
    });

    // 🔥 Static Budget (later Firestoreல இருந்து fetch பண்ணலாம்)
    const budget = 5000;

    const remaining = budget - total;
    const percent = budget > 0 ? (total / budget) * 100 : 0;

    // 🔥 Update UI
    document.getElementById("totalSpent").innerText = "₹" + total.toFixed(2);
    document.getElementById("highestExpense").innerText = "₹" + highest.toFixed(2);
    document.getElementById("remainingBudget").innerText = "₹" + remaining.toFixed(2);

    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressText").innerText =
      percent.toFixed(0) + "% of monthly budget used";

  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
});