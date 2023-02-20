import { connect } from 'https://esm.sh/*@planetscale/database@1.4.0';
import { planetscaleConfig } from '../planetscaleConfig.ts';
import { useState } from "preact/hooks";

const conn = connect(planetscaleConfig);

// Expect a userHandle object as a prop and return a table row.
export default function UserHandleRow({userHandle}) {
  const [displayedHandle, setDisplayedHandle] = useState(userHandle.handle);

  // Update the text of the user's handle and related handle type.
  // TODO: Only update if the text is different from our starting state.
  const updateHandle = async (userHandle, handleText: string) => {
    // FIXME: If we update a canonical handle, we have to update the relevant
    // record in the 'user' table. Remind me why there is a user record that
    // corresponds with a 'canonical' handle...
    const stmt = `
      UPDATE handles
      SET handle = :text
      WHERE user_id = :user_id AND handleType = :handleType
    `;
    const stmt_params = {
      text: handleText,
      user_id: userHandle.user_id,
      handleType: userHandle.handleType
    };
    const results = await conn.execute(stmt, stmt_params);
    //console.log(results);
    console.log(`UPDATE ${userHandle.handle} to ${handleText}`);
            setDisplayedHandle(handleText);
            userHandle.handle = handleText;
            console.log('AFTER setDisplayedHandle(): ', displayedHandle);
  };

  return (
  <tr key={displayedHandle}>
    <td contenteditable="true"
      onInput={(e) => console.log('Detected input!')}
      // When the row loses focus, write the result to the database.
      // It might make more sense to share this state one level
      // higher and save in a batch. This way also feels nice.
      onBlur={
        (e) => {
          const updatedHandle = e.target.innerText;
          console.log('CURRENT STATE: ', displayedHandle);
          console.log('INNER TEXT: ', updatedHandle);
          // Don't make the call if you've got nothing to say.
          // Probably the main reason I have no friends.
          if (updatedHandle !== displayedHandle) {
            // FIXME: The state doesn't update...
            //updateHandle(userHandle, updatedHandle);
            //setDisplayedHandle(updatedHandle);
            console.log('AFTER setDisplayedHandle(): ', displayedHandle);
          }
        }
      }
    >
    {displayedHandle}
    </td>
    <td>{userHandle.handleType}</td>
  </tr>
  );
}
