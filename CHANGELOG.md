# Change Log

All notable changes to the "ts-edifact" library will be documented in this file.

## Releases

### 0.0.14

- Applied fix for UNECELegacyMessageStructureParser provided by Stefan Partheym
- Fixed parsing issue of legacy UNECE directories due to an updated version of `htmlparser2` and `domhandler`
- Fixed Jasmine test output to be reader-friendly again

### 0.0.13

- Replaced ts-lint for es-lint
- Applied updated styling guides enforced by es-lint to the codebase
- Updated dependency versions to the most-recent ones

### 0.0.12

- Removed `MoaType` enum as there are to many possible enum constants available to enumberate them all
- Improved charset recognition while parsing the Edifact document. The `Reader` class will now update the `Parser`, which furthermore will update its `Tokenizer` once the charset was parsed from the respective `UNB` segment.
- Replaced charset definition from the `Configuration` class and moved the logic to the `Tokenizer` class
- Updated the `Parser` class to take a `Configuration` as construction argument and moved the `Validator` definition to the `Configuration` class

### 0.0.11

- Fixed an issue on generating an object structure through the interchange builder class if multiple messages are present within the same document

### 0.0.10

- Fixed an issue with parsing complex segment/element definitions
- Removed node-fetch from the dependencies as it wasn't used
- Moved htmlparser2 lib and some of its dependencies from dependencies to dev-dependencies. Hope this allows to usage of the lib in other projects

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