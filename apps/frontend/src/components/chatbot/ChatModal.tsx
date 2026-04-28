import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import chatbotConfig from '../../config/chatbot.json';

interface ChatModalProps {
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleHelpClick = () => {
    console.info('[CHAT_EVENT] HELP_CLICKED');
    setStep(1);
  };

  const handleCTAClick = () => {
    console.info('[CHAT_EVENT] CTA_REDIRECT');
    navigate(chatbotConfig.ctaPath);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 w-[320px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
        <Typography variant="h6" className="text-sm font-bold">
          Assistant
        </Typography>
        <button onClick={onClose} className="hover:bg-blue-700 rounded-full p-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-4"
            >
              <Typography variant="body2" className="text-gray-700">
                {chatbotConfig.greeting}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleHelpClick}
                className="bg-blue-600 hover:bg-blue-700 normal-case rounded-lg py-2"
              >
                {chatbotConfig.helpText}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-4"
            >
              <Typography variant="body2" className="text-gray-700">
                {chatbotConfig.guidanceText}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCTAClick}
                className="bg-green-600 hover:bg-green-700 normal-case rounded-lg py-2"
              >
                {chatbotConfig.ctaLabel}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatModal;
