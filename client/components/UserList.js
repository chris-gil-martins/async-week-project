import React, { useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { db } from '../firebase';
import { setUsers } from '../redux/reducers/users';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import firebase from 'firebase/app';

import { Grid, Link, Button, Box, Typography } from '@material-ui/core';

const UserList = ({ following }) => {
  const { currentUser } = useContext(UserContext);
  let users = useSelector((state) => state.users);
  users = following ? users.filter((user) => user.following) : users;
  const dispatch = useDispatch();

  useEffect(() => {
    return db.collection('users').onSnapshot(async (snapshot) => {
      const userInfo = await db.collection('users').doc(currentUser.uid).get();
      const userFollowing = userInfo.data().following;
      dispatch(
        setUsers(
          snapshot.docs
            .filter((doc) => doc.id !== currentUser.uid)
            .map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              following: userFollowing.includes(doc.id),
            }))
        )
      );
    });
  }, [currentUser]);

  const handleClick = (following, id) => {
    let update = following
      ? firebase.firestore.FieldValue.arrayRemove(id)
      : firebase.firestore.FieldValue.arrayUnion(id);
    db.collection('users').doc(currentUser.uid).update({ following: update });
  };

  return (
    <Box pt={3}>
      <Grid container spacing={2} justify="center">
        {users.map((user) => {
          return (
            <Grid
              item
              key={user.id}
              xs={4}
              md={2}
              container
              direction="column"
              alignItems="center"
              style={{ border: '1px solid black' }}
            >
              <Link to={`/users/${user.id}`} component={RouterLink}>
                <Typography variant="h5">{user.name}</Typography>
              </Link>
              <Box pt={2}>
                <Button onClick={() => handleClick(user.following, user.id)} variant="contained">
                  {user.following ? 'unfollow' : 'follow'}
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
