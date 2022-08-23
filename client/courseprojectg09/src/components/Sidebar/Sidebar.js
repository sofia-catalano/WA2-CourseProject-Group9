import { Link } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import {
    BsFillPersonPlusFill,
    BsFillPersonFill,
    BsPersonCheckFill
} from 'react-icons/bs';
import { IoIosArrowBack, IoIosArrowForward, IoIosListBox  } from 'react-icons/io';
import {FiUsers} from 'react-icons/fi'
import { IoTicketOutline, IoCardOutline } from "react-icons/io5";
import './Sidebar.css'
import {BiTransfer} from "react-icons/bi";

/**
 * Sidebar component.
 *
 * Contains list of different routes (`Menu`) for each user role,
 * useful for easy navigation throw the app.
 *
 *
 * @param {object}  props  - Component props.
 * @param {boolean} props.collapsed - If true the sidebar is in a tiny version.
 * @param {boolean} props.toggled - If true the sidebar is hidden and a button appears.
 * @param {function} props.handleToggle - Handle the action on toggle button.
 * @param {function} props.handleCollapse - Handle the action on collapse button.
 * @param {string} props.userRole - Role of the user, defined on login.
 */
function Sidebar({
                   collapsed,
                   toggled,
                   handleToggle,
                   handleCollapse,
                   userRole,
               }) {
    /**
     * Dictionary for selection of the the menu, based on its role
     */
    const roleMenu = {
        admin: <AdminMenu collapsed={collapsed} />,
        user: <UserMenu collapsed={collapsed} />,
    };

    const handleClose = () => {
        handleToggle(false);
    };

    return !userRole ? null : (
        <ProSidebar
            collapsed={collapsed}
            toggled={toggled}
            breakPoint="md"
            onToggle={handleToggle}
            style={{
                marginTop: '10px',
                height: 'auto',
            }}>
            <SidebarHeader>
                <div
                    style={{
                        padding: '24px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 14,
                        letterSpacing: '1px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    className="pro-sidebar">
                    <CollapseArrow collapsed={collapsed} handleCollapse={handleCollapse} />

                    {collapsed ? null : userRole.replace('_', ' ')}
                </div>
            </SidebarHeader>
            <SidebarContent className="pro-sidebar" onClick={handleClose}>
                {roleMenu[userRole]}
            </SidebarContent>
        </ProSidebar>
    );
}
function CollapseArrow({ collapsed, handleCollapse }) {
    const Arrow = collapsed ? IoIosArrowForward : IoIosArrowBack;
    return <Arrow className="collapse-arrow" size={22} onClick={() => handleCollapse(!collapsed)} />;
}

function CollapsableLink(props) {
    const { className, to, collapsed } = props;

    return (
        <Link className={className} to={to}>
            {collapsed ? null : props.children}
        </Link>
    );
}

function AdminMenu({ collapsed }) {
    return (
        <Menu iconShape="circle">
            <MenuItem icon={<BsFillPersonFill fontSize={"small"} />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="my/profile">
                    My Profile
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<BsFillPersonPlusFill />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/admin/registerAdmin">
                    Register a new admin
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<BsPersonCheckFill />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/admin/enrollAdmin/">
                    Enroll an admin
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<FiUsers/>}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/admin/travelers">
                    Travelers
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<IoTicketOutline />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/admin/tickets">
                    Travelers Tickets
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<IoCardOutline />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/admin/travelcards">
                    Travelers TravelCards
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<BiTransfer />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/admin/transactions">
                    Travelers Transactions
                </CollapsableLink>
            </MenuItem>
        </Menu>
    );
}

function UserMenu({ collapsed }) {
    return (
        <Menu iconShape="circle">
            <MenuItem icon={<BsFillPersonFill fontSize={"small"} />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="my/profile">
                    My Profile
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<IoTicketOutline />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/my/tickets">
                    My Tickets
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<IoCardOutline />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/my/travelcards">
                    My TravelCards
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<IoIosListBox />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/my/orders">
                    My Orders
                </CollapsableLink>
            </MenuItem>
            <MenuItem icon={<BiTransfer />}>
                <CollapsableLink collapsed={collapsed} className="text-light" to="/my/transactions">
                    My Transactions
                </CollapsableLink>
            </MenuItem>
        </Menu>
    );
}


export default Sidebar;
