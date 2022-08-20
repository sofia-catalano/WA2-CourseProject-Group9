import { Routes, BrowserRouter, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import {useState, useEffect} from 'react';
import Sidebar from "./components/Sidebar/Sidebar";
import Container from "@mui/material/Container";
import RegistrationPage from "./components/Registration/RegistrationPage";
import LoginPage from "./components/Login/LoginPage";

function App() {

    const [userRole, setUserRole] = useState('admin');
    const navigate = useNavigate();
    const [toggled, setToggled] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const handleCollapse = (value) => {
        setCollapsed(value);
    };

    const handleToggle = () => {
        setToggled(!toggled);
    };
    const AsideProps = {
        toggled,
        collapsed,
        userRole,
        handleToggle,
        handleCollapse,
    }
  return (
     <>
          <Navbar/>
          <Sidebar {...AsideProps} />
              <Routes>
                  <Route exact path="/" element={<Homepage/>}/>
                  <Route exact path="/user/login" element={<LoginPage/>}/>
                  <Route exact path="/user/register" element={<RegistrationPage/>}/>
              </Routes>
      </>
  );
}

export default App;
