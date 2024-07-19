import React from 'react';
import { IMessage } from '../models/IMessages';
import Message from './message';

interface MessageListProps {
  messages: IMessage[];
  currentUserID: string;
  onEdit: (messageId: string, messageText: string) => void;
  onDelete: (messageId: string) => void;
  editingMessageId: string | null;
  editingMessageText: string;
  setEditingMessageText: React.Dispatch<React.SetStateAction<string>>;
  onUpdate: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserID,
  onEdit,
  onDelete,
  editingMessageId,
  editingMessageText,
  setEditingMessageText,
  onUpdate
}) => (
  <div className="messages">
    {messages.map((msg) => (
      <Message
        key={msg.id}
        message={msg}
        currentUserID={currentUserID}
        onEdit={onEdit}
        onDelete={onDelete}
        editingMessageId={editingMessageId}
        editingMessageText={editingMessageText}
        setEditingMessageText={setEditingMessageText}
        onUpdate={onUpdate}
      />
    ))}
  </div>
);

export default MessageList;
