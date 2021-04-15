import React, { useContext } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

import { makeStyles, AppBar, Toolbar, Typography, Button, Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const { currentUser, logout } = useContext(UserContext);
  const history = useHistory();

  const doLogout = async () => {
    try {
      await logout();
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={RouterLink} className={classes.title} to="/">
          <Typography variant="h6">Code-a-gram</Typography>
        </Button>
        {currentUser ? (
          <div>
            <Button component={RouterLink} to="/" color="inherit">
              My Snippets
            </Button>
            <Button component={RouterLink} to="/users" color="inherit">
              Users
            </Button>
            <Button component={RouterLink} to="/users/following" color="inherit">
              Following
            </Button>
            <Button onClick={doLogout} color="inherit">
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
            <Button component={RouterLink} to="/signup" color="inherit">
              Signup
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
