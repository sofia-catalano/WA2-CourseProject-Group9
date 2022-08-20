import { Routes, BrowserRouter, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import {useState, useEffect} from 'react';
import Sidebar from "./components/Sidebar/Sidebar";
import Container from "@mui/material/Container";
import RegistrationPage from "./components/Registration/RegistrationPage";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import UserTicketsList from "./components/user/TicketsList";

function App() {

    const [userRole, setUserRole] = useState('user');
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
                         <Route exact path="/user/register" element={<RegistrationPage/>}/>
                         <Route exact path="/my/tickets" element={<UserTicketsList/>}/>
                         {/*<Route exact path="/my/tickets" element={<TicketsList/>}/>*/}
                     </Routes>
             </Grid>
         </Grid>
      </Container>
  );
}

export default App;
