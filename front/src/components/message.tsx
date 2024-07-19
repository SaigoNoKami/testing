import React from 'react';
import { IMessage } from '../models/IMessages';
import '../styles/message.css';
interface MessageProps {
  message: IMessage;
  currentUserID: string;
  onEdit: (messageId: string, messageText: string) => void;
  onDelete: (messageId: string) => void;
  editingMessageId: string | null;
  editingMessageText: string;
  setEditingMessageText: React.Dispatch<React.SetStateAction<string>>;
  onUpdate: () => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  currentUserID,
  onEdit,
  onDelete,
  editingMessageId,
  editingMessageText,
  setEditingMessageText,
  onUpdate
}) => (
  <div className={`message ${message.fromUserID === currentUserID ? 'sent' : 'received'}`}>
    {editingMessageId === message.id ? (
      <div className="message-content">
        <input
          type="text"
          value={editingMessageText}
          onChange={(e) => setEditingMessageText(e.target.value)}
        />
        <button onClick={onUpdate}>Update</button>
      </div>
    ) : (
      <>
        <div className="message-content">
          {message.message}
          {message.filesURL && message.filesURL.map((fileURL, index) => (
            <div key={index}>
              <a href={fileURL} target="_blank" rel="noopener noreferrer">View File</a>
            </div>
          ))}
        </div>
        {message.fromUserID === currentUserID && (
          <div className="message-actions">
            <button className="delete-button" onClick={() => onDelete(message.id)}>Delete</button>
            <button className="edit-button" onClick={() => onEdit(message.id, message.message)}>Edit</button>
          </div>
        )}
      </>
    )}
  </div>
);

export default Message;
