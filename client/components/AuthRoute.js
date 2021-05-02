import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useSelector } from 'react-redux';

const AuthRoute = ({ component: Component, extraProps = {}, ...otherProps }) => {
  const { currentUser } = useUser();
  const user = useSelector((state) => state.auth);
  return (
    <Route
      {...otherProps}
      render={(props) => {
        return currentUser ? (
          user.id ? (
            <Component {...props} {...extraProps} />
          ) : (
            <div>Loading...</div>
          )
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};

export default AuthRoute;
