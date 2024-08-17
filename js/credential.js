document.addEventListener('DOMContentLoaded', function() {
    // Handle Sign Up Button Click
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            console.log("Signup clicked");
            window.location.href = 'signup.html'; // Navigate to the signup page
        });
    } else {
        console.error("Element with ID 'signupBtn' not found.");
    }

    // Handle Login Button Click
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            console.log("Login clicked");
            window.location.href = 'login.html'; // Navigate to the login page
        });
    } else {
        console.error("Element with ID 'loginBtn' not found.");
    }

    // Handle Sign Up Form Submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Collect form data
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const gender = document.getElementById('gender').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            // Optional: Perform any validation or processing here
            if (!firstName || !lastName || !email || !password) {
                alert('Please fill in all required fields.');
                return;
            }

            // Example of form data processing (could send to a server)
            console.log('Sign Up Form Data:', { firstName, lastName, gender, email, password });

            // Redirect to a confirmation page or other page
            window.location.href = 'index.html'; // Replace with your desired URL
        });
    } else {
        console.error("Sign up form with ID 'signupForm' not found.");
    }

    // Handle Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Collect form data
            const loginEmail = document.getElementById('loginEmail').value;
            const loginPassword = document.getElementById('loginPassword').value;

            // Optional: Perform any validation or processing here
            if (!loginEmail || !loginPassword) {
                alert('Please fill in all required fields.');
                return;
            }

            // Example of form data processing (could send to a server)
            console.log('Login Form Data:', { loginEmail, loginPassword });

            // Redirect to a confirmation page or other page
            window.location.href = 'index.html'; // Replace with your desired URL
        });
    } else {
        console.error("Login form with ID 'loginForm' not found.");
    }
});
