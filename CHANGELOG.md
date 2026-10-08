# Changelog

## 1.3.1 - 2026-10-07
- `aiUsageConstraint` now applies to any `LearningComponent` (its domain was `Task`). AI usage rules govern assessments, quizzes and submissions, and readings or lessons that ask for a response, as well as tasks; the schema's own examples already used it on `Assessment` and `LearningComponent`. A constraint on a unit or lesson covers the work within it unless a part states its own. Its single domain stays valid RDFS (several `rdfs:domain` values would mean all of them at once).
- Outline builder: the AI Usage Constraints field shows for every learning component node (all but Course, Topic, Learning Objective and rubric parts), not only Task, Practice and Activity.
- Bumped schema version to 1.3.1.

## 1.3.0 - 2026-10-05
- Added project structure: `hasActivity` (Project → Activity) and its inverse `activityOf`, so a Project can state the activities it is made of, as its definition describes.
- Added `step` (an Activity's position in its Project's sequence) and `stage` (the named stage it belongs to, e.g. "Research", "Concept", or the Double Diamond's Discover/Define/Develop/Deliver).
- Added `prerequisite` on `Resource`: something to complete or understand first, such as an earlier activity a later one builds on. `coursePrerequisites` remains for whole-course requirements.
- Added `assessmentPurpose` on `Assessment` (`diagnostic`, `formative` or `summative`), describing how an assessment's results are used rather than the activity itself.
- Outline builder: Project → Activity uses `hasActivity` (children get `activityOf`); the properties panel edits step, stage and assessment purpose.
- VitePress plugin: the `assessment` directive takes `purpose`.
- Bumped schema version to 1.3.0.

## 1.1.0 - 2025-12-12
- Added rubric modeling: `Rubric`, `RubricCriterion`, `RubricScale`, and `RubricLevel` classes, plus rubric properties and weights.
- Linked assessments and activities to rubrics via the `rubric` property; rubrics now carry criteria, scales, and type metadata.
- Introduced rubric scale metadata (`hasLevel`, `levelOrdinal`, `levelPoints`, `pointsRequired`) to support analytic and holistic styles.
- Enabled outline builder support for rubric nodes (Rubric, Criterion, Scale, Level) and validation of rubric relationships.
- Updated VitePress plugin to render rubric components (`rubric`, `rubric-criterion`, `rubric-scale`, `rubric-level`) with microdata and styling; bumped plugin package version to 0.2.0.
- Bumped schema version to 1.1.0.

## 1.0.0 - Initial release
- Initial OERSchema classes and properties.
