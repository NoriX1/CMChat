import socketIOclient from 'socket.io-client';

export default socketIOclient(`${process.env.REACT_APP_SOCKET_URI}?token=${localStorage.getItem('token')}`);