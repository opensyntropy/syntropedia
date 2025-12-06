# Design: Home Page - Syntropedia

## 1. DESIGN PHILOSOPHY

### Core Principles
- **Modern & Lightweight**: Clean, minimal, fast-loading
- **Natural & Organic**: Reflects agriculture, growth, and nature
- **Educational**: Welcoming to beginners, informative for experts
- **Community-Driven**: Emphasizes collaboration and open knowledge
- **Accessible**: Easy to navigate, WCAG 2.1 AA compliant

### Visual Mood
- Earthy, natural color palette
- Photography-driven (beautiful plant images)
- Generous whitespace
- **Rounded corners throughout** (16px standard)
- Soft shadows and subtle gradients
- Lightweight, airy feel

---

## 2. LAYOUT STRUCTURE

### Desktop Layout (1440px reference)
```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAVBAR                       │
│  [Logo] Syntropedia    [Busca]    [Catálogo] [Login]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                    HERO SECTION                          │
│           Welcome Message + Hero Search                  │
│              Background: Nature Photo                    │
│                     [CTA Button]                         │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│               FEATURED SPECIES GRID                      │
│        [Card] [Card] [Card] [Card] [Card] [Card]        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                  STATISTICS CARDS                        │
│      [Espécies]    [Fotos]    [Contribuidores]          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              ABOUT / CALL TO ACTION                      │
│   Left: Description  |  Right: How to Contribute        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                     FOOTER                               │
│        Links | Community | License | Credits            │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout (375px reference)
```
┌──────────────────┐
│  Header (Sticky) │
│  [☰] Logo [🔍]  │
├──────────────────┤
│                  │
│   Hero Section   │
│   (Condensed)    │
│                  │
├──────────────────┤
│   Search Bar     │
├──────────────────┤
│  Featured Cards  │
│   (Single Col)   │
│     [Card]       │
│     [Card]       │
│     [Card]       │
├──────────────────┤
│   Statistics     │
│   (Stacked)      │
├──────────────────┤
│   About/CTA      │
│   (Stacked)      │
├──────────────────┤
│     Footer       │
└──────────────────┘
```

---

## 3. SECTION BREAKDOWN

### 3.1 HEADER / NAVIGATION

**Desktop:**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│ [🌱 Logo] Syntropedia          Catálogo  Sobre  Login   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Design:**
- Clean, minimal header
- No search bar (search is in hero section)
- Lightweight feel with ample padding
- Subtle bottom border (1px gray-100)

**Elements:**
- **Logo + Name**: Left aligned
  - Icon: Sprout icon (lucide-react)
  - Text: "Syntropedia" in green-600
  - Font: Semibold, 20px
  - Gap: 8px between icon and text

- **Navigation Links**: Right aligned
  - "Catálogo"
  - "Sobre"
  - "Fórum" (external link with arrow icon)
  - "Login" button (rounded-full, outlined green)

**Styling:**
- Height: 72px
- Background: white with blur backdrop
- Padding: 0 24px (mobile), 0 48px (desktop)
- Links: gray-700, hover:green-600
- Transitions: smooth 200ms

**Mobile:**
- Hamburger menu (left)
- Logo (center)
- Login button icon (right)
- Sticky on scroll with shadow

---

### 3.2 HERO SECTION

**Visual:**
- **Background**: Full-width nature photograph
  - Suggestion: Lush agroforestry system, soft focus
  - Overlay: Dark gradient (bottom to top, opacity 60%)
  - Height: 600px (desktop), 400px (mobile)

**Content (Centered, White Text):**

```
┌───────────────────────────────────────────────┐
│                                               │
│        🌱                                     │
│                                               │
│     SYNTROPEDIA                               │
│                                               │
│   Conhecimento Colaborativo sobre             │
│   Espécies para Agrofloresta                  │
│                                               │
│   ┌──────────────────────────────────┐       │
│   │  🔍  Buscar espécies...          │       │
│   └──────────────────────────────────┘       │
│                                               │
│   [Explorar Catálogo →]  [Contribuir]        │
│                                               │
└───────────────────────────────────────────────┘
```

**Typography:**
- Main Title: 48px (desktop), 32px (mobile), bold
- Subtitle: 20px (desktop), 16px (mobile), regular
- Search: 18px input

**CTA Buttons:**
- Primary: "Explorar Catálogo" (solid green)
- Secondary: "Contribuir" (outlined white)

---

### 3.3 FEATURED SPECIES SECTION

**Title:**
```
     Espécies em Destaque
     ─────────────────────
