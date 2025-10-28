import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login"
import Signup from "./Signup"
import User from "./User";
import ForgotPassword from "./ForgotPassword"
import Employee from "./Employee";
function App() {
  const [Username, setUsername] = useState("");
  return (
    <BrowserRouter>
      <Routes>
        <
          Route path="/" 
          element={<Home />} 
        />
        <Route path="/login/" element={<Login setUsername={setUsername} />} />
        <Route path="/user/" element={<User username={Username} />} />
        <Route path="/Signup/" element={<Signup />} />
        <Route path="/ForgotPassword/" element={<ForgotPassword />} />
        <Route path="/employee/" element={<Employee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
