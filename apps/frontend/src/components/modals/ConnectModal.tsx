import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { trackEvent } from '../../utils/analytics';
import { ConnectModalProps } from '../../types/modal';

// Premium Icons
const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, config, socials }) => {
  const [copied, setCopied] = useState(false);
  const email = "hello@tobiloba.com";

  useEffect(() => {
    if (isOpen) trackEvent('modal_open', { type: 'connect_with_me' });
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    trackEvent('cta_connect_email_copy');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!config) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={config.title}>
      <p className="text-gray-500 mb-8 leading-relaxed text-lg">
        {config.description}
      </p>

      {/* Social Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {(socials || []).map((social) => (
          <a 
            key={social.platform}
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_connect_social_click', { platform: social.platform })}
            className={`
              flex flex-col gap-4 p-5 rounded-3xl border transition-all duration-300 group hover:shadow-xl hover:-translate-y-1
              ${social.platform.toLowerCase() === 'linkedin' 
                ? 'bg-[#0077b5]/5 border-[#0077b5]/10 hover:border-[#0077b5]/30' 
                : 'bg-slate-50 border-slate-100 hover:border-gray-900/10'}
            `}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-transform group-hover:scale-110 shadow-sm
              ${social.platform.toLowerCase() === 'linkedin' ? 'bg-[#0077b5] text-white' : 'bg-gray-900 text-white'}`}>
              {social.platform.toLowerCase() === 'linkedin' ? <LinkedInIcon /> : <TwitterIcon />}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900">{social.platform}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none">{social.description}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Copy Email Card */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-slate-300 hover:shadow-lg group mb-10"
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 group-hover:text-gray-900 transition-colors shadow-sm">
            {copied ? <CheckIcon /> : <CopyIcon />}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-gray-900">{email}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {copied ? 'Copied successfully!' : 'Click to copy email'}
            </span>
          </div>
        </div>
      </button>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-sm font-medium">
          <span className="bg-white px-4 text-gray-400">or send a quick note</span>
        </div>
      </div>

      <form className="space-y-4">
        <textarea 
          rows={2}
          placeholder="I just wanted to say..."
          className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all resize-none"
        />
        <button 
          type="button"
          onClick={() => { alert('Coming soon!'); onClose(); }}
          className="w-full bg-gray-900 text-white rounded-[1.5rem] py-5 text-base font-extrabold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 active:scale-[0.98]"
        >
          Send Message
        </button>
      </form>
    </Modal>
  );
};

export default ConnectModal;