```

**Grid Layout:**
- Desktop: 3 columns x 2 rows = 6 cards
- Tablet: 2 columns x 3 rows = 6 cards
- Mobile: 1 column x 6 rows = 6 cards

**Species Card Design:**
```
┌─────────────────────────┐
│                         │
│    [Species Photo]      │
│     (4:3 ratio)         │
│                         │
├─────────────────────────┤
│                         │
│ Nome Científico         │
│ (italic, 18px)          │
│                         │
│ Nomes Populares         │
│ (gray, 14px)            │
│                         │
│ [ALTO] [CLIMAX]         │
│ (badges)                │
│                         │
└─────────────────────────┘
```

**Card Specifications:**
- Width: 360px (desktop), 100% (mobile)
- Height: 420px
- Border radius: 12px
- Shadow: Soft, lifted on hover
- Transition: smooth 200ms

**Image:**
- Aspect ratio: 4:3
- Object-fit: cover
- Loading: lazy
- Alt text: required

**Badges:**
- Estrato: Green gradient
- Estágio: Blue/purple gradient
- Size: Small, rounded-full
- Font: 12px, semibold

**Hover Effect:**
- Lift (translateY -4px)
- Shadow intensifies
- Slight scale (1.02)

---

### 3.4 STATISTICS SECTION

**Layout (3 Cards):**
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │
│   [Icon]    │  │   [Icon]    │  │   [Icon]    │
│             │  │             │  │             │
│     250     │  │    1.2K     │  │     89      │
│  Espécies   │  │   Fotos     │  │ Colaborad.  │
│             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

**Card Design:**
- Background: White
- Border: 1px solid gray-200
- Border radius: 16px
- Padding: 32px
- Center aligned

**Content:**
- Icon: 48px (lucide-react)
  - Espécies: Sprout
  - Fotos: Camera
  - Contribuidores: Users
- Number: 48px, bold, green
- Label: 14px, gray-600

**Spacing:**
- Gap between cards: 24px
- Section padding: 80px top/bottom

---

### 3.5 ABOUT / CALL TO ACTION

**Two Column Layout:**
```
┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│  O que é Syntropedia?    │   Como Contribuir?       │
│                          │                          │
│  [Description text]      │   1. Faça login          │
│  [Read more link]        │   2. Adicione fotos      │
│                          │   3. Participe do fórum  │
│                          │                          │
│                          │   [Começar →]            │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

**Left Column (About):**
- Title: 32px, bold
- Text: 16px, line-height 1.6
- Max width: 600px
- Link: "Saiba mais sobre o projeto →"

**Right Column (CTA):**
- Background: Light green gradient
- Border radius: 16px
- Padding: 40px
- Numbered steps with icons
- CTA button: "Começar a Contribuir"

---

### 3.6 FOOTER

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [Logo] Syntropedia                                 │
│                                                     │
│  Sistema open-source para agricultura sintrópica   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Projeto        Comunidade      Legal               │
│  ─────          ──────────      ─────               │
│  Sobre          Fórum           Licença MIT         │
│  Catálogo       GitHub          CC BY-SA 4.0        │
│  Contribuir     Discussões      Privacidade         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  © 2025 OpenSyntropy • Feito com ❤️ pela comunidade│
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Design:**
- Background: Dark gray (gray-900)
- Text: Light gray (gray-300)
- Links: White, underline on hover
- Padding: 60px vertical

---

## 4. COLOR PALETTE

### Primary Colors
```
Green Primary:     #16A34A  (green-600)
Green Dark:        #15803D  (green-700)
Green Light:       #22C55E  (green-500)
Green Lightest:    #DCFCE7  (green-100)
```

### Neutral Colors
```
Background:        #FFFFFF  (white)
Surface:           #F9FAFB  (gray-50)
Border:            #E5E7EB  (gray-200)
Text Primary:      #111827  (gray-900)
Text Secondary:    #6B7280  (gray-500)
```

### Semantic Colors
```
Success:           #10B981  (emerald-500)
Warning:           #F59E0B  (amber-500)
Error:             #EF4444  (red-500)
Info:              #3B82F6  (blue-500)
```

### Badge Colors (Gradients)
```
Estrato (Green):   from-green-500 to-emerald-600
Estágio (Blue):    from-blue-500 to-indigo-600
```

---

## 5. TYPOGRAPHY

### Font Families
```css
Headings:  'Inter', sans-serif (or system-ui)
Body:      'Inter', sans-serif
Mono:      'JetBrains Mono', monospace (for code)
Scientific: italic (for species names)
```

### Type Scale
```
H1: 48px / 3rem    (Hero title)
H2: 32px / 2rem    (Section titles)
H3: 24px / 1.5rem  (Card titles)
H4: 18px / 1.125rem

Body Large:  18px / 1.125rem
Body:        16px / 1rem
Body Small:  14px / 0.875rem
Caption:     12px / 0.75rem
```

### Font Weights
```
Bold:      700
Semibold:  600
Medium:    500
Regular:   400
```

---

## 6. SPACING SYSTEM

