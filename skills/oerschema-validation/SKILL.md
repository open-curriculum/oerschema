---
name: oerschema-validation
description: >
  Validate the OER Schema vocabulary in this repo's `app/lib/schema.ts` for internal consistency:
  no dangling class/property references, every class `properties[]` entry resolves, every internal
  `subClassOf`/`domain`/`range` entry resolves, subClassOf chains have no cycles, and `inverseOf`
  pairs are reciprocal. Ships a dependency-free runner (`scripts/validate-schema.mjs`) usable in CI
  and local pre-commit. Also flags advisories for properties that declare an inverse in their
  `comment` but don't set the `inverseOf` field (the forComponent/hasComponent,
  assessing/assessedBy, parentOf/childOf gaps). Use when the user says "validate the oer schema",
  "check schema.ts for broken references", "is my vocabulary consistent", "run the oerschema
  validator", or "check schema.ts before committing" — even if they don't say "validation". Pairs
  with oerschema-schema-author; repo-local to the oerschema project.
version: 1.0.0
license: MIT
metadata:
  author: oerschema
  tags: [oer-schema, oerschema, schema, validation, lint, ci, repo-local]
  requirements: "Working in the oerschema repo. Runs node scripts/validate-schema.mjs (Node >= 20, no deps). Exit 1 on errors; advisories do not fail."
---

# OER Schema Validation (repo-local maintainer skill)

This skill validates the internal consistency of the OER Schema vocabulary in `app/lib/schema.ts`.
It is the verification step that pairs with `oerschema-schema-author`: after any vocabulary edit,
run the validator. It is for maintainers of the oerschema project, not for content authors or
component implementers.

## What it validates

`scripts/validate-schema.mjs` loads `app/lib/schema.ts` (stripping the type-only import and `: Schema`
annotation, then evaluating the plain object literal) and checks:

1. **version** — `schema.version` is present and semver-ish.
2. **class `properties[]` resolve** — every entry in a class's `properties` array resolves to a
   defined property in `schema.properties`. Dangling references are errors.
3. **internal `subClassOf` resolves** — every non-URI entry resolves to a defined class. External
   URIs (`http://schema.org/...`, `http://creativecommons.org/ns#Work`, `https://schema.org/...`,
   `rdfs:...`) are skipped.
4. **subClassOf cycles** — walking internal ancestors never loops. (Termination is implied: roots
   `Resource` and `Thing` have external parents, so a cycle-free chain always reaches an external
   anchor.)
5. **internal `domain`/`range` resolve** — every non-URI entry in a property's `domain` and `range`
   resolves to a defined class.
6. **`inverseOf` reciprocity** — if `A.inverseOf` names a local property `B`, then
   `B.inverseOf` must equal `A`. A one-way `inverseOf` pointing at an external schema.org property —
   whether a full URI or a bare name that doesn't resolve locally (e.g.
   `mainEntityOfPage.inverseOf = "mainEntity"`) — is treated as an external reference and produces
   an advisory asking the author to verify intent, not an error. (The vocabulary can't define
   external schema.org properties, so a non-resolving bare name is assumed external.)
7. **Advisory: comment-declared inverses missing the field** — if a property's `comment` says
   "inverse of X" where X is a real property, but `inverseOf` is unset, it's an advisory. This
   catches the existing `forComponent`/`hasComponent`, `assessing`/`assessedBy`, and
   `parentOf`/`childOf` gaps without failing CI.

## How to run

```sh
node scripts/validate-schema.mjs
```

Output:
- a one-line summary (`OER Schema v1.2.0 — N classes, M properties`)
- advisories (⚠), if any
- errors (✗), if any
- a final ✓ / ✗ line

Exit code is `1` if there are any errors (so CI fails), `0` otherwise. Advisories do not fail CI.

## Wiring into CI

Add a script to `package.json`:

```json
"scripts": {
  "schema:check": "node scripts/validate-schema.mjs"
}
```

Then run it in CI (e.g. a GitHub Actions workflow) alongside `npm run typecheck` and
`npm run lint`. Suggested job step:

```yaml
- run: npm run schema:check
- run: npm run typecheck
- run: npm run lint
```

Because the validator is dependency-free and reads the source directly, it also works as a local
pre-commit hook (`node scripts/validate-schema.mjs` in `.husky/pre-commit` if husky is set up, or a
plain git hook).

