import { Button, Dialog, DialogActions, DialogContent, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import httpClient from '../utils/httpClient';
import Iconify from '../components/iconify';
import AppDatatable from '../components/table/AppDatatable';

const TABLE_HEAD = [
  { id: 'userId', label: 'User', alignRight: false },
  { id: 'user_photo', label: 'User Photo', alignRight: false },
  { id: 'cropped_photo', label: 'Presence Photo', alignRight: false },
  { id: 'check_out_cropped_photo', label: 'Presence Out Photo', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'distance', label: 'Distance', alignRight: false },
  { id: 'check_out_distance', label: 'Check Out Distance', alignRight: false },
  { id: 'status', label: 'IN Status', alignRight: false },
  { id: 'statusOut', label: 'OUT Status', alignRight: false },
];
export default function PresencePage() {
  const datatableRef = useRef();

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleOpenPhoto = (photo) => {
    setPhoto(photo);
    setOpenImageDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenImageDialog(false);
  };

  const handleFlagPresenceIn = async (presenceId, newStatus) => {
    datatableRef.current.handleCloseAction();
    Swal.showLoading();
    const response = await httpClient.post('/presence/flag-presence', {
      presenceId,
      newStatus,
    });
    datatableRef.current.refreshTable();
    Swal.close();
  };
  const handleFlagPresenceOut = async (presenceId, newStatus) => {
    datatableRef.current.handleCloseAction();
    Swal.showLoading();
    const response = await httpClient.post('/presence/flag-presence-out', {
      presenceId,
      newStatus,
    });
    datatableRef.current.refreshTable();
    Swal.close();
  };
  const handleDeleteButton = async (presenceId) => {
    datatableRef.current.handleCloseAction();
    Swal.showLoading();
    const response = await httpClient.post('/presence/delete', {
      presenceId,
    });
    datatableRef.current.refreshTable();
    Swal.close();
  };

  return (
    <>
      <Helmet>
        <title> Presence | Face Dashboard </title>
      </Helmet>
      <AppDatatable
        ref={datatableRef}
        baseUrl={'/presence'}
        tableHead={TABLE_HEAD}
        title="Presence"
        slots={{
          userId: (user, index) => {
            return user.fullname;
          },
          user_photo: (photo, index, data) => {
            return (
              <Button variant="contained" onClick={() => handleOpenPhoto(data.userId.cropped_photo.location)}>
                See Photo
              </Button>
            );
          },
          cropped_photo: (croppedPhoto, index) => {
            return (
              <Button variant="contained" onClick={() => handleOpenPhoto(croppedPhoto.location)}>
                See Photo
              </Button>
            );
          },
          check_out_cropped_photo: (croppedPhoto, index) => {
            return (
              <Button variant="contained" onClick={() => handleOpenPhoto(croppedPhoto.location)}>
                See Photo
              </Button>
            );
          },
          date: (date) => {
            return <span>{dayjs(date).add(7, 'hour').format('dddd, MMMM YYYY').toString()}</span>;
          },
          status: (status) => {
            return status ?? '-';
          },
          statusOut: (status) => {
            return status ?? '-';
          },
          action: (presenceId) => {
            return (
              <>
                <MenuItem onClick={() => handleFlagPresenceIn(presenceId, 'TP')}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Flag TP IN
                </MenuItem>
                <MenuItem onClick={() => handleFlagPresenceIn(presenceId, 'FP')}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Flag FP IN
                </MenuItem>
                <MenuItem onClick={() => handleFlagPresenceOut(presenceId, 'TP')}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Flag TP OUT
                </MenuItem>
                <MenuItem onClick={() => handleFlagPresenceOut(presenceId, 'FP')}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Flag FP OUT
                </MenuItem>
                <MenuItem onClick={() => handleDeleteButton(presenceId)}>
                  <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                  Delete
                </MenuItem>
              </>
            );
          },
        }}
      />
      <Dialog
        open={openImageDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <img src={photo} alt="user" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
