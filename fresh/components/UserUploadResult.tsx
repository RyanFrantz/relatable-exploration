export default function UserUploadResult({users}) {
  return (
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Upload Status</th>
        </tr>
      </thead>
      <tbody>
      {users.map((user, idx) => (
        <tr key={idx}>
          <td>{user.name}</td>
          <td>{user.status}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
