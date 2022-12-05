import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppDatatable from '../components/table/AppDatatable';

const TABLE_HEAD = [
  { id: 'userId', label: 'User', alignRight: false },
  { id: 'user_photo', label: 'User Photo', alignRight: false },
  { id: 'cropped_photo', label: 'Presence Photo', alignRight: false },
  { id: 'check_out_cropped_photo', label: 'Presence Out Photo', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'distance', label: 'Distance', alignRight: false },
  { id: 'check_out_distance', label: 'Check Out Distance', alignRight: false },
];
export default function PresencePage() {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleOpenPhoto = (photo) => {
    setPhoto(photo);
    setOpenImageDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenImageDialog(false);
  };
  return (
    <>
      <Helmet>
        <title> Presence | Face Dashboard </title>
      </Helmet>
      <AppDatatable
        baseUrl={'/presence'}
        tableHead={TABLE_HEAD}
        title="Presence"
        slots={{
          userId: (user, index) => {
            return user.fullname
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
          check_out_cropped_photo: (croppedPhoto, index) => {
            return (
              <Button variant="contained" onClick={() => handleOpenPhoto(croppedPhoto.location)}>
                See Photo
              </Button>
            );
          },
          date: (date) => {
            return (
              <span>{ dayjs(date).add(7, 'hour').format('dddd, MMMM YYYY').toString() }</span>
            );
          }
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
