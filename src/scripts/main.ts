import { initMenu } from './menu';
import { initMotion } from './motion';
import { initContactForm, initCopyEmail } from './contact';

// Astro processes this as a module: it is deferred and runs once per page.
initMotion();
initMenu();
initContactForm();
initCopyEmail();
