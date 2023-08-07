const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('projectId');

async function fetchProjectDetails() {
    try {
        const response = await fetch(`http://localhost:9500/api/admin/project/${projectId}`, {
            method: "GET"
        });

        const projectDetails = await response.json();


        const projectIdElement = document.querySelector('#project-id');
        const projectName = document.querySelector('#project-name');
        const projectDescription = document.querySelector('#project-description');
        const projectEndDate = document.querySelector('#project-end-date');
        const completionStatus = document.querySelector('.completion-status');
        
        let parsedDate = formatDate(projectDetails.EndDate)
        projectIdElement.textContent = `Project ID: ${projectDetails.ProjectID}`;
        projectName.textContent = `Name: ${projectDetails.Name}`;
        projectDescription.textContent = `Description: ${projectDetails.Description}`;
        projectEndDate.textContent = `End Date: ${parsedDate}`;
        completionStatus.textContent = `Status: ${projectDetails.IsComplete ? 'Complete' : 'Incomplete'}`;

    } catch (error) {
        console.log(error.message);
    }
}


async function fetchUnassignedUsers() {
    try {
        const response = await fetch('http://localhost:9500/api/admin/unassigned', {
            method: "GET"
        });

        if (response.ok) {
            const users = await response.json();
            populateUserList(users);
        } else {
            console.log("Something went wrong while fetching users");
        }
    } catch (error) {
        console.log(error.message);
    }
}
function populateUserList(users) {
    const userListContainer = document.getElementById('user-list');

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');

        const avatar = document.createElement('img');
        avatar.src =  "/Frontend/images/avatar.png"; 
        userCard.appendChild(avatar);

        const name = document.createElement('p');
        name.textContent = `Name: ${user.Username}`;
        userCard.appendChild(name);

        const email = document.createElement('p');
        email.textContent = `Email: ${user.Email}`;
        userCard.appendChild(email);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        userCard.appendChild(checkbox);

        userListContainer.appendChild(userCard);
    });
}
fetchProjectDetails();
fetchUnassignedUsers();
function formatDate(inputDate) {

    const date = new Date(inputDate);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const paddedDay = day < 10 ? '0' + day : day;
    const paddedMonth = month < 10 ? '0' + month : month;

    const formattedDate = `${paddedDay}/${paddedMonth}/${year}`;

    return formattedDate;
}