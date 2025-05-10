import { Schema } from "./types";

interface FormatOptions {
  baseUrl?: string;
  pretty?: boolean;
}

export function classToJsonLd(className: string, classData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  const jsonLd = {
    "@context": {
      "oer": baseUrl,
      "schema": "http://schema.org/",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "subClassOf": { "@id": "rdfs:subClassOf", "@type": "@id" },
      "comment": "rdfs:comment",
      "label": "rdfs:label",
      "properties": { "@id": "oer:properties", "@container": "@list" },
      "range": { "@id": "rdfs:range", "@type": "@id", "@container": "@list" },
      "domain": { "@id": "rdfs:domain", "@type": "@id", "@container": "@list" }
    },
    "@id": `${baseUrl}${className}`,
    "@type": "rdfs:Class",
    "label": classData.label || className,
    "subClassOf": classData.subClassOf.map((parent: string) => {
      return parent.startsWith('http://') ? parent : `${baseUrl}${parent}`;
    })
  };
  
  if (classData.comment) {
    jsonLd["comment"] = classData.comment;
  }
  
  if (classData.properties && classData.properties.length > 0) {
    jsonLd["properties"] = classData.properties;
  }
  
  return options.pretty ? JSON.stringify(jsonLd, null, 2) : JSON.stringify(jsonLd);
}

export function classToXml(className: string, classData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n';
  xml += '         xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\n';
  xml += `         xmlns:oer="${baseUrl}"\n`;
  xml += '         xmlns:schema="http://schema.org/">\n\n';
  
  xml += `  <rdfs:Class rdf:about="${baseUrl}${className}">\n`;
  
  // Add label
  if (classData.label) {
    xml += `    <rdfs:label>${escapeXml(classData.label)}</rdfs:label>\n`;
  }
  
  // Add comment
  if (classData.comment) {
    xml += `    <rdfs:comment>${escapeXml(classData.comment)}</rdfs:comment>\n`;
  }
  
  // Add parent classes
  for (const parent of classData.subClassOf) {
    const parentUri = parent.startsWith('http://') ? parent : `${baseUrl}${parent}`;
    xml += `    <rdfs:subClassOf rdf:resource="${parentUri}"/>\n`;
  }
  
  // Add properties
  if (classData.properties && classData.properties.length > 0) {
    for (const prop of classData.properties) {
      xml += `    <oer:properties>${prop}</oer:properties>\n`;
    }
  }
  
  xml += '  </rdfs:Class>\n';
  xml += '</rdf:RDF>';
  
  return xml;
}

export function classToTurtle(className: string, classData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let turtle = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`;
  turtle += `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`;
  turtle += `@prefix oer: <${baseUrl}> .\n`;
  turtle += `@prefix schema: <http://schema.org/> .\n\n`;
  
  turtle += `oer:${className} a rdfs:Class`;
  
  // Add label
  if (classData.label) {
    turtle += ` ;\n    rdfs:label "${classData.label}"`;
  }
  
  // Add comment
  if (classData.comment) {
    turtle += ` ;\n    rdfs:comment "${escapeTurtle(classData.comment)}"`;
  }
  
  // Add parent classes
  if (classData.subClassOf && classData.subClassOf.length > 0) {
    for (let i = 0; i < classData.subClassOf.length; i++) {
      const parent = classData.subClassOf[i];
      const parentUri = parent.startsWith('http://') ? `<${parent}>` : `oer:${parent}`;
      turtle += ` ;\n    rdfs:subClassOf ${parentUri}`;
    }
  }
  
  // Add properties
  if (classData.properties && classData.properties.length > 0) {
    for (let i = 0; i < classData.properties.length; i++) {
      turtle += ` ;\n    oer:properties "${classData.properties[i]}"`;
    }
  }
  
  turtle += ' .\n';
  
  return turtle;
}

