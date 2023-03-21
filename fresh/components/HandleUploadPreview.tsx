export default function HandleUploadPreview({handles}) {
  return (
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Handle</th>
          <th>Handle Type</th>
        </tr>
      </thead>
      <tbody>
      {handles.map((handle, idx) => (
        <tr key={idx}>
          <td>{handle.userId}</td>
          <td>{handle.handle}</td>
          <td>{handle.handleType}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
