import React, { useState } from "react";
import "./Register.css"; // Import your CSS file for styling
import { useNavigate } from "react-router-dom";
const AuthForm = ({ setUser, setSignedIn }) => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("signin");
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    user_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your authentication or registration logic here
    if (activeForm == "signin") {
      try {
        const response = await fetch(
          "http://localhost:3001/api/users/" + formData.email,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const result = await response.json();
          //
          if (formData.user_password == result[0].user_password) {
            setSignedIn(1);
            setUser(result[0]);
            navigate("/");
          } else {
          }

          console.log("Data fetched:", result);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch(
          "http://localhost:3001/api/insertsqlData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const resp = await fetch(
            "http://localhost:3001/neo4japi/createUser",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );
          const usertomongo = await fetch(
            "http://localhost:3001/mongoUsers/" + formData.user_name
          );
          console.log("Data inserted:", result);
        } else {
          console.error("Failed to insert data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    console.log("Form submitted:", formData);
    // You can send the form data to your backend for authentication/registration
  };

  const switchForm = (formType) => {
    setActiveForm(formType);
    setFormData({ user_name: "", email: "", user_password: "" }); // Reset form data when switching forms
  };

  return (
    <div className="auth-container">
      <div className="auth-switch">
        <span
          className={activeForm === "signin" ? "active" : ""}
          onClick={() => switchForm("signin")}
        >
          Sign In
        </span>
        <span
          className={activeForm === "register" ? "active" : ""}
          onClick={() => switchForm("register")}
        >
          Register
        </span>
      </div>
      <div className="auth-form">
        <h2>{activeForm === "signin" ? "Sign In" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {activeForm === "register" && (
            <label>
              Username:
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
              />
            </label>
          )}
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="user_password"
              value={formData.user_password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">
            {activeForm === "signin" ? "Sign In" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
