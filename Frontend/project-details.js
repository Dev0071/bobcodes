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
        projectIdElement.innerHTML = `<strong> Project ID: </strong>${projectDetails.ProjectID}`;
        projectName.innerHTML = `<strong> Project Name: </strong> ${projectDetails.Name}`;
        projectTitle = projectDetails.Name
        console.log(`${projectTitle}`, 'project titlllll')
        projectDescription.innerHTML = `<strong> Description:  </strong>${projectDetails.Description}`;
        projectEndDate.innerHTML = `<strong> End Date: </strong> ${parsedDate}`;
        completionStatus.textContent = `${projectDetails.IsComplete ? 'Complete' : 'Incomplete'}`;


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
        populateUserListWithoutCheckboxes(users)
    }catch (e) {
        console.log(e.message)
    }


}
async function fetchUnassignedUsers() {
    try {
        const response = await fetch('http://localhost:9500/api/admin/unassigned', {
            method: "GET"
        });

        if (response.ok) {
            const users = await response.json();
           populateUserListWithCheckboxes(users)
        } else {
            console.log("Something went wrong while fetching users");
        }
    } catch (error) {
        console.log(error.message);
    }
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
                ProjectID: projectId,
                Username: userName,
                ProjectName: projectTitle
            })
        });

        if (!response.ok) {
            console.log(projectTitle, "dbkjsbdjsbdskjbdjskjbdsj");
            console.log('Error updating user status');
            return;
        }


    } catch (error) {
        console.error('An error occurred:', error);
    }
}
function populateUserListWithCheckboxes(users) {
    const userListContainer = document.getElementById('user-list');
    if (users.length === 0) {
        const noUsersMessage = document.createElement('p');
        noUsersMessage.textContent = 'No available workers at the moment.';
        noUsersMessage.style = 'text-align: center;'
        userListContainer.appendChild(noUsersMessage);
    } else {
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');

            const avatar = document.createElement('img');
            avatar.src = "/Frontend/images/avatar.png";
            userCard.appendChild(avatar);

            const name = document.createElement('p');
            name.textContent = `Name: ${user.Username}`;
            userCard.appendChild(name);


            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.userId = user.UserID;
            checkbox.dataset.userName = user.Username;
            checkbox.addEventListener('change', handleCheckboxChange);
            userCard.appendChild(checkbox);

            userListContainer.appendChild(userCard);
        });
    }
}

function populateUserListWithoutCheckboxes(users) {
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



        userListContainer.appendChild(userCard);
    });
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

function logout() {
	localStorage.clear();
	window.location.href = 'login.html';
}