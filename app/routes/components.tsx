import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Components - OER Schema" },
    { name: "description", content: "Browse pedagogical components that use OER Schema vocabulary" },
  ];
};

// Component preview data
const components = [
  {
    id: "learning-objective",
    name: "Learning Objective",
    description: "Expected outcomes linked to InstructionalPatterns",
    schema: "@type: 'LearningObjective' (linked via hasLearningObjective)",
    vitepressCode: `::: learning-objective skill="explain photosynthesis" course="BIOL-101"
Students will be able to explain the process of photosynthesis and identify its key components including reactants, products, and cellular location.
:::`,
    htmlOutput: `<div itemscope itemtype="http://oerschema.org/LearningObjective">
  <meta itemprop="skill" content="explain photosynthesis" />
  <meta itemprop="forCourse" content="BIOL-101" />
  <h3>🎯 Learning Objective</h3>
  <p itemprop="description">Students will be able to explain the process of photosynthesis and identify its key components including reactants, products, and cellular location.</p>
</div>`,
    preview: (
      <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-r">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
          🎯 Learning Objective
        </h3>
        <p className="mb-3">Students will be able to explain the process of photosynthesis and identify its key components including reactants, products, and cellular location.</p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="bg-background px-2 py-1 rounded">Skill: explain photosynthesis</span>
          <span className="bg-background px-2 py-1 rounded">Course: BIOL-101</span>
        </div>
      </div>
    )
  },
  {
    id: "assessment",
    name: "Assessment",
    description: "InstructionalPattern for evaluating student performance",
    schema: "@type: 'Assessment' (subclass of InstructionalPattern)",
    vitepressCode: `::: assessment type="Quiz" points="25" assessing="photosynthesis-lab"
**Quick Check: Photosynthesis**

1. What are the main reactants in photosynthesis?
2. Where does photosynthesis primarily occur in plant cells?
3. What is the chemical equation for photosynthesis?

*Time limit: 10 minutes*
:::`,
    htmlOutput: `<div itemscope itemtype="http://oerschema.org/Assessment">
  <meta itemprop="additionalType" content="Quiz" />
  <meta itemprop="gradingFormat" content="25 points" />
  <link itemprop="assessing" href="#photosynthesis-lab" />
  <h3>📝 Assessment: Quick Check: Photosynthesis</h3>
  <div class="assessment-content">
    <ol>
      <li>What are the main reactants in photosynthesis?</li>
      <li>Where does photosynthesis primarily occur in plant cells?</li>
      <li>What is the chemical equation for photosynthesis?</li>
    </ol>
    <p class="time-limit">Time limit: 10 minutes</p>
  </div>
</div>`,
    preview: (
      <div className="border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4 rounded">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
          📝 Assessment: Quick Check: Photosynthesis
        </h3>
        <div className="mb-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>What are the main reactants in photosynthesis?</li>
            <li>Where does photosynthesis primarily occur in plant cells?</li>
            <li>What is the chemical equation for photosynthesis?</li>
          </ol>
          <p className="italic text-sm mt-3">Time limit: 10 minutes</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded">Quiz</span>
          <span className="bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded">25 points</span>
        </div>
      </div>
    )
  },
  {
    id: "practice-task",
    name: "Practice Task", 
    description: "Task subclass for hands-on learning activities",
    schema: "@type: 'Practice' (subclass of Task → InstructionalPattern)",
    vitepressCode: `::: practice action="Observing,Making" material="microscope-slides"
**Lab Exercise: Observing Chloroplasts**

### Materials Needed:
- Microscope
- Plant leaf samples (spinach or elodea)
- Slide and cover slip

### Instructions:
1. Prepare a wet mount of the leaf sample
2. Observe under 100x magnification
3. Identify and sketch chloroplasts
4. Record your observations

### Questions:
- What color are the chloroplasts?
- How are they distributed in the cell?
:::`,
    htmlOutput: `<div itemscope itemtype="http://oerschema.org/Practice">
  <link itemprop="typeOfAction" href="http://oerschema.org/Observing" />
  <link itemprop="typeOfAction" href="http://oerschema.org/Making" />
  <div itemprop="material" itemscope itemtype="http://oerschema.org/SupportingMaterial">
    <meta itemprop="name" content="microscope-slides" />
  </div>
  <h3>🔬 Practice: Observing Chloroplasts</h3>
  <div class="instructions">
    <!-- Materials and instructions content -->
  </div>
</div>`,
    preview: (
      <div className="border border-green-300 bg-green-50 dark:bg-green-950/20 p-4 rounded">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
          🔬 Practice: Observing Chloroplasts
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">Materials Needed:</h4>
            <ul className="list-disc list-inside text-sm ml-2">
              <li>Microscope</li>
              <li>Plant leaf samples (spinach or elodea)</li>
              <li>Slide and cover slip</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Instructions:</h4>
            <ol className="list-decimal list-inside text-sm ml-2 space-y-1">
              <li>Prepare a wet mount of the leaf sample</li>
              <li>Observe under 100x magnification</li>
              <li>Identify and sketch chloroplasts</li>
            </ol>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">Observing</span>
            <span className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">Making</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "learning-component",
    name: "Learning Component with Reflection",
    description: "Generic LearningComponent with Reflecting ActionType",
    schema: "@type: 'LearningComponent' with Reflecting ActionType",
    vitepressCode: `::: learning-component action="Reflecting" objective="connect-concepts"
**Reflection: Connecting Photosynthesis to Daily Life**

Take a few minutes to think about what you've learned about photosynthesis today.

**Prompts:**
- How does understanding photosynthesis change how you think about plants?
- What connections can you make between photosynthesis and environmental issues?  
- What questions do you still have about this process?

Write at least 150 words reflecting on these questions.
:::`,
    htmlOutput: `<div itemscope itemtype="http://oerschema.org/LearningComponent">
  <link itemprop="doTask" href="#reflection-task" />
  <link itemprop="hasLearningObjective" href="#connect-concepts" />
  
  <div itemscope itemtype="http://oerschema.org/Task" id="reflection-task">
    <link itemprop="typeOfAction" href="http://oerschema.org/Reflecting" />
    <h3>💭 Reflection: Connecting Photosynthesis to Daily Life</h3>
    <div class="reflection-content">
      <p>Take a few minutes to think about what you've learned...</p>
      <!-- Prompts content -->
    </div>
  </div>
</div>`,
    preview: (
      <div className="border border-purple-300 bg-purple-50 dark:bg-purple-950/20 p-4 rounded">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
          💭 Reflection: Connecting Photosynthesis to Daily Life
        </h3>
        <p className="text-sm mb-3">Take a few minutes to think about what you've learned about photosynthesis today.</p>
        <div className="mb-3">
          <p className="font-medium text-sm">Prompts:</p>
          <ul className="list-disc list-inside text-sm ml-2 space-y-1">
            <li>How does understanding photosynthesis change how you think about plants?</li>
            <li>What connections can you make between photosynthesis and environmental issues?</li>
            <li>What questions do you still have about this process?</li>
          </ul>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded">Reflecting ActionType</span>
          <span className="bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded">LearningComponent</span>
        </div>
      </div>
    )
  },
  {
    id: "instructional-pattern",
    name: "Complete Instructional Pattern",
    description: "InstructionalPattern linking multiple components and objectives",
    schema: "@type: 'InstructionalPattern' with hasComponent and hasLearningObjective",
    vitepressCode: `::: instructional-pattern type="Lesson" title="Introduction to Photosynthesis"
This lesson combines multiple learning components to teach photosynthesis fundamentals.

**Components included:**
- Learning objective: explain-photosynthesis
- Practice activity: chloroplast-observation  
- Assessment: photosynthesis-quiz
- Reflection task: connect-concepts

**Learning Actions:** Reading, Observing, Writing, Reflecting
:::`,
    htmlOutput: `<div itemscope itemtype="http://oerschema.org/InstructionalPattern">
  <meta itemprop="additionalType" content="Lesson" />
  <meta itemprop="name" content="Introduction to Photosynthesis" />
  
  <link itemprop="hasLearningObjective" href="#explain-photosynthesis" />
  <link itemprop="hasComponent" href="#chloroplast-observation" />
  <link itemprop="hasComponent" href="#photosynthesis-quiz" />
  <link itemprop="hasComponent" href="#connect-concepts" />
  
  <h3>📚 Lesson: Introduction to Photosynthesis</h3>
  <p>This lesson combines multiple learning components to teach photosynthesis fundamentals.</p>
  
  <div class="components-list">
    <!-- Component references would be rendered here -->
  </div>
</div>`,
    preview: (
      <div className="border border-indigo-300 bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
          📚 Lesson: Introduction to Photosynthesis
        </h3>
        <p className="text-sm mb-3">This lesson combines multiple learning components to teach photosynthesis fundamentals.</p>
        <div className="mb-3">
          <p className="font-medium text-sm">Components included:</p>
          <ul className="list-disc list-inside text-sm ml-2 space-y-1">
            <li>Learning objective: explain-photosynthesis</li>
            <li>Practice activity: chloroplast-observation</li>
            <li>Assessment: photosynthesis-quiz</li>
            <li>Reflection task: connect-concepts</li>
          </ul>
        </div>
        <div className="flex gap-2 text-sm flex-wrap">
          <span className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">Reading</span>
          <span className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">Observing</span>
          <span className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">Writing</span>
          <span className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">Reflecting</span>
        </div>
      </div>
    )
  }
];

export default function Components() {
  return (
    <div className="space-y-8 min-w-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">OER Schema Components</h1>
        <p className="text-muted-foreground mt-2">
          Explore reusable components designed with OER Schema vocabulary to support pedagogically sound learning experiences.
        </p>
      </div>

      <div className="space-y-8 min-w-0">
        {components.map((component) => (
          <div key={component.id} className="border rounded-lg p-6 min-w-0">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">{component.name}</h2>
              <p className="text-muted-foreground mt-1">{component.description}</p>
              <div className="mt-2 text-xs font-mono bg-muted px-2 py-1 rounded inline-block">
                {component.schema}
              </div>
            </div>

            <Tabs defaultValue="preview" className="space-y-4 min-w-0">
              <TabsList>
                <TabsTrigger value="preview">Live Preview</TabsTrigger>
                <TabsTrigger value="vitepress">VitePress Code</TabsTrigger>
                <TabsTrigger value="html">HTML Output</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4 min-w-0">
                <div className="min-w-0">
                  <h3 className="text-lg font-medium mb-3">How it appears to students:</h3>
                  <div className="border rounded p-4 bg-background min-w-0 overflow-hidden">
                    {component.preview}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vitepress" className="space-y-4 min-w-0">
                <div className="min-w-0">
                  <h3 className="text-lg font-medium mb-3">VitePress Markdown Syntax:</h3>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto max-w-full">
                    <code className="whitespace-pre-wrap break-words">{component.vitepressCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="html" className="space-y-4 min-w-0">
                <div className="min-w-0">
                  <h3 className="text-lg font-medium mb-3">Generated HTML with OER Schema:</h3>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto max-w-full">
                    <code className="whitespace-pre-wrap break-words">{component.htmlOutput}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ))}
      </div>

      {/* <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Integration with Course Outline Builder</h2>
        <p className="text-muted-foreground mb-4">
          These components can be imported into your Course Outline Builder for visual editing, configuration, and export to multiple formats including Canvas LMS modules.
        </p>
        <Button variant="outline" className="mr-3">
          Learn More About Integration
        </Button>
        <Link to="/outline-builder">
          <Button>
            Try Course Outline Builder
          </Button>
        </Link>
      </div> */}
    </div>
  );
}
