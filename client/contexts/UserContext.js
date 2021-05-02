import React, { useState, useEffect, useContext } from 'react';
import { fireAuth, db, googleAuthProvider } from '../firebase';

const UserContext = React.createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signup = (email, password, name) => {
    return fireAuth.createUserWithEmailAndPassword(email, password).then((credentials) => {
      db.collection('users').doc(credentials.user.uid).set({
        name,
        following: [],
        followers: [],
        profilePicture:
          'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
      });
    });
  };

  const login = (email, password) => {
    return fireAuth.signInWithEmailAndPassword(email, password);
  };

  const loginWithGoogle = () => {
    return fireAuth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const user = result.user;
        const doc = await db.collection('users').doc(user.uid).get();
        if (!doc || !doc.exists) {
          await db.collection('users').doc(user.uid).set({
            name: user.displayName,
            following: [],
            followers: [],
            profilePicture:
              'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
          });
        }
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
