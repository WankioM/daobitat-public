import React from 'react';
import { Message } from '../../types/messages';

interface TextMessageProps {
  message: Message;
  isOwn: boolean;
}

const TextMessage: React.FC<TextMessageProps> = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-md rounded-lg px-4 py-2 ${
          isOwn ? 'bg-rustyred text-white' : 'bg-lightstone text-graphite'
        }`}
      >
        <p>{message.content}</p>
        <span className="text-xs opacity-75 block text-right mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

export default TextMessage;