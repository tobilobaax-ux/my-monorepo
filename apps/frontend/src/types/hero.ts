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

export interface HeroConfig {
  heroText: HeroTextConfig;
  profile: ProfileConfig;
}

export interface HeroTextProps extends HeroTextConfig {}

export interface ProfileCardProps extends ProfileConfig {}
