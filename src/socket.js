import {io} from 'socket.io-client';

export const initSocket = async()=>{
    const options = {
        forceNew:true,
        reconnection: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io('http://localhost:5000', options);
};