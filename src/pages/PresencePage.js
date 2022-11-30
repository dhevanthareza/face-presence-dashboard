import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppDatatable from '../components/table/AppDatatable';

const TABLE_HEAD = [
  { id: 'userId', label: 'User', alignRight: false },
  { id: 'user_photo', label: 'User Photo', alignRight: false },
  { id: 'cropped_photo', label: 'Presence Photo', alignRight: false },
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
