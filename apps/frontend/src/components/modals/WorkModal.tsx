import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { trackEvent, EVENTS } from '../../utils/analytics';
import { WorkModalProps } from '../../types/modal';

// Premium Icons as SVG Components
const FullProductIcon = () => (
  <svg width="24" height="24" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const DesignIcon = () => (
  <svg width="24" height="24" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 11l3 3 5-5" />
  </svg>
);

const AuditIcon = () => (
  <svg width="24" height="24" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

const ConsultationIcon = () => (
  <svg width="24" height="24" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconRenderer = ({ type }: { type: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    box: <FullProductIcon />,
    design: <DesignIcon />,
    audit: <AuditIcon />,
    consultation: <ConsultationIcon />,
  };
  return iconMap[type] || <FullProductIcon />;
};

const WorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose, config }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      trackEvent(EVENTS.MODAL_OPEN, { type: 'work_with_me' });
      setStep(1);
      setSelectedType(null);
    }
  }, [isOpen]);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    trackEvent(EVENTS.CTA_CLICK, { action: 'select_project_type', value: type });
    setTimeout(() => setStep(2), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    trackEvent(EVENTS.FORM_SUBMIT, { form: 'work_with_me', type: selectedType });
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  if (!config) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={config.title}>
      <div className="min-h-[380px] flex flex-col justify-start">
        
        {/* Step 1: Project Type */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-gray-500 mb-6 leading-relaxed text-base sm:text-lg">
              {config.description}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {config.projectTypes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTypeSelect(item.id)}
                  className={`
                    flex flex-col items-center sm:items-start gap-2 sm:gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 text-center sm:text-left group
                    ${selectedType === item.id 
                      ? 'border-gray-900 bg-gray-900 text-white shadow-xl shadow-gray-900/10' 
                      : 'border-slate-100 bg-slate-50 text-gray-900 hover:border-gray-200 hover:bg-white hover:shadow-lg'}
                  `}
                >
                  <div className={`
                    w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl transition-all duration-300
                    ${selectedType === item.id ? 'bg-white/10 text-white' : 'bg-white text-slate-400 group-hover:text-gray-900 shadow-sm'}
                  `}>
                    <IconRenderer type={item.iconType} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm sm:text-base font-extrabold tracking-tight">{item.label}</h4>
                    <p className={`hidden sm:block text-[11px] leading-tight ${selectedType === item.id ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Form Details */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <header className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">{selectedType}</h3>
                <p className="text-xs text-gray-500">Let's get started</p>
              </div>
              <button onClick={() => setStep(1)} className="text-[10px] font-bold text-gray-400 hover:text-gray-900 bg-slate-100 px-2.5 py-1.5 rounded-full transition-all">
                Change
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <input required type="text" placeholder="Full Name" className="w-full px-5 py-4 rounded-xl sm:rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm sm:text-base" />
              <input required type="email" placeholder="Email Address" className="w-full px-5 py-4 rounded-xl sm:rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm sm:text-base" />
              <textarea required rows={3} placeholder="Project vision..." className="w-full px-5 py-4 rounded-xl sm:rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all resize-none text-sm sm:text-base" />
              
              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-gray-900 text-white rounded-xl sm:rounded-[1.5rem] py-4 sm:py-5 text-sm sm:text-base font-extrabold hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98]"
              >
                {loading ? (
                  <span className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Message</>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-500 py-6 sm:py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 rotate-3 shadow-lg shadow-emerald-500/10">
              <CheckIcon />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Sent!</h3>
            <p className="text-gray-500 max-w-[280px] sm:max-w-sm mx-auto leading-relaxed mb-8 sm:mb-10 text-sm sm:text-lg">
              I'll reach out about your <span className="font-bold text-gray-900">{selectedType}</span> project within 24 hours.
            </p>
            <button 
              onClick={onClose}
              className="px-8 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-100 transition-all"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default WorkModal;
