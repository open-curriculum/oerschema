/**
 * VitePress OER Schema Plugin
 * Adds pedagogical components with OER Schema microdata
 */

export function oerSchemaPlugin(md) {
  // Learning Objective component
  md.use(require('markdown-it-container'), 'learning-objective', {
    validate: function(params) {
      return params.trim().match(/^learning-objective\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^learning-objective\s+(.*)$/);
      
      if (tokens[idx].nesting === 1) {
        // Parse attributes
        const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
        const skill = attrs.skill || '';
        const course = attrs.course || '';
        
        return `<div class="oer-learning-objective" itemscope itemtype="http://oerschema.org/LearningObjective">
  ${skill ? `<meta itemprop="skill" content="${escapeHtml(skill)}" />` : ''}
  ${course ? `<meta itemprop="forCourse" content="${escapeHtml(course)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">🎯 Learning Objective</h3>
  </div>
  <div class="oer-component-content" itemprop="description">`;
      } else {
        return `  </div>
  <div class="oer-component-meta">
    ${attrs.skill ? `<span class="oer-tag">Skill: ${escapeHtml(attrs.skill)}</span>` : ''}
    ${attrs.course ? `<span class="oer-tag">Course: ${escapeHtml(attrs.course)}</span>` : ''}
  </div>
</div>\n`;
      }
    }
  });

  // Assessment component
  md.use(require('markdown-it-container'), 'assessment', {
    validate: function(params) {
      return params.trim().match(/^assessment\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^assessment\s+(.*)$/);
      
      if (tokens[idx].nesting === 1) {
        const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
        
        // Handle aiUsageConstraint - support single value or comma-separated list
        const constraints = attrs.aiUsageConstraint ? attrs.aiUsageConstraint.split(',').map(c => c.trim()) : [];
        const aiConstraintHtml = constraints.map(constraint => {
          return (constraint.startsWith('http://') || constraint.startsWith('https://'))
            ? `<link itemprop="aiUsageConstraint" href="${escapeHtml(constraint)}" />`
            : `<meta itemprop="aiUsageConstraint" content="${escapeHtml(constraint)}" />`;
        }).join('\n  ');
        
        return `<div class="oer-assessment" itemscope itemtype="http://oerschema.org/Assessment">
  ${attrs.type ? `<meta itemprop="additionalType" content="${escapeHtml(attrs.type)}" />` : ''}
  ${attrs.points ? `<meta itemprop="gradingFormat" content="${escapeHtml(attrs.points)} points" />` : ''}
  ${aiConstraintHtml}
  ${attrs.assessing ? `<link itemprop="assessing" href="#${escapeHtml(attrs.assessing)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">📝 Assessment</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        const constraints = attrs.aiUsageConstraint ? attrs.aiUsageConstraint.split(',').map(c => c.trim()) : [];
        return `  </div>
  <div class="oer-component-meta">
    ${attrs.type ? `<span class="oer-tag">${escapeHtml(attrs.type)}</span>` : ''}
    ${attrs.points ? `<span class="oer-tag">${escapeHtml(attrs.points)} points</span>` : ''}
    ${constraints.map(c => `<span class="oer-tag oer-ai-constraint">${escapeHtml(c)}</span>`).join('')}
  </div>
</div>\n`;
      }
    }
  });

  // Practice Task component
  md.use(require('markdown-it-container'), 'practice', {
    validate: function(params) {
      return params.trim().match(/^practice\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^practice\s+(.*)$/);
      
      if (tokens[idx].nesting === 1) {
        const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
        const actions = attrs.action ? attrs.action.split(',').map(a => a.trim()) : [];
        
        // Handle aiUsageConstraint - support single value or comma-separated list
        const constraints = attrs.aiUsageConstraint ? attrs.aiUsageConstraint.split(',').map(c => c.trim()) : [];
        const aiConstraintHtml = constraints.map(constraint => {
          return (constraint.startsWith('http://') || constraint.startsWith('https://'))
            ? `<link itemprop="aiUsageConstraint" href="${escapeHtml(constraint)}" />`
            : `<meta itemprop="aiUsageConstraint" content="${escapeHtml(constraint)}" />`;
        }).join('\n  ');
        
        return `<div class="oer-practice" itemscope itemtype="http://oerschema.org/Practice">
  ${aiConstraintHtml}
  ${actions.map(action => `<link itemprop="typeOfAction" href="http://oerschema.org/${escapeHtml(action)}" />`).join('\n  ')}
  ${attrs.material ? `<div itemprop="material" itemscope itemtype="http://oerschema.org/SupportingMaterial">
    <meta itemprop="name" content="${escapeHtml(attrs.material)}" />
  </div>` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">🔬 Practice</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        const constraints = attrs.aiUsageConstraint ? attrs.aiUsageConstraint.split(',').map(c => c.trim()) : [];
        return `  </div>
  <div class="oer-component-meta">
    ${actions.map(action => `<span class="oer-tag">${escapeHtml(action)}</span>`).join('')}
    ${constraints.map(c => `<span class="oer-tag oer-ai-constraint">${escapeHtml(c)}</span>`).join('')}
  </div>
</div>\n`;
      }
    }
  });

  // Rubric component
  md.use(require('markdown-it-container'), 'rubric', {
    validate: function(params) {
      return params.trim().match(/^rubric\s*(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^rubric\s*(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');

      if (tokens[idx].nesting === 1) {
        return `<div class="oer-rubric" itemscope itemtype="http://oerschema.org/Rubric">
  ${attrs.type ? `<meta itemprop="rubricType" content="${escapeHtml(attrs.type)}" />` : ''}
  ${attrs.scale ? `<link itemprop="rubricScale" href="#${escapeHtml(attrs.scale)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">📏 Rubric</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        return `  </div>
  <div class="oer-component-meta">
    ${attrs.type ? `<span class="oer-tag">${escapeHtml(attrs.type)}</span>` : ''}
    ${attrs.scale ? `<span class="oer-tag">Scale: ${escapeHtml(attrs.scale)}</span>` : ''}
  </div>
</div>\n`;
      }
    }
  });

  // Rubric Criterion component
  md.use(require('markdown-it-container'), 'rubric-criterion', {
    validate: function(params) {
      return params.trim().match(/^rubric-criterion\s*(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^rubric-criterion\s*(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');

      if (tokens[idx].nesting === 1) {
        return `<div class="oer-rubric-criterion" itemprop="hasCriterion" itemscope itemtype="http://oerschema.org/RubricCriterion">
  ${attrs.weight ? `<meta itemprop="criterionWeight" content="${escapeHtml(attrs.weight)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">📐 Criterion</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        return `  </div>
  <div class="oer-component-meta">
    ${attrs.weight ? `<span class="oer-tag">Weight: ${escapeHtml(attrs.weight)}</span>` : ''}
  </div>
</div>\n`;
      }
    }
  });

  // Rubric Scale component
  md.use(require('markdown-it-container'), 'rubric-scale', {
    validate: function(params) {
      return params.trim().match(/^rubric-scale\s*(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^rubric-scale\s*(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');

      if (tokens[idx].nesting === 1) {
        return `<div class="oer-rubric-scale" itemprop="rubricScale" itemscope itemtype="http://oerschema.org/RubricScale">
  ${attrs.pointsRequired ? `<meta itemprop="pointsRequired" content="${escapeHtml(attrs.pointsRequired)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">📊 Rubric Scale</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        return `  </div>
  <div class="oer-component-meta">
    ${attrs.pointsRequired ? `<span class="oer-tag">Points required</span>` : ''}
  </div>
</div>\n`;
      }
    }
  });

  // Rubric Level component
  md.use(require('markdown-it-container'), 'rubric-level', {
    validate: function(params) {
      return params.trim().match(/^rubric-level\s*(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^rubric-level\s*(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');

      if (tokens[idx].nesting === 1) {
        return `<div class="oer-rubric-level" itemprop="hasLevel" itemscope itemtype="http://oerschema.org/RubricLevel">
  ${attrs.ordinal ? `<meta itemprop="levelOrdinal" content="${escapeHtml(attrs.ordinal)}" />` : ''}
  ${attrs.points ? `<meta itemprop="levelPoints" content="${escapeHtml(attrs.points)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">⬆️ Rubric Level</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        return `  </div>
  <div class="oer-component-meta">
    ${attrs.ordinal ? `<span class="oer-tag">Ordinal: ${escapeHtml(attrs.ordinal)}</span>` : ''}
    ${attrs.points ? `<span class="oer-tag">Points: ${escapeHtml(attrs.points)}</span>` : ''}
  </div>
</div>\n`;
      }
    }
  });

  // Learning Component with Reflection
  md.use(require('markdown-it-container'), 'learning-component', {
    validate: function(params) {
      return params.trim().match(/^learning-component\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^learning-component\s+(.*)$/);
      
      if (tokens[idx].nesting === 1) {
        const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
        
        return `<div class="oer-learning-component" itemscope itemtype="http://oerschema.org/LearningComponent">
  ${attrs.objective ? `<link itemprop="hasLearningObjective" href="#${escapeHtml(attrs.objective)}" />` : ''}
  <div itemscope itemtype="http://oerschema.org/Task">
    ${attrs.action ? `<link itemprop="typeOfAction" href="http://oerschema.org/${escapeHtml(attrs.action)}" />` : ''}
    <div class="oer-component-header">
      <h3 class="oer-component-title">💭 Learning Component</h3>
    </div>
    <div class="oer-component-content">`;
      } else {
        return `    </div>
    <div class="oer-component-meta">
      ${attrs.action ? `<span class="oer-tag">${escapeHtml(attrs.action)} ActionType</span>` : ''}
      <span class="oer-tag">LearningComponent</span>
    </div>
  </div>
</div>\n`;
      }
    }
  });

  // Instructional Pattern component
  md.use(require('markdown-it-container'), 'instructional-pattern', {
    validate: function(params) {
      return params.trim().match(/^instructional-pattern\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^instructional-pattern\s+(.*)$/);
      
      if (tokens[idx].nesting === 1) {
        const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
        
        return `<div class="oer-instructional-pattern" itemscope itemtype="http://oerschema.org/InstructionalPattern">
  ${attrs.type ? `<meta itemprop="additionalType" content="${escapeHtml(attrs.type)}" />` : ''}
  ${attrs.title ? `<meta itemprop="name" content="${escapeHtml(attrs.title)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">📚 ${attrs.type || 'Instructional Pattern'}: ${attrs.title || ''}</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        return `  </div>
</div>\n`;
      }
    }
  });
}

/**
 * Parse attribute string like: skill="value" course="another value"
 */
function parseAttributes(str) {
  const attrs = {};
  const regex = /(\w+)=["']([^"']*?)["']/g;
  let match;
  
  while ((match = regex.exec(str)) !== null) {
    attrs[match[1]] = match[2];
  }
  
  return attrs;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
