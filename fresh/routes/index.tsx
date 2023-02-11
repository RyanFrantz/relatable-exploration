import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css"/>
      </Head>
      <header>
        <nav>
          <a href="/user/1">User 1</a>
          <a href="/user/7">User 7</a>
        </nav>
      </header>
      <main>
        Relatable Demo
      </main>
      <footer>
        I'm a footer.
      </footer>
    </>
  );
}
