import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB7t1wWHhPYBitqKC4SJ8lqP1WMLDefCxo",
    authDomain: "antocap-referrals.firebaseapp.com",
    projectId: "antocap-referrals",
    storageBucket: "antocap-referrals.appspot.com",
    messagingSenderId: "1071760453747",
    appId: "1:1071760453747:web:fafa7ac624ba7452e6fa06",
    measurementId: "G-EPLJB8MTRH"
};
    const app = initializeApp(firebaseConfig); // Initialize Firebase inside DOMContentLoaded
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    const analytics = getAnalytics(app);

           document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const showSignupButton = document.getElementById('show-signup');
    const showLoginButton = document.getElementById('show-login');
    const loginMessage = document.getElementById('login-message');
    const signupMessage = document.getElementById('signup-message');
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    const toggleSignupPassword = document.getElementById('toggle-signup-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const payButton = document.getElementById('pay-button');
    const paymentConfirmation = document.getElementById('payment-confirmation');

    // Toggle between login and signup sections
    showSignupButton.addEventListener('click', () => {
        loginSection.classList.add('hidden');
        signupSection.classList.remove('hidden');
    });

    showLoginButton.addEventListener('click', () => {
        signupSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Toggle password visibility
    const togglePasswordVisibility = (input, eyeIcon) => {
        eyeIcon.addEventListener('click', () => {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
        });
    };

    togglePasswordVisibility(document.getElementById('login-password'), toggleLoginPassword);
    togglePasswordVisibility(document.getElementById('signup-password'), toggleSignupPassword);
    togglePasswordVisibility(document.getElementById('confirm-password'), toggleConfirmPassword);

    // Handle login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'dashboard.html'; // Redirect to dashboard or home page
        } catch (error) {
            loginMessage.textContent = error.message;
        }
    });

    // Handle registration
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const paymentCode = paymentConfirmation.value;

        if (password !== confirmPassword) {
            signupMessage.textContent = 'Passwords do not match.';
            return;
        }

        try {
            // Check if email is already in use
            await signInWithEmailAndPassword(auth, email, password);
            signupMessage.textContent = 'Email already in use. Please login.';
        } catch (error) {
            // Register new user
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });

                // Check payment confirmation
                const paymentVerified = await verifyPayment(paymentCode); // Function to verify payment

                if (paymentVerified) {
                    await setDoc(doc(db, 'users', userCredential.user.uid), {
                        firstName,
                        lastName,
                        email
                    });
                    window.location.href = 'dashboard.html'; // Redirect after successful registration
                } else {
                    signupMessage.textContent = 'Payment not confirmed.';
                }
            } catch (error) {
                signupMessage.textContent = error.message;
            }
        }
    });
    // MPESA Payment Integration
    payButton.addEventListener('click', () => {
        // This is a placeholder. Replace with actual MPESA integration code
        window.location.href = `https://api.example.com/mpesa/stkpush?amount=250&paybill=400200&account=861102`;
            // Function to verify payment (stub, replace with actual verification code)
    async function verifyPayment(paymentCode) {
        // Replace with actual API request to verify payment
        return true; // Simulating a successful payment
    });
