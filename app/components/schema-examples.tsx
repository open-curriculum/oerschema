import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type SchemaExampleProps = {
  type: string;
  name: string;
  label?: string;
  comment?: string;
  properties?: string[];
  range?: string[];
  domain?: string[];
  baseUrl?: string;
};

export function SchemaExamples({
  type,
  name,
  label,
  comment,
  properties = [],
  range = [],
  domain = [],
  baseUrl = "http://oerschema.org/"
}: SchemaExampleProps) {
  const isClass = !range.length && !domain.length;
  
  // Generate a realistic example instance name
  const exampleName = `Example${name}`;
  
  // Generate examples for different formats
  const jsonLdExample = generateJsonLdExample(type, name, label, comment, properties, range, domain, baseUrl, exampleName);
  const turtleExample = generateTurtleExample(type, name, label, comment, properties, range, domain, baseUrl, exampleName);
  const rdfaExample = generateRDFaExample(type, name, label, comment, properties, range, domain, baseUrl, exampleName);
  const microdataExample = generateMicrodataExample(type, name, label, comment, properties, range, domain, baseUrl, exampleName);
  
  // Generate additional formats
  const jsonSchemaExample = generateJsonSchemaExample(type, name, label, comment, properties, range, domain, baseUrl);
  const nTriplesExample = generateNTriplesExample(type, name, label, comment, properties, range, domain, baseUrl, exampleName);
  const xmlRdfExample = generateXMLRDFExample(type, name, label, comment, properties, range, domain, baseUrl, exampleName);

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-6">Implementation Examples</h2>
      <p className="mb-6 text-muted-foreground">
        Below are examples of how to implement {isClass ? "the" : "properties related to"} {name} {isClass ? "class" : "property"} in different formats.
      </p>

      <Tabs defaultValue="json-ld" className="w-full">
        <div className="border-b overflow-x-auto pb-1">
          <TabsList className="flex flex-nowrap w-max">
            <TabsTrigger value="json-ld" className="min-w-[90px]">JSON-LD</TabsTrigger>
            <TabsTrigger value="turtle" className="min-w-[90px]">Turtle</TabsTrigger>
            <TabsTrigger value="rdfa" className="min-w-[90px]">RDFa</TabsTrigger>
            <TabsTrigger value="microdata" className="min-w-[90px]">Microdata</TabsTrigger>
            <TabsTrigger value="json-schema" className="min-w-[90px]">JSON Schema</TabsTrigger>
            <TabsTrigger value="n-triples" className="min-w-[90px]">N-Triples</TabsTrigger>
            <TabsTrigger value="xml-rdf" className="min-w-[90px]">XML/RDF</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="json-ld" className="mt-6">
          <div className="bg-muted rounded-lg p-4 relative max-w-full overflow-hidden">
            <pre className="text-sm whitespace-pre-wrap break-all overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">{jsonLdExample}</pre>
          </div>
        </TabsContent>
        
        <TabsContent value="turtle" className="mt-6">
          <div className="bg-muted rounded-lg p-4 relative max-w-full overflow-hidden">
            <pre className="text-sm whitespace-pre-wrap break-all overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">{turtleExample}</pre>
          </div>
        </TabsContent>
        
        <TabsContent value="rdfa" className="mt-6">
          <div className="bg-muted rounded-lg p-4 relative max-w-full overflow-hidden">
            <pre className="text-sm whitespace-pre-wrap break-all overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">{rdfaExample}</pre>
          </div>
        </TabsContent>
        
        <TabsContent value="microdata" className="mt-6">
          <div className="bg-muted rounded-lg p-4 relative max-w-full overflow-hidden">
            <pre className="text-sm whitespace-pre-wrap break-all overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">{microdataExample}</pre>
          </div>
        </TabsContent>
        
        <TabsContent value="json-schema" className="mt-6">
          <div className="bg-muted rounded-lg p-4 relative max-w-full overflow-hidden">
            <pre className="text-sm whitespace-pre-wrap break-all overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">{jsonSchemaExample}</pre>
          </div>
        </TabsContent>
        
        <TabsContent value="n-triples" className="mt-6">
          <div className="bg-muted rounded-lg p-4 relative max-w-full overflow-hidden">
            <pre className="text-sm whitespace-pre-wrap break-all overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">{nTriplesExample}</pre>
          </div>
        </TabsContent>
        
        <TabsContent value="xml-rdf" className="mt-6">
          <div className="bg-muted rounded-lg p-4 relative max-w-full overflow-hidden">
            <pre className="text-sm whitespace-pre-wrap break-all overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">{xmlRdfExample}</pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Generate a JSON-LD example
function generateJsonLdExample(
  type: string, 
  name: string, 
  label?: string, 
  comment?: string, 
  properties: string[] = [], 
  range: string[] = [], 
  domain: string[] = [],
  baseUrl: string = "http://oerschema.org/",
  exampleName: string = ""
) {
  if (type === "Class") {
    // Class example
    const classObj: any = {
      "@context": {
        "oer": baseUrl,
        "schema": "http://schema.org/"
      },
      "@type": `oer:${name}`
    };
    
    // Add some example properties
    if (properties.length) {
      // Use just a few properties to keep the example concise
      const sampleProps = properties.slice(0, Math.min(3, properties.length));
      
      sampleProps.forEach(prop => {
        classObj[`oer:${prop}`] = getSampleValueForProperty(prop);
      });
    } else {
      // Add some generic properties if none specified
      classObj["oer:name"] = exampleName;
      if (comment) {
        classObj["oer:description"] = comment;
      }
    }

    return JSON.stringify(classObj, null, 2);
  } else {
    // Property example
    const propExample: any = {
      "@context": {
        "oer": baseUrl,
        "schema": "http://schema.org/"
      }
    };
    
    // If the property has domains, create an example for the first domain
    if (domain.length > 0) {
      const sampleDomain = domain[0].replace(/^http:\/\//, "").split("/").pop() || "Resource";
      propExample["@type"] = `oer:${sampleDomain}`;
      propExample[`oer:${name}`] = getSampleValueForProperty(name, range);
    } else {
      propExample["@type"] = "oer:Resource";
      propExample[`oer:${name}`] = getSampleValueForProperty(name, range);
    }
    
    return JSON.stringify(propExample, null, 2);
  }
}

// Generate a Turtle example
function generateTurtleExample(
  type: string, 
  name: string, 
  label?: string, 
  comment?: string, 
  properties: string[] = [], 
  range: string[] = [], 
  domain: string[] = [],
  baseUrl: string = "http://oerschema.org/",
  exampleName: string = ""
) {
  const oerPrefix = baseUrl;
  let turtle = `@prefix oer: <${oerPrefix}> .\n`;
  turtle += '@prefix schema: <http://schema.org/> .\n';
  turtle += '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n';

  if (type === "Class") {
    // Class example
    const resourceId = exampleName.replace(/\s+/g, '_');
    turtle += `# Example of an oer:${name}\n`;
    turtle += `<http://example.org/resources/${resourceId}> a oer:${name} ;\n`;
    
    if (properties.length) {
      // Use just a few properties to keep the example concise
      const sampleProps = properties.slice(0, Math.min(3, properties.length));
      
      sampleProps.forEach((prop, index) => {
        const isLast = index === sampleProps.length - 1;
        const value = getTurtleValueForProperty(prop);
        turtle += `    oer:${prop} ${value}${isLast ? ' .' : ' ;'}\n`;
      });
    } else {
      // Add some generic properties if none specified
      turtle += `    oer:name "${exampleName}" ;\n`;
      if (comment) {
        turtle += `    oer:description "${comment.replace(/"/g, '\\"')}" .\n`;
      } else {
        turtle += '    oer:description "An example resource" .\n';
      }
    }
    
  } else {
    // Property example
    const sampleDomain = domain.length > 0 ? 
      domain[0].replace(/^http:\/\//, "").split("/").pop() || "Resource" : 
      "Resource";
    
    const resourceId = `Example${sampleDomain}`;
    turtle += `# Example of using oer:${name} property\n`;
    turtle += `<http://example.org/resources/${resourceId}> a oer:${sampleDomain} ;\n`;
    turtle += `    oer:${name} ${getTurtleValueForProperty(name, range)} .\n`;
  }
  
  return turtle;
}

// Generate an RDFa example
function generateRDFaExample(
  type: string, 
  name: string, 
  label?: string, 
  comment?: string, 
  properties: string[] = [], 
  range: string[] = [], 
  domain: string[] = [],
  baseUrl: string = "http://oerschema.org/",
  exampleName: string = ""
) {
  if (type === "Class") {
    // Class example
    let rdfa = '<div prefix="oer: http://oerschema.org/ schema: http://schema.org/"\n';
    rdfa += `     typeof="oer:${name}"\n`;
    rdfa += '     resource="http://example.org/resources/example1">\n';
    
    if (properties.length > 0) {
      // Use just a few properties to keep the example concise
      const sampleProps = properties.slice(0, Math.min(3, properties.length));
      
      sampleProps.forEach(prop => {
        if (isSimpleValueProperty(prop)) {
          rdfa += `  <span property="oer:${prop}">${getSampleValueForProperty(prop, null, true)}</span>\n`;
        } else {
          rdfa += `  <div property="oer:${prop}" resource="#${prop}_value">${getSampleValueForProperty(prop, null, true)}</div>\n`;
        }
      });
    } else {
      // Add some generic properties if none specified
      rdfa += `  <h2 property="oer:name">${exampleName}</h2>\n`;
      if (comment) {
        rdfa += `  <p property="oer:description">${comment}</p>\n`;
      }
    }
    
    rdfa += '</div>';
    return rdfa;
    
  } else {
    // Property example
    const sampleDomain = domain.length > 0 ? 
      domain[0].replace(/^http:\/\//, "").split("/").pop() || "Resource" : 
      "Resource";
    
    let rdfa = '<div prefix="oer: http://oerschema.org/ schema: http://schema.org/"\n';
    rdfa += `     typeof="oer:${sampleDomain}"\n`;
    rdfa += '     resource="http://example.org/resources/example1">\n';
    
    const propValue = getSampleValueForProperty(name, range, true);
    
    if (range.some(r => !r.includes('http://') || r.includes('schema.org'))) {
      // If the range includes a class, use a nested resource
      rdfa += `  <div property="oer:${name}" resource="#${name}_value">\n`;
      rdfa += `    ${propValue}\n`;
      rdfa += '  </div>\n';
    } else {
      // Otherwise, use a simple property
      rdfa += `  <span property="oer:${name}">${propValue}</span>\n`;
    }
    
    rdfa += '</div>';
    return rdfa;
  }
}

// Generate a Microdata example
function generateMicrodataExample(
  type: string, 
  name: string, 
  label?: string, 
  comment?: string, 
  properties: string[] = [], 
  range: string[] = [], 
  domain: string[] = [],
  baseUrl: string = "http://oerschema.org/",
  exampleName: string = ""
) {
  if (type === "Class") {
    // Class example
    let microdata = `<div itemscope itemtype="${baseUrl}${name}">\n`;
    
    if (properties.length > 0) {
      // Use just a few properties to keep the example concise
      const sampleProps = properties.slice(0, Math.min(3, properties.length));
      
      sampleProps.forEach(prop => {
        if (isSimpleValueProperty(prop)) {
          microdata += `  <span itemprop="${prop}">${getSampleValueForProperty(prop, null, true)}</span>\n`;
        } else {
          microdata += `  <div itemprop="${prop}">${getSampleValueForProperty(prop, null, true)}</div>\n`;
        }
      });
    } else {
      // Add some generic properties if none specified
      microdata += `  <h2 itemprop="name">${exampleName}</h2>\n`;
      if (comment) {
        microdata += `  <p itemprop="description">${comment}</p>\n`;
      }
    }
    
    microdata += '</div>';
    return microdata;
    
  } else {
    // Property example
    const sampleDomain = domain.length > 0 ? 
      domain[0].replace(/^http:\/\//, "").split("/").pop() || "Resource" : 
      "Resource";
    
    let microdata = `<div itemscope itemtype="${baseUrl}${sampleDomain}">\n`;
    
    const propValue = getSampleValueForProperty(name, range, true);
    
    if (range.some(r => !r.includes('http://') || r.includes('schema.org'))) {
      // If the range includes a class, use a nested item
      microdata += `  <div itemprop="${name}" itemscope itemtype="${baseUrl}${range[0]}">\n`;
      microdata += `    ${propValue}\n`;
      microdata += '  </div>\n';
    } else {
      // Otherwise, use a simple property
      microdata += `  <span itemprop="${name}">${propValue}</span>\n`;
    }
    
    microdata += '</div>';
    return microdata;
  }
}

// Generate a JSON Schema example
function generateJsonSchemaExample(
  type: string, 
  name: string, 
  label?: string, 
  comment?: string, 
  properties: string[] = [], 
  range: string[] = [], 
  domain: string[] = [],
  baseUrl: string = "http://oerschema.org/"
) {
  if (type === "Class") {
    // JSON Schema for a class
    const schema: any = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": `${baseUrl}${name}.schema.json`,
      "title": label || name,
      "description": comment || `Schema for the ${name} class`,
      "type": "object",
      "properties": {
        "@context": {
          "type": "object",
          "properties": {
            "oer": { "type": "string", "format": "uri" },
            "schema": { "type": "string", "format": "uri" }
          },
          "required": ["oer"]
        },
        "@type": {
          "type": "string",
          "const": `oer:${name}`
        }
      },
      "required": ["@context", "@type"]
    };
    
    if (properties.length > 0) {
      // Add selected properties to the schema
      properties.forEach(prop => {
        schema.properties[`oer:${prop}`] = getJsonSchemaTypeForProperty(prop);
      });
    }
    
    return JSON.stringify(schema, null, 2);
  } else {
    // JSON Schema for a property
    // Create an example schema showing how to use this property in an object
    const schema: any = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": `${baseUrl}${name}.schema.json`,
      "title": label || name,
      "description": comment || `Schema for objects using the ${name} property`,
      "type": "object",
      "properties": {
        "@context": {
          "type": "object",
          "properties": {
            "oer": { "type": "string", "format": "uri" }
          },
          "required": ["oer"]
        }
      },
      "required": ["@context"]
    };
    
    // If the property has domains, create a schema for the first domain
    if (domain.length > 0) {
      const sampleDomain = domain[0].replace(/^http:\/\//, "").split("/").pop() || "Resource";
      schema.properties["@type"] = {
        "type": "string",
        "const": `oer:${sampleDomain}`
      };
      schema.properties[`oer:${name}`] = getJsonSchemaTypeForProperty(name, range);
      schema.required.push("@type", `oer:${name}`);
    } else {
      schema.properties["@type"] = {
        "type": "string",
        "description": "Type of the resource"
      };
      schema.properties[`oer:${name}`] = getJsonSchemaTypeForProperty(name, range);
      schema.required.push("@type", `oer:${name}`);
    }
    
    return JSON.stringify(schema, null, 2);
  }
}

// Generate N-Triples example
function generateNTriplesExample(
  type: string, 
  name: string, 
  label?: string, 
  comment?: string, 
  properties: string[] = [], 
  range: string[] = [], 
  domain: string[] = [],
  baseUrl: string = "http://oerschema.org/",
  exampleName: string = ""
) {
  const resourceBaseUri = "http://example.org/resources/";
  const resourceId = exampleName.replace(/\s+/g, '_');
  const resourceUri = `<${resourceBaseUri}${resourceId}>`;
  const oerUri = `<${baseUrl}>`;
  let ntriples = "";

  if (type === "Class") {
    // Add type triple
    ntriples += `${resourceUri} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${baseUrl}${name}> .\n`;
    
    // Add properties
    if (properties.length > 0) {
      // Use just a few properties for a concise example
      const sampleProps = properties.slice(0, Math.min(3, properties.length));
      
      sampleProps.forEach(prop => {
        const value = getNTriplesValueForProperty(prop);
        ntriples += `${resourceUri} <${baseUrl}${prop}> ${value} .\n`;
      });
    } else {
      // Add some generic properties
      ntriples += `${resourceUri} <${baseUrl}name> "${exampleName}" .\n`;
      if (comment) {
        ntriples += `${resourceUri} <${baseUrl}description> "${comment.replace(/"/g, '\\"')}" .\n`;
      }
    }
  } else {
    // Property example
    const sampleDomain = domain.length > 0 ? 
      domain[0].replace(/^http:\/\//, "").split("/").pop() || "Resource" : 
      "Resource";
    
    // Add type triple for the domain class
    ntriples += `${resourceUri} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${baseUrl}${sampleDomain}> .\n`;
    
    // Add the property
    const value = getNTriplesValueForProperty(name, range);
    ntriples += `${resourceUri} <${baseUrl}${name}> ${value} .\n`;
  }

  return ntriples;
}

// Generate XML/RDF example
function generateXMLRDFExample(
  type: string, 
  name: string, 
  label?: string, 
  comment?: string, 
  properties: string[] = [], 
  range: string[] = [], 
  domain: string[] = [],
  baseUrl: string = "http://oerschema.org/",
  exampleName: string = ""
) {
  const resourceId = exampleName.replace(/\s+/g, '_');
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n';
  xml += '         xmlns:oer="http://oerschema.org/"\n';
  xml += '         xmlns:schema="http://schema.org/">\n\n';
  
  if (type === "Class") {
    xml += `  <oer:${name} rdf:about="http://example.org/resources/${resourceId}">\n`;
    
    if (properties.length > 0) {
      // Use just a few properties for a concise example
      const sampleProps = properties.slice(0, Math.min(3, properties.length));
      
      sampleProps.forEach(prop => {
        const value = getXMLValueForProperty(prop);
        xml += `    <oer:${prop}>${value}</oer:${prop}>\n`;
      });
    } else {
      // Add some generic properties
      xml += `    <oer:name>${exampleName}</oer:name>\n`;
      if (comment) {
        xml += `    <oer:description>${escapeXml(comment)}</oer:description>\n`;
      }
    }
    
    xml += `  </oer:${name}>\n`;
  } else {
    // Property example
    const sampleDomain = domain.length > 0 ? 
      domain[0].replace(/^http:\/\//, "").split("/").pop() || "Resource" : 
      "Resource";
    
    xml += `  <oer:${sampleDomain} rdf:about="http://example.org/resources/${resourceId}">\n`;
    
    // Add the property
    if (range.some(r => !r.includes('http://') || r.includes('schema.org'))) {
      // Complex object property
      const rangeClass = range[0].replace(/^http:\/\//, "").split("/").pop() || "Thing";
      
      xml += `    <oer:${name}>\n`;
      xml += `      <oer:${rangeClass} rdf:about="http://example.org/resources/${name}_value">\n`;
      xml += `        <oer:name>Sample ${rangeClass}</oer:name>\n`;
      xml += `      </oer:${rangeClass}>\n`;
      xml += `    </oer:${name}>\n`;
    } else {
      // Simple value property
      const value = getXMLValueForProperty(name, range);
      xml += `    <oer:${name}>${value}</oer:${name}>\n`;
    }
    
    xml += `  </oer:${sampleDomain}>\n`;
  }
  
  xml += '</rdf:RDF>';
  return xml;
}

// Helper for JSON Schema types
function getJsonSchemaTypeForProperty(propName: string, range: string[] = []): any {
  if (propName.includes('date')) {
    return { "type": "string", "format": "date" };
  } else if (propName.includes('count') || propName.includes('number')) {
    return { "type": "integer" };
  } else if (propName.includes('percent') || propName.includes('score')) {
    return { "type": "number" };
  } else if (propName.includes('enabled') || propName.includes('active') || 
             propName.includes('visible') || propName.includes('disabled') || 
             propName.includes('inactive') || propName.includes('hidden')) {
    return { "type": "boolean" };
  } else if (propName.includes('url') || propName.includes('link') || propName.includes('uri')) {
    return { "type": "string", "format": "uri" };
  } else if (propName.includes('email')) {
    return { "type": "string", "format": "email" };
  } else if (range && range.length) {
    const firstRange = range[0];
    
    if (firstRange.includes('Date')) {
      return { "type": "string", "format": "date" };
    } else if (firstRange.includes('Boolean')) {
      return { "type": "boolean" };
    } else if (firstRange.includes('Number')) {
      return { "type": "number" };
    } else if (firstRange.includes('Integer')) {
      return { "type": "integer" };
    } else if (firstRange.includes('URL')) {
      return { "type": "string", "format": "uri" };
    } else if (!firstRange.includes('Text') && !firstRange.includes('String') && 
              (!firstRange.includes('http://') || firstRange.includes('schema.org'))) {
      // It's a reference to another class
      return { "$ref": `#/definitions/${firstRange.split('/').pop()}` };
    }
  }
  
  // Default is string
  return { "type": "string" };
}

// Helper for Turtle values
function getTurtleValueForProperty(propName: string, range: string[] = []): string {
  if (propName.includes('date')) {
    return '"2025-05-09"^^xsd:date';
  } else if (propName.includes('count') || propName.includes('number') || 
             propName.includes('percent') || propName.includes('score')) {
    return '"42"^^xsd:integer';
  } else if (propName.includes('enabled') || propName.includes('active') || 
             propName.includes('visible') || propName.includes('disabled') || 
             propName.includes('inactive') || propName.includes('hidden')) {
    return '"true"^^xsd:boolean';
  } else if (propName.includes('url') || propName.includes('link') || propName.includes('uri')) {
    return '<https://example.org/resource>';
  } else if (range && range.length) {
    const firstRange = range[0];
    
    if (firstRange.includes('Date')) {
      return '"2025-05-09"^^xsd:date';
    } else if (firstRange.includes('Boolean')) {
      return '"true"^^xsd:boolean';
    } else if (firstRange.includes('Number') || firstRange.includes('Integer')) {
      return '"42"^^xsd:integer';
    } else if (firstRange.includes('URL')) {
      return '<https://example.org/resource>';
    } else if (!firstRange.includes('Text') && !firstRange.includes('String') && 
              (!firstRange.includes('http://') || firstRange.includes('schema.org'))) {
      // It's a reference to another class
      const className = firstRange.split('/').pop();
      return `<http://example.org/resources/Example${className}>`;
    }
  }
  
  // Default for strings
  return '"Sample value"';
}

// Helper for N-Triples values
function getNTriplesValueForProperty(propName: string, range: string[] = []): string {
  if (propName.includes('date')) {
    return '"2025-05-09"^^<http://www.w3.org/2001/XMLSchema#date>';
  } else if (propName.includes('count') || propName.includes('number') || 
             propName.includes('percent') || propName.includes('score')) {
    return '"42"^^<http://www.w3.org/2001/XMLSchema#integer>';
  } else if (propName.includes('enabled') || propName.includes('active') || 
             propName.includes('visible') || propName.includes('disabled') || 
             propName.includes('inactive') || propName.includes('hidden')) {
    return '"true"^^<http://www.w3.org/2001/XMLSchema#boolean>';
  } else if (propName.includes('url') || propName.includes('link') || propName.includes('uri')) {
    return '<https://example.org/resource>';
  } else if (range && range.length) {
    const firstRange = range[0];
    
    if (firstRange.includes('Date')) {
      return '"2025-05-09"^^<http://www.w3.org/2001/XMLSchema#date>';
    } else if (firstRange.includes('Boolean')) {
      return '"true"^^<http://www.w3.org/2001/XMLSchema#boolean>';
    } else if (firstRange.includes('Number') || firstRange.includes('Integer')) {
      return '"42"^^<http://www.w3.org/2001/XMLSchema#integer>';
    } else if (firstRange.includes('URL')) {
      return '<https://example.org/resource>';
    } else if (!firstRange.includes('Text') && !firstRange.includes('String') && 
              (!firstRange.includes('http://') || firstRange.includes('schema.org'))) {
      // It's a reference to another class
      const className = firstRange.split('/').pop();
      return `<http://example.org/resources/Example${className}>`;
    }
  }
  
  // Default for strings
  return `"Sample value"`;
}

// Helper for XML values
function getXMLValueForProperty(propName: string, range: string[] = []): string {
  if (propName.includes('date')) {
    return '2025-05-09';
  } else if (propName.includes('count') || propName.includes('number') || 
             propName.includes('percent') || propName.includes('score')) {
    return '42';
  } else if (propName.includes('enabled') || propName.includes('active') || 
             propName.includes('visible') || propName.includes('disabled') || 
             propName.includes('inactive') || propName.includes('hidden')) {
    return 'true';
  } else if (propName.includes('url') || propName.includes('link') || propName.includes('uri')) {
    return 'https://example.org/resource';
  } else if (propName.includes('email')) {
    return 'example@example.org';
  } else if (range && range.length) {
    const firstRange = range[0];
    
    if (firstRange.includes('Date')) {
      return '2025-05-09';
    } else if (firstRange.includes('Boolean')) {
      return 'true';
    } else if (firstRange.includes('Number') || firstRange.includes('Integer')) {
      return '42';
    } else if (firstRange.includes('Text') || firstRange.includes('String')) {
      return 'Sample text value';
    } else {
      return 'Sample value';
    }
  } else {
    return 'Sample value';
  }
}

// Helper to escape special XML characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Helper function to generate a sample property value
function getSampleValueForProperty(propName: string, range: string[] = [], isHtml = false): string | number | boolean {
  // Generate sample values based on property name
  if (propName.includes('name') || propName.includes('title') || propName.includes('label')) {
    return 'Sample Name';
  } else if (propName.includes('description') || propName.includes('comment') || propName.includes('text')) {
    return 'This is a sample description for the resource.';
  } else if (propName.includes('date')) {
    return '2025-05-09';
  } else if (propName.includes('url') || propName.includes('link') || propName.includes('uri')) {
    return isHtml ? '<a href="https://example.org/resource">https://example.org/resource</a>' : 'https://example.org/resource';
  } else if (propName.includes('email')) {
    return 'example@example.org';
  } else if (propName.includes('count') || propName.includes('number')) {
    return 42;
  } else if (propName.includes('percent') || propName.includes('score')) {
    return 85;
  } else if (propName.includes('enabled') || propName.includes('active') || propName.includes('visible')) {
    return true;
  } else if (propName.includes('disabled') || propName.includes('inactive') || propName.includes('hidden')) {
    return false;
  } else if (propName.includes('author') || propName.includes('creator') || propName.includes('contributor')) {
    return isHtml ? '<span>John Doe</span>' : 'John Doe';
  } else if (range && range.length) {
    // If we have range information, use that to generate a sample value
    const firstRange = range[0];
    
    if (firstRange.includes('Date')) {
      return '2025-05-09';
    } else if (firstRange.includes('Boolean')) {
      return true;
    } else if (firstRange.includes('Number') || firstRange.includes('Integer')) {
      return 42;
    } else if (firstRange.includes('Text') || firstRange.includes('String')) {
      return 'Sample text value';
    } else {
      // It's a reference to another class
      const className = firstRange.split('/').pop();
      return isHtml ? `<span>Example ${className}</span>` : `Example ${className}`;
    }
  }
  
  // Default value for any other property
  return 'Sample value';
}

// Helper to determine if a property likely takes a simple value or a complex object
function isSimpleValueProperty(propName: string): boolean {
  const complexProps = ['author', 'creator', 'contributor', 'person', 'organization', 
                        'location', 'address', 'place', 'image', 'video', 'audio'];
  
  return !complexProps.some(term => propName.toLowerCase().includes(term));
}