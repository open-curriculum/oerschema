# VitePress OER Schema Plugin

A VitePress plugin that adds pedagogical components with OER Schema microdata support.

## Quick Start

### 1. Download Plugin Files

Download the following files to your VitePress project:

- [`index.mjs`](./index.mjs) - Main plugin file
- [`styles.css`](./styles.css) - Component styles
- [`package.json`](./package.json) - Package configuration

### 2. Install Dependencies

```bash
npm install markdown-it-container
```

### 3. Configure VitePress

Update your `.vitepress/config.js`:

```javascript
import { defineConfig } from 'vitepress'
import { oerSchemaPlugin } from './path/to/index.mjs'

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(oerSchemaPlugin)
    }
  },
  head: [
    ['link', { rel: 'stylesheet', href: '/path/to/styles.css' }]
  ]
})
```

## Usage Examples

### Learning Objective
```markdown
::: learning-objective skill="explain photosynthesis" course="BIOL-101"
Students will be able to explain the process of photosynthesis...
:::
```

### Assessment
```markdown
::: assessment type="Quiz" points="25" assessing="photosynthesis-lab"
**Quick Check: Photosynthesis**
1. What are the main reactants?
:::
```

### Practice Task
```markdown
::: practice action="Observing,Making" material="microscope-slides"
**Lab Exercise: Observing Chloroplasts**
Instructions here...
:::
```

### Learning Component
```markdown
::: learning-component action="Reflecting" objective="connect-concepts"
**Reflection: Connecting Photosynthesis to Daily Life**
Reflection prompts here...
:::
```

### Instructional Pattern
```markdown
::: instructional-pattern type="Lesson" title="Introduction to Photosynthesis"
This lesson combines multiple learning components...
:::
```

## Features

- ✅ **OER Schema microdata** - Embedded structured data for SEO and interoperability
- ✅ **Responsive design** - Works on all device sizes
- ✅ **Dark mode support** - Adapts to VitePress theme
- ✅ **Accessible styling** - Proper contrast and semantic markup
- ✅ **Print friendly** - Optimized for PDF generation

## Live Examples

See the [Components Gallery](../components) for interactive examples and generated HTML.

## Support

For issues and questions, visit the [OER Schema GitHub repository](https://github.com/oerschema/oerschema-v7).
