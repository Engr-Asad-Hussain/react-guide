import { Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

/*
 * Helper text should not be used for showing error messages
 * HelperText for showing valid/invalid values
*/
export function HelperText({ children }) {
    return (
        <Box style={{ display: 'flex', color: '#6E6E6E' }}>
            <HelpIcon fontSize="inherit" style={{ marginRight: '5px' }} />
            {children}
        </Box>
    )
}