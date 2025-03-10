import Head from "next/head";
import Intro from "src/components/introduction";
import LoginForm from "src/components/forms/user/login-form";

export default function Home() {
  return (
    <>
      <Head>
        <title>Exams-platform</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Content is directly passed as children to Layout */}
      <Intro />
      <LoginForm />
    </>
  );
}
