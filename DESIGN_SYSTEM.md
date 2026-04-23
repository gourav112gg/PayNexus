# PayNexus Design System

## Premium Minimalist Design Guidelines

### Overview
PayNexus is a premium payment-splitting application with a minimalist aesthetic. The design emphasizes clarity, elegance, and smooth interactions through carefully chosen colors, typography, and animations.

---

## Color Palette

### Primary Colors

#### Teal Primary
```
Light Mode: oklch(0.52 0.12 230)
Dark Mode:  oklch(0.65 0.12 230)
Usage: Primary buttons, active states, key actions
Trust & Professionalism
```

#### Coral Accent  
```
Light Mode: oklch(0.63 0.15 20)
Dark Mode:  oklch(0.72 0.15 20)
Usage: Highlights, success states, important accents
Warmth & Approachability
```

### Neutral Colors

#### Background
```
Light: oklch(0.99 0 0)      - Pure white
Dark:  oklch(0.13 0 0)      - Deep black
Clean, minimal foundation
```

#### Foreground
```
Light: oklch(0.2 0.01 240)  - Deep navy
Dark:  oklch(0.93 0 0)      - Off-white
Excellent contrast for readability
```

#### Borders
```
Light: oklch(0.96 0 0)      - Near-white with opacity
Dark:  oklch(0.26 0 0)      - Light gray
Use with 40% opacity for subtlety
```

#### Muted
```
Light: oklch(0.95 0 0)      - Very light gray
Dark:  oklch(0.35 0 0)      - Medium gray
For inactive, secondary elements
```

### Contextual Colors
- **Success**: Green (oklch 0.72 0.15 140) - For approvals
- **Warning**: Amber (oklch 0.68 0.15 70) - For pending
- **Error**: Red (oklch 0.58 0.2 25) - For destructive actions

---

## Typography

### Font Family
- **Primary**: Geist (sans-serif)
- **Monospace**: Geist Mono (for codes, IDs)

### Font Sizes
- **h1**: 2xl (24px) - Page headers
- **h2**: lg (18px) - Section headers  
- **h3**: base (16px) - Card titles
- **body**: sm (14px) - Body text
- **label**: xs (12px) - Form labels
- **caption**: xs (12px) - Secondary text

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Labels, captions
- **Semibold**: 600 - Card titles, highlights
- **Bold**: 700 - Page headers

### Line Heights
- **Headings**: 1.2
- **Body**: 1.6 (leading-relaxed)
- **Compact**: 1.4

---

## Spacing System

### Base Unit: 0.25rem (4px)

#### Spacing Scale
- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `3` = 0.75rem (12px)
- `4` = 1rem (16px)
- `6` = 1.5rem (24px)
- `8` = 2rem (32px)
- `12` = 3rem (48px)

### Common Patterns
- **Padding Cards**: p-6 (24px)
- **Button Height**: h-10 (40px)
- **Section Gap**: gap-8 (32px)
- **Component Gap**: gap-4 (16px)

---

## Border Radius

### Standard: 0.5rem (8px)

Used consistently across:
- Buttons
- Inputs
- Cards
- Modals

Creates a modern, friendly appearance without being overly rounded.

---

## Shadows & Depth

### Minimal Approach

Only use shadows where necessary:
- **Cards**: None (minimal design)
- **Inputs**: None
- **Buttons**: None
- **Hover states**: Subtle border color change

Principle: Let typography and spacing create hierarchy, not shadows.

---

## Animation System

### Timing & Easing

#### Standard Smooth Transition
```css
.smooth-transition {
  transition: all 0.2s ease-out;
}
```
- **Duration**: 200ms
- **Easing**: ease-out (natural deceleration)
- **Properties**: all (color, transform, opacity, etc.)

#### Button Interaction
```css
.btn-smooth {
  transition: all 0.2s ease-out;
}
.btn-smooth:active {
  transform: scale(0.95);
}
```
- **Active State**: Scale to 95%
- **Hover State**: Color transition
- **Feels**: Responsive, tactile

#### Input Focus
```css
.input-minimal:focus {
  ring: 1px solid primary/50;
}
```
- **Duration**: 200ms transition
- **Visual Feedback**: Subtle ring
- **Feels**: Clear without jarring

### Animation Guidelines
1. Keep all animations between 200-300ms
2. Use ease-out for user-initiated actions
3. Add scale effect for active button states
4. Use opacity changes for hover states
5. Never use more than 2 simultaneous animations

---

## Component Patterns

### Buttons

#### Primary Button
```
Background: Primary teal
Text: White
Padding: px-4 py-2 (h-10 for tall)
Border: None
Radius: 0.5rem
Hover: bg-primary/90
Active: scale(0.95)
```

