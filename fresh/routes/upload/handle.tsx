import { Head } from "$fresh/runtime.ts";
import Footer from "../../components/Footer.tsx";
import UploadHandleForm from "../../islands/UploadHandleForm.tsx";


export default function UploadHandle() {
  return (
    <>
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
