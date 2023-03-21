import { Head } from "$fresh/runtime.ts";
import Footer from "../components/Footer.tsx";

export default function Home() {
  return (
    <>
      <header>
        <nav>
          <a href="/users">Users</a>
          <a href="/upload/user">Upload Users</a>
        </nav>
      </header>
      <main>
        Relatable Demo
      </main>
      <Footer/>
    </>
  );
}
