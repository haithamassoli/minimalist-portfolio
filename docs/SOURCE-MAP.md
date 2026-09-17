# Source map

The supplied `Pasted text.txt` (inspected homepage DOM) is the content source.
The public homepage was checked to confirm section order and links.

| Original section | Astro component | Editable content |
|---|---|---|
| Hero | Hero.astro | site.json |
| Client Logos | ClientStrip.astro | clients.json |
| Projects | Projects.astro | projects.json |
| About Me | About.astro | about.json, site.json |
| Skills | Skills.astro | skills.json |
| Services | Services.astro | services.json |
| Testimonials | Testimonials.astro | testimonials.json |
| Certifications | Certifications.astro | certifications.json |
| FAQ | FAQ.astro | faq.json |
| Articles | Articles.astro | posts.json |
| Footer | Footer.astro, ContactForm.astro | site.json |

## Deliberate changes

- One responsive DOM tree, rather than separate Framer breakpoint copies.
- Semantic elements, keyboard focus indicators, native dialog and details, reduced-motion support.
- CSS dot pattern in place of hundreds of absolutely positioned dot elements.
- Native scrolling and light entrance/hover effects, not Framer's exact animation engine.
- No tracking, editor toolbar, browser-extension styles, or template purchase widget.
- Public project/blog listing pages reuse the four projects and three articles in the supplied homepage. These listing layouts are implementation additions, not recovered source pages.
- Case-study and article bodies were not in the uploaded HTML. Cards open their original detail URLs; no detail text has been invented.
- Original booking link was only https://cal.com; replace it with a real booking profile.
- Source experience list has three jobs. The source “show all” affordance now links to the provided LinkedIn profile instead of pretending more job data exists.
- Contact form delivery requires your endpoint. Without one, it opens an email draft and explicitly does not claim delivery.
- Original image/font URLs remain remote references. Embedded SVG artwork was extracted into public/icons. No font binaries are included.
