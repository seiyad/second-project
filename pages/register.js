import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const username = document.getElementById("user");
const email = document.getElementById("userName");
const password = document.getElementById("password");
const registerBtn = document.getElementById("register");

registerBtn.addEventListener("click", async () => {

  if (username.value === "" || email.value === "" || password.value === "") {
    alert("Please fill all fields");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    await updateProfile(userCredential.user, {
      displayName: username.value
    });

    alert("Registration Successful");
    window.location.href = "../pages/dashboard.html";

  } catch (error) {
    alert(error.message);
  }

});