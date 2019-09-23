import socketIOclient from 'socket.io-client';

export default socketIOclient(`localhost:3090?token=${localStorage.getItem('token')}`);