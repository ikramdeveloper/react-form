import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

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
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = resp?.data?.accessToken;
      const roles = resp?.data?.roles;

      setAuth({ username: name, pwd, roles, accessToken });
      setName("");
      setPwd("");
      navigate(from, { replace: true });
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
          <Link to="/register">Register</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
