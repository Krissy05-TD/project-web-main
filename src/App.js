import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home"
import Create from "./pages/create"
import Login from "./pages/login"
import LoginN from "./pages/loginN"
import Welcome from "./pages/welcome"
import Welcomes from "./pages/welcomes"
import Edit from "./pages/edit"
// import Contact from "./pages/contact"
import New from "./pages/new"
import Forgot from "./pages/forgot"
import NewOTP from "./pages/newotp"
import OTP from "./pages/otp"

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="create" element={<Create/>} />
      <Route path="login" element={<Login/>} />
      <Route path="loginN" element={<LoginN/>} />
      <Route path="welcome" element={<Welcome/>} />
      <Route path="welcomes" element={<Welcomes/>} />
      <Route path='/edit' element={<Edit/>} />
      {/* <Route path='/contact' element={<Contact/>} /> */}
      <Route path="new" element={<New/>} />
      <Route path="forgot" element={<Forgot/>} />
      <Route path="newotp" element={<NewOTP/>} />
      <Route path="otp" element={<OTP/>} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
