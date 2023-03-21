import { useState } from "preact/hooks";
import HandleUploadPreview from '../components/HandleUploadPreview.tsx';
import HandleUploadResult from '../components/HandleUploadResult.tsx';
import Papa from 'https://esm.sh/papaparse@5.3.2';

export default function UploadHandleForm() {
  const [uploadedData, setUploadedData] = useState();
  const [submittedData, setSubmittedData] = useState();

  // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nothing to see here.');
  };

  const handleChange = (e) => {
    console.log('Handling change for handles');
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true, // Organize by header.
      skipEmptyLines: true,
      transformHeader: function(header) {
        return camelize(header); // "Handle Type" -> "handleType"
      },
      complete: function(results) {
        console.log(results);
        setUploadedData(results.data);
      }
    });
  };

  const handleUpload = async () => {
    const allSubmissions = submittedData || []; // Do this in state init.
    for (const user of uploadedData) {
      const resp = await fetch(`/api/user/${user.userId}/handles`, {
        method: "POST",
        body: JSON.stringify({handle: user.handle, handleType: user.handleType})
      });
      const respBody = await resp.json();
      const uploadResult = {handle: user.handle, status: respBody.message};
      allSubmissions.push(uploadResult);
    }
    setSubmittedData(allSubmissions);
    // Clear uploaded data and replace it with state about results from
    // submitted data so we can display results.
    setUploadedData(null);
  };

  // User ID, Handle, Handle Type
  return (
    <>
    <form onSubmit={handleSubmit}>
      <p>
        Your CSV should contain three headers: "User Id", "Handle", and "Handle Type".
      </p>
      <input accept="text/csv" id="csv-input-file" type="file" onChange={handleChange}/>
    </form>
    {uploadedData ?
      (
      <div>
        <article>Preview handles to upload:
          <HandleUploadPreview handles={uploadedData} />
          <button type="button" onClick={handleUpload}>Upload Handles</button>
        </article>
      </div>
      ) : (
      <div></div>
      )
    }
    {submittedData ?
      (
      <div>
        <article>Status of user upload:
          <HandleUploadResult handles={submittedData} />
        </article>
      </div>
      ) : (
      <div></div>
      )
    }
    </>
  );
}
