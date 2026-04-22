import { ModalConfig, ProjectType, ConnectOption } from './modal';

export interface HeroTextConfig {
  badge?: string;
  heading: string;
  subheading: string;
  intro: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ProfileConfig {
  name: string;
  role: string;
  image: string;
  stats: Stat[];
  funFacts?: string[];
}

export interface FooterConfig {
  owner: string;
  links: { label: string; url: string }[];
}

export interface HeroConfig {
  flags?: {
    hero_section_enabled: boolean;
    analytics_tracking_enabled: boolean;
    analytics_dashboard_enabled: boolean;
  };
  heroText: HeroTextConfig;
  profile: ProfileConfig;
  modals: {
    work: ModalConfig & { 
      label: string; 
      projectTypes: ProjectType[];
    };
    connect: ModalConfig & { 
      label: string; 
      email: string;
      options: ConnectOption[];
    };
  };
  footer: FooterConfig;
}

export interface HeroTextProps extends HeroTextConfig {}

export interface ExtendedHeroTextProps extends HeroTextProps {
  onWorkClick?: () => void;
  onConnectClick?: () => void;
  workLabel?: string;
  connectLabel?: string;
}

export interface ProfileCardProps extends ProfileConfig {}
