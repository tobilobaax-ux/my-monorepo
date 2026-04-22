export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarConfig {
  logo: {
    text: string;
    href: string;
  };
  links: NavLink[];
}
