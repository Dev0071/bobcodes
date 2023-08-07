const signUpForm = document.getElementById("signup");
const errorElement = document.getElementById("error-message");

signUpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (username.trim() === "" || username.length < 3) {
    alert("Please enter a valid username (at least 3 characters).");
    return;
  }

  // Validate email format
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Validate password
  if (password.length < 6) {
    alert("Please enter a password with at least 6 characters.");
    return;
  }

  // Check if passwords match
  if (!matchPassword(password, confirmPassword)) {
    alert("Passwords do not match.");
    return;
  }

  try {
    
    const response = await fetch("http://localhost:9500/users/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({Username: username, Email: email, Password: password})
    })

    if(response.ok){
      setTimeout(function() {
        window.location.href = "login.html";
      }, 3000);
        showSnackBar()
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message;
      errorElement.innerText = errorMessage;
    }

  } catch (error) {
    console.log(error.message, "Sign up");
  }
});



function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function matchPassword(password, confirmPassword) {
    return password === confirmPassword
}  

function showSnackBar() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 6000); 
}
