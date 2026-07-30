#!/usr/bin/env node
/**
 * OER Schema self-consistency validator.
 *
 * Validates app/lib/schema.ts for internal consistency:
 *   - every class `properties[]` entry resolves to a defined property
 *   - every internal `subClassOf` / `domain` / `range` entry resolves to a defined class
 *   - subClassOf chains have no cycles (and thus terminate at an external URI or internal root)
 *   - inverseOf reciprocity: if A.inverseOf names an internal property B, then B.inverseOf === A
 *   - advisory: properties that declare an inverse in their `comment` but don't set `inverseOf`
 *     (catches the forComponent/hasComponent, assessing/assessedBy, parentOf/childOf gaps)
 *
 * Usage:  node scripts/validate-schema.mjs
 * Exit:   1 if any ERROR (advisories do not fail CI), 0 otherwise.
 *
 * This script is dependency-free and runs on Node >= 20. It loads schema.ts by stripping the
 * type-only import and the `: Schema` annotation, then evaluating the plain object literal in a
 * Function scope. schema.ts contains only strings and arrays inside the object, so this is safe for
 * a trusted local source file. Keep that property true: do not put executable expressions or
 * imports of runtime modules inside the `schema` object.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, "..", "app", "lib", "schema.ts");

function loadSchema() {
  const raw = readFileSync(schemaPath, "utf8");
  // Drop the type-only import line(s) and any bare import statements.
  const noImports = raw.replace(/^\s*import\s+.*$/gm, "");
  // Convert `export const schema: Schema =` -> `const schema =` (strip the type annotation).
  const deTyped = noImports.replace(
    /export\s+const\s+schema\s*:\s*Schema\s*=\s*/m,
    "const schema = "
  );
  // eslint-disable-next-line no-new-func
  const factory = new Function(deTyped + "\n; return schema;");
  return factory();
}

const isExternal = (s) =>
  typeof s === "string" &&
  (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("rdfs:"));

function walkAncestors(classes, name, seen) {
  // returns true if a cycle is detected
  if (seen.has(name)) return true;
  seen.add(name);
  const cls = classes[name];
  if (!cls) return false;
  for (const parent of cls.subClassOf || []) {
    if (isExternal(parent)) continue;
    const pName = parent.split("/").pop() || parent;
    if (!classes[pName]) continue;
    if (walkAncestors(classes, pName, seen)) return true;
  }
  return false;
}

function main() {
  const schema = loadSchema();
  const errors = [];
  const advisories = [];
  const classes = schema.classes || {};
  const properties = schema.properties || {};

  // 1. version
  if (typeof schema.version !== "string" || !/^\d+\.\d+\.\d+/.test(schema.version)) {
    errors.push(`schema.version is missing or not semver-ish: ${String(schema.version)}`);
  }

  // 2. classes
  for (const [name, cls] of Object.entries(classes)) {
    if (typeof cls.label !== "string" || !cls.label) {
      errors.push(`class ${name}: missing label`);
    }
    if (!Array.isArray(cls.subClassOf) || cls.subClassOf.length === 0) {
      errors.push(`class ${name}: subClassOf must be a non-empty array`);
    } else {
      for (const parent of cls.subClassOf) {
        if (isExternal(parent)) continue;
        const pName = parent.split("/").pop() || parent;
        if (!classes[pName]) {
          errors.push(`class ${name}: subClassOf references unknown internal class "${parent}"`);
        }
      }
      const seen = new Set();
      if (walkAncestors(classes, name, seen)) {
        errors.push(`class ${name}: subClassOf chain has a cycle`);
      }
    }
    if (!Array.isArray(cls.properties)) {
      errors.push(`class ${name}: properties must be an array`);
    } else {
      for (const prop of cls.properties) {
        if (!properties[prop]) {
          errors.push(`class ${name}: properties[] references unknown property "${prop}"`);
        }
      }
    }
  }

  // 3. properties
  for (const [name, prop] of Object.entries(properties)) {
    if (typeof prop.label !== "string" || !prop.label) {
      errors.push(`property ${name}: missing label`);
    }
    if (!Array.isArray(prop.range) || prop.range.length === 0) {
      errors.push(`property ${name}: range must be a non-empty array`);
    } else {
      for (const r of prop.range) {
        if (isExternal(r)) continue;
        if (!classes[r]) {
          errors.push(`property ${name}: range references unknown class "${r}"`);
        }
      }
    }
    if (!Array.isArray(prop.domain) || prop.domain.length === 0) {
      errors.push(`property ${name}: domain must be a non-empty array`);
    } else {
      for (const d of prop.domain) {
        if (isExternal(d)) continue;
        if (!classes[d]) {
          errors.push(`property ${name}: domain references unknown class "${d}"`);
        }
      }
    }
    // inverseOf reciprocity
    if (prop.inverseOf) {
      const inv = prop.inverseOf;
      if (isExternal(inv)) {
        // external schema.org inverse (e.g. mainEntity) — fine, one-way
      } else if (!properties[inv]) {
        // bare-name inverse that doesn't resolve locally — assumed external schema.org property
        // (e.g. mainEntityOfPage.inverseOf = "mainEntity"). Advisory so the author verifies intent;
        // a genuine typo is still caught by the reciprocity check on the partner side if it exists.
        advisories.push(`property ${name}: inverseOf "${inv}" is not a local property — assumed external schema.org property; verify this is intentional`);
      } else if (properties[inv].inverseOf !== name) {
        errors.push(
          `property ${name}: inverseOf "${inv}" is not reciprocal (that property's inverseOf is "${properties[inv].inverseOf ?? "<unset>"}")`
        );
      }
    }
    // advisory: comment declares an inverse but inverseOf is unset
    if (!prop.inverseOf && typeof prop.comment === "string") {
      const m = prop.comment.match(/inverse of\s+([A-Za-z]+)/i);
      if (m) {
        const declared = m[1];
        if (properties[declared]) {
          advisories.push(
            `property ${name}: comment says "inverse of ${declared}" but inverseOf is not set`
          );
        }
      }
    }
  }

  // Report
  const ok = errors.length === 0;
  console.log(`OER Schema v${schema.version || "?"} — ${Object.keys(classes).length} classes, ${Object.keys(properties).length} properties`);
  if (advisories.length) {
    console.log(`\nAdvisories (${advisories.length}):`);
    for (const a of advisories) console.log(`  ⚠  ${a}`);
  }
  if (errors.length) {
    console.log(`\nErrors (${errors.length}):`);
    for (const e of errors) console.log(`  ✗  ${e}`);
  }
  console.log(`\n${ok ? "✓ schema is internally consistent" : "✗ schema has errors"}${advisories.length ? ` (${advisories.length} advisory)` : ""}`);
  process.exit(ok ? 0 : 1);
}

main();
