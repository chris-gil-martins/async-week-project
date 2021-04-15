import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SnippetList from './SnippetList';
import Login from './Login';
import Signup from './Signup';
import NavBar from './Navbar';
import UserList from './UserList';
import AuthRoute from './AuthRoute';

import { CssBaseline, Container } from '@material-ui/core';

const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <NavBar />
        <Container maxWidth="xl">
          <Switch>
            <AuthRoute exact path="/" component={SnippetList} extraProps={{ self: true }} />
            <AuthRoute exact path="/users" component={UserList} extraProps={{ following: false }} />
            <AuthRoute
              path="/users/following"
              component={UserList}
              extraProps={{ following: true }}
            />
            <AuthRoute path="/users/:userId" component={SnippetList} extraProps={{ self: false }} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </Container>
      </Router>
    </React.Fragment>
  );
};

export default App;
