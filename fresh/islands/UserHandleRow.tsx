// Expect of prop named 'userhandle' and return a table row.
export default function UserHandleRow({userHandle}) {
  return (
  <tr key={userHandle.handle}>
    <td contenteditable="true"
      onClick={(e) => console.log(e.target.innerText)}
    >
    {userHandle.handle}
    </td>
    <td>{userHandle.handleType}</td>
  </tr>
  );
}