### Consistent Scale (Tailwind)
```
xs:   4px  (1)
sm:   8px  (2)
md:   16px (4)
lg:   24px (6)
xl:   32px (8)
2xl:  48px (12)
3xl:  64px (16)
4xl:  80px (20)
```

### Section Spacing
```
Between sections: 80px (4xl)
Inside sections:  48px (2xl)
Card padding:     24px (lg)
```

---

## 7. INTERACTIVE ELEMENTS

### Buttons

**Primary Button:**
```
Background: green-600
Hover: green-700
Text: white
Padding: 12px 24px
Border radius: 8px
Shadow: md
Transition: all 200ms
```

**Secondary Button:**
```
Background: transparent
Border: 2px solid current
Hover: background green-50
Padding: 10px 22px (account for border)
```

**Icon Buttons:**
```
Size: 40px x 40px
Rounded: full
Background: hover gray-100
```

### Links
```
Color: green-600
Hover: green-700 + underline
Transition: 150ms
```

### Search Input
```
Border: 2px solid gray-200
Focus: border-green-500 + ring-2 ring-green-100
Border radius: 8px
Padding: 12px 16px
Icon: left aligned, gray-400
```

---

## 8. IMAGES & MEDIA

### Species Photos
- Aspect ratio: 4:3
- Quality: WebP format, fallback to JPEG
- Sizes:
  - Thumbnail: 360x270
  - Card: 720x540
  - Full: 1440x1080
- Loading: Lazy with placeholder

### Hero Background
- Resolution: 1920x1080
- Format: WebP
- Fallback: JPG
- Optimization: Compressed, < 200KB
- Overlay: gradient-to-t from-black/60 to-transparent

### Icons
- Library: lucide-react
- Size: 24px (default), 48px (stats)
- Stroke width: 2
- Color: Contextual

---

## 9. ACCESSIBILITY

### Contrast Ratios
- Text on white: 4.5:1 minimum
- Large text: 3:1 minimum
- Buttons: 3:1 minimum

### Focus States
- Visible focus ring (2px)
- Color: green-500
- Offset: 2px

### Keyboard Navigation
- Tab order: logical
- Skip to main content link
- Escape to close modals

### Screen Reader
- Semantic HTML (header, nav, main, footer)
- Alt text on all images
- ARIA labels where needed
- Skip links

---

## 10. RESPONSIVE BREAKPOINTS

```
Mobile:     < 640px   (sm)
Tablet:     640-1024px (md-lg)
Desktop:    1024-1536px (lg-xl)
Wide:       > 1536px  (2xl)
```

### Key Adaptations

**Hero:**
- Mobile: 400px height, 32px title
- Desktop: 600px height, 48px title

**Grid:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Navigation:**
- Mobile: Hamburger menu
- Desktop: Full nav bar

---

## 11. ANIMATIONS & TRANSITIONS

### Page Load
```
Hero: Fade in (400ms)
Cards: Stagger fade in (600ms, 100ms delay each)
Stats: Count up animation
```

### Hover Effects
```
Cards: Lift + shadow (200ms ease-out)
Buttons: Background change (150ms)
Links: Underline slide (200ms)
```

### Scroll Effects
```
Header: Sticky with shadow on scroll
Parallax: Subtle on hero (optional)
Fade in: Sections as they enter viewport
```

---

## 12. IMPLEMENTATION NOTES

### Component Structure
```
HomePage
├── Header
├── HeroSection
├── FeaturedSpecies
│   └── SpeciesCard (x6)
├── Statistics
│   └── StatCard (x3)
├── AboutCTA
└── Footer
```

### Data Requirements
- Featured species: 6 most recent or curated
- Statistics: Real-time counts from DB
- Hero image: Static asset or CMS

### Performance
- Image optimization: next/image
- Lazy loading: Below fold content
- Code splitting: Dynamic imports
- Caching: ISR for homepage (revalidate: 3600)

---

## 13. CONTENT SUGGESTIONS

### Hero
**Title:** "Syntropedia"
**Subtitle:** "Conhecimento colaborativo sobre espécies para agricultura sintrópica e agrofloresta"

### About Section
"A Syntropedia é uma plataforma open-source que reúne conhecimento sobre espécies vegetais para sistemas agroflorestais. Nossa comunidade documenta, compartilha e aprende sobre plantas que transformam a agricultura."

### CTA Steps
1. **Faça login** - Conecte-se via fórum Discourse
2. **Adicione fotos** - Contribua com imagens das espécies
3. **Participe** - Discuta e aprenda com a comunidade

---

## NEXT STEPS

After design approval:
1. Set up design tokens in Tailwind config
2. Create reusable components (Button, Card, etc.)
3. Build static homepage with mock data
4. Integrate with real database
5. Add animations and polish
6. Test accessibility
7. Optimize performance

---

**Version:** 1.0
**Last Updated:** December 2025
**Status:** Draft - Awaiting Review
