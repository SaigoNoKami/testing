import React, { useState, useEffect, useContext } from 'react';
import UserChat from './userChat';
import '../styles/chat.css';
import { IUser } from '../models/IUser';
import UserService from '../services/userService';
import { Context } from '..'; // Импортируйте контекст

const Chat: React.FC = () => {
  const [participants, setParticipants] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  
  const { store } = useContext(Context); // Получите функцию logout из контекста

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        let response = await UserService.fetchUsers();
        setParticipants(response.data);
      } catch (error) {
        console.error('Failed to fetch participants', error);
      }
    };

    
    fetchParticipants();
  }, []);
  
  const handleLogout = async () => {
    if (store.user) {
      await store.logout(store.user.id);
    }
  };
  return (
    <div className="chat-container">
      <div className="participants">
        {participants.map((user) => (
          <div key={user.id} onClick={() => setSelectedUser(user)} className="participant">
            {user.username}
          </div>
        ))}
        <button onClick={handleLogout} className="logout-button">Logout</button> 
      </div>
      <div className="chat-content">
        {selectedUser ? (
          <UserChat user={selectedUser} />
        ) : (
          <div className="no-chat">Select a participant to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
