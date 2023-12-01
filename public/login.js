// login.js //
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get the username and password from the form
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Perform client-side validation if needed
        if (!username || !password) {
            console.error("Username and password are required.");
            return;
        }

        // Example: Perform AJAX login request
        // You can use fetch or any other method to send the login data to the server
        fetch("/login.html", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: username,
                password: password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Redirect to the store page
                window.location.href = "./store.html";
            } else {
                // Display error message or handle unsuccessful login
                console.error("Login failed");
            }
        })
        .catch(error => {
            console.error("Error during login:", error);
        });
    });
});
