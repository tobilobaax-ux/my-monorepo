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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Editorial Backdrop */}
      <div 
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" 
        onClick={onClose}
      />

      {/* Editorial Modal Surface: Responsive Bottom Sheet -> Centered Card */}
      <div className="relative w-full max-w-lg bg-[#fafafa] rounded-t-[2rem] sm:rounded-[2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 ease-out border border-white/20 max-h-[92vh] sm:max-h-[85vh]">
        
        {/* Rough / TV Static Noise Overlay (Matching Hero Rhythm) */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.2] pointer-events-none mix-blend-multiply" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Header - Architectural & Precise */}
        <div className="relative z-10 px-6 sm:px-8 pt-8 pb-4 flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">{title}</h2>
            <div className="h-1 w-6 sm:w-8 bg-gray-900 mt-3 rounded-full" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-900 transition-all active:scale-95"
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6"  y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content Section padding adjustments */}
        <div className="relative z-10 px-6 sm:px-8 pb-10 sm:pb-12 pt-2 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
