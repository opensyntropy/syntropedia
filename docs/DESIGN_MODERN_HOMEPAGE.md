# Design: Modern & Lightweight Home Page - Syntropedia

**Version:** 2.0 (Modern Update)
**Updated:** December 2025

---

## 🎨 DESIGN PRINCIPLES

### Core Philosophy
- ✨ **Modern & Lightweight**: Clean, minimal, fast
- 🌿 **Natural & Organic**: Earthy, nature-inspired
- 🎯 **Focus-Driven**: Clear hierarchy, no clutter
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 📱 **Mobile-First**: Responsive, touch-friendly

### Visual Language
- **Rounded Corners**: 16px standard (modern, friendly)
- **Generous Whitespace**: Breathing room, clarity
- **Subtle Shadows**: Depth without heaviness
- **Photography-Driven**: Beautiful plant images
- **Green Accent**: Natural, growth-focused

---

## 📐 LAYOUT STRUCTURE

```
┌─────────────────────────────────────┐
│          HEADER (Minimal)           │
│  Logo          Nav Links    Login   │
├─────────────────────────────────────┤
│                                     │
│         HERO SECTION                │
│   Title + Subtitle + Search         │
│   (Clean, centered, spacious)       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    FEATURED SPECIES (Grid)          │
│   [Card] [Card] [Card]              │
│   [Card] [Card] [Card]              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    STATISTICS (3 Cards)             │
│   Espécies  Fotos  Contribuidores   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    ABOUT + CTA (2 Columns)          │
│   Description  |  How to Start      │
│                                     │
├─────────────────────────────────────┤
│          FOOTER (Minimal)           │
│      Links  Community  Legal        │
└─────────────────────────────────────┘
```

---

## 🧩 COMPONENTS

### 1. HEADER

**Design:**
```
┌──────────────────────────────────────────────┐
│   🌱 Syntropedia      Catálogo  Sobre  Login │
└──────────────────────────────────────────────┘
```

**Specifications:**
- Height: `72px`
- Background: `white` with `backdrop-blur-md` (glassmorphism)
- Border bottom: `1px solid gray-100`
- Padding: `0 48px` (desktop), `0 24px` (mobile)
- Sticky: Yes, with shadow on scroll

**Logo:**
- Icon: `Sprout` (lucide-react), 24px
- Text: "Syntropedia", semibold, 20px, green-600
- Clickable, links to home

**Navigation:**
- Links: gray-700, hover:green-600
- Font: 15px, medium
- Gap: 32px between links
- Transition: 200ms

**Login Button:**
- Style: Outlined
- Border: `2px solid green-600`
- Border radius: `rounded-full`
- Padding: `8px 20px`
- Hover: bg-green-50

**Mobile:**
- Hamburger: left
- Logo: center
- Login icon: right

---

### 2. HERO SECTION

**Layout:**
```
┌────────────────────────────────────┐
│                                    │
│          Syntropedia               │
│                                    │
│   Conhecimento Colaborativo sobre  │
│   Espécies para Agrofloresta       │
│                                    │
│   ┌──────────────────────────┐    │
│   │ 🔍 Buscar espécies...     │    │
│   └──────────────────────────┘    │
│                                    │
│   [Explorar →]  [Contribuir]      │
│                                    │
└────────────────────────────────────┘
```

**Design:**
- Background: Subtle gradient (`from-green-50/30 to-white`)
- OR: Light texture/pattern
- Padding: `120px` top/bottom (desktop), `80px` (mobile)
- Text: Center aligned

**Title:**
- Text: "Syntropedia"
- Font: Bold, 56px (desktop), 36px (mobile)
- Color: gray-900
- Letter spacing: tight

**Subtitle:**
- Font: Regular, 20px (desktop), 16px (mobile)
- Color: gray-600
- Max width: 600px
- Line height: 1.6

**Search Bar:**
- Width: `600px` max (desktop), 100% (mobile)
- Height: `56px`
- Border radius: `16px` (rounded!)
- Border: `2px solid gray-200`
- Focus: `border-green-500` + `ring-4 ring-green-100`
- Shadow: `shadow-sm`, focus: `shadow-md`
- Icon: Search (left, gray-400)
- Placeholder: "Buscar espécies por nome..."
- Font: 16px

