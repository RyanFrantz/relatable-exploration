import { Head } from "$fresh/runtime.ts";
import Footer from "../../components/Footer.tsx";
import UploadForm from "../../islands/UploadForm.tsx";


export default function Upload() {
  return (
    <>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/users">Users</a>
        </nav>
      </header>
      <main>
        <UploadForm />
      </main>
      <Footer/>
    </>
  );
}