export function propertyToJsonLd(propertyName: string, propertyData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  const jsonLd = {
    "@context": {
      "oer": baseUrl,
      "schema": "http://schema.org/",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "comment": "rdfs:comment",
      "label": "rdfs:label",
      "range": { "@id": "rdfs:range", "@type": "@id", "@container": "@list" },
      "domain": { "@id": "rdfs:domain", "@type": "@id", "@container": "@list" }
    },
    "@id": `${baseUrl}${propertyName}`,
    "@type": "rdf:Property",
    "label": propertyData.label || propertyName,
    "range": propertyData.range.map((type: string) => {
      return type.startsWith('http://') ? type : `${baseUrl}${type}`;
    }),
    "domain": propertyData.domain.map((domain: string) => {
      return domain.startsWith('http://') ? domain : `${baseUrl}${domain}`;
    })
  };
  
  if (propertyData.comment) {
    jsonLd["comment"] = propertyData.comment;
  }
  
  return options.pretty ? JSON.stringify(jsonLd, null, 2) : JSON.stringify(jsonLd);
}

export function propertyToXml(propertyName: string, propertyData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n';
  xml += '         xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\n';
  xml += `         xmlns:oer="${baseUrl}"\n`;
  xml += '         xmlns:schema="http://schema.org/">\n\n';
  
  xml += `  <rdf:Property rdf:about="${baseUrl}${propertyName}">\n`;
  
  // Add label
  if (propertyData.label) {
    xml += `    <rdfs:label>${escapeXml(propertyData.label)}</rdfs:label>\n`;
  }
  
  // Add comment
  if (propertyData.comment) {
    xml += `    <rdfs:comment>${escapeXml(propertyData.comment)}</rdfs:comment>\n`;
  }
  
  // Add range
  for (const range of propertyData.range) {
    const rangeUri = range.startsWith('http://') ? range : `${baseUrl}${range}`;
    xml += `    <rdfs:range rdf:resource="${rangeUri}"/>\n`;
  }
  
  // Add domain
  for (const domain of propertyData.domain) {
    const domainUri = domain.startsWith('http://') ? domain : `${baseUrl}${domain}`;
    xml += `    <rdfs:domain rdf:resource="${domainUri}"/>\n`;
  }
  
  xml += '  </rdf:Property>\n';
  xml += '</rdf:RDF>';
  
  return xml;
}

export function propertyToTurtle(propertyName: string, propertyData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let turtle = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`;
  turtle += `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`;
  turtle += `@prefix oer: <${baseUrl}> .\n`;
  turtle += `@prefix schema: <http://schema.org/> .\n\n`;
  
  turtle += `oer:${propertyName} a rdf:Property`;
  
  // Add label
  if (propertyData.label) {
    turtle += ` ;\n    rdfs:label "${propertyData.label}"`;
  }
  
  // Add comment
  if (propertyData.comment) {
    turtle += ` ;\n    rdfs:comment "${escapeTurtle(propertyData.comment)}"`;
  }
  
  // Add range
  if (propertyData.range && propertyData.range.length > 0) {
    for (let i = 0; i < propertyData.range.length; i++) {
      const range = propertyData.range[i];
      const rangeUri = range.startsWith('http://') ? `<${range}>` : `oer:${range}`;
      turtle += ` ;\n    rdfs:range ${rangeUri}`;
    }
  }
  
  // Add domain
  if (propertyData.domain && propertyData.domain.length > 0) {
    for (let i = 0; i < propertyData.domain.length; i++) {
      const domain = propertyData.domain[i];
      const domainUri = domain.startsWith('http://') ? `<${domain}>` : `oer:${domain}`;
      turtle += ` ;\n    rdfs:domain ${domainUri}`;
    }
  }
  
  turtle += ' .\n';
  
  return turtle;
}

// JSON Schema Converters
export function classToJsonSchema(className: string, classData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": `${baseUrl}${className}.schema.json`,
    "title": classData.label || className,
    "description": classData.comment || `Schema for the ${className} class`,
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
        "const": `oer:${className}`
      }
    },
    "required": ["@context", "@type"]
  };
  
  if (classData.properties && classData.properties.length > 0) {
    classData.properties.forEach((prop: string) => {
      schema.properties[`oer:${prop}`] = {
        "type": "string"
      };
    });
  }
  
  return options.pretty ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
}

