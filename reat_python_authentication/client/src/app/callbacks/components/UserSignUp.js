import axios from "app/callbacks/axios";

export const userSignUp = async (
	name,
	username,
	password,
	setIsLoading,
	setError
) => {
	setIsLoading(true);
	await axios
		.post(`${process.env.REACT_APP_USER_SERVICE}/user/signup`,
			JSON.stringify({ name, username, password }),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		)
		.then((data) => {
			alert(data.data.message);
		})
		.catch((error) => {
			if (!error?.response) {
				setError({
					status: true,
					details: error.response.message,
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
