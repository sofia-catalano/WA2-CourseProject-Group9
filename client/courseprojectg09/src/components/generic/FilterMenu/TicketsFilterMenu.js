import {Menu} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import React from "react";
import {LocalizationProvider} from '@mui/x-date-pickers-pro';
import {AdapterDayjs} from '@mui/x-date-pickers-pro/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

function TicketsFilterMenu(props) {
    const {open, anchorEl, handleClose, typeSelected, setTypeSelected} = props
    const {startDate, setStartDate, endDate, setEndDate, searchTickets, rangeDate, setRangeDate} = props

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
                    <FormLabel id="type-tickets-label">Type tickets</FormLabel>
                </MenuItem>
                <RadioGroup
                    aria-labelledby="type-tickets"
                    value={typeSelected}
                    name="radio-buttons-group"
                    onChange={(event) => setTypeSelected(event.target.value)}
                >
                    <MenuItem>
                        <FormControlLabel value="all" control={<Radio/>} label="Purchased tickets(All)"/>
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="valid" control={<Radio/>} label="Valid tickets"/>
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="validated" control={<Radio/>} label="Validated tickets"/>
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="expired" control={<Radio/>} label="Expired tickets"/>
                    </MenuItem>
                </RadioGroup>

                <MenuItem>
                    <FormLabel id="range-tickets">
                        {typeSelected.charAt(0).toUpperCase() + typeSelected.slice(1)} tickets between:
                    </FormLabel>
                </MenuItem>

                <RadioGroup
                    aria-labelledby="range-tickets-label"
                    value={rangeDate ? 'range' : 'all'}
                    name="radio-buttons-group"
                    onChange={(event) => event.target.value == 'all' ? setRangeDate(false) : setRangeDate(true)}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MenuItem>
                            <FormControlLabel value="range" control={<Radio/>} label="Range dates"/>
                            <DatePicker
                                label="Start date"
                                value={startDate}
                                onChange={(newValue) => {
                                    setStartDate(newValue);
                                }}

                                renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End date"
                                value={endDate}
                                onChange={(newValue) => {
                                    setEndDate(newValue);
                                }}
                                minDate={startDate}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </MenuItem>
                        <MenuItem>
                            <FormControlLabel value="all" control={<Radio/>} label="All dates"/>
                        </MenuItem>
                    </LocalizationProvider>
                </RadioGroup>
                <Button onClick={searchTickets}>Filter tickets</Button>
            </FormControl>
        </Menu>
    );
}


function TravelcardsFilterMenu(props) {
    const {open, anchorEl, handleClose, typeSelected, setTypeSelected} = props
    const {startDate, setStartDate, endDate, setEndDate, searchTickets, rangeDate, setRangeDate} = props

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
                    aria-labelledby="type-travelcards"
                    value={typeSelected}
                    name="radio-buttons-group"
                    onChange={(event) => setTypeSelected(event.target.value)}
                >
                    <MenuItem>
                        <FormControlLabel value="all" control={<Radio/>} label="Purchased travelcards(All)"/>
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="valid" control={<Radio/>} label="Valid travelcards"/>
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel value="expired" control={<Radio/>} label="Expired travelcards"/>
                    </MenuItem>
                </RadioGroup>

                <MenuItem>
                    <FormLabel id="range-travelcards">
                        {typeSelected.charAt(0).toUpperCase() + typeSelected.slice(1)} tickets between:
                    </FormLabel>
                </MenuItem>
                <RadioGroup
                    aria-labelledby="range-travelcards-label"
                    value={rangeDate ? 'range' : 'all'}
                    name="radio-buttons-group"
                    onChange={(event) => event.target.value == 'all' ? setRangeDate(false) : setRangeDate(true)}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MenuItem>
                            <FormControlLabel value="range" control={<Radio/>} label="Range dates"/>
                            <DatePicker
                                label="Start date"
                                value={startDate}
                                onChange={(newValue) => {
                                    setStartDate(newValue);
                                }}

                                renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End date"
                                value={endDate}
                                onChange={(newValue) => {
                                    setEndDate(newValue);
                                }}
                                minDate={startDate}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </MenuItem>
                        <MenuItem>
                            <FormControlLabel value="all" control={<Radio/>} label="All dates"/>
                        </MenuItem>
                    </LocalizationProvider>
                </RadioGroup>
                <Button onClick={searchTickets}>Filter travelcards</Button>

            </FormControl>
        </Menu>
    );
}

export {TicketsFilterMenu, TravelcardsFilterMenu}