#### Secondary Button
```
Background: Muted
Text: Foreground
Padding: px-4 py-2 (h-10 for tall)
Border: None
Radius: 0.5rem
Hover: bg-muted/80
```

### Cards

#### Standard Card
```
Background: White (#fafafa)
Border: 1px border-border/40
Padding: p-6
Radius: 0.5rem
Shadow: None
Hover: border-border/60
```

### Inputs

#### Text Input
```
Background: oklch(0.97 0 0)
Border: None
Padding: px-4 py-2.5
Radius: 0.5rem
Focus: ring-1 ring-primary/50
Transition: 0.2s smooth
```

### Progress Bar

#### Approval Progress
```
Background: border/40
Fill: primary (solid, no gradient)
Height: h-1.5
Radius: full
Animation: width 0.3s ease-out
```

---

## Layout Principles

### Grid & Spacing
- Use flexbox for 1D layouts
- Use grid for 2D layouts
- Maintain consistent gaps
- Responsive: Mobile → Tablet → Desktop

### Max Width
- Content container: max-w-5xl
- Full page: max-w-6xl (legacy)
- Sidebar: max-w-sm

### Responsive Breakpoints
- Mobile: < 640px (no breakpoint)
- Tablet: md (768px)
- Desktop: lg (1024px)
- Wide: xl (1280px)

---

## Accessibility Standards

### Color Contrast
- **WCAG AA**: 4.5:1 minimum for text
- **WCAG AAA**: 7:1 preferred
- Teal on white: ✓ Passes WCAG AAA
- Coral on white: ✓ Passes WCAG AA

### Typography
- Minimum font size: 14px (body)
- Line height: 1.6 for body text
- Focus indicators: Visible ring with 1px width

### Interactive Elements
- Minimum touch target: 44x44px
- Button height: 40px (h-10)
- Link underlines: Always visible on hover

---

## Dark Mode

### Implementation
CSS custom properties automatically swap between light/dark:

```css
:root {
  --primary: oklch(0.52 0.12 230);  /* Light mode */
}

.dark {
  --primary: oklch(0.65 0.12 230);  /* Dark mode */
}
```

### Adjustments
- All colors automatically switch
- No additional CSS needed
- Smooth transition on theme change
- Maintains readability in both modes

---

## Real-World Examples

### Success State
```
Icon: ✓ Check
Color: Green
Animation: Smooth scale-up
Duration: 200ms
Message: "Approved" or "Complete"
```

### Pending State
```
Icon: Clock
Color: Amber
Animation: Subtle pulse (optional)
Duration: 1s
Message: "Pending Approval"
```

### Error State  
```
Icon: ! Alert
Color: Red
Animation: Shake (optional)
Duration: 300ms
Message: "Failed - Try Again"
```

---

## Implementation Checklist

- [x] Use teal primary for actions
- [x] Use coral for important highlights
- [x] Keep all animations 200-300ms
- [x] Use ease-out timing function
- [x] Minimal shadows (only borders)
- [x] Consistent 0.5rem radius
- [x] Proper color contrast
- [x] Dark mode support
- [x] Responsive design
- [x] Smooth hover states

---

## Common Mistakes to Avoid

❌ **Don't**:
- Add multiple animation effects simultaneously
- Use gradients (except in rare cases)
- Add thick borders to everything
- Use drop shadows for depth
- Animate for more than 300ms
- Use decorative fonts

✓ **Do**:
- Keep animations smooth and natural
- Use solid, sophisticated colors
- Use subtle, 40% opacity borders
- Create depth with spacing and typography
- Keep everything responsive
- Use Geist font family

---

## File Organization

```
app/
  globals.css          ← Color tokens & animation utilities
  layout.tsx           ← Metadata & base styling
  page.tsx             ← Login with minimalist design
  dashboard/
    page.tsx           ← Wallet with smooth interactions
    groups/page.tsx    ← Groups with clean cards
    payments/page.tsx  ← Payments with smooth progress
    qr/page.tsx        ← QR with minimal layout

components/
  Navigation.tsx       ← Minimal header
  (other components)   ← Follow design system

lib/
  types.ts             ← Type definitions
  store.ts             ← State management
  utils.ts             ← Utility functions
```

---

## Future Enhancements

1. **Micro-interactions**: Add success animations
2. **Loading States**: Skeleton screens with smooth transitions
3. **Page Transitions**: Smooth fade/slide between pages
4. **Toast Notifications**: Subtle entrance/exit animations
5. **Confetti**: For major success events (optional)

---

*This design system prioritizes clarity, elegance, and user delight through thoughtful minimalism and smooth interactions.*
