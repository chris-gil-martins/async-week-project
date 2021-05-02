import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SnippetList from './SnippetList';
import Login from './Login';
import Signup from './Signup';
import NavBar from './Navbar';
import UserList from './UserList';
import AuthRoute from './AuthRoute';
import LiveStream from './LiveStream';
import Profile from './Profile';
import Feed from './Feed';
import SingleSnippet from './SingleSnippet';
import { setSnippets } from '../redux/reducers/snippets';
import { setAuth } from '../redux/reducers/auth';
import { setUsers } from '../redux/reducers/users';
import { useDispatch } from 'react-redux';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';

import { CssBaseline, Container } from '@material-ui/core';

const App = () => {
  const dispatch = useDispatch();
  const { currentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      return db.collection('users').onSnapshot(async (snapshot) => {
        dispatch(
          setUsers(
            snapshot.docs
              .filter((doc) => doc.id !== currentUser.uid)
              .reduce((acc, doc) => {
                acc[doc.id] = {
                  id: doc.id,
                  ...doc.data(),
                };
                return acc;
              }, {})
          )
        );
      });
    } else {
      dispatch(setUsers({}));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      return db
        .collection('snippets')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
          dispatch(setSnippets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
        });
    } else {
      dispatch(setSnippets([]));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      return db
        .collection('users')
        .doc(currentUser.uid)
        .onSnapshot((snapshot) => {
          dispatch(setAuth({ id: currentUser.uid, ...snapshot.data() }));
        });
    } else {
      dispatch(setAuth({}));
    }
  }, [currentUser]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <NavBar />
        <Container maxWidth="xl">
          <Switch>
            <AuthRoute exact path="/" component={Feed} />
            <AuthRoute exact path="/snippets" component={SnippetList} extraProps={{ self: true }} />
            <AuthRoute path="/snippets/:snippetId" component={SingleSnippet} />
            <AuthRoute exact path="/users" component={UserList} extraProps={{ subset: 'all' }} />
            <AuthRoute
              path="/users/following"
              component={UserList}
              extraProps={{ subset: 'following' }}
            />
            <AuthRoute
              path="/users/followers"
              component={UserList}
              extraProps={{ subset: 'followers' }}
            />
            <AuthRoute path="/users/:userId" component={SnippetList} extraProps={{ self: false }} />
            <AuthRoute path="/livestream/:userId" component={LiveStream} />
            <AuthRoute path="/profile" component={Profile} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </Container>
      </Router>
    </React.Fragment>
  );
};

export default App;
