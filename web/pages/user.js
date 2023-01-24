// PoC for a user page.
/* TODO: Add the following meta tag to our Head component:
 * <meta name="viewport" content="initial-scale=1, width=device-width" />
 * See https://mui.com/material-ui/getting-started/usage/#responsive-meta-tag
 */

import useSWR from 'swr';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';

const fetcher = async (...args) => {
  const res = await fetch(...args)
  return res.json();
};

const lambdaUrl = 'https://7dsgyi7ncu7tn6gzrzzgiobzoq0pykmb.lambda-url.us-east-2.on.aws'
const handlePrefix = /\w+\|/; // We'll strip this from the fetched handles

export default function User() {
  const { data, error, isLoading } = useSWR(lambdaUrl, fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Handle</TableCell>
            <TableSortLabel active>
              <TableCell align="left">Handle Type</TableCell>
            </TableSortLabel>
              <TableCell>Employment Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.sk}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell >{row.sk.replace(handlePrefix, '')}</TableCell>
              <TableCell >{row.handleType}</TableCell>
              <TableCell >{row.employmentStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </Container>
  );
}

/*
export default function User() {
  return (
      </Box>
    </Container>
  );
}
*/
