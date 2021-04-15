import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const AuthRoute = ({ component: Component, extraProps = {}, ...otherProps }) => {
  const { currentUser } = useContext(UserContext);
  return (
    <Route
      {...otherProps}
      render={(props) => {
        return currentUser ? <Component {...props} {...extraProps} /> : <Redirect to="/login" />;
      }}
    />
  );
};

export default AuthRoute;
