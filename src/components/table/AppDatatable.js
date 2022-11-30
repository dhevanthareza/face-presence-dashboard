import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Iconify from '../iconify';
import Scrollbar from '../scrollbar';


import httpClient from '../../utils/httpClient';
import AppTableHeader from './AppTableHeader';
import AppListToolbar from './AppListToolbar';

export default function AppDatatable({baseUrl, tableHead, title, slots = {}}) {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filter, setfilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [datas, setDatas] = useState([]);
  const [dataCount, setDataCount] = useState(0);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = datas.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilter = (event) => {
    setPage(0);
    setfilter(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataCount.length) : 0;

  const isNotFound = !datas.length && !!filter;


  const fetchDatas = async () => {
    const response = await httpClient.get(`${baseUrl}/datatable`);
    setDatas(response.data.data.result);
    setDataCount(response.data.data.count);
  }

  useEffect(() => {
    fetchDatas()
  }, []);


  return (
    <>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            { title }
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            { title }
          </Button>
        </Stack>

        <Card>
          <AppListToolbar numSelected={selected.length} filter={filter} onfilter={handleFilter} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <AppTableHeader
                  order={order}
                  orderBy={orderBy}
                  headLabel={[...tableHead, { id: '', },]}
                  rowCount={dataCount}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {datas.map((row, index) => {
                    const selectedData = selected.indexOf(row.id) !== -1;

                    return (
                      <TableRow hover key={index} tabIndex={-1} role="checkbox" selected={selectedData}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedData} onChange={(event) => handleClick(event, row.id)} />
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={fullname} src={`/assets/images/avatars/avatar_${index + 1}.jpg`} />
                            <Typography variant="subtitle2" noWrap>
                              {fullname}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                        {
                          tableHead.map((head, index) => {
                            return (
                              <TableCell key={index} align="left">
                                { slots[head.id] ? slots[head.id](row[head.id], index) : row[head.id]}
                              </TableCell>
                            );
                          })
                        }

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filter}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
