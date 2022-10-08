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
		.post(`${process.env.REACT_APP_USER_SERVICE}/user/auth`,
			JSON.stringify({ username, password }),
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		)
		.then((data) => {
			const { accessToken } = data.data;
			authDispatch( prev => ({ ...prev, username, accessToken }));
			/**
			 * Observation:
			 * If we direct go to dashboard, it redirects to login because of RequireAuth (Dashboard is protected)
			 * If login ok, it checks from which location you are coming (location?.state?.from?.pathname). If you are coming from /profile it redirects to /profile
			 * 
			 */
			console.log(location)
			const from = location?.state?.from?.pathname || '/dashboard'
			navigate(from, { replace: true })
		})
		.catch((error) => {
			console.log('error', error?.response)
			if (!error?.response) {
				setError({
					status: true,
					details: 'This service is not avaialble at the moment. Please try again later.'
				});
			} else {
				setError({
					status: true,
					details: error.response.data.message,
				});
			}
			setIsLoading(false);
		});
	setIsLoading(false);
};