export function propertyToJsonSchema(propertyName: string, propertyData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": `${baseUrl}${propertyName}.schema.json`,
    "title": propertyData.label || propertyName,
    "description": propertyData.comment || `Schema for objects using the ${propertyName} property`,
    "type": "object",
    "properties": {
      "@context": {
        "type": "object",
        "properties": {
          "oer": { "type": "string", "format": "uri" }
        },
        "required": ["oer"]
      },
      "@type": {
        "type": "string",
        "description": "Type of the resource"
      }
    },
    "required": ["@context", "@type"]
  };
  
  schema.properties[`oer:${propertyName}`] = { 
    "type": "string",
    "description": propertyData.comment || `The ${propertyName} property`
  };
  
  schema.required.push(`oer:${propertyName}`);
  
  return options.pretty ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
}

// N-Triples Converters
export function classToNTriples(className: string, classData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  let triples = "";
  
  // Type declaration
  triples += `<${baseUrl}${className}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .\n`;
  
  // Label
  if (classData.label) {
    triples += `<${baseUrl}${className}> <http://www.w3.org/2000/01/rdf-schema#label> "${classData.label}" .\n`;
  }
  
  // Comment
  if (classData.comment) {
    triples += `<${baseUrl}${className}> <http://www.w3.org/2000/01/rdf-schema#comment> "${escapeNTriples(classData.comment)}" .\n`;
  }
  
  // Parent classes
  classData.subClassOf.forEach((parent: string) => {
    const parentUri = parent.startsWith('http://') ? parent : `${baseUrl}${parent}`;
    triples += `<${baseUrl}${className}> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <${parentUri}> .\n`;
  });
  
  // Properties
  if (classData.properties && classData.properties.length > 0) {
    classData.properties.forEach((prop: string) => {
      triples += `<${baseUrl}${className}> <${baseUrl}properties> "${prop}" .\n`;
    });
  }
  
  return triples;
}

export function propertyToNTriples(propertyName: string, propertyData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  let triples = "";
  
  // Type declaration
  triples += `<${baseUrl}${propertyName}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> .\n`;
  
  // Label
  if (propertyData.label) {
    triples += `<${baseUrl}${propertyName}> <http://www.w3.org/2000/01/rdf-schema#label> "${propertyData.label}" .\n`;
  }
  
  // Comment
  if (propertyData.comment) {
    triples += `<${baseUrl}${propertyName}> <http://www.w3.org/2000/01/rdf-schema#comment> "${escapeNTriples(propertyData.comment)}" .\n`;
  }
  
  // Range
  propertyData.range.forEach((range: string) => {
    const rangeUri = range.startsWith('http://') ? range : `${baseUrl}${range}`;
    triples += `<${baseUrl}${propertyName}> <http://www.w3.org/2000/01/rdf-schema#range> <${rangeUri}> .\n`;
  });
  
  // Domain
  propertyData.domain.forEach((domain: string) => {
    const domainUri = domain.startsWith('http://') ? domain : `${baseUrl}${domain}`;
    triples += `<${baseUrl}${propertyName}> <http://www.w3.org/2000/01/rdf-schema#domain> <${domainUri}> .\n`;
  });
  
  return triples;
}

