export default function UserUploadPreview({users}) {
  return (
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Employment Status</th>
        </tr>
      </thead>
      <tbody>
      {users.map((user, idx) => (
        <tr key={idx}>
          <td>{user.name}</td>
          <td>{user.employmentStatus}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
