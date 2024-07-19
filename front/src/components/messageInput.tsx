import React from 'react';
import '../styles/messagesInput.css';

interface MessageInputProps {
  newMessage: string;
  files: File[];
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  files,
  setNewMessage,
  setFiles,
  onSend
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button onClick={handleFileClick} className="custom-file-button">
        Choose Files
      </button>
      <div className="file-list">
        {files.map((file) => (
          <div key={file.name} className="file-item">
            <span>{file.name}</span>
            <button className="remove-file-btn" onClick={() => handleRemoveFile(file)}>✖</button>
          </div>
        ))}
      </div>
      <button onClick={onSend}>Send</button>
    </div>
  );
};

export default MessageInput;
