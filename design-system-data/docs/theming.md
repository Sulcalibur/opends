# Theming with tokens

Theming in Ember means **reassigning tokens**, not editing component internals. Components never hard-code values — they reference tokens, so a theme is just a token override.

## Light and dark

Semantic tokens are single values today. For dark mode, add dark-valued tokens with the same names in your export and swap them at the root:

```css
[data-theme="dark"] {
  --color-bg-canvas: #23211E;  /* was #FAFAF9 */
  --color-text-primary: #FAFAF9;
  --color-border-default: #3F3C37;
}
```

## Branding

To re-skin Ember for your product, override the ramp anchors and let the scale follow:

| Token | Default | Swap to |
| --- | --- | --- |
| `color.primary.500` | `#FF6B4A` | your brand color |
| `color.secondary.500` | `#E8B23A` | your accent |
| `font.family.display` | `'Outfit', …` | your display face |

## Checking contrast

Verify every text token against its surface before shipping a theme. As a rule of thumb:

- Body text on `color.bg.canvas` must clear **4.5:1**.
- Large display text must clear **3:1**.
- Ember's neutral ramp is tuned so `neutral.600` on `neutral.50` passes AA.
