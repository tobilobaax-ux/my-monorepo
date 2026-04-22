import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ModalConfig {
  title: string;
  description: string;
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  placeholder: string;
  required?: boolean;
  halfWidth?: boolean;
  options?: string[];
}

export interface ProjectType {
  id: string;
  label: string;
  description: string;
  iconType: string;
  formSchema: FormField[];
}

export interface ConnectOption {
  id: string;
  label: string;
  description: string;
  iconType: string;
  formSchema: FormField[];
}

export interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: ModalConfig & { projectTypes: ProjectType[] };
}

export interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: ModalConfig & { 
    email: string;
    options: ConnectOption[];
  };
}
