# Changelog

## 1.1.0 - 2025-12-12
- Added rubric modeling: `Rubric`, `RubricCriterion`, `RubricScale`, and `RubricLevel` classes, plus rubric properties and weights.
- Linked assessments and activities to rubrics via the `rubric` property; rubrics now carry criteria, scales, and type metadata.
- Introduced rubric scale metadata (`hasLevel`, `levelOrdinal`, `levelPoints`, `pointsRequired`) to support analytic and holistic styles.
- Enabled outline builder support for rubric nodes (Rubric, Criterion, Scale, Level) and validation of rubric relationships.
- Updated VitePress plugin to render rubric components (`rubric`, `rubric-criterion`, `rubric-scale`, `rubric-level`) with microdata and styling; bumped plugin package version to 0.2.0.
- Bumped schema version to 1.1.0.

## 1.0.0 - Initial release
- Initial OERSchema classes and properties.
