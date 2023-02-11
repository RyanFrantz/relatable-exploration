import { connect } from 'https://esm.sh/*@planetscale/database@1.4.0';
import { planetscaleConfig } from '../planetscaleConfig.ts';

const conn = connect(planetscaleConfig);

// Update the text of the user's handle and related handle type.
// TODO: Only update if the text is different from our starting state.
const updateHandle = async (userHandle, handleText: string) => {
  // FIXME: We really should use component state here to _always_
  // update on _any_ difference (not just the starting state when
  // the browser first drew the page).
  if (userHandle.handle === handleText) {
    // Don't make the call if you've got nothing to say.
    // Probably the main reason I have no friends.
    return;
  }
  const stmt = `
    UPDATE handles
    SET handle = :text
    WHERE handleType = :handleType
  `;
  const stmt_params = {
    text: handleText,
    handleType: userHandle.handleType
  };
  const results = await conn.execute(stmt, stmt_params);
  console.log(results);
  console.log(`UPDATE ${userHandle.handle} to ${handleText}`);
};

// Expect of prop named 'userhandle' and return a table row.
export default function UserHandleRow({userHandle}) {
  return (
  <tr key={userHandle.handle}>
    <td contenteditable="true"
      // When the row loses focus, write the result to the database.
      // It might make more sense to share this state one level
      // higher and save in a batch. This way also feels nice.
      onBlur={(e) => {updateHandle(userHandle, e.target.innerText)} }
    >
    {userHandle.handle}
    </td>
    <td>{userHandle.handleType}</td>
  </tr>
  );
}
