import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { trackEvent, EVENTS } from '../../utils/analytics';
import { WorkModalProps, ProjectType } from '../../types/modal';
import { submitLead } from '../../utils/api';

// Architectural Icons
const DeliveryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="1" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const MentorshipIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

const CoffeeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16a3 3 0 0 1 3 3v1a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7V8z" />
    <path d="M6 1v3M10 1v3M14 1v3" />
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
    box: <DeliveryIcon />,
    mentorship: <MentorshipIcon />,
    coffee: <CoffeeIcon />,
  };
  return iconMap[type] || <DeliveryIcon />;
};

const WorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose, config }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (isOpen) {
      trackEvent(EVENTS.CLICKED, { ctaId: 'Work With Me', action: 'modal_open' });
      setStep(1);
      setSelectedType(null);
      setErrors({});
    }
  }, [isOpen]);

  const handleClose = () => {
    if (step < 3) {
      const optionName = selectedType ? ` - ${selectedType.id}` : '';
      trackEvent(EVENTS.ABANDONED, { 
        ctaId: `Work With Me${optionName} Journey Not Completed / Abandoned`
      });
    }
    onClose();
  };

  const handleTypeSelect = (type: ProjectType) => {
    setSelectedType(type);
    trackEvent(EVENTS.CLICKED, { ctaId: `Work With Me - ${type.id} option clicked` });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedType) return;

    setErrors({});
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validation
    const newErrors: Record<string, string> = {};
    selectedType.formSchema.forEach(field => {
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
      await submitLead('work_with_me', selectedType.id, data);
      trackEvent(EVENTS.COMPLETED, { ctaId: `Work With Me - ${selectedType.id} Journey Completed` });
      setStep(3);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!config) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={config.title}>
      <div className="flex flex-col">
        
        {/* Step 1: Option Selection */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <p className="text-gray-500 mb-8 text-base sm:text-lg leading-relaxed">
              {config.description}
            </p>
            <div className="space-y-3 sm:space-y-4">
              {config.projectTypes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTypeSelect(item)}
                  className="w-full flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-900 group transition-all duration-300 text-left hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                    <IconRenderer type={item.iconType} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{item.label}</h4>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{item.description}</p>
                  </div>
                  <div className="text-gray-200 group-hover:text-gray-900 transition-all group-hover:translate-x-1">
                    <ArrowRight />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pure Dynamic Schema Form */}
        {step === 2 && selectedType && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <header className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Objective</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none mt-1">{selectedType.label}</h3>
              </div>
              <button 
                onClick={() => {
                  setStep(1);
                  setErrors({});
                }} 
                className="text-[10px] font-bold text-gray-900 hover:opacity-50 transition-all border-b-2 border-gray-900 pb-0.5"
              >
                BACK
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {selectedType.formSchema.map((field) => {
                  if (field.type === 'textarea' || !field.halfWidth) return null;
                  return (
                    <div key={field.name} className="col-span-1 border-gray-200">
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

              {selectedType.formSchema.map((field) => {
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
                    ) : (
                      field.type === 'select' ? (
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
                      )
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
                  <>
                    CONFIRM REQUEST
                    <ArrowRight />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Success State */}
        {step === 3 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-700 py-8 sm:py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl rotate-3">
              <svg width="32" height="32" className="sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tighter italic uppercase underline decoration-gray-900/10 underline-offset-8 decoration-4">Request Sent</h3>
            <p className="text-gray-500 max-w-[260px] sm:max-w-xs mx-auto leading-relaxed mb-10 text-sm sm:text-base font-medium">
              I've received your inquiry for <span className="text-gray-900 font-bold">{selectedType?.label}</span>. I'll review the details and get back to you shortly.
            </p>
          </div>
        )}

      </div>
    </Modal>
  );
};


export default WorkModal;
