import {Routes, Navigate, Route, useNavigate, useLocation} from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import {useState, useEffect} from 'react';
import Sidebar from "./components/Sidebar/Sidebar";
import Container from "@mui/material/Container";
import Layout from "./components/Layout/Layout";
import {UserProvider, useUser} from "./components/UserProvider";
import AllRoutes from "./utils/Routes";


function App() {
    const navigate = useNavigate();
    const [toggled, setToggled] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const handleCollapse = (value) => {
        setCollapsed(value);
    };

    const handleToggle = () => {
        setToggled(!toggled);
    };


    return (
        <Container maxWidth='xxl' disableGutters={true}>
            <UserProvider>
                <Layout>
                    <AllRoutes/>
                </Layout>
            </UserProvider>
        </Container>
    );
}

export default App;
