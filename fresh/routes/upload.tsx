import { Head } from "$fresh/runtime.ts";
import Footer from "../components/Footer.tsx";
import UploadForm from "../islands/UploadForm.tsx";


export default function Upload() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css"/>
      </Head>
      <header>
        <nav>
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
