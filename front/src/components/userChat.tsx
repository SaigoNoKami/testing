import React, { useState, useEffect, useContext } from 'react';
import '../styles/userChat.css';
import { IUser } from '../models/IUser';
import messageService from '../services/messagesService';
import { IMessage } from '../models/IMessages';
import { Context } from '..';
import socketService from '../services/socketService';
import MessageList from './messageList';
import MessageInput from './messageInput';

interface UserChatProps {
  user: IUser;
}

const UserChat: React.FC<UserChatProps> = ({ user }) => {
  const { store } = useContext(Context);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]); 
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState<string>('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await messageService.fetchChat(store.user.id, user.id);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();

    const handleNewMessage = (message: IMessage) => {
      if (
        (message.fromUserID === store.user.id && message.toUserID === user.id) ||
        (message.fromUserID === user.id && message.toUserID === store.user.id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleDeleteMessage = (messageId: string) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
    };

    const handleUpdateMessage = (updatedMessage: IMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );
    };

    socketService.joinRoom(store.user.id);
    socketService.onNewMessage(handleNewMessage);
    socketService.onDeleteMessage(handleDeleteMessage);
    socketService.onUpdateMessage(handleUpdateMessage);

    return () => {
      socketService.offNewMessage();
      socketService.offDeleteMessage();
      socketService.offUpdateMessage();
    };
  }, [store.user.id, user.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' && files.length === 0) {
      return; 
    }

    const formData = new FormData();
    formData.append('fromUserID', store.user.id);
    formData.append('toUserID', user.id);
    formData.append('message', newMessage);

    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await messageService.sendMessage(formData);
      setNewMessage('');
      setFiles([]); 
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  };

  const handleEditMessage = (messageId: string, messageText: string) => {
    setEditingMessageId(messageId);
    setEditingMessageText(messageText);
  };

  const handleUpdateMessage = async () => {
    try {
      await messageService.updateMessage(editingMessageId!, editingMessageText);
      setEditingMessageId(null);
      setEditingMessageText('');
    } catch (error) {
      console.error('Failed to update message', error);
    }
  };

  return (
    <div className="user-chat">
      <h2>Chat with {user.username}</h2>
      <MessageList
        messages={messages}
        currentUserID={store.user.id}
        onEdit={handleEditMessage}
        onDelete={handleDeleteMessage}
        editingMessageId={editingMessageId}
        editingMessageText={editingMessageText}
        setEditingMessageText={setEditingMessageText}
        onUpdate={handleUpdateMessage}
      />
      <MessageInput
        newMessage={newMessage}
        files={files} 
        setNewMessage={setNewMessage}
        setFiles={setFiles} 
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default UserChat;
