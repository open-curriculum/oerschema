---
name: oerschema-schema-author
description: >
  Guide maintainers extending the OER Schema vocabulary in this repo's `app/lib/schema.ts` — adding
  classes and properties with correct subClassOf chains (terminating at schema.org /
  creativecommons/ns#Work or an internal root), required domain/range arrays, alternateType for
  datatype-like classes, baseVocab for schema.org-aligned properties, reciprocal inverseOf pairs,
  and version bump semantics. Also covers downstream sync (outline-types OutlineNodeType, the
  VitePress plugin directives, the Google Apps Script add-on components, the Remix routes, and the
  PRAW oerschema-audit vocabulary reference). Use when the user says "add a new oerschema class",
  "add a property to schema.ts", "what subClassOf chain for a new assessment type", "extend the oer
  schema vocabulary", "add a forProgram property", or "the vocabulary is missing a class for X" —
  even if they don't say "schema-author". Repo-local to the oerschema project; pairs with
  oerschema-validation to verify edits.
version: 1.0.0
license: MIT
metadata:
  author: oerschema
  tags: [oer-schema, oerschema, schema, vocabulary, authoring, maintainer, repo-local]
  requirements: "Working in the oerschema repo. Edits app/lib/schema.ts (and downstream files). Run oerschema-validation after edits; run npm run typecheck / lint."
---

# OER Schema Vocabulary Authoring (repo-local maintainer skill)

This skill guides a maintainer extending the OER Schema vocabulary defined in
`app/lib/schema.ts` (currently v1.2.0). It is for people contributing to the oerschema project
itself — not for content authors (that's `oerschema-audit`) or component implementers (that's
`oerschema-integration-finder`). The goal is vocabulary edits that are internally consistent, aligned
to schema.org, and propagated to every downstream surface that consumes the vocabulary.

## Source of truth files

- `app/lib/schema.ts` — the vocabulary (`export const schema: Schema`). The single source of truth
  for classes and properties.
- `app/lib/types.ts` — the `Schema`, `SchemaClass`, `SchemaProperty` interfaces.
- `app/lib/schema-utils.ts` — helpers for walking the vocabulary (`getClassProperties`,
  `isPropertyValidForClass`, `isClassValidForPropertyRange`, `isSubclassOf`-style logic via
  `isClassInDomain`/`isClassInRange`). Reuse these instead of writing new traversal abstractions
  (per the PRAW "repurpose core code" rule).
- `app/lib/schema-validation.ts` — outline-builder relationship validation built on schema-utils.
- `app/lib/outline-types.ts` — the `OutlineNodeType` union of classes the outline builder UI exposes.

## Adding a class

In `schema.classes`:

```ts
NewClass: {
  label: "NewClass",
  comment: "One-sentence purpose.",
  subClassOf: ["ParentClass", "http://schema.org/SomeType"],
  properties: ["newProp", "inheritedPropName"]
}
```

Rules:
- **`label`** matches the key (PascalCase).
- **`comment`** is a one-sentence purpose. Don't leave it empty for user-facing classes.
- **`subClassOf`** is a non-empty array. The chain must **terminate** at an external URI
  (`http://schema.org/...`, `http://creativecommons.org/ns#Work`, `https://schema.org/...`) or at
  an internal root (`Resource` or `Thing`). Every internal parent must resolve to a defined class.
  Do not create a class whose chain only loops internal classes without reaching an external or root
  anchor.
- **`properties`** lists the property names this class *introduces or directly owns*. Inherited
  properties come from parents at runtime via `getClassProperties` — do not re-list inherited
  properties here (the outline-builder and audit tooling walk inheritance). Every entry must resolve
  to a property in `schema.properties`; a dangling entry is a validation error.
- **`schema`** field: set `"root"` only on `Resource`, `"intangible"` only on `Intangible`. Omit for
  everything else.
- **`alternateType`**: set when the class is datatype-like and maps to a schema.org datatype
  (see the GradeFormat family: `PointGradeFormat` → `http://oerschema.org/Number`). Omit otherwise.

## Adding a property

In `schema.properties`:

```ts
newProp: {
  label: "newProp",
  comment: "What it means, including the direction of the relationship.",
  range: ["TargetClass", "Text"],
  domain: ["OwningClass"],
  baseVocab: "http://schema.org/",   // only if aligned to a schema.org property
  inverseOf: "partnerProp",          // only if it has an internal inverse
  alternateType: "http://schema.org/..." // rare; only for schema.org-aligned datatype props
}
```

Rules:
- **`domain`** and **`range`** are **required non-empty arrays**. Every internal entry (not starting
  with `http://`/`https://`) must resolve to a defined class. External URIs (schema.org types) are
  allowed in both.
- **`baseVocab`**: set to `"http://schema.org/"` only when the property mirrors a schema.org
  property (e.g. `name`, `description`, `image`). Omit for OER-Schema-native properties
  (`forCourse`, `hasLearningObjective`, `rubric`, etc.).
- **`inverseOf`**: when a property has an internal inverse, set `inverseOf` on **both** directions
  pointing at each other. The existing `forComponent`/`hasComponent` pair is the cautionary tale —
  their *comments* say "inverse of ..." but neither sets the `inverseOf` field, which
  `oerschema-validation` flags. Don't repeat that gap. If the inverse is an external schema.org
  property (like `mainEntityOfPage.inverseOf = "mainEntity"`), setting it one-way is fine — do not
  invent a local property to match.
- **`comment`** should state the relationship direction ("A parent in relation to a child resource",
  not just "parent").

## Inverse pairs — the rules

1. Internal inverse pair → set `inverseOf` on both properties, each naming the other.
2. External inverse (schema.org property not in this vocabulary) → set `inverseOf` on the local
   property only; do not create a stub.
3. No inverse → omit the field. Do not leave `inverseOf` pointing at a non-existent internal name.

## Version bumps

Bump `schema.version` (currently `"1.2.0"`) per semver:
- **PATCH** — comment/clarification fixes, no new classes/properties, no domain/range changes.
- **MINOR** — new classes and/or properties, widened ranges, new subtypes. Most vocabulary growth is
  minor. Update the PRAW `oerschema-audit` `references/vocabulary.md` to match (note the new
  version in its header).
- **MAJOR** — breaking changes: removed classes/properties, narrowed domains/ranges, renamed
  terms. Coordinate with downstream consumers first.

## Downstream sync (do this when the vocabulary changes)

A vocabulary change is not done when `schema.ts` is saved. Propagate to:

1. **`app/lib/outline-types.ts`** — if the new class should appear in the outline builder UI, add it
   to the `OutlineNodeType` union and to the `nodeTypes` arrays in `schema-validation.ts`
   (`getValidChildTypes`, `getValidParentTypes`). If it shouldn't appear in the outline builder, skip.
2. **`app/lib/schema-validation.ts`** — if the new class introduces a relationship property that the
   outline builder should recognize, add it to the `relationshipProperties` /
   `relationshipChecks` lists and the `priorities` in `suggestRelationship`.
3. **Remix routes** — `app/routes/schema.tsx` / `api.schema.tsx` serve the vocabulary to the schema
   browser; they read from `schema.ts` so they pick up changes automatically, but verify the browser
   renders the new class. `app/lib/format-converters.ts` and `outline-templates.ts` may need updates
   if the new class affects outline serialization.
4. **`vitepress-plugin/index.js`** — if authors would reasonably author the new class in VitePress
   markdown, add a matching `:::` container directive (see how `learning-objective`, `assessment`,
   `rubric`, etc. are implemented). Update `vitepress-plugin/README.md` with the new directive.
5. **`google-apps-script/Code.js`** + `sidebar.html` — if the new class should be insertable from
   Google Docs, add an insert function and sidebar UI entry. Update
   `google-apps-script/README.md` and `test-instructions.md`.
6. **PRAW `oerschema-audit` skill** — update
   `~/Documents/git/haxtheweb/praw/skills/oerschema-audit/references/vocabulary.md` (the class
   hierarchy + property tables, and the version header) so the audit's recommendations stay
   accurate. If the new class has a VitePress directive, also update the audit's
   `references/markup-surfaces.md` directive→class map.
7. **`oerschema-integration-finder`** — if the new class is a pedagogical structure components might
   render, add it to the candidate table in
   `~/Documents/git/haxtheweb/praw/skills/oerschema-integration-finder/references/component-patterns.md`.

## After editing

- Run `node scripts/validate-schema.mjs` (the `oerschema-validation` script) and fix any errors.
- Run `npm run typecheck` and `npm run lint` in this repo (these are the oerschema repo scripts, not
  the webcomponents monorepo — safe to run here).
- Do **not** run a build at the top of the webcomponents monorepo (PRAW rule); this repo's own
  `npm run build` is the Remix build and is fine if you need to verify the schema browser, but
  typecheck + lint + the validator are usually sufficient for a vocabulary edit.

## Gotchas

- **Don't re-list inherited properties on a subclass.** `Lesson` doesn't list `hasLearningObjective`
  — it inherits it from `InstructionalPattern`. Only list properties the class itself owns.
- **Domain/range inheritance is runtime, not declarative.** A property valid on a parent is valid on
  the child by walk; you don't need to widen the property's `domain` when adding a subclass.
- **`forComponent`/`hasComponent` are the cautionary tale.** Their comments declare an inverse
  relationship but neither sets `inverseOf`. When adding any inverse pair, set the field on both —
  and consider fixing the existing pair while you're in the file (run the validator after).
- **External `subClassOf` URIs are not errors.** `http://schema.org/Thing` in a `subClassOf` array is
  correct; the validator skips them. Don't try to resolve them to local classes.
- **`mainEntityOfPage.inverseOf = "mainEntity"` is intentional** — `mainEntity` is an external
  schema.org property. Don't "fix" it by removing the field or creating a local `mainEntity`.
- **Keep the audit vocabulary reference in sync.** A vocabulary change that isn't reflected in the
  PRAW `oerschema-audit` `references/vocabulary.md` will cause the audit to recommend stale
  classes/properties. Treat that reference as a downstream artifact of `schema.ts`.

## Dependencies

- **Reads/edits:** `app/lib/schema.ts`, `app/lib/types.ts`, `app/lib/outline-types.ts`,
  `app/lib/schema-validation.ts`, `app/lib/schema-utils.ts`, Remix routes, `vitepress-plugin/`,
  `google-apps-script/`, PRAW `oerschema-audit` + `oerschema-integration-finder` references.
- **Pairs with:** `oerschema-validation` (run after every edit).
- **Hands off to:** `oerschema-audit` / `oerschema-integration-finder` reference updates
  (downstream propagation).

## References

- `app/lib/schema.ts` — the vocabulary
- `app/lib/types.ts` — the Schema interfaces
- `app/lib/schema-utils.ts` — traversal helpers to reuse
- `app/lib/schema-validation.ts` — outline-builder relationship validation
- `app/lib/outline-types.ts` — OutlineNodeType union
- `vitepress-plugin/index.js` — directive→class implementations
- `google-apps-script/Code.js` — insertable components
- PRAW `oerschema-audit` skill `references/vocabulary.md` — downstream mirror to keep in sync
