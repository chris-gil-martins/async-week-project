import React, { useEffect, useContext } from 'react';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import { setUsers } from '../redux/reducers/users';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import firebase from 'firebase/app';
import _ from 'lodash';

import { Grid, Link, Button, Box, Typography, Avatar, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const UserList = ({ subset }) => {
  const { currentUser } = useUser();
  const user = useSelector((state) => state.auth);

  const classes = useStyles();

  let users = useSelector((state) => state.users);

  if (subset === 'following') {
    users = _.pickBy(users, (otherUsers) => {
      return user.following.includes(otherUsers.id);
    });
  } else if (subset === 'followers') {
    users = _.pickBy(users, (otherUsers) => {
      return user.followers.includes(otherUsers.id);
    });
  }

  const handleClick = async (following, id) => {
    let myUpdate = following
      ? firebase.firestore.FieldValue.arrayRemove(id)
      : firebase.firestore.FieldValue.arrayUnion(id);
    let theirUpdate = following
      ? firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
      : firebase.firestore.FieldValue.arrayUnion(currentUser.uid);
    await db.collection('users').doc(currentUser.uid).update({ following: myUpdate });
    await db.collection('users').doc(id).update({ followers: theirUpdate });
  };

  return (
    <Box pt={3}>
      <Grid container spacing={2} justify="space-around">
        {_.values(users).map((otherUser) => {
          return (
            <Grid
              item
              key={otherUser.id}
              xs={6}
              md={4}
              lg={2}
              container
              direction="column"
              alignItems="center"
              justify="space-between"
            >
              <Avatar src={otherUser.profilePicture} className={classes.large} />
              <Link to={`/users/${otherUser.id}`} component={RouterLink}>
                <Typography variant="h5" align="center">
                  {otherUser.name}
                </Typography>
              </Link>
              <Box pt={2}>
                <Button
                  onClick={() => handleClick(user.following.includes(otherUser.id), otherUser.id)}
                  variant="contained"
                  style={{
                    backgroundColor: user.following.includes(otherUser.id)
                      ? 'tomato'
                      : 'dodgerblue',
                  }}
                >
                  {user.following.includes(otherUser.id) ? 'unfollow' : 'follow'}
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default UserList;
