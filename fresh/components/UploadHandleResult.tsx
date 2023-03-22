export default function UploadHandleResult({handles}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Handle</th>
          <th>Upload Status</th>
        </tr>
      </thead>
      <tbody>
      {handles.map((handle, idx) => (
        <tr key={idx}>
          <td>{handle.handle}</td>
          <td>{handle.status}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
