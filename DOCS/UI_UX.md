# UI/UX Wireframes & Theme

## 1. Design Philosophy
The "SkillSync" interface is built on a **High-Density, Performance-First** philosophy. We use a **Premium Dark Theme** to reduce eye strain for developers and highlight complex data visualizations (radar charts, heatmaps).

### 🎨 Color Palette
- **Primary Background**: `Slate-900` (#0f172a) - Deep, professional void.
- **Accents**: 
  - `Cyan-400` (#22d3ee) - Primary action color, represents technical clarity.
  - `Purple-500` (#a855f7) - Secondary accent, represents creative growth.
  - `Emerald-500` (#10b981) - Success indicator for mastered skills.
- **Text**: `Slate-100` (#f1f5f9) - Maximum legibility against dark backgrounds.

## 2. User Journey (UX Flow)

1.  **Onboarding**: User lands on a clean, centered Login/Register page.
2.  **Snapshot**: Upon login, the User is taken to the **Dashboard** which provides an immediate visual summary (Radar Chart) of their entire skillset.
3.  **Expansion**: User adds a new skill using the slider-based interactive form (enhancing UX by removing manual number input).
4.  **Analysis**: User navigates to the "My Skills" page for granular management and "Gap Analysis" to see which skills are below industry benchmarks.
5.  **Growth**: Based on low scores, the system automatically surfaces "Recommended Actions" (e.g., Coursera links).

## 3. Key UI Components
- **Sidebar Navigation**: Desktop-first layout for quick access to dashboard, profile, and settings.
- **Glassmorphism Cards**: Card containers use `backdrop-blur` and subtle borders to create depth without visual clutter.
- micro-interactions**: 
  - Hover states on chart bars.
  - Smooth transitions when switching categories.
  - Animated progress bars for skill levels.

## 4. Digital Wireframe (Logic)
Instead of static images, our live UI acts as the high-fidelity wireframe. 
- **Layout**: 12-column grid system built with Tailwind CSS.
- **Responsive Nature**: Flex-box based containers that stack on mobile but expand into multiple columns on wide monitors.
