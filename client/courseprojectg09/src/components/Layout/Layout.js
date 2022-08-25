import { useState } from 'react';

import { FaBars } from 'react-icons/fa';
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {useLocation} from "react-router-dom";
import Grid from "@mui/material/Grid";



function Layout(props) {
    const { loggedIn, doLogout, userRole, userId } = props;

    const [toggled, setToggled] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleCollapse = (value) => {
        setCollapsed(value);
    };

    const handleToggle = (value) => {
        setToggled(value);
    };

    const AsideProps = {
        toggled,
        collapsed,
        userRole,
        handleToggle,
        handleCollapse,
    };
    const location = useLocation()
    const noSidebarUrl = ['/', '/user/login', '/user/register', '/catalogue', '/validateTicket', '/aboutUs']

    const showSidebar = () => {
        return noSidebarUrl.find(element=>element==location.pathname) == undefined
    }
    return (

        <>
            {console.log(location.pathname)}
            <Navbar/>
            <Grid container spacing={2}>
                {showSidebar() &&
                    <Grid item xs={2}>
                        <Sidebar {...AsideProps} />

                        {/* This button shows up when the sidebar is hidden */}
                        <Button as={FaBars} className="aside-toggle" onClick={() => handleToggle(true)}>
                            <FaBars />
                        </Button>
                    </Grid>
                }
                <Grid item xs={showSidebar()? 10 :12}>
                    <main>{props.children}</main>
                </Grid>
            </Grid>
        </>
    );
}

export default Layout;
