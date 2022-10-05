import { CircularProgress, Button } from "@mui/material";

/*
 * Custom button for showing loading effect on endpoint calling.
*/
export function ButtonLoading({ isLoading, children, ...props }) {
	if (isLoading) {
		return (
			<CircularProgress size={26} style={{ marginInline: 'auto'}}/>
		)
	}
	return (
		<Button
			type="submit"
			variant="contained"
			color="primary"
			size="large"
			{...props}
		>
			{children}
		</Button>
	)
}