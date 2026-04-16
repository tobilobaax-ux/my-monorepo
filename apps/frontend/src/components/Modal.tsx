import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div 
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-gray-900/20 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out">
        
        {/* Header - More Compact on Mobile */}
        <div className="px-5 py-5 sm:px-8 sm:pt-8 sm:pb-4 flex justify-between items-center border-b border-gray-100/50">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
            aria-label="Close modal"
          >
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6"  y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content - Hidden Scrollbar & Tighter Mobile Padding */}
        <div className="px-5 py-6 sm:px-8 sm:pb-8 sm:pt-4 overflow-y-auto max-h-[80vh] no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
