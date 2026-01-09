# VitePress OER Schema Plugin

A VitePress plugin that adds pedagogical components with OER Schema microdata support.

## Installation for Local Development

1. Copy the `vitepress-plugin` folder to your VitePress project root
2. Install the plugin in your `.vitepress/config.js`:

```javascript
import { oerSchemaPlugin } from './vitepress-plugin/index.js'

export default {
  // ... your config
  markdown: {
    config: (md) => {
      md.use(oerSchemaPlugin)
    }
  }
}
```

3. Copy the CSS file to your theme or import it in your custom CSS

## Usage

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
### Rubric
```markdown
::: rubric type="analytic" scale="default-scale"
Describe rubric usage here...
  ::: rubric-criterion weight="1"
  Criterion description here...
  :::
  ::: rubric-scale pointsRequired="true"
    ::: rubric-level ordinal="1" points="1"
    Descriptor for level 1
    :::
    ::: rubric-level ordinal="4" points="4"
    Descriptor for level 4
    :::
  :::
:::
```

```

### Practice Task
```markdown
::: practice action="Observing,Making" material="microscope-slides"
**Lab Exercise: Observing Chloroplasts**
Instructions here...
:::
```

### Learning Component with Reflection
```markdown
::: learning-component action="Reflecting" objective="connect-concepts"
**Reflection: Connecting Photosynthesis to Daily Life**
Reflection prompts here...
:::
```

### Complete Instructional Pattern
```markdown
::: instructional-pattern type="Lesson" title="Introduction to Photosynthesis"
This lesson combines multiple learning components...
:::
```