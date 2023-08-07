// const token = localStorage.getItem('authToken');
// // console.log(token);
// const getTokenClaim = (token, claimName) => {
// 	try {
// 		const base64Url = token.split('.')[1];
// 		const base64 = base64Url.replace('-', '+').replace('_', '/');
// 		const decodedData = JSON.parse(atob(base64));
// 		return decodedData[claimName];
// 	} catch (error) {
// 		console.error('Error decoding token:', error);
// 		return null;
// 	}
// };

// const userId = getTokenClaim(token, 'userId');
// console.log(userId);

// const fetchUserProjects = async userId => {
// 	try {
// 		const userProjectsApiResponse = await fetch(
// 			`http://localhost:9500/api/user/projects/${userId}`,
// 			{
// 				method: 'GET',
// 				headers: {
// 					Authorization: `Bearer ${token}`, // Include the authentication token
// 				},
// 			},
// 		);

// 		if (userProjectsApiResponse.ok) {
// 			const userProjects = await userProjectsApiResponse.json();
// 			console.log(userProjects);
// 			// populateUserProjects(userProjects);
// 		} else {
// 			console.error('Failed to fetch user projects:', userProjectsApiResponse.status);
// 		}
// 	} catch (error) {
// 		console.error('Error fetching user projects:', error);
// 	}
// };
