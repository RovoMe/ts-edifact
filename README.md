[![view on npm](https://img.shields.io/npm/v/ts-edifact.svg)](https://www.npmjs.org/package/ts-edifact)
[![npm module downloads per month](https://img.shields.io/npm/dm/ts-edifact.svg)](https://www.npmjs.org/package/ts-edifact)


# ts-edifact

This is a typescript port of the [node-edifact](https://github.com/tdecaluwe/node-edifact) project.

Currently supported functionality:

* An ES6 streaming parser reading UN/EDIFACT messages.
* Provide your own event listeners to get the parser to do something useful.
* Construct structured javascript objects from UN/EDIFACT messages.
* Support for the UNA header and custom separators.
* Validating data elements and components accepted by a given segment.
* Parsing and checking standard UN/EDIFACT messages with segment tables.
* Support for envelopes.
* Check for well-formed Edifact documents according to the defined message type, version and revision within the `UNH` message header.
* Generation of Edifact specification definition files (i.e. `D01B_INVOIC.struct.json`, `D01B_INVOIC.segments.json` and `D01B_INVOIC.elements.json`) obtained from the UNECE page directly.

## Usage

This example parses a document and translates it to a javascript array `result` containing segments. Each segment is an object containing a `name` and an `elements` array. An element is an array of components.

```typescript
import { Parser, Validator, ResultType } from 'ts-edifact';

const enc: string = ...;
const doc: string = ...;

const validator: Validator = new ValidatorImpl();
const parser: Parser = new Parser(validator);

// Provide some segment and element definitions.
validator.define(...);

// Parsed segments will be collected in the result array.
let result: ResultType = [];
let elements: string[][];
let components: string[];

parser.onOpenSegment = (segment: string): void => {
  // Started a new segment.
  elements = [];
  result.push({ name: segment, elements: elements });
});

parser.onElement = (): void => {
  // Parsed a new element.
  components = [];
  elements.push(components);
});

parser.onComponent = (value: string): void => {
  // Got a new component.
  components.push(value);
});

parser.encoding(enc);
parser.write(doc);
parser.end();
```

or more streamlined using the `Reader` utility class

```typescript
import { Reader, ResultType } from "ts-edifact";

const document: string = ...;
const specDir: string = ...;

const reader: Reader = new Reader(specDir);
reader.encoding("UNOC");
const result: ResultType[] = reader.parse(document);
...
```

or if a custom set of segment- and element definitions should be used

```typescript
import { Reader, ResultType, Dictionary, SegmentEntry, ElementEntry } from "ts-edifact";

import * as segmentsData from ".../segments.json";
import * as elementsData from ".../elements.json";

const document: string = ...;
const specDir: string = ...;

const segments: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>(segmentsData);
const elements: Dictionary<ElementEntry> = new Dictionary<ElmentEntry>(elementsData);

const reader: Reader = new Reader(specDir);
reader.encoding("UNOC");
reader.define(segments);
reader.define(elements);

const result: ResultType[] = reader.parse(document);
...
```

## Installation

The module can be installled through:

```shell
npm install ts-edifact
```

Keep in mind that this is an ES6 library. It currently can be used with node 4.0 or higher.

## Overview

This module is build around a central `Parser` class which provides the core UN/EDIFACT parsing functionality. It only exposes four methods:

- the `encoding(string)` method defines the admissible character set to be used while parsing
- the `write()` method to write some data to the parser
- the `separators()`method does return the separators which are used by the parser
- the `end()` method to close an EDI interchange. 

Data read by the parser can be read by using hooks which will be called on specific parsing events.

### Segment and element definitions

Definitions can be provided to describe the structure of segments and elements. An example of a segment definition:

```json
{
  "BGM": {
    "requires": 0,
    "elements": ["C002", "C106", "1225", "4343"]
  }
}
```

A corresponding definition from the UN/EDIFACT `D01A` spec for the above mentioned `BGM` segment can be seen following [this link](http://www.unece.org/trade/untdid/d01a/trsd/trsdbgm.htm).

The `requires` property indicates the number of elements which are required to obtain a valid segment. The `elements` array contains the names of the elements which should be provided. Definitions can also be provided for these elements:

```json
{
  "C002": {
    "requires": 4,
    "components": ["an..3", "an..17", "an..3", "an..35"]
  },
  "C106": {
    "requires": 3,
    "components": ["an..35", "an..9", "an..6"]
  }
}
```

An incomplete set of D01B definition files can be found in the [`src/messageSpec`](src/messageSpec/) folder. The `*.struct.json` files contain the general structure definition of an Edifact message, i.e. `INVOIC.struct.json` contains the message structure specification of a `D01B` Edifact invoice, while `*.segments.json` contain the respective admissible segments of the acutal processed message type and the `*.elements.json` contain the respective component definitions of elements used by segments.

As of version `0.0.7` such definition files can be generated via the [`UNECEMessageStructureParser`](src/edi/messageStructureParser.ts) class in case the definition is available online at the [unece.org](https://www.unece.org) page. This parser will generate a `EdifactMessageSpecification` object structure that holds the actual message type structe definition as well as the segment- and element tables needed to validate the document to process.

The `persist` utility function of the `src/util` class allows to persist the generated definitions to files which can be used onwards.

```typescript
import { MessageStructureParser, UNECEMessageStructureParser } from "ts-edifact";
import { persist } from "ts-edifact/lib/util";

...

function storeSpecFiles(specDir: string, type: string, version: string, revision: string): Promise<...> {
    const structureParser: MessageStructureParser = new UNECEMessageStructureParser(version + revision, type);
    return loadTypeSpec()
      .then((response: EdifactMessageSpecification) => {
          // store downloaded and parsed definition files to the specified directory
          persist(response, specDir));

          ... // some other work
      }
      .catch((error: Error) => handle(error));
}

...
await storeSpecFiles("/home/SomeUser/edifact", "invoic", "d", "01b")
    .then(...);
```

On using the `Reader` class it will attempt to read such specification files from either the provided directory or, if none was provided, it will try to read such definition files from the local directory. The `*.segments.json` and `*.elements.json` files are used during parsing time of the Edifact document to validate that only admissible values are provided for the respective segments/elements. By default, the `ValidatorImpl` class will ignore any unknown segments or element definitions found. If a strict validation should be performed, that throws an error in case an unknown segment or element is contained within the document the validator needs to be initialized with the optional `throwOnMissingDefinitions` parameter set to true.

```typescript
// use strict validation; will throw an error if unknown segments and elements are found
const validator: Validator = new ValidatorImpl(true);
```

The `*.struct.json` file is only used in case an object structure should be generated via the `InterchangeBuilder` class. 

### Performance

Parsing speed including validation but without matching against a segment table is around 20Mbps. Around 30% of the time spent seems to be needed for the validation part.

If performance is critical the event callbacks can also be directly defined as methods on the `Parser` instance. Defining an event callback `onOpenSegment(callback)` then becomes:

```typescript
const parser: Parser = new Parser();
const callback = (segment: string) => { ... };

parser.onOpenSegment = callback;
```

Keep in mind that this avoids any `openSegment` events to be produced and as such, also it's associated overhead.

## Classes

| Class | Description |
| ----- | ----------- |
| [Parser](#Parser) | The `Parser` class encapsulates an online parsing algorithm. By itself it doesn't do anything useful, however the parser can be extended through several event callbacks. |
| [Reader](#Reader) | A convenience class which assigns default callbacks to the respective event callbacks on the parser and returns an array of name- and elements entries, where name is a string referencing the segment name and elements is a multidimensional array where the outer array represents an element of the segment and the inner array will contain the respective components of an element. |
| [Tracker](#Tracker) | A utility class which validates segment order against a given message structure. |
| [Validator](#Validator) | The `Validator` can be used as an add-on to the `Parser` class, to enable validation of segments, elements and components. This class implements a tolerant validator, only segments and elements for which definitions are provided will be validated. Other segments or elements will pass through untouched. Validation includes:<ul><li>Checking data element counts, including mandatory elements.</li><li>Checking component counts, including mandatory components.</li><li>Checking components against their required format.</li> |
| [Counter](#Counter) | The `Counter` class can be used as a validator for the `Parser` class. However it doesn't perform any validation, it only keeps track of segment, element and component counts. Component counts are reset when starting a new element, just like element counts are reset when closing the segment. |
| [InterchangeBuilder](#InterchangeBuilder)| The `InterchangeBuilder` class will use the parsed result obtained by either the reader or the parser and convert the array of segments, by using a corresponding message version definition, into a JavaScript object structure containing the respective messages contained in the parsed Edifact as well as respective segment groups which are further subgrouped by the iteration count on respective segments. I.e. if multiple LIN and accompanying segments are found, they are grouped in their own subgroup and any accompanying segment belonging to that segment group will be added to that subgroup as well. |
| [UNECEMessageStructureParser](#UNECEMessageStructureParser) | A helper class to parse the online version of the UNECE hompeage for the respective Edifact message type structure as well as the admissible segments and elements for the respective message type |
| [SegmentTableBuilder](#SegmentTableBuilder) | A builder for segment definition objects used by the validator and tracker classes |
| [ElementTableBuilder](#ElementTableBuilder) | A builder for element definition objects used by the validator and tracker classes |

## Reference

<a name="Parser"></a>
### Parser

A parser capable of accepting data formatted as an UN/EDIFACT interchange. The constructor accepts a `Validator` instance as an optional argument:

```typescript
new Parser();
new Parser(validator);
```

The first constructor will initialize a `NullValidator`, which does not perform any validation and therefore also not throw any errors.

| Function | Description |
| -------- | ----------- |
| `onOpenSegment(segment: string): void` | Add a listener for a specific open segment event. |
| `onCloseSegment(): void` | Add a listener for a close segment event. |
| `onElement(): void` | Add a listener for starting processing an element within a segment. |
| `onComponent(data: string): void` | Add a listener for a parsed component part of an Edifact element. |
| `encoding(encoding: string): void` | Specifies the character set to use while parsing the Edifact document. By default [`UNOA`](https://blog.sandro-pereira.com/2009/08/15/edifact-encoding-edi-character-set-support/) will be used. |
| `write(chunk)` | Write a chunk of data to the parser |
| `separators()` | *Since v0.0.7* Returns an object of the identified and used separators |
| `end()` | Terminate the EDI interchange |

<a name="Reader"></a>
### Reader

A convenience class which already implements default callbacks for common parsing tasks. 

```typescript
new Reader(specDir?: string);
```

The optional `specDir` parameter should point to the location where the Edifact specification files can be found. If none was provided the reader tries to find them in the local directory.

| Function | Description |
| -------- | ----------- |
| `define(definitions: (Dictionary<SegmentEntry> \| Dictionary<ElementEntry>)): void` | Feeds the validator used inside the reader with the set of known segment and element definitions. Parsed segments which do not adhere to the segments or elements defined in these tables will lead to a failure being thrown and therefore fail the parsing of the Edifact document. |
| `encoding(encoding: string): void` | Specifies the character set to use while parsing the Edifact document. By default [`UNOA`](https://blog.sandro-pereira.com/2009/08/15/edifact-encoding-edi-character-set-support/) will be used. | 
| `parse(document: string): ResultType[]` | Will attempt to parse the document to an array of segment objects where each segment object contains a name and a further multidimensional array of strings representing the elements in the outer array and the respective components of an element in the inner array. Any validation error encountered while reading the Edifact document will lead to an error being thrown and does ending the parsing process preemptively. |

<a name="Tracker"></a>
### Tracker

A utility class which validates segment order against a given message structure. The constructor accepts a segment table as its first argument:

```typescript
new Tracker(table: MessageType[]);
```

| Function | Description |
| -------- | ----------- |
| `accept(segment: string \| MessageType): void` | Match a segment to the message structure and update the current position of the tracker. |
| `reset(): void` | Reset the tracker to the initial position of the current segment table. |

<a name="Validator"></a>
### Validator

The `Validator` can be used to validate segments, elements and components. It keeps track of element and component counts and checks if the component types match those in the segment definition.

```typescript
new ValidatorImpl(throwOnMissingDefinitions?: boolean = false);
```

Since `v0.0.7` a strict validation can be performed on setting the `throwOnMissingDefinitions` parameter to `true` which leads to failures if unknown segments or elements are used within the document under validation. Be default, the current implementation will ignore any unknown segments or elements.

| Function | Description |
| -------- | ----------- |
| `disable(): void` | Disable validation. |
| `enable(): void` | Enable validation. |
| `define(definitions: (Dictionary<SegmentEntry> \| Dictionary<ElementEntry>)): void` | Provision the validator with an array of segment and element definitions. |
| `format(formatString: string): FormatType \| undefined` | Requests a component definition associated with a format string |
| `onOpenSegment(segment: string): void` | Start validation of a new segment |
| `onElement(): void` | Add an element |
| `onOpenComponent(buffer: Tokenizer): void` | Open a component |
| `onCloseComponent(buffer: Tokenizer): void` | Close a component |
| `onCloseSegment(segment: string): void` | Finish the segment |

The `buffer` argument to both `onOpenComponent()` and `onCloseComponent()` should provide three methods `alpha()`, `alphanumeric()`, and `numeric()` allowing the mode of the buffer to be set. It should also expose a `length()` method to check the length of the data currently in the buffer.

<a name="InterchangeBuilder"></a>
### InterchangeBuilder

The `InterchangeBuilder` uses the result of the `Parser` or `Reader` to convert the array of segments into a JavaScript/TypeScript object structure representing the interchange envelop and the respective Edifact messages parsed. 

It will attempt to use the specific message structure definition for the concrete version defined in the message header (`UNH`) to check whether a mandatory segment according to the Edifact specification is missing. A `D96A` invoice should therefore attempt to use the respective `D96A_INVOIC` message structure specification and if not obtainable fall back of a common `INVOIC` message struture specification.

The constructuro expects, besides the parsing result of the Edifact document a base path where the Edifact message structure definition files are located. An incomplete list can be found using the `./node_modules/ts-edifact/lib/messages/` base path.

```typescript
new InterchangeBuilder(parsingResult: ResultType[], basePath: string);
```

<a name="UNECEMessageStructureParser"></a>
### UNECEMessageStructureParser

*Since `v0.0.7`*: This class will parse the [unece.org](https://www.unece.org) Website in order to generate message structure definition as well as segment- and element definitions for a requested message type.

```typescript
new UNECEmessageStructureParser(version: string, type: string);
```

| Function | Description |
| -------- | ----------- |
| `loadTypeSpec(): Promise<EdifactMessageSpecification>` | Downloads the message structure definition page of a respective Edifact message type, i.e. `INVOIC`, and for all specified segments the respective segment definition pages. These pages will be parsed and converted to a object structure supporting the lookup of the respective entries. |

The generated `EdifactMessageSpecification` object will hold the parsed values for the message type structure as well as the segments- and elements used by this message type.

Note that the respective segments and elements are mapped to own typescript objects which are defined in [src/edifact.ts](src/edifact.ts). The current set of classes is probably incomplete and may fall victim to differences between multiple versions and release tags of the Edifact specification. Consider further work to be done here in the future.

<a name="SegmentTableBuilder"></a>
### SegmentTableBuilder

A helper class to load the respective segment definition files, from either the local directory or a specified one, and convert them to a usable data structure needed by the validator and tracker classes.

```typescript
new SegmentTableBuilder(type: string);
```

| Function | Description |
| -------- | ----------- |
| `forVersion(version: string): TableBuilder<SegmentEntry>` | Sets the version of the Edifact document this builder should fetch. |
| `specLocation(location: string): TableBuilder<SegmentEntry>` | Sets the path where to look for the segment definition files. | 
| `build(): Dictionary<SegmentEntry>` | Attempts to load the `*.segments.json` definition file of the specified message type (and version if specified) and returns a dictionary object with the loaded data. If no file could be found only the basic `UNB`, `UNH`, `UNS`, `UNT` and `UNZ` segment definitions are loaded. |

<a name="ElementTableBuilder"></a>
### ElementTableBuilder

A helper class to load the respective element definition files, from either the local directory or a specified one, and convert them to a usable data structure needed by the validator and tracker classes.

```typescript
new ElementTableBuilder(type: string);
```

| Function | Description |
| -------- | ----------- |
| `forVersion(version: string): TableBuilder<ElementEntry>` | Sets the version of the Edifact document this builder should fetch. |
| `specLocation(location: string): TableBuilder<ElementEntry>` | Sets the path where to look for the element definition files. | 
| `build(): Dictionary<ElementEntry>` | Attempts to load the `*.elements.json` definition file of the specified message type (and version if specified) and returns a dictionary object with the loaded data. If no file could be found only the basic element definitions used by the `UNB`, `UNH`, `UNS`, `UNT` and `UNZ` segments are loaded. |