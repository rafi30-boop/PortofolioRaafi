export interface SocialLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  firstName: string;
  role: string;
  title: string;
  headline: string;
  description: string;
  email: string;
  location: string;
  url: string;
  responseTime: string;
  socials: SocialLink[];
  footerColumns: FooterColumn[][];
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  year: string;
  image?: string;
  gradient: string;
  tech: string[];
  details: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  school: string;
  period: string;
  description: string;
}

export interface CertificateItem {
  slug: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  credentialUrl: string;
  image?: string;
  gradient: string;
  details: string[];
  skills: string[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface PortfolioContent {
  site: SiteConfig;
  specialties: string[];
  skills: Skill[];
  projects: Project[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certificates: CertificateItem[];
}