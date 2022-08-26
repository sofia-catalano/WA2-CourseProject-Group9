import {Routes, BrowserRouter, Route, useNavigate, useLocation} from 'react-router-dom';
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
import AdminTravelcardsList from "./components/admin/AdminTravelcardsList";
import UserOrdersList from "./components/user/UserOrdersList";
import ValidationPage from "./components/Registration/ValidationPage";
import UserTransactionsList from "./components/user/UserTransactionsList";
import AdminTransactionsList from "./components/admin/AdminTransactionsList";
import BuyTickets from "./components/TicketsCatalogue/BuyTickets";
import BuyTravelcard from "./components/TicketsCatalogue/BuyTravelcard";
import AdminsList from "./components/admin/AdminsList";
import AdminUserTicketsList from "./components/admin/AdminUserTicketsList";
import AdminUserTravelcardsList from "./components/admin/AdminUserTravelcardsList";
import TicketsCatalogue from './components/TicketsCatalogue/TicketsCatalogue';
import ValidateTicketPage from "./components/ValidateTicketPage/ValidateTicketPage";
import AdminOrdersList from "./components/admin/AdminOrdersList";
import UserTravelCardsList from "./components/user/UserTravelCardsList";
import Layout from "./components/Layout/Layout";
import {UserProvider, useUser} from "./components/UserProvider";


function App() {

    const [userRole, setUserRole] = useState('admin');
    // const {loggedIn, userRole, setUserRole, setLoggedIn}=useUser()
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
    const LayoutProps = {
        userRole,
    };

    return (
        <Container maxWidth='xxl' disableGutters={true}>
            <UserProvider />,
            <Layout {...LayoutProps}>
                <Routes>
                    <Route exact path="/" element={<Homepage/>}/>
                    <Route exact path="/admin/traveler/:user/profile" element={<UserProfile />}/>
                    <Route exact path="/admin/traveler/:user/tickets" element={<AdminUserTicketsList />}/>
                    <Route exact path="/admin/traveler/:user/travelcards" element={<AdminUserTravelcardsList/>}/>
                    <Route exact path="/user/register" element={<RegistrationPage/>}/>
                    <Route exact path="/user/validate" element={<ValidationPage/>}/>
                    <Route exact path="/user/login" element={<LoginPage/>}/>
                    <Route exact path="/my/tickets" element={<UserTicketsList/>}/>
                    <Route exact path="/my/travelcards" element={<UserTravelCardsList/>}/>
                    <Route exact path="/my/profile" element={<UserProfile />}/>
                    <Route exact path="/my/orders" element={<UserOrdersList/>}/>
                    <Route exact path="/catalogue/shop/tickets" element={<BuyTickets/>}/>
                    <Route exact path="/catalogue/admin/tickets" element={<BuyTickets/>}/>
                    <Route exact path="/catalogue/shop/travelcard" element={<BuyTravelcard/>}/>
                    <Route exact path="/catalogue/admin/travelcard" element={<BuyTravelcard/>}/>
                    <Route exact path="/my/transactions" element={<UserTransactionsList/>}/>
                    <Route exact path="/admin/admins" element={<AdminsList/>}/>
                    <Route exact path="/admin/travelers" element={<UsersList/>}/>
                    <Route exact path="/admin/tickets" element={<AdminTicketsList/>}/>
                    <Route exact path="/admin/travelcards" element={<AdminTravelcardsList/>}/>
                    <Route exact path="/admin/orders" element={<AdminOrdersList/>}/>
                    <Route exact path="/admin/transactions" element={<AdminTransactionsList/>}/>
                    <Route exact path="/catalogue" element={<TicketsCatalogue/>}/>
                    <Route exact path="/validateTicket" element={<ValidateTicketPage/>}/>
                    {/*<Route exact path="/my/tickets" element={<TicketsList/>}/>*/}
                </Routes>
            </Layout>
        </Container>
    );
}

export default App;
