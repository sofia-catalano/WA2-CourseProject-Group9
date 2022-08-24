import {Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

function TicketsFilterMenu (props){
    const {open, anchorEl, handleClose}=props

    return (
        <Menu
            id="basic-menu"
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            anchorEl={anchorEl}
        >
            <MenuItem onClick={handleClose}>Purchased tickets(All) </MenuItem>
            <MenuItem onClick={handleClose}>Valid tickets </MenuItem>
            <MenuItem onClick={handleClose}>Validated tickets</MenuItem>
            <MenuItem onClick={handleClose}>Expired Tickets</MenuItem>
        </Menu>
    );
}
export default TicketsFilterMenu;
