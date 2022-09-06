import {Navigate, Route, Routes} from 'react-router-dom';
import Homepage from "../components/Homepage/Homepage";
import UserProfile from "../components/user/Profile";
import AdminUserTicketsList from "../components/admin/AdminUserTicketsList";
import AdminUserTravelcardsList from "../components/admin/AdminUserTravelcardsList";
import RegistrationPage from "../components/Registration/RegistrationPage";
import ValidationPage from "../components/Registration/ValidationPage";
import LoginPage from "../components/Login/LoginPage";
import UserTicketsList from "../components/user/UserTicketsList";
import UserTravelCardsList from "../components/user/UserTravelCardsList";
import UserOrdersList from "../components/user/UserOrdersList";
import BuyTickets from "../components/TicketsCatalogue/BuyTickets";
import BuyTravelcard from "../components/TicketsCatalogue/BuyTravelcard";
import UserTransactionsList from "../components/user/UserTransactionsList";
import AdminsList from "../components/admin/AdminsList";
import UsersList from "../components/admin/UsersList";
import AdminTicketsList from "../components/admin/AdminTicketsList";
import AdminTravelcardsList from "../components/admin/AdminTravelcardsList";
import AdminOrdersList from "../components/admin/AdminOrdersList";
import AdminTransactionsList from "../components/admin/AdminTransactionsList";
import TicketsCatalogue from "../components/TicketsCatalogue/TicketsCatalogue";
import ValidateTicketPage from "../components/ValidateTicketPage/ValidateTicketPage";
import {useUser} from "../components/UserProvider";
import AdminUserOrdersList from "../components/admin/AdminUserOrdersList";


const rolesPathRedirect = {
    client: '/my/profile',
    admin: '/admin/ticktes',
};

function getUserRoute(role) {
    //return default route of the user.
    return rolesPathRedirect[role] || '';

}

function AllRoutes() {
    const {loggedIn, userRole, setUserRole, setLoggedIn}=useUser()

    const getAdminComponent=(component)=>{
        return loggedIn && userRole === 'ADMIN' ?
            component
            :
            <Navigate to="/user/login" replace={true} />
    }

    const getCustomerComponent=(component)=>{
        return loggedIn && userRole === 'CUSTOMER' ?
            component
            :
            <Navigate to="/user/login" replace={true} />
    }

    const getProtectedComponent=(component)=>{
        return loggedIn ?
            component
            :
            <Navigate to="/user/login" replace={true} />
    }

    return (
        <Routes>
            {/*-----------------------------------OPEN ROUTES----------------------------------*/}
            <Route exact path="/" element={<Homepage/>}/>

            <Route exact path="/user/register" element={<RegistrationPage/>}/>
            <Route exact path="/user/validate" element={<ValidationPage/>}/>
            <Route exact path="/user/login" element={<LoginPage/>}/>

            <Route exact path="/catalogue" element={<TicketsCatalogue/>}/>
            <Route exact path="/validateTicket" element={<ValidateTicketPage/>}/>
            {/*--------------------------------------------------------------------------------*/}

            {/*------------------------------ADMIN/CUSTOMER ROUTES-----------------------------*/}
            <Route exact path="/my/profile" element={getProtectedComponent(<UserProfile/>)}/>
            {/*--------------------------------------------------------------------------------*/}

            {/*--------------------------------CUSTOMER ROUTES---------------------------------*/}
            <Route exact path="/catalogue/shop/tickets" element={getCustomerComponent(<BuyTickets/>)}/>
            <Route exact path="/catalogue/shop/travelcard" element={getCustomerComponent(<BuyTravelcard/>)}/>
            <Route exact path="/my/tickets" element={getCustomerComponent(<UserTicketsList/>)}/>
            <Route exact path="/my/travelcards" element={getCustomerComponent(<UserTravelCardsList/>)}/>
            <Route exact path="/my/orders" element={getCustomerComponent(<UserOrdersList/>)}/>
            <Route exact path="/my/transactions" element={getCustomerComponent(<UserTransactionsList/>)}/>
            {/*--------------------------------------------------------------------------------*/}

            {/*----------------------------------ADMIN ROUTES----------------------------------*/}
            <Route exact path="/admin/admins" element={getAdminComponent(<AdminsList/>)}/>
            <Route exact path="/admin/travelers" element={getAdminComponent(<UsersList/>)}/>
            <Route exact path="/admin/tickets" element={getAdminComponent(<AdminTicketsList/>)}/>
            <Route exact path="/admin/travelcards" element={getAdminComponent(<AdminTravelcardsList/>)}/>
            <Route exact path="/admin/orders" element={getAdminComponent(<AdminOrdersList/>)}/>
            <Route exact path="/admin/transactions" element={getAdminComponent(<AdminTransactionsList/>)}/>

            <Route exact path="/admin/traveler/:user/profile" element={getAdminComponent(<UserProfile/>)}/>
            <Route exact path="/admin/traveler/:user/tickets" element={getAdminComponent(<AdminUserTicketsList/>)}/>
            <Route exact path="/admin/traveler/:user/travelcards" element={getAdminComponent(<AdminUserTravelcardsList/>)}/>
            <Route exact path="/admin/traveler/:user/orders" element={getAdminComponent(<AdminUserOrdersList/>)}/>

            <Route exact path="/catalogue/admin/tickets" element={getAdminComponent(<BuyTickets/>)}/>
            <Route exact path="/catalogue/admin/travelcard" element={getAdminComponent(<BuyTravelcard/>)}/>
            {/*--------------------------------------------------------------------------------*/}

        </Routes>
    );
}

export default AllRoutes

