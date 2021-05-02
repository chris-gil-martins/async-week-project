import React, { useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useSelector } from 'react-redux';

import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Grid,
  Menu,
  MenuItem,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CodeIcon from '@material-ui/icons/Code';

const useStyles = makeStyles(() => ({
  navbar: {
    backgroundColor: '#333333',
  },
  title: {
    textTransform: 'none',
    justifyContent: 'flex-start',
  },
  icons: {
    color: 'white',
  },
  profilePicture: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'white',
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const { currentUser, logout } = useUser();
  const user = useSelector((state) => state.auth);
  const history = useHistory();

  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setProfileAnchor(null);
  };

  const doLogout = async () => {
    try {
      await logout();
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppBar position="static" className={classes.navbar}>
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Button color="inherit" className={classes.title} component={RouterLink} to="/">
            <Grid container alignItems="center">
              <CodeIcon fontSize="large" style={{ marginRight: 10 }} />
              <Typography variant="h6">Our Code</Typography>
            </Grid>
          </Button>
          <Grid item xs container direction="row-reverse">
            <Grid item className={classes.icons}>
              {!!user.profilePicture ? (
                <IconButton onClick={handleOpen} color="inherit">
                  <img src={user.profilePicture} className={classes.profilePicture} />
                </IconButton>
              ) : (
                <IconButton onClick={handleOpen} color="inherit">
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
              )}
              <Menu
                id="profile-menu"
                anchorEl={profileAnchor}
                keepMounted
                open={Boolean(profileAnchor)}
                onClose={handleClose}
              >
                {!currentUser && (
                  <MenuItem onClick={handleClose}>
                    <Button color="inherit" component={RouterLink} to="/login">
                      Login
                    </Button>
                  </MenuItem>
                )}
                {!currentUser && (
                  <MenuItem onClick={handleClose}>
                    <Button color="inherit" component={RouterLink} to="/signup">
                      Sign Up
                    </Button>
                  </MenuItem>
                )}
                {!!currentUser && (
                  <MenuItem onClick={handleClose}>
                    <Button component={RouterLink} to={`/profile`} color="inherit">
                      My Profile
                    </Button>
                  </MenuItem>
                )}
                {!!currentUser && (
                  <MenuItem onClick={handleClose}>
                    <Button component={RouterLink} to="/users/following" color="inherit">
                      Following
                    </Button>
                  </MenuItem>
                )}
                {!!currentUser && (
                  <MenuItem onClick={handleClose}>
                    <Button component={RouterLink} to="/users/followers" color="inherit">
                      Followers
                    </Button>
                  </MenuItem>
                )}
                {!!currentUser && (
                  <MenuItem onClick={handleClose}>
                    <Button color="inherit" onClick={doLogout}>
                      Logout
                    </Button>
                  </MenuItem>
                )}
              </Menu>
            </Grid>
            {!!currentUser && (
              <Button component={RouterLink} to={`/livestream/${currentUser.uid}`} color="inherit">
                Livestream
              </Button>
            )}
            {!!currentUser && (
              <Button component={RouterLink} to="/users" color="inherit">
                Users
              </Button>
            )}
            {!!currentUser && (
              <Button component={RouterLink} to="/snippets" color="inherit">
                My Snippets
              </Button>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
