import axios from "app/callbacks/axios";

export const userLogout = async () => {
	await axios
		.post(`${process.env.REACT_APP_USER_SERVICE}/user/logout`,
			{
				headers: { 'Content-Type': 'application/json' },
				// Authorization Token
				// Cookie
			}
		)
		.then((data) => {
		})
		.catch((error) => {
			
		});
};
