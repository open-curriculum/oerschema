import { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "VitePress Plugin - OER Schema" },
    { name: "description", content: "Download the VitePress plugin for OER Schema pedagogical components" },
  ];
};

export default function Plugin() {
  const pluginFiles = [
    {
      name: "index.mjs",
      description: "Main plugin file with ES module support",
      url: "/vitepress-plugin/index.mjs",
      size: "~8KB"
    },
    {
      name: "styles.css", 
      description: "Component styles with dark mode support",
      url: "/vitepress-plugin/styles.css",
      size: "~4KB"
    },
    {
      name: "package.json",
      description: "Package configuration and dependencies",
      url: "/vitepress-plugin/package.json",
      size: "~1KB"
    },
    {
      name: "README.md",
      description: "Installation and usage documentation",
      url: "/vitepress-plugin/README.md",
      size: "~3KB"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">VitePress Plugin</h1>
        <p className="text-muted-foreground mt-2">
          Add OER Schema pedagogical components to your VitePress documentation with semantic markup and beautiful styling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Quick Installation</h2>
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">1. Install from npm</h3>
            <pre className="bg-background p-2 rounded text-sm">
              <code>npm install vitepress-plugin-oer-schema</code>
            </pre>
            
            <h3 className="font-medium mb-2 mt-3">2. Configure VitePress</h3>
            <pre className="bg-background p-2 rounded text-sm text-wrap">
              <code>{`import { oerSchemaPlugin } from 'vitepress-plugin-oer-schema'

export default {
  markdown: {
    config: (md) => md.use(oerSchemaPlugin)
  }
}`}</code>
            </pre>

            <h3 className="font-medium mb-2 mt-3">3. Import Styles</h3>
            <pre className="bg-background p-2 rounded text-sm text-wrap">
              <code>{`import 'vitepress-plugin-oer-schema/styles.css'`}</code>
            </pre>
          </div>
        </div>

        {/* <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-sm">Published on npm registry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-sm">OER Schema microdata for SEO and interoperability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-sm">9 pedagogical component types (including rubrics)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-sm">Responsive design with dark mode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-sm">Print-friendly styling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-sm">Accessible markup and styling</span>
            </li>
          </ul>
        </div> */}
      </div>

      {/* <div>
        <h2 className="text-2xl font-semibold mb-4">Alternative: Download Files</h2>
        <p className="text-muted-foreground mb-4">
          Prefer to download the files directly? Access the plugin source files below:
        </p>
        <div className="grid gap-4">
          {pluginFiles.map((file) => (
            <div key={file.name} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">{file.description}</p>
                <span className="text-xs text-muted-foreground">{file.size}</span>
              </div>
              <Button asChild variant="outline">
                <a href={file.url} download={file.name}>
                  Download
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div> */}

      <div className="bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Example Usage</h2>
        <p className="text-muted-foreground mb-4">
          Here's how to use the components in your VitePress markdown files:
        </p>
        <pre className="bg-background p-4 rounded text-sm overflow-x-auto">
          <code>{`::: learning-objective skill="analyze data" course="DATA-101"
Students will be able to analyze and interpret data using statistical methods.
:::

::: practice action="Analyzing,Computing" material="dataset-csv"
**Exercise: Sales Data Analysis**
Download the sales dataset and calculate key metrics...
:::

::: assessment type="Project" points="100" assessing="data-analysis"
**Final Project: Data Analysis Report**
Create a comprehensive analysis of the provided dataset...
:::

::: rubric type="analytic"
**Assignment Rubric**

::: rubric-criterion weight="40"
**Data Analysis Quality**
::: rubric-scale pointsRequired="true"
::: rubric-level ordinal="3" points="40"
Excellent analysis with clear insights
:::
::: rubric-level ordinal="2" points="30"
Good analysis with some insights
:::
::: rubric-level ordinal="1" points="20"
Basic analysis
:::
:::
:::
:::`}</code>
        </pre>
      </div>

      <div className="text-center space-y-4">
        {/* <div>
          <Button asChild className="mr-4">
            <a href="/components">View Live Examples</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/vitepress-plugin/README.md" target="_blank">
              Full Documentation
            </a>
          </Button>
        </div> */}
        <div className="text-sm text-muted-foreground">
          <a href="https://www.npmjs.com/package/vitepress-plugin-oer-schema" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            View on npm
          </a>
          {" • "}
          Version 0.2.1
        </div>
      </div>
    </div>
  );
}
