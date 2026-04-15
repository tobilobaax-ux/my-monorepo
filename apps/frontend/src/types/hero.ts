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
}

import { ModalConfig } from './modal';

export interface HeroConfig {
  heroText: HeroTextConfig;
  profile: ProfileConfig;
  modals: {
    work: ModalConfig & { label: string };
    connect: ModalConfig & { label: string; socials: { platform: string; url: string; description: string }[] };
  };
}

export interface HeroTextProps extends HeroTextConfig {}

export interface ProfileCardProps extends ProfileConfig {}