**CTA Buttons:**
- Gap: 16px between
- Primary: "Explorar Catálogo →"
  - Background: green-600
  - Text: white
  - Padding: 14px 28px
  - Border radius: 12px
  - Shadow: shadow-md, hover:shadow-lg
- Secondary: "Contribuir"
  - Outlined, border-green-600
  - Hover: bg-green-50

---

### 3. FEATURED SPECIES

**Section:**
- Padding: `80px` vertical
- Background: white
- Max width: `1280px`, centered

**Title:**
- Text: "Espécies em Destaque"
- Font: Bold, 32px
- Color: gray-900
- Margin bottom: 48px
- Center aligned

**Grid:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column
- Gap: 24px
- 6 cards total

**Species Card:**
```
┌──────────────────────┐
│                      │
│   [Photo 4:3]        │
│                      │
├──────────────────────┤
│ Jatobá               │ ← Scientific name
│ Hymenaea courbaril   │ ← italic, smaller
│                      │
│ Jatobá, jataí        │ ← Common names
│                      │
│ [ALTO] [CLÍMAX]      │ ← Badges
└──────────────────────┘
```

**Card Specifications:**
- **Border radius: 16px** 🎯
- Border: 1px solid gray-100
- Background: white
- Shadow: `shadow-sm`
- Hover: `translateY(-4px)` + `shadow-lg`
- Transition: all 200ms ease-out
- Overflow: hidden (for image)

**Image:**
- Aspect ratio: 4:3
- Object fit: cover
- Loading: lazy
- Border radius: 16px 16px 0 0

**Content Padding:**
- 20px all sides

**Typography:**
- Scientific name: 18px, semibold, italic, gray-900
- Common names: 14px, regular, gray-600
- Margin: 8px between elements

**Badges:**
- Border radius: `rounded-full`
- Padding: 4px 12px
- Font: 12px, medium
- Estrato: bg-green-100, text-green-700
- Estágio: bg-blue-100, text-blue-700
- Gap: 8px between badges

---

### 4. STATISTICS

**Section:**
- Background: gradient from-gray-50 to-white
- Padding: 80px vertical
- Border top: 1px solid gray-100

**Layout:**
```
┌────────────┐  ┌────────────┐  ┌────────────┐
│            │  │            │  │            │
│   [Icon]   │  │   [Icon]   │  │   [Icon]   │
│            │  │            │  │            │
│    250     │  │   1.2K     │  │     89     │
│  Espécies  │  │  Fotos     │  │Contribuid. │
│            │  │            │  │            │
└────────────┘  └────────────┘  └────────────┘
```

**Stat Card:**
- Background: white
- **Border radius: 20px** (extra rounded)
- Border: 1px solid gray-100
- Shadow: shadow-sm
- Padding: 48px 32px
- Center aligned

**Icon:**
- Size: 48px
- Color: green-600
- Margin bottom: 16px
- Icons: Sprout, Camera, Users

**Number:**
- Font: Bold, 48px
- Color: green-600
- Margin bottom: 8px

**Label:**
- Font: Medium, 14px
- Color: gray-600
- Text transform: uppercase
- Letter spacing: wide

**Gap:**
- 24px between cards

---

### 5. ABOUT + CTA

**Section:**
- Padding: 100px vertical
- Background: white
- Max width: 1280px

