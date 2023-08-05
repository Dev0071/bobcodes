const token = localStorage.getItem("authToken");
const userJsonString = localStorage.getItem("user");
const user = JSON.parse(userJsonString);
document.addEventListener("DOMContentLoaded", () => {

    if (!token) {
        // Redirect to the login page if the token is not present.
        window.location.href = "login.html";
    } else {
        displayGreeting()
        getAssignedProjects()
    }
});


async function getAssignedProjects() {
    try {
        const response = await fetch(`http://localhost:9500/users/projects/user/${user.userId}`)
        console.log(response)
    } catch (error) {

    }
}
function logout(){

    localStorage.clear()
    window.location.href = "login.html";

}
function displayGreeting() {


    console.log("user id", user.userId);

    if (user !== null) {


        if (user.isAdministrator === true) {
            alert("Hello King, " + user.username);
            // Admin-specific logic here...
        } else {
            alert("Hello Peasant, " + user.username);
            // User-specific logic here...
        }
    } else {
        console.error("Failed to parse JWT token.");
        // Redirect to the login page if the token is not valid.
        window.location.href = "login.html";
    }
}
