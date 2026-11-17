# Claude Fable 5.2 (High) Revamp Directive: Pet Pals Web Application
> **System Role**: Senior Motion & Interface Architect / Principal Frontend Systems Engineer  
> **Mode**: Claude Fable 5.2 High Reasoning & Autonomous Execution Mode  
> **Target**: Comprehensive UI/UX Overhaul of `pet_shop` multi-page website  

---

## 1. Executive Summary & Aesthetic North Star
Transform the existing **Pet Pals** multi-page website into an elite, motion-forward, retro-modern tactile experience. The aesthetic amalgamates:
1. **Motionsites-tier Hero Stage**: High-velocity kinetic typography, a bottom-anchored 3D pet mascot, sticky multi-layered drop-shadow typography, scroll-driven inward sliding word columns, and a seamless 60fps infinite marquee.
2. **Pet Pals Signature Palette**: Signature Warm Golden Yellow (`#FBCB5B`) & Deep Slate Royal Blue (`#2D4D8A`), accented with Vibrant Periwinkle (`#5E76C5`), Terracotta (`#CE865E`), and Energetic Coral Pop (`#FF624F`).
3. **Tactile Neo-Brutalist Craft**: Chunky solid borders (`3px solid #2D4D8A`), hard drop shadows (`8px 8px 0px ...`), pill buttons with sliding fills, buttery border-radii (`20px - 28px`), and interactive micro-animations.

---

## 2. Strict Architectural Invariants
1. **Zero Stack Alteration**: Keep pure semantic HTML5, CSS3 (`index.css`), and minimal Vanilla JavaScript for scroll math and interaction. Do NOT convert to a SPA, framework, or introduce build tools unless requested.
2. **Preserve All Internal Links & Navigation**:
   - `index.html` ↔ `pets.html` ↔ `services.html` ↔ `about.html` ↔ `testimonials.html` ↔ `contact.html`
3. **Preserve Functional Attributes**:
   - All external breed documentation URLs (The Spruce Pets links in `pets.html`).
   - All contact form inputs (`name`, `email`, `phone`, `pet-type`, comments, submit handlers).
   - Real price amounts (`₹10000`, `₹25000`, etc.) and existing image assets.
4. **Clean File System Output**: Write files directly to disk using filesystem tools. Avoid truncating code or outputting placeholders like `/* rest of code here */`.

---

## 3. Design System Tokens & Typography

### Typography Head Embed:
```html
<!-- Display Font: Bamboly Demo (Hero Titles, Stacked Headers, Marquee) -->
<link href="https://db.onlinewebfonts.com/c/58ee300970307a1cc399e6bebd7617ce?family=Bamboly+Demo" rel="stylesheet">

<!-- Primary Body & Subheadings: Inter, Poppins, Fredoka -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet">
```

### Color Palette Tokens:
```css
:root {
  --color-hero-bg: #FBCB5B;          /* Signature warm golden yellow */
  --color-canvas-light: #FFFDF5;     /* Warm butter cream page background */
  --color-brand-blue: #2D4D8A;       /* Deep signature slate royal blue */
  --color-accent-blue: #5E76C5;      /* Vibrant periwinkle blue */
  --color-sky-blue: #89CFF0;         /* Pastel sky blue */
  --color-terracotta: #CE865E;       /* Warm cinnamon terracotta */
  --color-coral-pop: #FF624F;        /* High-energy coral pop */
  --color-pure-white: #FFFFFF;       /* Crisp white */
  --color-dark-slate: #17233D;       /* Contrast base & footer */
  --shadow-tactile: 6px 6px 0px var(--color-brand-blue);
  --shadow-tactile-lg: 10px 10px 0px var(--color-brand-blue);
  --shadow-coral: 6px 6px 0px var(--color-coral-pop);
}
```

---

