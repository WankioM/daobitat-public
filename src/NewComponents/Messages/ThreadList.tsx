import React from 'react';
import ThreadListItem from './ThreadListItem';
import { ThreadListProps, ChatContact } from '../../types/messages'; 

const ThreadList: React.FC<ThreadListProps> = ({
  contacts,
  selectedContactId,
  onSelectContact,
}) => {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-500 text-center">No messages yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact: ChatContact) => (
          <ThreadListItem
          key={`${contact.user._id}-${contact.property._id}`}
          contact={contact}
          isSelected={contact.user._id === selectedContactId}
          onClick={() => onSelectContact(contact)}
        />
        ))}
      </div>
    </div>
  );
};

export default ThreadList;