import React, { useState, useEffect } from 'react';
import { fireAuth, db, googleAuthProvider } from '../firebase';

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signup = (email, password, name) => {
    return fireAuth.createUserWithEmailAndPassword(email, password).then((credentials) => {
      db.collection('users').doc(credentials.user.uid).set({
        name,
        following: [],
      });
    });
  };

  const login = (email, password) => {
    return fireAuth.signInWithEmailAndPassword(email, password);
  };

  const loginWithGoogle = () => {
    return fireAuth
      .signInWithPopup(googleAuthProvider)
      .then((result) => {
        const user = result.user;
        db.collection('users').doc(user.uid).set({
          name: user.displayName,
          following: [],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logout = () => {
    return fireAuth.signOut();
  };

  useEffect(() => {
    return fireAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, login, signup, logout, loginWithGoogle }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
