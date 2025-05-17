// ✅ Import Firebase modules (must be at the top level)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsAsISoYD2jTrJRttc1rlFUekiBO2MaKw",
  authDomain: "e-commerce-website-01-266ce.firebaseapp.com",
  projectId: "e-commerce-website-01-266ce",
  storageBucket: "e-commerce-website-01-266ce.appspot.com", // Fixed typo: should be .appspot.com not .app
  messagingSenderId: "239245041522",
  appId: "1:239245041522:web:e91bc64af8db2b15be87eb"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// ✅ Show temporary message
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// ✅ Handle Sign Up
const signUp = document.getElementById('submitSignUp');
if (signUp) {
  signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          firstName: firstName,
          lastName: lastName
        };
        showMessage('Account Created Successfully', 'signUpMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            window.location.href = 'https://www.fashionfeast.shop/';
          })
          .catch((error) => {
            console.error("Error writing document", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email Address Already Exists !!!', 'signUpMessage');
        } else {
          showMessage('Unable to create User', 'signUpMessage');
        }
      });
  });
}

// ✅ Handle Sign In
const signIn = document.getElementById('submitSignIn');
if (signIn) {
  signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage('Login is successful', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'https://www.fashionfeast.shop/';
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
          showMessage('Incorrect Email or Password', 'signInMessage');
        } else {
          showMessage('Account does not Exist', 'signInMessage');
        }
      });
  });
}
