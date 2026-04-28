import React, { useState, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatTrigger from './ChatTrigger';
import ChatErrorBoundary from './ChatErrorBoundary';
import chatbotConfig from '../../config/chatbot.json';

const ChatModal = lazy(() => import('./ChatModal'));

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastClick, setLastClick] = useState(0);

  const toggleOpen = () => {
    // SECURE: Debounce (300ms)
    const now = Date.now();
    if (now - lastClick < 300) return;
    setLastClick(now);

    if (!isOpen) {
      console.info('[CHAT_EVENT] CHAT_OPENED');
    }
    setIsOpen(!isOpen);
  };

  const fallbackMsg = chatbotConfig?.fallbackMessage || "Hi, how can we help?";

  return (
    <ChatErrorBoundary fallback={fallbackMsg}>
      <ChatTrigger onClick={toggleOpen} isOpen={isOpen} />
      
      <AnimatePresence>
        {isOpen && (
          <Suspense fallback={null}>
            <ChatModal onClose={() => setIsOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </ChatErrorBoundary>
  );
};

export default ChatWidget;
