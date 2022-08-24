import { Routes, BrowserRouter, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import {useState, useEffect} from 'react';
import Sidebar from "./components/Sidebar/Sidebar";
import Container from "@mui/material/Container";
import RegistrationPage from "./components/Registration/RegistrationPage";
import LoginPage from "./components/Login/LoginPage";

import Grid from '@mui/material/Grid';
import UserTicketsList from "./components/user/UserTicketsList";
import UserProfile from "./components/user/Profile";
import UsersList from "./components/admin/UsersList";
import AdminTicketsList from "./components/admin/AdminTicketsList";
import UserOrdersList from "./components/user/UserOrdersList";
import ValidationPage from "./components/Registration/ValidationPage";
import UserTransactionsList from "./components/user/UserTransactionsList";
import AdminTransactionsList from "./components/admin/AdminTransactionsList";
import TicketsCatalogue from "./components/BuyTickets/BuyTickets";

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
        <Container maxWidth='xxl' sx={{p:0, m:0}}>
            <Navbar/>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Sidebar {...AsideProps} />
                </Grid>
                <Grid item xs={10}>
                    <Routes>
                        <Route exact path="/" element={<Homepage/>}/>
                        <Route exact path="/admin/traveler/:user/profile" element={<UserProfile userRole={userRole}/>}/>
                        <Route exact path="/user/register" element={<RegistrationPage/>}/>
                        <Route exact path="/user/validate" element={<ValidationPage/>}/>
                        <Route exact path="/user/login" element={<LoginPage/>}/>
                        <Route exact path="/my/tickets" element={<UserTicketsList/>}/>
                        <Route exact path="/my/profile" element={<UserProfile  userRole={userRole}/>}/>
                        <Route exact path="/my/orders" element={<UserOrdersList/>}/>
                        <Route exact path="/buy/tickets" element={<TicketsCatalogue/>}/>
                        <Route exact path="/my/transactions" element={<UserTransactionsList/>}/>
                        <Route exact path="/admin/travelers" element={<UsersList/>}/>
                        <Route exact path="/admin/tickets" element={<AdminTicketsList/>}/>
                        <Route exact path="/admin/transactions" element={<AdminTransactionsList/>}/>

                        {/*<Route exact path="/my/tickets" element={<TicketsList/>}/>*/}
                    </Routes>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;
