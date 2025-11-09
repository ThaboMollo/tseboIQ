# tseboIQ Official Brand Application Guide

## 🎨 Brand Identity Overview

This document outlines how the official tseboIQ brand has been applied across the entire platform based on `tseboIQ_brand.json`.

---

## Color System

### Primary Colors
- **Navy (`#0A1630`)**: Trust, intelligence, professionalism
  - Used for: Headers, footers, primary backgrounds, text on light backgrounds
  - Tailwind: `bg-primary`, `text-primary`

- **Navy Light (`#12264F`)**: Secondary navy shade
  - Used for: Dark mode backgrounds, hover states
  - Tailwind: `bg-primary-light`

### Accent Colors
- **Teal (`#22B4AE`)**: AI, innovation, interactivity
  - Used for: CTAs, links, icons, focus states, progress indicators
  - Tailwind: `bg-accent`, `text-accent`, `border-accent`

- **Teal Light (`#4BD0CA`)**: Lighter teal for gradients
  - Used for: Hover states, gradient endpoints
  - Tailwind: `bg-accent-light`, `text-accent-light`

### Neutral Colors
- **Light (`#F8FAFC`)**: Clean backgrounds
- **Medium (`#E2E8F0`)**: Borders, dividers
- **Dark (`#94A3B8`)**: Muted text, placeholders

### Feedback Colors
- **Success (`#10B981`)**: Confirmations, success messages
- **Error (`#EF4444`)**: Errors, warnings

---

## Typography

### Fonts
- **Headings**: Poppins (Semi-bold 600, Bold 700)
  - Tailwind: `font-heading`
  - Line height: 1.3

- **Body**: Inter (Regular 400, Medium 500)
  - Tailwind: `font-sans`
  - Line height: 1.6

### Font Scale
```
sm:   0.875rem
base: 1rem
lg:   1.125rem
xl:   1.25rem
2xl:  1.5rem
3xl:  1.875rem
```

---

## Gradients

### Hero Gradient
```css
background: linear-gradient(135deg, #0A1630 0%, #12264F 40%, #22B4AE 100%);
```
- Tailwind: `bg-gradient-hero`
- Used for: Hero sections, banners, feature backgrounds

### Button Gradient
```css
background: linear-gradient(90deg, #22B4AE 0%, #4BD0CA 100%);
```
- Tailwind: `bg-gradient-button`
- Used for: Primary CTAs, interactive buttons

---

## Components

### Buttons
```jsx
<button className="bg-gradient-button text-white font-semibold px-6 py-3 rounded-xl transition-brand hover:shadow-hover">
  Click Me
</button>
```

**Specifications**:
- Border radius: 1rem (`rounded-xl`)
- Padding: 0.75rem 1.5rem
- Font weight: 600 (semi-bold)
- Transition: 0.25s ease-in-out
- Hover: Teal glow shadow

### Cards
```jsx
<div className="bg-white rounded-xl shadow-card p-6">
  Card content
</div>
```

**Specifications**:
- Background: White (`#FFFFFF`)
- Border radius: 1rem
- Shadow: `0px 4px 10px rgba(10, 22, 48, 0.15)`
- Padding: 1.5rem

### Inputs
```jsx
<input className="border-2 border-neutral-medium focus:border-accent focus:ring-4 focus:ring-accent/10 rounded-lg px-4 py-2 transition-brand" />
```

**Specifications**:
- Border: 2px neutral medium
- Focus: Teal border + subtle glow
- Border radius: 0.75rem
- Transition: 0.25s ease-in-out

---

## Shadows

### Card Shadow
```css
box-shadow: 0px 4px 10px rgba(10, 22, 48, 0.15);
```
- Tailwind: `shadow-card`

### Hover Shadow
```css
box-shadow: 0px 6px 16px rgba(34, 180, 174, 0.25);
```
- Tailwind: `shadow-hover`

### Glow Shadow
```css
box-shadow: 0 0 20px rgba(34, 180, 174, 0.3);
```
- Tailwind: `shadow-glow`

