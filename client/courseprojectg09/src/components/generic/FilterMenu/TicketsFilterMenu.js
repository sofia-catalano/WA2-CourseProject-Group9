import {Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import React from "react";

function TicketsFilterMenu (props){
    const {open, anchorEl, handleClose, typeSelected, handleTypeSelectedChange}=props

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
            <FormControl>
                <MenuItem>
                    <FormLabel id="demo-radio-buttons-group-label">Type tickets</FormLabel>
                </MenuItem>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={typeSelected}
                    name="radio-buttons-group"
                    onChange={handleTypeSelectedChange}
                >
                    <MenuItem>
                        <FormControlLabel value="all" control={<Radio />} label="Purchased tickets(All)" />
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="valid" control={<Radio />} label="Valid tickets" />
                    </MenuItem>
                    <MenuItem>
                         <FormControlLabel value="validated" control={<Radio />} label="Validated tickets" />
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="expired" control={<Radio />} label="Expired tickets" />
                    </MenuItem>
                </RadioGroup>
            </FormControl>
        </Menu>
    );
}


function TravelcardsFilterMenu (props){
    const {open, anchorEl, handleClose, typeSelected, handleTypeSelectedChange}=props

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
            <FormControl>
                <MenuItem>
                    <FormLabel id="demo-radio-buttons-group-label">Type travelcards</FormLabel>
                </MenuItem>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={typeSelected}
                    name="radio-buttons-group"
                    onChange={handleTypeSelectedChange}
                >
                    <MenuItem>
                        <FormControlLabel value="all" control={<Radio />} label="Purchased travelcards(All)" />
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="valid" control={<Radio />} label="Valid travelcards" />
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="expired" control={<Radio />} label="Expired travelcards" />
                    </MenuItem>
                </RadioGroup>
            </FormControl>
        </Menu>
    );
}

export {TicketsFilterMenu, TravelcardsFilterMenu}
