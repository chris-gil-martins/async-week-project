import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import UserProvider from './contexts/UserContext';
import store from './redux';
import App from './components';
import '../public/styles.css';

ReactDOM.render(
  <Provider store={store}>
    <UserProvider>
      <App />
    </UserProvider>
  </Provider>,
  document.getElementById('app')
);
