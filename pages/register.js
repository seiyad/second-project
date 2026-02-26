import { auth, db } from "./firebase.js";

import { 
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const username = document.getElementById("user");
const email = document.getElementById("userName");
const password = document.getElementById("password");
const registerBtn = document.getElementById("register");

registerBtn.addEventListener("click", async () => {

  if (!username.value || !email.value || !password.value) {
    alert("Please fill all fields");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username.value
    });

    await setDoc(doc(db, "users", user.uid), {
      username: username.value,
      email: email.value,
      uid: user.uid,
      createdAt: new Date()
    });

    alert("Registration Successful");

    window.location.replace("./dashboard.html");

  } catch (error) {
    alert(error.message);
  }

});