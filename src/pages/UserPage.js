import { Avatar, Dialog, DialogActions, DialogContent, Stack, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppDatatable from '../components/table/AppDatatable';

const TABLE_HEAD = [
  { id: 'fullname', label: 'Fullname', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'photo', label: 'Photo', alignRight: false },
  { id: 'cropped_photo', label: 'Cropped Photo', alignRight: false },
];

export default function UserPage() {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [photo, setPhoto] = useState(null);

  

  const handleOpenPhoto = (photo) => {
    setPhoto(photo)
    setOpenImageDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenImageDialog(false)
  }

  return (
    <>
      <Helmet>
        <title> User | Face Dashboard </title>
      </Helmet>
      <AppDatatable
        baseUrl={'/user'}
        tableHead={TABLE_HEAD}
        title="User"
        slots={{
          fullname: (fullname, index) => {
            return (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar alt={fullname} src={`/assets/images/avatars/avatar_${index + 1}.jpg`} />
                <Typography variant="subtitle2" noWrap>
                  {fullname}
                </Typography>
              </Stack>
            );
          },
          photo: (photo, index) => {
            return (
              <Button variant="contained" onClick={() => handleOpenPhoto(photo.location)}>See Photo</Button>
            );
          },
          cropped_photo: (croppedPhoto, index) => {
            return (
              <Button variant="contained" onClick={() => handleOpenPhoto(croppedPhoto.location)}>See Photo</Button>
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
