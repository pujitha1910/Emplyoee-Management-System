// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // React Router v6
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import EmployeeList from "./components/employeeList";
import CreateEmployee from "./components/createEmployee";
import Header from "./components/header";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUsername(localStorage.getItem("username"));
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
  };

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        {isLoggedIn && <Header username={username} onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/create-employee"
            element={
              isLoggedIn ? <CreateEmployee /> : <Login onLogin={handleLogin} />
            }
          />
          <Route path="/create-employee/:id" element={<CreateEmployee />} />
          <Route
            path="/employee-list"
            element={
              isLoggedIn ? <EmployeeList /> : <Login onLogin={handleLogin} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
