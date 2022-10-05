import axios from "app/callbacks/axios";

export const userLogin = async (
	username,
	password,
	setIsLoading,
	setError,
	authDispatch,
	navigate,
	location
) => {
	setIsLoading(true);
	await axios
		.post(`${process.env.REACT_APP_USER_SERVICE}/user/login`, {
			username: username,
			password: password,
		})
		.then((data) => {
			const jwt = data.data.jwt;
			authDispatch({ username, password, jwt, roles: [1984] });
			/**
			 * Observation:
			 * If we direct go to dashboard, it redirects to login because of RequireAuth (Dashboard is protected)
			 * If login ok, it checks from which location you are coming (location?.state?.from?.pathname). If you are coming from /profile it redirects to /profile
			 * 
			 */
			const from = location?.state?.from?.pathname || '/dashboard'
			console.log('from: ', from);
			navigate(from, { replace: true })
		})
		.catch((error) => {
			if (error !== undefined) {
				setError({
					status: true,
					details: error.message,
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
