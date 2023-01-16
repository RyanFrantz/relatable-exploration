// PoC for a user page.
/* TODO: Add the following meta tag to our Head component:
 * <meta name="viewport" content="initial-scale=1, width=device-width" />
 * See https://mui.com/material-ui/getting-started/usage/#responsive-meta-tag
 */

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

export default function User() {
  return (
    <Container maxWidth = "lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ bgcolor: "orange" }}>RF</Avatar>
      </Box>
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ bgcolor: "green" }}>CN</Avatar>
      </Box>
    </Container>
  );
}
