const loginForm = document.getElementById("login-button");

loginForm.addEventListener("click", async (event) => {
    alert("Jamo")
    event.preventDefault();

    // Get the login credentials from the form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Send a POST request to the server's login route
    try {
        const response = await fetch("http://localhost:9500/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Email: email, Password: password })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;

            // Store the token in localStorage
            localStorage.setItem("authToken", token);

            console.log("Login successful!");
            // Redirect the user or update the UI to show they are logged in
        } else {
            console.log("Login failed.");
            // Handle login failure (e.g., show error message to the user)
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});
