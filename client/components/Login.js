import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';

import { Grid, TextField, Box, Button } from '@material-ui/core';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loginWithGoogle } = useUser();
  const history = useHistory();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      await login(email, password);
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box pt={3}>
      <Grid container justify="center" alignItems="center">
        <Grid item>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="email"
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(evt) => setEmail(evt.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="password"
                  id="password"
                  name="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value)}
                />
              </Grid>
            </Grid>
            <Box pt={2}>
              <Button type="submit" variant="contained" fullWidth color="primary">
                Login
              </Button>
            </Box>
            <Box pt={2}>
              <Button onClick={handleGoogleLogin} variant="contained" fullWidth color="primary">
                Login with Google
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
