import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import UserProvider from './contexts/UserContext';
import SocketProvider from './contexts/SocketContext';
import store from './redux';
import App from './components';
import '../public/styles.css';

ReactDOM.render(
  <Provider store={store}>
    <UserProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </UserProvider>
  </Provider>,
  document.getElementById('app')
);
