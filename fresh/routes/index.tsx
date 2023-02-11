import { Head } from "$fresh/runtime.ts";
import Footer from "../components/Footer.tsx";

export default function Home() {
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
        Relatable Demo
      </main>
      <Footer/>
    </>
  );
}
