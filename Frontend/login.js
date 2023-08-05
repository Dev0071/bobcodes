const loginForm = document.getElementById("login-form")


loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    // console.log("clicked login");

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const errorElement = document.getElementById("error-message");


    try {
        const response = await fetch("http://localhost:9500/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Email: email, Password: password })
        })

        console.log(response);


        if (response.ok) {
            const data = await response.json()
            const token = data.token
            const decodedToken = parseJwt(token)
            localStorage.setItem("authToken", token)
            window.location.href = "index.html"
        }

        else {

            const errorResponse = await response.json();
            const errorMessage = errorResponse.message;
            errorElement.innerText = errorMessage;
        }
    } catch (error) {
        console.log(error);
        
    }


})

function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = decodeURIComponent(atob(base64).split("").map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));

        return JSON.parse(payload);
    } catch (error) {
        console.error("Error parsing JWT token:", error);
        return null;
    }
}