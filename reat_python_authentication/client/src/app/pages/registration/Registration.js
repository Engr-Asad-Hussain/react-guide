import { useState, useEffect } from 'react';
import { ButtonLoading, HelperText } from 'app/custom';
import { userSignUp } from 'app/callbacks';
import { Typography, Button, Grid, TextField, Fade, Box } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


export function Registration() {
	console.log('Page: Registration: ', window.location.pathname)
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');

	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);

	const [error, setError] = useState({ status: false, details: "" });
	const [isLoading, setIsLoading] = useState(false);

	// Password
	useEffect(() => {
		setValidPwd(PWD_REGEX.test(pwd));
		setValidMatch(pwd === matchPwd && pwd !== '');
	}, [pwd, matchPwd])


	const _handleSubmit = (event) => {
		event.preventDefault();

		// If button enabled with JS hack
		if (!EMAIL_REGEX.test(username) || !PWD_REGEX.test(pwd) || !name || !matchPwd) {
			setError({
				status: true,
				details: 'Please provide valid input fields'
			});
			return
		}
		userSignUp(
			name,
			username,
			pwd,
			'FREE',
			setIsLoading,
			setError,
		);
	}

	return (
		<section>
			<Box maxWidth={400} marginInline='auto'>
				<Fade in={error.status}>
					<Typography color='error' align='center'>
						{error.details}
					</Typography>
				</Fade>
				<Grid
					component="form"
					onSubmit={_handleSubmit}
				>
					<TextField
						id="fullname"
						name="fullname"
						type="text"
						margin="dense"
						placeholder="Full name"
						onChange={(e) => setName(e.target.value)}
						autoFocus
						required
						fullWidth
					/>
					<TextField
						type="email"
						id="email-address"
						name="email-address"
						margin="dense"
						placeholder="Email address"
						onChange={(e) => setUsername(e.target.value)}
						required
						fullWidth
					/>
					<TextField
						id="password"
						type="password"
						placeholder="Password"
						margin="dense"
						error={Boolean(pwd) && !validPwd}
						onChange={(e) => setPwd(e.target.value)}
						onFocus={() => setPwdFocus(true)}
						FormHelperTextProps={{ component: 'div' }}
						helperText={pwdFocus && (
							<HelperText>
								<p style={{ margin: 0 }}>
									Use 8 or more characters with a mix of letters, numbers & special characters.
								</p>
							</HelperText>
						)}
						aria-invalid={validPwd ? "false" : "true"}
						required
						fullWidth
					/>
					<TextField
						type="password"
						id="confirm-password"
						placeholder="Confirm password"
						error={Boolean(matchPwd) && !validMatch}
						margin="dense"
						onChange={(e) => setMatchPwd(e.target.value)}
						fullWidth
						required
					/>
					<Fade in={Boolean(matchPwd) && !validMatch}>
						<Typography color="error" style={{ margin: 0, fontSize: '0.75rem' }}>
							<ErrorIcon fontSize="inherit" style={{ marginRight: '5px' }} />
							<span>Password do not match</span>
						</Typography>
					</Fade>
					<Box display='grid'>
						<ButtonLoading
							disabled={!(Boolean(name) && Boolean(username) && validPwd && validMatch)}
							isLoading={isLoading}
						>
							Create your account
						</ButtonLoading>
						<Button
							variant="contained"
							color="primary"
							size="large"
							style={{ marginTop: '5px' }}
						>
							Back
						</Button>
						<br />
					</Box>
				</Grid>
			</Box>
		</section>
	);
}