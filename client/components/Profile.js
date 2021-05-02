import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { db, storage } from '../firebase';
import { useSelector } from 'react-redux';

import { Grid, Box, IconButton, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

function Profile() {
  const { currentUser } = useUser();
  const user = useSelector((state) => state.auth);
  const fileInput = useRef();

  const handleProfilePictureUpdate = (evt) => {
    const image = evt.target.files[0];
    const uploadTask = storage.ref(`/images/${currentUser.uid}-profile`).put(image);
    uploadTask.on(
      'state_changed',
      () => {},
      (err) => {
        console.error(err);
      },
      () => {
        storage
          .ref('images')
          .child(`${currentUser.uid}-profile`)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            db.collection('users').doc(currentUser.uid).update({
              profilePicture: fireBaseUrl,
            });
          });
      }
    );
  };

  return (
    <Box mt={3}>
      <Grid container direction="column" align="center" spacing={2}>
        {user.id && (
          <>
            <Grid item>
              <img
                src={user.profilePicture}
                style={{ width: 300, height: 300, borderRadius: 9999 }}
              />
              <IconButton style={{ color: 'blue' }} onClick={() => fileInput.current.click()}>
                <EditIcon />
              </IconButton>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="fileInput"
                type="file"
                ref={fileInput}
                onChange={handleProfilePictureUpdate}
              />
            </Grid>
            <Grid item>
              <Typography align="center" variant="h5">
                {user.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="center" variant="h6">
                {user.following.length} Following
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="center" variant="h6">
                {user.followers.length} Followers
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default Profile;
