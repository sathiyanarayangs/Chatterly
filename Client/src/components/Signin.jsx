import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import "./Signin.css";

const Signin = () => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const res = await fetch("http://localhost:5000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
    } else if (data.role === "admin") {
      dispatch({ type: "ADMIN", payload: { role: 1, email: data.email } });
      window.alert(data.message);
      navigate("/");
    } else {
      dispatch({ type: "MEMBER", payload: { role: 2, email: data.email } });
      window.alert(data.message);
      navigate("/");
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="card">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} method="POST">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="signup-btn">
              <p>
                <Link to="/signup">Sign Up</Link>
              </p>
            </div>
            <div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
