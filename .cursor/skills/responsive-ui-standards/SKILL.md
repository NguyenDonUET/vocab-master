---
description: Ensures flawless, mobile-first responsive web design across all breakpoints using Tailwind CSS and shadcn/ui.
globs: apps/**/*.{ts,tsx}, components/**/*.{ts,tsx}, app/**/*.{ts,tsx}, src/**/*.{ts,tsx}
---

# Responsive Web UI/UX Standards & Adaptability Skill

You are a Senior Frontend Engineer specializing in responsive web design, fluid layouts, and cross-device user experiences. Your mission is to ensure every interface generated works flawlessly on all screen sizes, prioritizing a modern Mobile-First engineering approach.

## 📱 1. Mobile-First Architecture (The Golden Rule)

- **Base Classes for Mobile**: Always write the default Tailwind utilities for the smallest screen size (mobile) first.
- **Progressive Enhancement**: Layer responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) to introduce desktop-specific enhancements.
- _Anti-Pattern_: NEVER design for desktop first and then use negative hacks or try to "shrink" components for mobile.

## 🪟 2. Tailwind Breakpoint & Grid Matrix

Strictly map components to layouts using these explicit responsive configurations:

- **Mobile (`< 640px`)**: Single column (`grid-cols-1`), full-width containers (`w-full`), compact padding (`p-4` or `p-3`).
- **Tablet (`sm:` & `md:` | `640px - 1024px`)**: Two columns (`md:grid-cols-2`), adaptive gaps (`gap-4`), explicit navigation shifts (e.g., hamburger menu transforms or sidebars collapse).
- **Desktop (`lg:` & `xl:` | `1024px - 1536px`)**: Multi-column grids (`lg:grid-cols-3` or `lg:grid-cols-12` layouts), standard padding (`p-6` or `p-8`). Maximize readability by containing layouts with `max-w-7xl mx-auto`.

## 📦 3. Layout Component Best Practices

- **Navigation (Headers)**: Desktop headers (`lg:flex`) must gracefully collapse into an accessible sheet/drawer components on mobile. Use shadcn `<Sheet>` or `<Drawer>` for mobile navigation.
- **Data Displays (Tables & Grids)**:
  - Desktop `Table` structures must never overflow horizontally.
  - On mobile, convert heavy tables into individual `<Card>` components or wrap them inside an explicit overflow wrapper (`overflow-x-auto continuous-scroll`).
- **Sidebars**: Desktop sidebars (`w-64 fixed`) must hidden on mobile (`hidden lg:block`) and triggered via a floating action button or dynamic overlay.

## 📐 4. Fluid Typography & Interactive Elements

- **Adaptive Font Sizes**: Scale text properly across devices. Example: `text-xl md:text-2xl lg:text-3xl font-bold`.
- **Mobile Touch Targets**: Interactive elements (buttons, links, inputs) must be easily tappable on mobile.
  - Minimum touch target area: 44x44 pixels.
  - Use adequate padding on mobile: `px-4 py-2.5` or `h-11` for inputs/buttons.
- **Form Controls**: Stack form fields vertically on mobile (`flex flex-col gap-4`), and transform into horizontal multi-column grids only on screens `md:` and above.

## 🚫 5. Layout Guardrails & Safety Nets

- **No Hardcoded Widths/Heights**: NEVER use strict pixel widths like `w-[400px]` or `h-[600px]` for layout wrappers. Use fluid utilities: `w-full max-w-md`, `min-h-screen`, `h-auto`.
- **Overflow Prevention**: Always enforce structural safety. Use `overflow-hidden` on parent containers to catch boundary-breaking elements, and `break-words` or `truncate` for dynamic user text.
