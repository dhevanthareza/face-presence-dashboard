import { Button, Dialog, DialogActions, DialogContent, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import httpClient from '../utils/httpClient';
import AppDatatable from '../components/table/AppDatatable';
import Iconify from '../components/iconify';

const TABLE_HEAD = [
  { id: 'userId', label: 'UserId', alignRight: false },
  { id: 'user_photo', label: 'User Photo', alignRight: false },
  { id: 'cropped_photo', label: 'Presence Photo', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'distance', label: 'Distance', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
];
export default function PresenceFailed() {
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

  const handleFlagPresence = async (presenceId, newStatus) => {
    datatableRef.current.handleCloseAction();
    Swal.showLoading();
    const response = await httpClient.post('/presence/flag-presence-failed', {
      presenceId,
      newStatus,
    });
    datatableRef.current.refreshTable();
    Swal.close();
  };

  const handleDeleteButton = async (presenceId) => {
    datatableRef.current.handleCloseAction();
    Swal.showLoading();
    const response = await httpClient.post('/presence/delete-failed', {
      presenceId,
    });
    datatableRef.current.refreshTable();
    Swal.close();
  };

  return (
    <>
      <Helmet>
        <title> Presence Failed | Face Dashboard </title>
      </Helmet>
      <AppDatatable
        ref={datatableRef}
        baseUrl={'/presence-failed'}
        tableHead={TABLE_HEAD}
        title="Failed Presence"
        slots={{
          userId: (user, index) => {
            return user == null ? '-' : user.fullname;
          },
          user_photo: (photo, index, data) => {
            return (
              <Button variant="contained" onClick={() => handleOpenPhoto(data.userId.photo.location)}>
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
          date: (date) => {
            return <span>{dayjs(date).add(7, 'hour').format('dddd, MMMM YYYY HH:mm:ss').toString()}</span>;
          },
          status: (status) => {
            return status ?? "-";
          },
          action: (presenceId) => {
            return (
              <>
                <MenuItem onClick={() => handleFlagPresence(presenceId, 'TN')}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Flag TN
                </MenuItem>
                <MenuItem onClick={() => handleFlagPresence(presenceId, 'FN')}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Flag FN
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
