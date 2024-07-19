import io from 'socket.io-client';
import { IMessage } from '../models/IMessages';
const socket = io(process.env.SERVER!); 

const joinRoom = (userId: string) => {
  socket.emit('joinRoom', { userId });
};

const onNewMessage = (callback: (message: IMessage) => void) => {
  socket.on('newMessage', callback);
};

const offNewMessage = () => {
  socket.off('newMessage');
};

const onDeleteMessage = (callback: (messageId: string) => void) => {
  socket.on('deleteMessage', callback);
};

const offDeleteMessage = () => {
  socket.off('deleteMessage');
};

const onUpdateMessage = (callback: (updatedMessage: IMessage) => void) => {
  socket.on('updateMessage', callback);
};

const offUpdateMessage = () => {
  socket.off('updateMessage');
};

export default {
  joinRoom,
  onNewMessage,
  offNewMessage,
  onDeleteMessage,
  offDeleteMessage,
  onUpdateMessage,
  offUpdateMessage,
};
