# Task Manager Dashboard - Design Guidelines

## Design Approach
**Selected Framework:** Design System + Reference Hybrid  
**Primary Reference:** Linear's minimalist task management aesthetic with dark-first design  
**Supporting Influences:** Notion's clean tables, GitHub's code-focused dark theme  

This productivity tool prioritizes efficiency, clarity, and minimal cognitive load. Dark theme is the primary interface with carefully considered contrast ratios for extended use.

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background Base: `222 12% 9%` - Deep charcoal for main canvas
- Surface: `222 12% 12%` - Elevated cards and sidebar
- Surface Elevated: `222 12% 15%` - Modals, dropdowns
- Border: `222 10% 20%` - Subtle dividers
- Border Interactive: `222 10% 28%` - Hover states

**Accent & Status Colors**
- Primary (Actions): `217 91% 60%` - Vibrant blue for CTAs and links
- Success (Create): `142 71% 45%` - Green for create actions
- Warning (Update): `38 92% 50%` - Amber for update actions  
- Danger (Delete): `0 84% 60%` - Red for delete actions

**Text Hierarchy**
- Primary Text: `222 12% 95%` - Headings and important content
- Secondary Text: `222 10% 70%` - Body text and labels
- Tertiary Text: `222 8% 50%` - Timestamps and metadata
- Disabled: `222 8% 35%` - Inactive elements

---

### B. Typography

**Font Stack:** System fonts for optimal performance
```
Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Monospace: "SF Mono", "Roboto Mono", Consolas, monospace (for IDs)
```

**Type Scale**
- Page Title: 24px / font-semibold / tracking-tight
- Section Header: 18px / font-semibold
- Table Headers: 13px / font-medium / uppercase / tracking-wide / text-tertiary
- Body Text: 14px / font-normal / leading-relaxed
- Small Text: 12px / font-normal (timestamps, metadata)
- Button Text: 14px / font-medium

---

### C. Layout System

**Spacing Primitives:** Tailwind units of `2, 3, 4, 6, 8, 12, 16, 20`
- Component padding: `p-4` to `p-6`
- Section spacing: `gap-6` to `gap-8`
- Page margins: `p-6` to `p-8`

**Grid Structure**
- Sidebar: Fixed `w-56` (224px)
- Main Content: `flex-1` with `max-w-7xl mx-auto`
- Content Padding: `px-6 py-6` to `px-8 py-8`

---

### D. Component Library

#### 1. **Layout Components**

**Sidebar**
- Fixed left panel, full height
- Dark surface background
- Logo/brand at top with `p-6`
- Navigation items: `px-4 py-2.5`, rounded corners on hover
- Active state: Subtle background highlight with accent border-left
- Icons: 20px size, aligned with text

**Header Bar**
- Height: `h-14` to `h-16`
- Background: Surface elevated with bottom border
- Contains: Page title (left), user profile/actions (right)
- Horizontal padding: `px-6` to `px-8`

**Main Content Area**
- Background: Base background
- Padding: `p-6` to `p-8`
- Card containers: `bg-surface rounded-lg border border-border`

#### 2. **Data Display**

**Task Table**
- Header: Sticky, background surface, uppercase labels, `py-3 px-4`
- Rows: `py-3.5 px-4`, border-bottom divider, hover background change
- Columns: ID (monospace, 80px), Title (flex-1), Description (flex-2), Created At (160px), Actions (120px)
- Empty state: Centered icon + text with muted colors

**Audit Log Table**
- Similar structure to task table
- Action badges: Rounded `px-2.5 py-1`, colored backgrounds with matching text
  - Create: Green background `142 71% 45%` at 15% opacity, green text
  - Update: Amber background `38 92% 50%` at 15% opacity, amber text
  - Delete: Red background `0 84% 60%` at 15% opacity, red text
- Monospace font for task IDs

**Pagination**
- Bottom of table, right-aligned
- Page numbers as buttons: `px-3 py-1.5`, active state with primary color
- Previous/Next: Text buttons with chevron icons
- Show "X-Y of Z tasks" text on left side

#### 3. **Interactive Elements**

**Buttons**
- Primary: `bg-primary text-white px-4 py-2 rounded-md font-medium`
- Secondary: `border border-border bg-transparent px-4 py-2 rounded-md`
- Danger: `bg-danger text-white px-4 py-2 rounded-md`
- Icon buttons: `p-2 rounded-md` hover background
- All buttons: Subtle hover brightness change, no excessive animations

**Modal (Create/Edit Task)**
- Overlay: `bg-black/60` backdrop blur
- Container: `bg-surface-elevated rounded-lg max-w-lg w-full p-6` with border
- Header: Title + close icon, `mb-6`
- Form fields: Full width labels above inputs, `space-y-4`
- Footer: Action buttons right-aligned, `gap-3`

**Confirmation Dialog (Delete)**
- Smaller modal: `max-w-md`
- Warning icon: Red accent, centered
- Clear title and description text
- Button group: Cancel (secondary) + Delete (danger)

**Input Fields**
- Height: `h-10` to `h-11`
- Background: Surface with border
- Padding: `px-3 py-2`
- Focus: Primary color ring, border color change
- Textarea: Min height `h-24`, resize-y enabled
- Character count: Small text, right-aligned below field (e.g., "45/100")

**Search Bar**
- Prominent placement above table
- Magnifying glass icon prefix
- Placeholder: "Search tasks by title or description..."
- Width: `w-full md:w-96`

#### 4. **Feedback Elements**

**Status Badges**
- Compact size: `text-xs px-2.5 py-1 rounded-full font-medium`
- Pill-shaped with colored backgrounds

**Loading States**
- Skeleton loaders for table rows: Animated gradient shimmer
- Spinners: 20px size, primary color for actions

---

### E. Spacing & Visual Rhythm

**Vertical Rhythm**
- Between sections: `space-y-6` to `space-y-8`
- Within cards: `space-y-4` to `space-y-6`
- Table cell padding: `py-3` to `py-4`

**Container Constraints**
- Max width for content: `max-w-7xl`
- Max width for modals: `max-w-lg` to `max-w-xl`
- Form field max width: Full width within modal

---

### F. Interactions & Micro-Animations

**Minimize animations** - only use where it enhances usability:
- Hover states: Subtle background color transitions (150ms)
- Modal entry: Fade in overlay + scale content (200ms ease-out)
- Button clicks: Slight scale-down effect (100ms)
- Table row hover: Background color change (150ms)

**No animations for:**
- Page transitions
- Sidebar navigation
- Form field focus
- Badge appearances

---

## Implementation Notes

1. **Consistency First:** Every table, modal, and form should follow the same patterns
2. **Information Density:** Prioritize readable data presentation over decorative elements
3. **Keyboard Navigation:** Ensure all interactive elements are keyboard accessible
4. **Focus States:** Clear visual indicators for keyboard users (ring with primary color)
5. **Responsive Behavior:** Sidebar collapses to hamburger menu on mobile (`< md` breakpoint)