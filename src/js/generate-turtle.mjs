import { promises as fs } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Parser as N3Parser, Writer as N3Writer } from 'n3';
import jsonld from 'jsonld';
import yaml from 'yamljs';

// Get directory path
const __dirname = dirname(fileURLToPath(import.meta.url));

// Function to transform YAML schema to JSON-LD
function transformYamlToJSONLD(schemaYAML) {
  const jsonLD = {
    "@context": {
      "schema": "http://schema.org/",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "ex": "http://example.org/"
    },
    "@graph": []
  };

  const classes = schemaYAML.classes || {};

  for (const [className, classData] of Object.entries(classes)) {
    // Skip if classData is undefined or null
    if (!classData) continue;

    const classJSONLD = {
      "@id": `ex:${className}`,
      "@type": "rdfs:Class",
      "rdfs:label": classData.label || className,
      "rdfs:comment": classData.comment || "",
      "rdfs:subClassOf": classData.subClassOf || [],
      "schema:property": classData.properties || []
    };

    // Remove empty arrays or unnecessary fields
    if (classJSONLD["rdfs:comment"] === "") {
      delete classJSONLD["rdfs:comment"];
    }

    if (classJSONLD["rdfs:subClassOf"].length === 0) {
      delete classJSONLD["rdfs:subClassOf"];
    }

    if (classJSONLD["schema:property"].length === 0) {
      delete classJSONLD["schema:property"];
    }

    jsonLD["@graph"].push(classJSONLD);
  }

  return jsonLD;
}

async function generateTurtle() {
  try {
    console.log('Starting Turtle file generation...');

    // Load schema.yml
    const schemaPath = './src/config/schema.yml';
    console.log(`Loading schema from: ${schemaPath}`);
    const schemaYAML = yaml.load(schemaPath);
    console.log('Schema YAML loaded successfully.');

    // Transform YAML to JSON-LD
    console.log('Transforming YAML schema to JSON-LD...');
    const schemaJSONLD = transformYamlToJSONLD(schemaYAML);
    console.log('Transformation to JSON-LD completed.');

    // Ensure dist directory exists
    const outputDir = './dist';
    console.log(`Ensuring output directory exists: ${outputDir}`);
    await fs.mkdir(outputDir, { recursive: true });

    // Convert JSON-LD to N-Quads
    console.log('Converting JSON-LD to N-Quads...');
    const nquads = await jsonld.toRDF(schemaJSONLD, { format: 'application/n-quads' });
    console.log('Conversion to N-Quads completed.');

    if (!nquads) {
      throw new Error('jsonld.toRDF returned no N-Quads.');
    }

    // Parse N-Quads into quads
    console.log('Parsing N-Quads...');
    const parser = new N3Parser();
    const quadsParsed = parser.parse(nquads);
    console.log('Parsed quads:', quadsParsed);

    // Initialize N3Writer for Turtle
    console.log('Initializing N3Writer for Turtle...');
    const writer = new N3Writer({ prefixes: { ex: 'http://example.org/', schema: 'http://schema.org/', rdfs: 'http://www.w3.org/2000/01/rdf-schema#' } });

    // Add quads to writer
    console.log('Adding quads to writer...');
    writer.addQuads(quadsParsed);
    console.log('Quads added to writer.');

    // Serialize to Turtle
    console.log('Serializing to Turtle...');
    const turtle = await new Promise((resolve, reject) => {
      writer.end((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    console.log('Turtle serialization completed.');

    if (!turtle) {
      throw new Error('Turtle serialization resulted in empty output.');
    }

    // Write Turtle to file
    const outputPath = './dist/schema.ttl';
    console.log(`Writing Turtle to file: ${outputPath}`);
    await fs.writeFile(outputPath, turtle);
    console.log(`Turtle file generated successfully at ${outputPath}`);
  } catch (error) {
    console.error('Error generating Turtle file:', error);
    process.exit(1);
  }
}

// Execute the generation
generateTurtle();