## Rule-name mapping (consistency with the audit skill)

The validator's check names align with the "Known vocabulary-internal gaps" section of the PRAW
`oerschema-audit` skill's `references/vocabulary.md`. Specifically:

- The audit skill tells content auditors **not** to report these as content errors, and to defer
  them to `oerschema-validation` / `oerschema-schema-author`:
  - `forComponent` / `hasComponent` — comment-declared inverses, `inverseOf` unset → validator
    advisory.
  - `assessing` / `assessedBy`, `parentOf` / `childOf` — same.
  - `mainEntityOfPage.inverseOf = "mainEntity"` — external inverse → validator allows it.

When the validator's advisories are resolved (the `inverseOf` fields set on the internal pairs),
update the audit skill's `references/vocabulary.md` "Known vocabulary-internal gaps" section to
remove the resolved entries so auditors stop deferring them.

## Relationship to existing validation code

`app/lib/schema-validation.ts` validates **outline-builder relationships** (can a child of type X
be added under a parent of type Y, via which property) using `schema-utils.ts` helpers. It does
**not** validate `schema.ts` itself for self-consistency. This skill fills that gap — the two are
complementary:

- `schema-validation.ts` — "is this outline relationship allowed by the vocabulary?" (runtime, for
  the outline builder UI).
- `scripts/validate-schema.mjs` (this skill) — "is the vocabulary itself internally consistent?"
  (build-time / CI, for vocabulary authors).

Reuse `schema-utils.ts` helpers (`getClassProperties`, `isPropertyValidForClass`,
`isClassValidForPropertyRange`) when extending the outline-builder validation; this skill's script
re-implements its own traversal only because it loads the schema without a TypeScript toolchain
(see the script header comment).

## When to use

- After any edit to `app/lib/schema.ts` (run before committing).
- In CI on every PR touching `app/lib/schema.ts` or downstream surfaces.
- When diagnosing why `oerschema-audit` or the outline builder is producing a strange result — a
  vocabulary-level inconsistency may be the cause.
- Before releasing a new vocabulary version (bump `schema.version`, then validate).

## Gotchas

- **Advisories don't fail CI.** The `forComponent`/`hasComponent`-style gaps are advisories because
  they don't break runtime tooling — but fix them when you're already editing the file, then re-run.
- **External URIs are not errors.** `http://schema.org/Thing` in `subClassOf` or `range` is correct;
  the validator skips them. Don't "fix" them.
- **`mainEntityOfPage.inverseOf = "mainEntity"` is intentional and external.** `mainEntity` is a
  schema.org property not defined in this vocabulary. The validator treats the non-resolving bare
  name as an external reference and emits an advisory (verify intent), not an error. Do not create
  a local `mainEntity` stub to make it reciprocal.
- **The current vocabulary has a pre-existing `title` error.** `TableOfContentsEntry` lists
  `"title"` in its `properties` array but no `title` property is defined in `schema.properties`
  (the closest is `name`, domain `Resource`). The validator flags this and exits 1. This is a real
  vocabulary bug for `oerschema-schema-author` to fix (add a `title` property or change the entry
  to `name`) — not a validator bug. Until it's fixed, CI will fail on this rule.
- **The script evaluates the de-typed source of a trusted local file.** It strips the type-only
  import and the `: Schema` annotation, then evaluates the object literal. This is safe only because
  `schema.ts` contains strings and arrays inside `schema` — keep it that way. Do not put runtime
  imports or executable expressions inside the `schema` object, or the validator will break.
- **Node >= 20 required** (matches the repo's `engines` field). No other deps.

## Dependencies

- **Reads:** `app/lib/schema.ts`
- **Pairs with:** `oerschema-schema-author` (run after every authoring edit)
- **Aligns with:** PRAW `oerschema-audit` `references/vocabulary.md` "Known vocabulary-internal gaps"

## References

- `scripts/validate-schema.mjs` — the runner (see header comment for the load strategy)
- `app/lib/schema.ts` — the vocabulary under validation
- `app/lib/schema-validation.ts` — the complementary outline-builder relationship validator
- `app/lib/schema-utils.ts` — traversal helpers (reused by outline-builder validation)
- PRAW `oerschema-audit` skill `references/vocabulary.md` — the "Known vocabulary-internal gaps"
  section that defers to this skill
