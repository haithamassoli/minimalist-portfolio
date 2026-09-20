export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  sourceUrl: string;
  image: ImageAsset;
}

export interface Post {
  slug: string;
  title: string;
  author: string;
  dateLabel: string;
  date: string;
  excerpt: string;
  sourceUrl: string;
  image: ImageAsset;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: ImageAsset;
}

export interface Certificate {
  date: string;
  title: string;
  issuer: string;
  url: string;
}


export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
  direction: 'rtl' | 'ltr';
}
