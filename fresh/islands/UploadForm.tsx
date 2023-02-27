import Papa from 'https://esm.sh/papaparse@5.3.2';

export default function UploadForm() {
  // With a non-submit button, I expect we won't see this get called.
  const handleSubmit = (e) => {
    // Prevent form submission. Useful to do things on the same page.
    e.preventDefault();
    console.log('Submitted!');
  };

  const handleChange = (e) => {
    const file = event.target.files[0];
    console.log('File to upload: ', file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        // TODO: Set state here and use it when the upload button is clicked.
        console.log(results.data);
      }
    });
  };

  const handleUpload = () => {
    console.log('Upload starting...');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input id="csv-input-file" type="file" onChange={handleChange}/>
      <button type="button" onClick={handleUpload}>Upload CSV</button>
    </form>
  );
}
