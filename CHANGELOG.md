# Change Log

All notable changes to the "ts-edifact" library will be documented in this file.

## [Unreleased]

### 0.0.9
- Added cache support for already generated segment- and element definition tables to the Reader class

### 0.0.8
- Fixed a segment definition generation issue for `TAX` segments, which due to its long name didn't end up in a propper definition
- Added D01B GENRAL message structure and segment/element definition files

### 0.0.7
- Added CHANGELOG.md
- Added parser for generating necessary message-, segment- and element structure objects needed for validating Edifact documents
- Refactored segment and element objects to make use of a builder pattern and allow to easily load segment/element definitions from a target location
- Updated project structure to get rid of plenty of ESLint errors

### 0.0.6
- Added support for loading external Edifact message structure definition files on generating an Edifact interchange via the `InterchangeBuilder` class
- Updated README

### 0.0.5
- Added test to reproduce validation issues of Edifact documents not having values for optional elements using a minimum length of 1 or greater, i.e. as `n1` is defined.
- Fixed issue #2 caused by validator not checking whether components are optional or not

### 0.0.4
- Fixed an issue while parsing negative numerical values
- Added further segment and element definitions, such as `GID`, `TMP` and `RNG` and their corresponding comonent definitions.

### 0.0.3
- Changed module type from `es6` to `commonjs` due to import issues in a plugin this library should be used in
- Added further DESADV message structure definition files

### 0.0.2
- Refactored segment- and element-definitions from .ts files to .json files to allow defining different versions
- Added some version specific INVOIC (D96A, D01B) message structure definitions

### 0.0.1
- Initial port of the `node-edifact` project to typescript