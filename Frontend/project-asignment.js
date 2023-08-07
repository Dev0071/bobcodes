const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('projectId');
let projectTitle;

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
        projectTitle = projectDetails.Name
        projectDescription.textContent = `Description: ${projectDetails.Description}`;
        projectEndDate.textContent = `End Date: ${parsedDate}`;
        completionStatus.textContent = `Status: ${projectDetails.IsComplete ? 'Complete' : 'Incomplete'}`;


        if (projectDetails.IsComplete) {
            fetchUsersUnderProject();
        } else {

            fetchUnassignedUsers();
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function fetchUsersUnderProject(){
//   12F270BF-E797-44D7-A538-47C791A927B1

    try {
        const usersResponse = await  fetch(`http://localhost:9500/users/projects/user/${projectId}`, {
            method: "GET"
        })
        const users = await usersResponse.json();
        console.log(users, 'eeeeee')
    }catch (e) {
        console.log(e.message)
    }


}
async function fetchUnassignedUsers() {
    try {
        const response = await fetch('http://localhost:9500/api/admin/unassigned', {
            method: "GET"
        });


        const  users = await  response.json()
        console.log("unassigned users", users)

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
        avatar.src = "/Frontend/images/avatar.png";
        userCard.appendChild(avatar);

        const name = document.createElement('p');
        name.textContent = `Name: ${user.Username}`;
        userCard.appendChild(name);

        const email = document.createElement('p');
        email.textContent = `Email: ${user.Email}`;
        userCard.appendChild(email);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.dataset.userId = user.UserID;
        checkbox.dataset.userName = user.Username
        console.log(checkbox.dataset.userId = user.UserID,
            checkbox.dataset.userName = user.Username)
        checkbox.addEventListener('change', handleCheckboxChange);
        userCard.appendChild(checkbox);

        userListContainer.appendChild(userCard);
    });
}

async function handleCheckboxChange(event) {
    const userId = event.target.dataset.userId;
    const isChecked = event.target.checked;

    const {userName} = event.target.dataset; // Destructuring the userName from the dataset

    if (!userName) {
        console.error('Username is missing');
        return;
    }

    try {
        const response = await fetch(`http://localhost:9500/api/admin/assign/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserID: userId,
                projectId: projectId,
                UserName: userName,
                ProjectName: projectTitle
            })
        });

        if (!response.ok) {
            console.log('Error updating user status');
            return;
        }


    } catch (error) {
        console.error('An error occurred:', error);
    }
}


fetchProjectDetails();

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