**Layout (2 Columns):**
```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│ O que é            │  Como Contribuir?   │
│ Syntropedia?       │                     │
│                     │  ① Faça login       │
│ [Description]       │  ② Adicione fotos   │
│                     │  ③ Participe        │
│ [Saiba mais →]     │                     │
│                     │  [Começar →]       │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

**Left Column:**
- Title: 28px, bold
- Text: 16px, gray-600, line-height 1.7
- Max width: 500px
- Link: green-600, with arrow icon

**Right Column:**
- Background: gradient from-green-50 to-emerald-50
- **Border radius: 20px**
- Padding: 40px
- Shadow: shadow-sm

**Steps:**
- Numbered circles (green-600)
- Icon + text layout
- Font: 16px, gray-700
- Gap: 20px between steps

**CTA Button:**
- Full width or centered
- Primary green style
- Text: "Começar a Contribuir →"

---

### 6. FOOTER

**Design:**
- Background: gray-900
- Text: gray-300
- Padding: 60px vertical, 48px horizontal
- Border top: none (clean)

**Layout:**
```
┌────────────────────────────────────────┐
│  🌱 Syntropedia                        │
│  Open-source para agricultura          │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  Projeto    Comunidade    Legal       │
│  ───────    ──────────    ─────       │
│  Sobre      Fórum         MIT         │
│  Catálogo   GitHub        CC BY-SA    │
│                                        │
├────────────────────────────────────────┤
│  © 2025 OpenSyntropy                  │
└────────────────────────────────────────┘
```

**Typography:**
- Logo: 18px, semibold, white
- Description: 14px, gray-400
- Headers: 12px, uppercase, gray-400, tracking-wide
- Links: 14px, gray-300, hover:white
- Copyright: 12px, gray-500

**Links:**
- Underline on hover
- Transition: 150ms

---

## 🎨 DESIGN TOKENS

### Border Radius Scale
```
Small:    8px   (badges, small elements)
Medium:   12px  (buttons)
Large:    16px  (cards, inputs) ← STANDARD
XL:       20px  (stat cards, containers)
Full:     9999px (pills, rounded buttons)
```

### Shadows
```
sm:   0 1px 2px 0 rgb(0 0 0 / 0.05)
md:   0 4px 6px -1px rgb(0 0 0 / 0.1)
lg:   0 10px 15px -3px rgb(0 0 0 / 0.1)
xl:   0 20px 25px -5px rgb(0 0 0 / 0.1)
```

### Spacing Scale
```
xs:   4px
sm:   8px
md:   16px
lg:   24px
xl:   32px
2xl:  48px
3xl:  64px
4xl:  80px
5xl:  100px
```

### Colors
```
Primary Green:   #16A34A  (green-600)
Green Dark:      #15803D  (green-700)
Green Light:     #22C55E  (green-500)
Green Subtle:    #F0FDF4  (green-50)

Background:      #FFFFFF
Surface:         #F9FAFB  (gray-50)
Border:          #E5E7EB  (gray-200)

Text Primary:    #111827  (gray-900)
Text Secondary:  #6B7280  (gray-500)
```

---

## ✨ INTERACTIONS

### Hover States
- **Cards**: Lift 4px + larger shadow
- **Buttons**: Darken background 10%
- **Links**: Color change + underline
- **Icons**: Scale 1.05

### Focus States
- Ring: 4px, green-100
- Border: green-500
- Outline: none (use ring instead)

### Transitions
- Default: 200ms ease-out
- Quick: 150ms ease-out
- Slow: 300ms ease-in-out

---

## 📱 RESPONSIVE

### Breakpoints
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Key Adaptations
- **Hero title**: 56px → 36px
- **Section padding**: 80px → 48px
- **Card grid**: 3 cols → 2 cols → 1 col
- **Stats**: Row → Column
- **About**: 2 cols → 1 col stacked

---

## 🚀 IMPLEMENTATION NOTES

### Component Tree
```
HomePage
├── Header
├── Hero
│   └── SearchBar
├── FeaturedSpecies
│   └── SpeciesCard × 6
├── Statistics
│   └── StatCard × 3
├── AboutCTA
└── Footer
```

### Performance
- Images: next/image with lazy loading
- Above fold: Priority loading
- Below fold: Lazy load
- Fonts: System fonts fallback
- Animations: GPU-accelerated (transform, opacity)

### Accessibility
- Semantic HTML5
- ARIA labels where needed
- Keyboard navigation
- Focus visible
- Skip links
- Alt text on images

---

**Status:** Ready for Implementation ✅

This modern, lightweight design emphasizes:
- **Rounded corners** (16px standard)
- **Clean header** (no search bar clutter)
- **Generous whitespace**
- **Subtle shadows**
- **Natural green accents**
