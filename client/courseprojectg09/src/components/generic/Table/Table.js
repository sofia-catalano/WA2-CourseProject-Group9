import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {Radio, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from '@mui/icons-material/FilterList';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}



function GenericTableHead(props) {
    const {order, orderBy, onRequestSort,headCells } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                 {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        padding={'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={headCell.numeric}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            hideSortIcon={true}
                        >
                            <b>{headCell.label}</b>
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

GenericTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};


const EnhancedTableToolbar = (props) => {
    const {nameTable, FilterMenu, onAddElement, setTypeSelected, typeSelected} = props
    const {startDate, setStartDate, endDate, setEndDate, searchTickets, rangeDate, setRangeDate}=props
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const location = useLocation();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' , color:'#1976d2'}}
                variant="h4"
                id="tableTitle"
                component="div"
                align="center"
            >
                {nameTable}
            </Typography>

            {
            location.pathname==="/catalogue/admin/tickets" || location.pathname==="/catalogue/admin/travelcard" ?
                <Tooltip title="Add to list">
                    <IconButton onClick={ onAddElement }>
                        <AddCircleOutlineIcon/>
                    </IconButton>
                </Tooltip>

                :
                FilterMenu && <>
                    <Tooltip title="Filter list">
                        <IconButton onClick={handleClick}>
                            <FilterListIcon/>
                        </IconButton>
                    </Tooltip>
                    <FilterMenu
                        open={open}
                        handleClose={handleClose}
                        anchorEl={anchorEl}
                        typeSelected={typeSelected}
                        setTypeSelected={setTypeSelected}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        searchTickets={searchTickets}
                        rangeDate={rangeDate}
                        setRangeDate={setRangeDate}
                    />
                </>
            }

        </Toolbar>
    );
};



export default function GenericTable(props) {
    const {headCells, rows, nameTable, FilterMenu, onClickElement, onAddElement, onDownloadQRCode} = props
    const {typeSelected, setTypeSelected } = props //for filter menu
    const {selectedValue, handleTypeTicketsChange}=props //only for buy ticket form
    const {startDate, setStartDate, endDate, setEndDate, searchTickets, rangeDate, setRangeDate}=props
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '90%', mt:2 , mr:5, ml:5 }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar nameTable={nameTable}
                                      FilterMenu={FilterMenu}
                                      onAddElement={onAddElement}
                                      typeSelected={typeSelected}
                                      setTypeSelected={setTypeSelected}
                                      startDate={startDate}
                                      endDate={endDate}
                                      setStartDate={setStartDate}
                                      setEndDate={setEndDate}
                                      searchTickets={searchTickets}
                                      rangeDate={rangeDate}
                                      setRangeDate={setRangeDate}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'small'}
                    >
                        <GenericTableHead
                            headCells={headCells}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            onSelectAllClick={()=>{}}/>

                        {<TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy))*/}

                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            onClick={onClickElement}
                                            tabIndex={-1}
                                            key={rows.indexOf(row)}
                                        >
                                            {selectedValue &&
                                                <TableCell align="center">
                                                    <Radio
                                                        checked={selectedValue === row.id}
                                                        onChange={(event)=>handleTypeTicketsChange(event.target.value)}
                                                        value={row.id}
                                                        name="radio-buttons"
                                                        size="small"
                                                    />
                                                </TableCell>
                                            }

                                            {Object.keys(row).map(function(key) {
                                                return key === "jws" ?
                                                    <TableCell key={key} align="center">
                                                        <IconButton aria-label="delete" onClick={()=>onDownloadQRCode(row.id)}>
                                                            <ArrowCircleDownIcon
                                                                fontSize="small"/>
                                                        </IconButton>
                                                    </TableCell> :
                                                    <TableCell key={key} align="center">{row[key]}</TableCell>
                                            })
                                            }
                                        </TableRow>
                                    );
                                })}

                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                        }
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
