// register.js //
// Assuming you have a register.js file, you can use it to add any client-side functionality related to registration

// For example, you might want to perform some client-side validation
// or handle events like submitting the registration form asynchronously using AJAX
// This is just a placeholder, you might need to adapt it based on your requirements

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Example: Perform AJAX registration request
        // You can use fetch or any other method to send the registration data to the server
        fetch("/register.html", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                repeatPassword: document.getElementById("psw-repeat").value,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "./login.html";
            } else {
                // Display error message or handle unsuccessful registration
                console.error("Registration failed");
            }
        })
        .catch(error => {
            console.error("Error during registration:", error);
        });
    });
});
