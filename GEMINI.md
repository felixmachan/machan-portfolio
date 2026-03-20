# GEMINI.md

## Project Overview
**Machán Félix - Mechatronics Engineering Portfolio**
A professional, high-impact portfolio showcasing multidisciplinary engineering expertise. The site highlights projects spanning mechanical design, electrical engineering, software development, and infrastructure. It features 3D model previews, responsive design, and localized content (HU/EN).

## Architecture & Technologies
- **Frontend:** Vanilla HTML5, CSS3, and JavaScript.
- **Styling:** Modular CSS system (`variables.css`, `base.css`, `components.css`, `animations.css`, `project.css`). Uses CSS variables for theme management (Light/Dark).
- **Animations:** Custom scroll-reveal logic (`reveal.js`) and CSS animations.
- **3D Visualization:** Integrated Three.js/Model Viewer for displaying `.glb` engineering models (pcbs, pedals, button boxes).
- **Assets:** Optimized image formats (AVIF, WebP) and SVG icons.
- **Tracking/SEO:** robots.txt, sitemap.xml, and OpenGraph metadata for social sharing.

## Directory Structure
- `index.html`: Core landing page with integrated sections (About, Experience, Education, Projects, Skills, Contact).
- `projects/`: Deep-dive pages for specific engineering projects (e.g., `network.html`, `pacerra.html`).
- `assets/`:
    - `css/`: Thematic and component-based stylesheets.
    - `js/`: Main interaction logic (`main.js`), 3D logic (`3d.js`), and gallery features (`lightbox.js`).
    - `img/`: Project imagery, professional photography, and service/technology logos.
    - `models/`: GLB files for 3D project previews.
    - `docs/`: Downloadable assets like CVs and technical documentation.

## Development & Usage
- **Development:** This is a pure static site. It can be served locally using any simple HTTP server (e.g., `npx serve`, `python -m http.server`, or Live Server in VS Code).
- **Styling Conventions:**
    - Use CSS variables from `variables.css` for colors, spacing, and typography.
    - Follow the "panel" and "reveal" class patterns for consistent layout and entry animations.
    - Adhere to the existing responsive breakpoints (768px, 420px).
- **Content Updates:**
    - For new projects, create a corresponding HTML file in `projects/` using `network.html` or `pacerra.html` as a template.
    - Register new projects in the `#projects` section of `index.html`.
    - Use optimized AVIF/WebP images for performance.

## Design Principles
- **Clarity and Reliability:** The aesthetic reflects engineering precision.
- **Visual Impact:** High-quality imagery and interactive 3D elements are prioritized to engage technical and non-technical viewers alike.
- **Local-First:** The architecture supports bi-lingual content through localized paths and language toggles.
