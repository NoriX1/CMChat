import React from 'react';
import io from 'socket.io-client';

export default React.createContext(io(`${process.env.REACT_APP_SOCKET_URI}?token=`));