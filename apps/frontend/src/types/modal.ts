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

export interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: ModalConfig;
}

export interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: ModalConfig;
  socials?: {
    platform: string;
    url: string;
    description: string;
  }[];
}
