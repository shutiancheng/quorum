# SOCius Design System

## 1. Introduction
Quorum is a high-performance platform designed for clarity, rapid response, and deep analytical insight. This design system provides a unified framework for building consistent, accessible, and professional interfaces across web and mobile platforms.

## 2. Brand Identity
The brand identity is defined by a high-contrast "Dark Mode" aesthetic, utilizing a vibrant neon accent color to draw attention to critical data points and interactive elements.

## 3. Color Palette

### Brand Colors
* **Brand Base:** `#E5FF8F` (Vibrant Lime) - Used for primary actions, critical highlights, and brand elements.
* **Brand Secondary:** `#00D0FF` (Bright Cyan) - Used for secondary data visualizations or accents.

### Tints & Shades (Brand Base)
* **Lighter 1:** `#EDFFB1`
* **Lighter 2:** `#F7FFDD`
* **Lighter 3:** `#F2FFC7`
* **Lighter 4:** `#FCFFF4`

### Functional Colors
* **Positive:** `#00FF00` (Success states, uptime, high compliance)
* **Danger:** `#FF0000` (Critical alerts, malware detected, low compliance)
* **Warning:** `#FFA500` (Medium priority alerts, warnings)

### Neutrals & Grays
* **Neutral Color:** `#000000` (Primary background)
* **Surface 1:** `#0D0D0D` (Default card/widget background)
* **Surface 2:** `#161616` (Secondary containers)
* **Surface 3:** `#1F1F1F` (Dividers or inactive states)
* **Surface 4:** `#282828` (Hover states)
* **Text Neutral:** `#FFFFFF` (Primary text color)

## 4. Typography

**Primary Typeface:** Aeonik
**Scale:** Based on a 4px grid.

### Headings
| Label | Font Size | Leading (Line Height) | Tracking (Letter Spacing) |
| :--- | :--- | :--- | :--- |
| Heading H1 | 36px | 40px | 0px |
| Heading H2 | 30px | 36px | 0px |
| Heading H3 | 24px | 32px | 0px |

### Body
| Label | Font Size | Leading (Line Height) | Tracking (Letter Spacing) |
| :--- | :--- | :--- | :--- |
| Body Large | 18px | 28px | 0px |
| Body Default | 16px | 24px | 0px |

### Captions
| Label | Font Size | Leading (Line Height) | Tracking (Letter Spacing) |
| :--- | :--- | :--- | :--- |
| Caption Default | 14px | 16px | 0px |
| Caption Small | 12px | 16px | 0px |

## 5. Components

### Widgets & Cards
* **Border Radius:** 24px (Large widgets), 12px (Small buttons/inputs).
* **Background:** Use `#0D0D0D` for dark widgets and `#FFFFFF` for light/accent widgets.
* **Padding:** 24px standard internal padding.

### Buttons
* **Primary Button:** Background `#E5FF8F`, Text `#000000`, Rounded corners.
* **Secondary Button:** Background `#1F1F1F`, Text `#FFFFFF`.

### Data Visualization
* **Gauges:** Semi-circular progress bars using `#E5FF8F` for progress and `#1F1F1F` for the track.
* **Line Charts:** Smooth curves with gradient fills. Use accent colors to differentiate data streams.
* **Status Tags:** Small rounded capsules (e.g., "High", "Critical") using semantic colors (Green/Red).

## 6. Layout & Grid
* **Background:** Solid `#000000` with an optional subtle 8px dot grid pattern.
* **Spacing:** Use multiples of 4px (8, 16, 24, 32, 48).
* **Desktop:** Sidebar navigation (48px - 64px width) with a flexible main content area.
* **Mobile:** Card-based vertical stack with a 16px gutter.
