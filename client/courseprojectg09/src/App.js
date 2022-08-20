import { Routes, BrowserRouter, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import {useState, useEffect} from 'react';
import Sidebar from "./components/Sidebar/Sidebar";
import Container from "@mui/material/Container";

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
          {/*<Routes>
                 <Route exact path="/" element={<Homepage/>}/>
          </Routes>*/}
      </>
  );
}

export default App;
