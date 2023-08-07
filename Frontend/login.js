const loginForm = document.getElementById('login-form');
const errorElement = document.getElementById('error-message');

loginForm.addEventListener('submit', async event => {
	event.preventDefault();
	errorElement.innerText = '';
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	try {
		const response = await fetch(`http://localhost:9500/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ Email: email, Password: password }),
		});

		if (response.ok) {
			const data = await response.json();
			const token = data.token;

			localStorage.setItem('authToken', token);
			const decodedToken = parseJwt(token);

			// Fetch user details using the user ID from the payload
			const userId = decodedToken.UserID;
			console.log(userId);
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
			fetchUserProjects(userId);

			const userDetailsResponse = await fetch(`http://localhost:9500/users/user/${userId}`, {
				method: 'GET',
			});

			if (!userDetailsResponse.ok) {
				throw new Error('Failed to fetch user details.');
			}

			const userDetails = await userDetailsResponse.json();

			decodedToken.isAdmin = userDetails.isAdmin;

			const user = {
				userId: decodedToken.UserID,
				username: decodedToken.Username,
				isAdministrator: decodedToken.isAdmin,
			};

			// Save the user object in localStorage
			localStorage.setItem('user', JSON.stringify(user));

			window.location.href = 'index.html';

			// const project = fetchUserProjects(userId);
			// console.log(project);
		} else {
			const errorResponse = await response.json();
			const errorMessage = errorResponse.message;
			errorElement.innerText = errorMessage;
		}
	} catch (error) {
		console.log(error);
	}
});

function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const payload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join(''),
		);

		return JSON.parse(payload);
	} catch (error) {
		console.error('Error parsing JWT token:', error);
		return null;
	}
}