// RDFa Converters
export function classToRDFa(className: string, classData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let rdfa = '<!DOCTYPE html>\n<html>\n<head>\n  <title>' + (classData.label || className) + '</title>\n</head>\n<body>\n';
  
  rdfa += '  <div prefix="oer: ' + baseUrl + ' rdfs: http://www.w3.org/2000/01/rdf-schema#"\n';
  rdfa += '       typeof="rdfs:Class"\n';
  rdfa += '       resource="' + baseUrl + className + '">\n';
  
  // Label
  if (classData.label) {
    rdfa += `    <h1 property="rdfs:label">${classData.label}</h1>\n`;
  }
  
  // Comment
  if (classData.comment) {
    rdfa += `    <p property="rdfs:comment">${escapeHtml(classData.comment)}</p>\n`;
  }
  
  // Parent classes
  if (classData.subClassOf && classData.subClassOf.length > 0) {
    rdfa += '    <div>\n';
    rdfa += '      <h2>Inherits from:</h2>\n';
    rdfa += '      <ul>\n';
    
    classData.subClassOf.forEach((parent: string) => {
      const parentUri = parent.startsWith('http://') ? parent : `${baseUrl}${parent}`;
      rdfa += `        <li><a property="rdfs:subClassOf" href="${parentUri}">${parent}</a></li>\n`;
    });
    
    rdfa += '      </ul>\n';
    rdfa += '    </div>\n';
  }
  
  // Properties
  if (classData.properties && classData.properties.length > 0) {
    rdfa += '    <div>\n';
    rdfa += '      <h2>Properties:</h2>\n';
    rdfa += '      <ul>\n';
    
    classData.properties.forEach((prop: string) => {
      rdfa += `        <li property="oer:properties">${prop}</li>\n`;
    });
    
    rdfa += '      </ul>\n';
    rdfa += '    </div>\n';
  }
  
  rdfa += '  </div>\n';
  rdfa += '</body>\n</html>';
  
  return rdfa;
}

export function propertyToRDFa(propertyName: string, propertyData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let rdfa = '<!DOCTYPE html>\n<html>\n<head>\n  <title>' + (propertyData.label || propertyName) + '</title>\n</head>\n<body>\n';
  
  rdfa += '  <div prefix="oer: ' + baseUrl + ' rdfs: http://www.w3.org/2000/01/rdf-schema# rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n';
  rdfa += '       typeof="rdf:Property"\n';
  rdfa += '       resource="' + baseUrl + propertyName + '">\n';
  
  // Label
  if (propertyData.label) {
    rdfa += `    <h1 property="rdfs:label">${propertyData.label}</h1>\n`;
  }
  
  // Comment
  if (propertyData.comment) {
    rdfa += `    <p property="rdfs:comment">${escapeHtml(propertyData.comment)}</p>\n`;
  }
  
  // Range
  if (propertyData.range && propertyData.range.length > 0) {
    rdfa += '    <div>\n';
    rdfa += '      <h2>Range:</h2>\n';
    rdfa += '      <ul>\n';
    
    propertyData.range.forEach((range: string) => {
      const rangeUri = range.startsWith('http://') ? range : `${baseUrl}${range}`;
      rdfa += `        <li><a property="rdfs:range" href="${rangeUri}">${range}</a></li>\n`;
    });
    
    rdfa += '      </ul>\n';
    rdfa += '    </div>\n';
  }
  
  // Domain
  if (propertyData.domain && propertyData.domain.length > 0) {
    rdfa += '    <div>\n';
    rdfa += '      <h2>Domain:</h2>\n';
    rdfa += '      <ul>\n';
    
    propertyData.domain.forEach((domain: string) => {
      const domainUri = domain.startsWith('http://') ? domain : `${baseUrl}${domain}`;
      rdfa += `        <li><a property="rdfs:domain" href="${domainUri}">${domain}</a></li>\n`;
    });
    
    rdfa += '      </ul>\n';
    rdfa += '    </div>\n';
  }
  
  rdfa += '  </div>\n';
  rdfa += '</body>\n</html>';
  
  return rdfa;
}

