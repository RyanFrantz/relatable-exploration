import { Head } from "$fresh/runtime.ts";
import Footer from "../../components/Footer.tsx";
import UploadHandleForm from "../../islands/UploadHandleForm.tsx";


export default function UploadHandle() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css"/>
      </Head>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/users">Users</a>
        </nav>
      </header>
      <main>
        <UploadHandleForm />
      </main>
      <Footer/>
    </>
  );
}
