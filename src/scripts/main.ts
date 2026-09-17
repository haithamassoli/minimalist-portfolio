import { initMenu } from './menu';
import { initReveal } from './reveal';
import { initContactForm, initCopyEmail } from './contact';

// Astro processes this as a module: it is deferred and runs once per page.
initMenu();
initReveal();
initContactForm();
initCopyEmail();