---

## Brand Applications

### Headers & Navigation
- Background: Navy (`bg-primary`)
- Text: White
- Logo: Teal gradient
- Links: White with teal hover

### Footers
- Background: Navy (`bg-primary`)
- Text: Light gray
- Headings: Teal (`text-accent`)
- Links: Teal hover

### Hero Sections
- Background: Hero gradient (`bg-gradient-hero`)
- Text: White
- CTAs: Button gradient

### Forms
- Labels: Navy text
- Inputs: Neutral borders, teal focus
- Buttons: Gradient button
- Success: Green feedback
- Error: Red feedback

### Dashboards
- Background: Light neutral
- Cards: White with card shadow
- Headers: Navy
- Accents: Teal
- Data viz: Teal primary, navy secondary

### Modals
- Overlay: Navy with 80% opacity
- Content: White card
- Border: Teal accent (optional)
- Close button: Teal

---

## Dark Mode

### Color Inversions
- Primary background → Primary light
- Text dark → White
- Text light → Navy
- Accent colors remain consistent

### Implementation
```jsx
<div className="bg-neutral-light dark:bg-primary text-text-dark dark:text-white">
  Content
</div>
```

---

## Accessibility

### Contrast Ratios
- Navy on white: 14.5:1 ✓
- Teal on white: 3.2:1 (use for accents only)
- Teal on navy: 4.8:1 ✓
- White on navy: 14.5:1 ✓

### Focus States
- All interactive elements have visible teal focus ring
- Focus ring: 2px solid teal + 4px glow

---

## CSS Variables

```css
:root {
  --color-primary: #0A1630;
  --color-primary-light: #12264F;
  --color-accent: #22B4AE;
  --color-accent-light: #4BD0CA;
  --gradient-hero: linear-gradient(135deg, #0A1630 0%, #12264F 40%, #22B4AE 100%);
  --gradient-button: linear-gradient(90deg, #22B4AE 0%, #4BD0CA 100%);
  --shadow-card: 0px 4px 10px rgba(10, 22, 48, 0.15);
  --shadow-hover: 0px 6px 16px rgba(34, 180, 174, 0.25);
  --transition-brand: all 0.25s ease-in-out;
}
```

---

## Brand Checklist

### ✅ Completed
- [x] Tailwind config updated with brand colors
- [x] CSS variables defined
- [x] Footer component branded
- [x] Global typography applied
- [x] Scrollbar styled with teal
- [x] Focus states using teal

### 🔄 In Progress
- [ ] Home page fully branded
- [ ] All pages using hero gradient
- [ ] All buttons using gradient-button
- [ ] All cards using shadow-card
- [ ] Forms with teal focus states
- [ ] Dashboards with brand colors

---

## Quick Reference

### Common Patterns

**Primary CTA**:
```jsx
<button className="bg-gradient-button text-white font-semibold px-8 py-4 rounded-xl hover:shadow-hover transition-brand">
  Get Started
</button>
```

**Section Header**:
```jsx
<h2 className="font-heading text-4xl font-bold text-primary dark:text-white mb-6">
  Section Title
</h2>
```

**Feature Card**:
```jsx
<div className="bg-white dark:bg-primary-light rounded-xl shadow-card p-6 hover:shadow-hover transition-brand">
  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-accent" />
  </div>
  <h3 className="font-heading text-xl font-semibold mb-2">Title</h3>
  <p className="text-gray-600 dark:text-gray-300">Description</p>
</div>
```

**Link**:
```jsx
<Link className="text-accent hover:text-accent-light transition-brand underline">
  Learn More
</Link>
```

---

## Brand Ethos

**Colors**: Navy for trust, Teal for intelligence, White for clarity

**Feel**: Minimal, Futuristic, Confident

**Voice**: Professional yet approachable, AI-driven but human-focused

---

**Last Updated**: January 2025  
**Source**: `tseboIQ_brand.json`  
**Maintained By**: tseboIQ Development Team
