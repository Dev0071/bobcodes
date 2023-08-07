const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('projectId');

async function fetchProjectDetails() {
    try {
        const response = await fetch(`http://localhost:9500/api/admin/project/${projectId}`, {
            method: "GET"
        });

        const projectDetails = await response.json();

        // Select the HTML elements where you want to populate the project details
        const projectIdElement = document.querySelector('#project-id');
        const projectName = document.querySelector('#project-name');
        const projectDescription = document.querySelector('#project-description');
        const projectEndDate = document.querySelector('#project-end-date');
        const completionStatus = document.querySelector('.completion-status');

        // Populate the project details into the selected elements
        projectIdElement.textContent = `Project ID: ${projectDetails.ProjectID}`;
        projectName.textContent = `Name: ${projectDetails.Name}`;
        projectDescription.textContent = `Description: ${projectDetails.Description}`;
        projectEndDate.textContent = `End Date: ${projectDetails.EndDate}`;
        completionStatus.textContent = `Status: ${projectDetails.IsComplete ? 'Complete' : 'Incomplete'}`;

    } catch (error) {
        console.log(error.message);
    }
}

fetchProjectDetails();