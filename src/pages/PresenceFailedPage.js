import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppDatatable from '../components/table/AppDatatable';

const TABLE_HEAD = [
  { id: 'userId', label: 'UserId', alignRight: false },
  { id: 'photo', label: 'Photo', alignRight: false },
  { id: 'cropped_photo', label: 'Cropped Photo', alignRight: false },
];
export default function PresenceFailed() {
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
        <title> Presence Failed | Face Dashboard </title>
      </Helmet>
      <AppDatatable
        baseUrl={'/presence-failed'}
        tableHead={TABLE_HEAD}
        title="Presence"
        slots={{
          photo: (photo, index) => {
            return (
              <Button variant="contained" onClick={() => handleOpenPhoto(photo.location)}>
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