## 4. 3D Pet Mascot Specification
- **Subject**: Stylized 3D French Bulldog / Golden Retriever pup with electric-blue eyes, wearing a sleek retro-sport ribbed collar or hoodie, chest-up bust looking upward with personality, transparent cutout background.
- **Image URL**:
  ```html
  <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260801_104316_80b428ea-dc99-4399-afb3-8ccb7b34b2d0.png&w=1280&q=85" 
       alt="Pet Pals 3D Mascot" 
       class="hero-mascot-img" />
  ```
- **Fallback Asset**: Clean local cutout `images/freepik__upload__98625.png` styled with `filter: drop-shadow(0 20px 30px rgba(45,77,138,0.25))`.

---

## 5. Tactical Directives for Claude Fable 5.2 (High)

### Directive A: Sub-Agent / Multi-Phase Orchestration
To avoid single-turn token limits and ensure zero truncation, orchestrate execution across dedicated sequential phases or sub-agents:

```
[Phase 1: Design Engine & Global Shell]
├── Build centralized `index.css` (variables, typography, tactile card components, pill buttons, animations)
└── Establish unified responsive Navbar (with mobile toggle) and Global Footer.

[Phase 2: Hero Stage & Landing Engine (`index.html`)]
├── 120vh Sticky Hero with 4-Layer Stacked "PET PALS" drop typography
├── Scroll-driven kinetic Poppins side word columns (deterministic math)
├── Infinite 60fps Marquee track
└── Revamped Featured Companions grid with neo-brutalist hover physics

[Phase 3: Catalog & Services (`pets.html` & `services.html`)]
├── `pets.html`: Filter pills, pet card grid, status badges, price pills, detail links
└── `services.html`: Zig-zag alternating cards, watermark numbers, feature checkmarks

[Phase 4: Brand Proof & Engagement (`about.html`, `testimonials.html`, `contact.html`)]
├── `about.html`: Bento grid, ethical breeding standards, masonry gallery
├── `testimonials.html`: Rating star SVGs, verified pills, parent avatars
└── `contact.html`: High-contrast form card, custom inputs, store hours & interactive map frame

[Phase 5: Verification & Quality Audit]
├── Cross-page navigation verification
├── Viewport responsiveness check (375px, 768px, 1024px, 1440px)
└── 60fps scroll & animation performance audit
```

### Directive B: Token Handling & Context Budgeting
1. **Direct File Tool Execution**: Do NOT print thousands of lines of HTML/CSS to the chat console. Use filesystem tools (`write_file`, `edit_file`) to write code directly into repository files.
2. **Modular Progression**: Complete one file per step. Verify file completeness before proceeding to the next file.
3. **No Placeholders**: Never emit `<!-- same as before -->` or `/* unchanged CSS */`. Every file written must be 100% complete, production-ready, and standalone.

### Directive C: Responsive Design Matrix & Layout Guardrails
1. **Fluid Clamp Sizing**: Use `clamp()` for typography and padding to eliminate jarring breakpoint jumps:
   - Hero Display: `clamp(5.5rem, 22vw, 20rem)`
   - Hero Side Words: `clamp(1.4rem, 6vw, 7rem)`
   - Section Headings: `clamp(2rem, 5vw, 3.5rem)`
   - Body Text: `clamp(1rem, 1.2vw, 1.15rem)`
2. **Breakpoints**:
   - **Mobile (`< 768px`)**: Stacked title drop halved (`18px`), side word offset halved (`scaleFactor = 0.5`), full-width cards, accessible touch targets (minimum 44x44px), hamburger drawer navigation.
   - **Tablet (`768px - 1023px`)**: 2-column grids, scale factor `0.75`, padded gutters `4vw`.
   - **Desktop (`>= 1024px`)**: Full kinetic offsets, multi-column bento grids, full sticky hero motion.
3. **Scroll & Overflow Safety**:
   - `html, body { overflow-x: hidden; width: 100%; }`
   - Use `100dvh` where supported with `100vh` fallback to prevent mobile browser URL-bar jumping.

---

## 6. Page Specifications & Motion Physics

