import axios from "app/callbacks/axios";

export const userSignUp = async (
	name,
	username,
	password,
	license,
	setIsLoading,
	setError
) => {
	setIsLoading(true);
	await axios
		.post(`${process.env.REACT_APP_USER_SERVICE}/user/signup`, {
			name: name,
			username: username,
			password: password,
			license: license,
		})
		.then((data) => {
			alert(data.message);
		})
		.catch((error) => {
			if (error !== undefined) {
				setError({
					status: true,
					details: error.message
				});
			} else {
				setError({
					status: true,
					details: 'This service is not avaialble at the moment. Please try again later.'
				});
			}
			setIsLoading(false);
		});
	setIsLoading(false);
};
