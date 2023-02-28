import { useState } from "preact/hooks";
import UserUploadPreview from '../components/UserUploadPreview.tsx';
import Papa from 'https://esm.sh/papaparse@5.3.2';

export default function UploadForm() {
  const [uploadedData, setUploadedData] = useState();

  // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  // With a non-submit button, I expect we won't see this get called.
  const handleSubmit = (e) => {
    // Prevent form submission. Useful to do things on the same page.
    e.preventDefault();
    console.log('Submitted!');
  };

  const handleChange = (e) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true, // Organize by header.
      skipEmptyLines: true,
      transformHeader: function(header) {
        return camelize(header); // "Employment Status" -> "employmentStatus"
      },
      complete: function(results) {
        //console.log(results.data);
        // results.meta.fields contains the header names.
        setUploadedData(results.data);
      }
    });
  };

  const handleUpload = () => {
    console.log('Upload starting...');
    // We'll call our API from here.
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <p>
        Your CSV should contain two headers: "Name" and "Employment Status".
      </p>
      <input id="csv-input-file" type="file" onChange={handleChange}/>
    </form>
    {uploadedData ?
      (
      <div>
        <article>Preview users to upload:
          <UserUploadPreview users={uploadedData} />
          <button type="button" onClick={handleUpload}>Upload Users</button>
        </article>
      </div>
      ) : (
      <div></div>
      )
    }
    </>
  );
}
