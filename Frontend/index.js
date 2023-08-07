const token = localStorage.getItem('authToken');
const userJsonString = localStorage.getItem('user');
const user = JSON.parse(userJsonString);
const adminSection = document.getElementById('admin-section');
const userSection = document.getElementById('user-section');
const createProjectForm = document.getElementById('create-project-form');

document.addEventListener('DOMContentLoaded', () => {
	if (!token) {
		window.location.href = 'login.html';
	} else {
		// Show or hide sections based on the user's role
		if (user && user.isAdministrator) {
			userSection.style.display = 'none';
			adminSection.style.display = 'block';
		} else {
			userSection.style.display = 'block';
			adminSection.style.display = 'none';
		}
	}

	allApiCalls();
});

const userId = user.userId;

async function fetchUserProjects(userId) {
	try {
		console.log('called');
		const response = await fetch(`http://localhost:9500/users/projects/user/${userId}`);
		const userProjects = await response.json();
		console.log(userProjects);
	} catch (error) {
		console.error('Error fetching user projects:', error.message);
	}
}

createProjectForm.addEventListener('submit', async event => {
	event.preventDefault();
	await createProject();
});

async function allApiCalls() {
	const usersResponse = await fetch('http://localhost:9500/users/all-users', {
		method: 'GET',
	});
	const users = await usersResponse.json();
	populateTeamMembers(users);

	const allProjectsApiResponse = await fetch('http://localhost:9500/api/admin/projects/', {
		method: 'GET',
	});

	const allProjects = await allProjectsApiResponse.json();
	const incompleteProjects = allProjects.filter(project => !project.IsComplete);
	const completeProjects = allProjects.filter(project => project.IsComplete);
	populateAllProjects(allProjects);
	populateIncompleteProjects(incompleteProjects);
	populateCompleteProjects(completeProjects);
}

function populateCompleteProjects(projects) {
	const allProjectsContainer = document.getElementById('complete-projects');

	projects.forEach(project => {
		const projectElement = document.createElement('div');
		projectElement.classList.add('project');

		const titleElement = document.createElement('h4');
		titleElement.textContent = project.Name;
		projectElement.append(titleElement);

		const descriptionElement = document.createElement('p');
		descriptionElement.classList.add('project-description-class');
		descriptionElement.textContent = project.Description;
		projectElement.append(descriptionElement);

		let rawDate = project.EndDate;
		let formattedDate = formatDate(rawDate);
		const endDateElement = document.createElement('p');
		endDateElement.textContent = formattedDate;
		projectElement.append(endDateElement);

		const completionStatusElement = document.createElement('p');
		completionStatusElement.textContent = project.IsComplete;
		projectElement.append(completionStatusElement);

		allProjectsContainer.appendChild(projectElement);

		projectElement.addEventListener('click', () => {
			// Redirect to projectdetails.html with the project ID as a query parameter
			window.location.href = `projectdetails.html?projectId=${project.ProjectID}`;
		});
	});
}

function populateIncompleteProjects(projects) {
	const allProjectsContainer = document.getElementById('incomplete-projects');

	projects.forEach(project => {
		const projectElement = document.createElement('div');
		projectElement.classList.add('project');

		const titleElement = document.createElement('h4');
		titleElement.textContent = project.Name;
		projectElement.append(titleElement);

		const descriptionElement = document.createElement('p');
		descriptionElement.classList.add('project-description-class');
		descriptionElement.textContent = project.Description;
		projectElement.append(descriptionElement);

		let rawDate = project.EndDate;
		let formattedDate = formatDate(rawDate);
		const endDateElement = document.createElement('p');
		endDateElement.textContent = formattedDate;
		projectElement.append(endDateElement);

		const completionStatusElement = document.createElement('p');
		completionStatusElement.textContent = project.IsComplete;
		projectElement.append(completionStatusElement);

		allProjectsContainer.appendChild(projectElement);

		projectElement.addEventListener('click', () => {
			// Redirect to projectdetails.html with the project ID as a query parameter
			window.location.href = `projectdetails.html?projectId=${project.ProjectID}`;
		});
	});
}

function populateAllProjects(projects) {
	const allProjectsContainer = document.getElementById('all-projects');

	projects.forEach((project, index) => {
		const projectElement = document.createElement('div');
        projectElement.classList.add('project');
        if (index === 0) {
            projectElement.style.marginTop = '160px';
        }
		const titleElement = document.createElement('h4');
		titleElement.textContent = project.Name;
		projectElement.append(titleElement);

		const descriptionElement = document.createElement('p');
		descriptionElement.classList.add('project-description-class');
		descriptionElement.textContent = project.Description;
		projectElement.append(descriptionElement);

		let rawDate = project.EndDate;
		let formattedDate = formatDate(rawDate);
		const endDateElement = document.createElement('p');
		endDateElement.textContent = `Completion Deadline: ${formattedDate}`;
		projectElement.append(endDateElement);

		const completionStatusElement = document.createElement('p');
		completionStatusElement.textContent = `Status: ${
			project.IsComplete ? 'Complete' : 'Incomplete'
		}`;
		projectElement.append(completionStatusElement);

		projectElement.addEventListener('click', () => {
			// Redirect to projectdetails.html with the project ID as a query parameter
			window.location.href = `projectdetails.html?projectId=${project.ProjectID}`;
		});

		allProjectsContainer.appendChild(projectElement);
	});
}

function populateTeamMembers(teamMembers) {
	const teamMembersContainer = document.getElementById('team');
	teamMembers.forEach(member => {
		const memberElement = document.createElement('div');
		memberElement.classList.add('team-member');

		const avatarElement = document.createElement('img');
		avatarElement.src = '/Frontend/images/avatar.png';
		avatarElement.style = 'height: 150px;';
		memberElement.append(avatarElement);

		const nameElement = document.createElement('p');
		nameElement.textContent = member.Username;
		memberElement.append(nameElement);

		const emailElement = document.createElement('p');
		emailElement.textContent = member.Email;
		emailElement.style = 'font-size:12px';
		memberElement.append(emailElement);

		teamMembersContainer.appendChild(memberElement);
	});
}

async function createProject() {
	try {
		const projectTitle = document.getElementById('new-project-name').value;
		const projectDescription = document.getElementById('new-project-description').value;
		const completionDate = document.getElementById('new-project-completion-date').value;

		const response = await fetch('http://localhost:9500/api/admin/create/project', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				Name: projectTitle,
				Description: projectDescription,
				EndDate: completionDate,
			}),
		});

		console.log(response);
	} catch (error) {
		console.log(error, 'post error');
	}
}

function logout() {
	localStorage.clear();
	window.location.href = 'login.html';
}

function showSection(sectionId) {
	const section = document.getElementById(sectionId);
	section.style.display = 'block';
}

function openForm() {
	document.getElementById('myForm').style.display = 'block';
}

function closeForm(event) {
	document.getElementById('myForm').style.display = 'none';
	if (event.target === formPopup || event.target.id === 'btnCloseForm') {
		formPopup.style.display = 'none';
	}
}

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