// Microdata Converters
export function classToMicrodata(className: string, classData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let microdata = '<!DOCTYPE html>\n<html>\n<head>\n  <title>' + (classData.label || className) + '</title>\n</head>\n<body>\n';
  
  microdata += `  <div itemscope itemtype="http://www.w3.org/2000/01/rdf-schema#Class" itemid="${baseUrl}${className}">\n`;
  
  // Label
  if (classData.label) {
    microdata += `    <h1 itemprop="http://www.w3.org/2000/01/rdf-schema#label">${classData.label}</h1>\n`;
  }
  
  // Comment
  if (classData.comment) {
    microdata += `    <p itemprop="http://www.w3.org/2000/01/rdf-schema#comment">${escapeHtml(classData.comment)}</p>\n`;
  }
  
  // Parent classes
  if (classData.subClassOf && classData.subClassOf.length > 0) {
    microdata += '    <div>\n';
    microdata += '      <h2>Inherits from:</h2>\n';
    microdata += '      <ul>\n';
    
    classData.subClassOf.forEach((parent: string) => {
      const parentUri = parent.startsWith('http://') ? parent : `${baseUrl}${parent}`;
      microdata += `        <li><a itemprop="http://www.w3.org/2000/01/rdf-schema#subClassOf" href="${parentUri}">${parent}</a></li>\n`;
    });
    
    microdata += '      </ul>\n';
    microdata += '    </div>\n';
  }
  
  // Properties
  if (classData.properties && classData.properties.length > 0) {
    microdata += '    <div>\n';
    microdata += '      <h2>Properties:</h2>\n';
    microdata += '      <ul>\n';
    
    classData.properties.forEach((prop: string) => {
      microdata += `        <li itemprop="${baseUrl}properties">${prop}</li>\n`;
    });
    
    microdata += '      </ul>\n';
    microdata += '    </div>\n';
  }
  
  microdata += '  </div>\n';
  microdata += '</body>\n</html>';
  
  return microdata;
}

export function propertyToMicrodata(propertyName: string, propertyData: any, options: FormatOptions = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let microdata = '<!DOCTYPE html>\n<html>\n<head>\n  <title>' + (propertyData.label || propertyName) + '</title>\n</head>\n<body>\n';
  
  microdata += `  <div itemscope itemtype="http://www.w3.org/1999/02/22-rdf-syntax-ns#Property" itemid="${baseUrl}${propertyName}">\n`;
  
  // Label
  if (propertyData.label) {
    microdata += `    <h1 itemprop="http://www.w3.org/2000/01/rdf-schema#label">${propertyData.label}</h1>\n`;
  }
  
  // Comment
  if (propertyData.comment) {
    microdata += `    <p itemprop="http://www.w3.org/2000/01/rdf-schema#comment">${escapeHtml(propertyData.comment)}</p>\n`;
  }
  
  // Range
  if (propertyData.range && propertyData.range.length > 0) {
    microdata += '    <div>\n';
    microdata += '      <h2>Range:</h2>\n';
    microdata += '      <ul>\n';
    
    propertyData.range.forEach((range: string) => {
      const rangeUri = range.startsWith('http://') ? range : `${baseUrl}${range}`;
      microdata += `        <li><a itemprop="http://www.w3.org/2000/01/rdf-schema#range" href="${rangeUri}">${range}</a></li>\n`;
    });
    
    microdata += '      </ul>\n';
    microdata += '    </div>\n';
  }
  
  // Domain
  if (propertyData.domain && propertyData.domain.length > 0) {
    microdata += '    <div>\n';
    microdata += '      <h2>Domain:</h2>\n';
    microdata += '      <ul>\n';
    
    propertyData.domain.forEach((domain: string) => {
      const domainUri = domain.startsWith('http://') ? domain : `${baseUrl}${domain}`;
      microdata += `        <li><a itemprop="http://www.w3.org/2000/01/rdf-schema#domain" href="${domainUri}">${domain}</a></li>\n`;
    });
    
    microdata += '      </ul>\n';
    microdata += '    </div>\n';
  }
  
  microdata += '  </div>\n';
  microdata += '</body>\n</html>';
  
  return microdata;
}

// Helper utilities

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

function escapeTurtle(unsafe: string): string {
  return unsafe.replace(/["\\]/g, function (c) {
    switch (c) {
      case '"': return '\\"';
      case '\\': return '\\\\';
      default: return c;
    }
  });
}

function escapeNTriples(unsafe: string): string {
  return unsafe
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}