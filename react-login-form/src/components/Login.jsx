import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/authProvider";
import axios from "../api/axios";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [name, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !pwd) {
      setErrMsg("invalid request");
      return;
    }

    try {
      const resp = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: name, pwd }),
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );
      console.log(resp.data);
      const accessToken = resp?.data?.accessToken;
      const roles = resp?.data?.roles;
      setAuth({ name, pwd, roles, accessToken });
      setName("");
      setPwd("");
      setIsSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 400) {
        setErrMsg("Bad Request");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {isSuccess ? (
        <section>
          <h1>You are logged in</h1>
          <p>
            <a href="/home">Go to home</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              ref={userRef}
              autoComplete="off"
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
            />
            <button type="submit" disabled={!name || !pwd ? true : false}>
              Sign In
            </button>
          </form>
          <p>
            Need an account? <br />
            <span className="line">
              <a href="https://www.google.com">Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
