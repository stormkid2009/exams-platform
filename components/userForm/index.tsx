import { useState } from "react";

function User() {
  const [email, setEmail] = useState<string>("");

  
  const fetcher = async () => {
    const url = "http://localhost:3000/api/session/new";
    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    };
    const data = await fetch(url, reqOptions);
    const requestData = await data.json();
    console.log(requestData);
  };

  function generateSession(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  // send request to api to generat session
  if (!email) {
    console.log("Please enter valid email address!!!");
  }
  fetcher();
  }

  return (
    <div className="h-full flex flex-col items-center border-2  p-4 m-4">
      <form onSubmit={generateSession} >
        <div className="p-2 m-4 ">
          <p className="">
            please write valid email down below and click generate Session
          </p>
        </div>
        <label htmlFor="user-email" className="px-2">
          Email{" "}
        </label>
        <input
          id="user-email"
          name="email"
          type="email"
          value={email}
          required
          placeholder="username@example.com"
          aria-label="user-email"
          aria-describedby="user-email-description"
          className="p-2 m-2"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <button type="submit">Generate new Session</button>
      </form>
    </div>
  );
}

export default User;
