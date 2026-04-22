import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { trackEvent, EVENTS } from '../../utils/analytics';
import { ConnectModalProps, ConnectOption } from '../../types/modal';
import { submitLead } from '../../utils/api';

// Premium Architectural Icons
const AuditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const GroupIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconRenderer = ({ type }: { type: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    audit: <AuditIcon />,
    chat: <ChatIcon />,
    group: <GroupIcon />,
  };
  return iconMap[type] || <ChatIcon />;
};

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, config }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<ConnectOption | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (isOpen) {
      trackEvent(EVENTS.MODAL_OPEN, { type: 'connect_with_me' });
      setStep(1);
      setSelectedPath(null);
      setErrors({});
    }
  }, [isOpen]);

  const handlePathSelect = (path: ConnectOption) => {
    setSelectedPath(path);
    trackEvent(EVENTS.CTA_CLICK, { action: 'select_connect_path', value: path.id });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPath) return;

    setErrors({});
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validation
    const newErrors: Record<string, string> = {};
    selectedPath.formSchema.forEach(field => {
      const val = data[field.name] as string;
      if (field.required && !val) {
        newErrors[field.name] = 'This field is required';
      }
      if (field.type === 'email' && val && !validateEmail(val)) {
        newErrors[field.name] = 'Please enter a valid email address';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await submitLead('connect_with_me', selectedPath.id, data);
      trackEvent(EVENTS.FORM_SUBMIT, { form: 'connect_with_me', type: selectedPath.id });
      setStep(3);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!config) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={config.title}>
      <div className="flex flex-col">
        
        {/* Step 1: Elite Path Selection */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <p className="text-gray-500 mb-8 sm:mb-10 text-base sm:text-lg leading-relaxed">{config.description}</p>
            
            <div className="space-y-3 sm:space-y-4">
              {config.options.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePathSelect(item)}
                  className="w-full flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-900 group transition-all duration-300 text-left hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                    <IconRenderer type={item.iconType} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{item.label}</h4>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-70">{item.description}</p>
                  </div>
                  <div className="text-gray-200 group-hover:text-gray-900 transition-all group-hover:translate-x-1">
                    <ArrowRight />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Dynamic Path Form */}
        {step === 2 && selectedPath && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <header className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact Path</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none mt-1">{selectedPath.label}</h3>
              </div>
              <button 
                onClick={() => {
                  setStep(1);
                  setErrors({});
                }} 
                className="text-[10px] font-bold text-gray-900 hover:opacity-50 transition-all border-b-2 border-gray-900 pb-0.5"
              >BACK</button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {selectedPath.formSchema.map((field) => {
                  if (field.type === 'textarea' || !field.halfWidth) return null;
                  return (
                    <div key={field.name} className="col-span-1">
                      {field.type === 'select' ? (
                        <select 
                          name={field.name} 
                          required={field.required} 
                          className={`w-full px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl bg-white border ${errors[field.name] ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:border-gray-900 transition-all text-sm font-medium appearance-none`}
                        >
                          <option value="">{field.placeholder}</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input 
                          name={field.name} 
                          required={field.required} 
                          type={field.type} 
                          placeholder={field.placeholder} 
                          className={`w-full px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl bg-white border ${errors[field.name] ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:border-gray-900 transition-all text-sm font-medium`} 
                        />
                      )}
                      {errors[field.name] && <p className="mt-1 ml-4 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors[field.name]}</p>}
                    </div>
                  );
                })}
              </div>

              {selectedPath.formSchema.map((field) => {
                if (field.halfWidth) return null;
                return (
                  <div key={field.name} className="w-full">
                    {field.type === 'textarea' ? (
                      <textarea 
                        name={field.name} 
                        required={field.required} 
                        rows={4} 
                        placeholder={field.placeholder} 
                        className={`w-full px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl bg-white border ${errors[field.name] ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:border-gray-900 transition-all resize-none text-sm font-medium`} 
                      />
                    ) : field.type === 'select' ? (
                      <select 
                        name={field.name} 
                        required={field.required} 
                        className={`w-full px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl bg-white border ${errors[field.name] ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:border-gray-900 transition-all text-sm font-medium appearance-none`}
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input 
                        name={field.name} 
                        required={field.required} 
                        type={field.type} 
                        placeholder={field.placeholder} 
                        className={`w-full px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl bg-white border ${errors[field.name] ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:border-gray-900 transition-all text-sm font-medium`} 
                      />
                    )}
                    {errors[field.name] && <p className="mt-1 ml-4 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors[field.name]}</p>}
                  </div>
                );
              })}
              
              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-gray-900 text-white rounded-xl sm:rounded-2xl py-4 sm:py-5 text-sm font-bold hover:bg-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group mt-4"
              >
                {loading ? (
                  <span className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>SUBMIT REQUEST <ArrowRight /></>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Success State */}
        {step === 3 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-700 py-8 sm:py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl rotate-3">
              <svg width="32" height="32" className="sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tighter italic uppercase underline decoration-gray-900/10 underline-offset-8 decoration-4">Request Sent</h3>
            <p className="text-gray-500 max-w-[260px] sm:max-w-xs mx-auto leading-relaxed mb-10 text-sm sm:text-base font-medium">I've received your request. Talk soon.</p>
            <button onClick={onClose} className="text-[10px] font-bold text-gray-900 tracking-[0.3em] uppercase hover:opacity-50 transition-all">[ Close Window ]</button>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default ConnectModal;
