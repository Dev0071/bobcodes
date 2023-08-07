const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('projectId');
console.log(projectId);


async function fetchProjectDetails() = {
    try {
        const response = await fetch(`http://localhost:9500/api/admin/project/${projectId}`, {
            method: "GET"
        })
    } catch (error) {
        console.log(error.message);
    }
}