import React, { useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = React.createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const sio = io();
    setSocket(sio);
    return () => sio.close();
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
