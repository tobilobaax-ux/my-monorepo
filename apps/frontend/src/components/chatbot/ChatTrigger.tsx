import React from 'react';
import { motion } from 'framer-motion';

interface ChatTriggerProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatTrigger: React.FC<ChatTriggerProps> = ({ onClick, isOpen }) => {
  return (
    <motion.button
      id="chat-trigger"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors z-50 ${
        isOpen ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'
      }`}
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )}
    </motion.button>
  );
};

export default React.memo(ChatTrigger);
