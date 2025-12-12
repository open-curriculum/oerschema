# Example VitePress Configuration

Here's how to configure your VitePress site to use the OER Schema plugin:

## .vitepress/config.js

```javascript
import { defineConfig } from 'vitepress'
import { oerSchemaPlugin } from '../vitepress-plugin/index.js'

export default defineConfig({
  title: 'Your Course Title',
  description: 'Course description with OER Schema support',
  
  // Add the plugin to markdown processing
  markdown: {
    config: (md) => {
      md.use(oerSchemaPlugin)
    }
  },
  
  // Include the CSS in your theme
  head: [
    ['link', { rel: 'stylesheet', href: '/oer-schema-components.css' }]
  ],
  
  themeConfig: {
    // Your theme config
  }
})
```

## .vitepress/theme/index.js

If using a custom theme, import the styles:

```javascript
import DefaultTheme from 'vitepress/theme'
import '../../../vitepress-plugin/styles.css'

export default {
  extends: DefaultTheme,
  // Your theme customizations
}
```

## Example Markdown Usage

Create a file like `lesson1.md`:

```markdown
# Lesson 1: Introduction to Photosynthesis

::: learning-objective skill="explain photosynthesis" course="BIOL-101"
Students will be able to explain the process of photosynthesis and identify its key components including reactants, products, and cellular location.
:::

## Content Section

Your lesson content here...

::: practice action="Observing,Recording" material="microscope-slides"
**Lab Exercise: Observing Chloroplasts**

### Materials Needed:
- Microscope
- Plant leaf samples
- Slides and cover slips

### Instructions:
1. Prepare a wet mount of the leaf sample
2. Observe under 100x magnification
3. Record your observations
:::

::: assessment type="Quiz" points="10" assessing="photosynthesis-basics"
**Quick Check**

1. What are the main reactants in photosynthesis?
2. What are the main products?
:::

::: learning-component action="Reflecting" objective="photosynthesis-understanding"
**Reflection**

Think about what you learned today. How does photosynthesis connect to your daily life?
:::
```

This will render as properly styled components with OER Schema microdata embedded for SEO and accessibility.
