import projectData from './projects.json';
import postData from './posts.json';
import testimonialData from './testimonials.json';
import certificateData from './certifications.json';
import faqData from './faq.json';
import type { Project, Post, Testimonial, Certificate, FAQItem } from '../types/content';

export { default as site } from './site.json';
export { default as about } from './about.json';
export { default as clients } from './clients.json';
export { default as skills } from './skills.json';
export { default as services } from './services.json';

export const projects: Project[] = projectData;
export const featuredProjects: Project[] = projects.slice(0, 4);
export const posts: Post[] = postData;
export const testimonials: Testimonial[] = testimonialData;
export const certificates: Certificate[] = certificateData;
export const faqs: FAQItem[] = faqData;