### 6.1 `index.html` (Hero & Motion Stage)
- **Hero Height**: `120vh`, `position: relative`, `background: #FBCB5B`.
- **Sticky Typography Overlay**: `position: sticky; top: 0; height: 100vh; overflow: hidden;`
- **Stacked "PET PALS" Title** (`z-index: 5`):
  - Layer 0 (Back): `#5E76C5` (Desktop offset `translateY(36px)`, Mobile `18px`)
  - Layer 1: `#FBCB5B` (Desktop offset `translateY(24px)`, Mobile `12px`)
  - Layer 2: `#FF624F` (Desktop offset `translateY(12px)`, Mobile `6px`)
  - Layer 3 (Front): `#FFFFFF` (Offset `translateY(0px)`)
- **Kinetic Side Words** (`z-index: 6`):
  - Left: `CUDDLE`, `NURTURE`, `PLAYFUL`, `WHISKERS`
  - Right: `LOYALTY`, `BOUNCY`, `PURRFECT`, `UNLEASH`
  - Exact Math:
    ```javascript
    const maxScroll = heroSection.offsetHeight - window.innerHeight;
    const progress = Math.min(Math.max(-heroRect.top / maxScroll, 0), 1);
    const scaleFactor = window.innerWidth < 768 ? 0.5 : 1.0;
    // Offset for word i (0..3):
    const leftOffset = -(60 + i * 40) * scaleFactor * (1 - progress);
    const rightOffset = +(60 + i * 40) * scaleFactor * (1 - progress);
    const opacity = 0.35 + progress * 0.65;
    ```
- **3D Mascot Placement** (`z-index: 10`):
  - Bottom-anchored `bottom: 0; left: 50%; transform: translateX(-50%);`
  - Inline style: `height: 112%; max-height: 112%; min-height: 75%;`
- **Marquee Band** (`z-index: 20`):
  - Background `#2D4D8A`, Text `#FBCB5B`, font `"Bamboly Demo"`.
  - String: `ETHICAL BREEDING · SPA GROOMING · VET APPROVED · PURE JOY · HEALTHY PAWS · ADOPT LOVE · FOREVER HOMES · `
  - 4 seamless clones running 20s linear infinite translation to `-50%`.

### 6.2 `pets.html` (Catalog & Adoption Showcase)
- Interactive category pills (All, Dogs, Cats, Bunnies, Aquatic) with active state switching.
- Pet cards: tactile shadow `8px 8px 0px #2D4D8A`, hover lift `translateY(-6px)`, verified breeding badge, formatted price pill (`#FF624F`), and preserved detail links.

### 6.3 `services.html` (Care & Wellness)
- Alternating editorial layout with decorative watermark numbers (`01`, `02`, `03`).
- Service cards with feature checklist badges (`🐾 Bathing`, `🐾 Nail Trimming`, etc.), soft gradient accents, and tactile action buttons.

### 6.4 `about.html` (Brand Heritage & Standards)
- Bento grid: "Our Story" (founding narrative), "Ethical Breeding Standard", and "Vet Certified Care".
- Masonry image gallery with zoom-on-hover physics (`scale(1.04)`).
- Certifications showcase banner with gold tactile badges.

### 6.5 `testimonials.html` (Customer Voices)
- Playful ASCII title: `≽^• ˕ • ྀི≼ Happy Pet Parents`.
- Masonry review cards with 5-star rating SVG clusters, pet parent photos with offset border rings, and quote highlights.

### 6.6 `contact.html` (Interactive Contact Hub)
- Two-column layout:
  - Left: Store hours, emergency hotline card, location details, interactive map iframe.
  - Right: Tactile neo-brutalist form card in `#2D4D8A` with `#FBCB5B` hard shadow.
- Custom inputs with floating focus transitions and responsive submit button with hover slide.

---

## 7. Deliverables & Execution Standard
1. Fully implemented and formatted `index.css`.
2. Fully updated HTML files (`index.html`, `pets.html`, `services.html`, `about.html`, `testimonials.html`, `contact.html`).
3. Fully functional JavaScript for scroll tracking, mobile menu toggle, and category filtering.
4. Zero visual bugs, zero missing styles, zero broken links.
