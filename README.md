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

## Installation

The module can be installled through:

```shell
npm install ts-edifact
```

Keep in mind that this is an ES6 library. It currently can be used with node 4.0 or higher.

## Overview

This module is build around a central `Parser` class which provides the core UN/EDIFACT parsing functionality. It only exposes three methods, the `encoding(string)` method defines the admissible character set to be used while parsing, the `write()` method to write some data to the parser and the `close()` method to close an EDI interchange. Data read by the parser can be read by using hooks which will be called on specific parsing events.

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

A corresponding definition from the UN/EDIFACT `D06A` spec for the above mentioned `BGM` segment can be seen following [this link].

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

An incomplete set of definitions is included with the library in the files [`segments.json`](src/main/definitions/segments.json) and [`elements.json`](src/main/definitions/elements.json) and can be included as follows:

```typescript
import { Dictionary, SegmentEntry, ElementEntry  } from "./validator";

import * as segs from "./definitions/segments.json";
import * as eles from "./definitions/elements.json";

const segments: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>(segs);
const elements: Dictionary<ElementEntry> = new Dictionary<ElementEntry>(eles);
```

A working example using segment and element definitions can be found in the `examples` directory.

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

## Reference

<a name="Parser"></a>
### Parser

A parser capable of accepting data formatted as an UN/EDIFACT interchange. The constructor accepts a `Validator` instance as an optional argument:

```
new Parser([validator])
```

| Function | Description |
| -------- | ----------- |
| `onOpenSegment(segment: string): void` | Add a listener for a specific open segment event. |
| `onCloseSegment(): void` | Add a listener for a close segment event. |
| `onElement(): void` | Add a listener for starting processing an element within a segment. |
| `onComponent(data: string): void` | Add a listener for a parsed component part of an Edifact element. |
| `encoding(encoding: string): void` | Specifies the character set to use while parsing the Edifact document. By default [`UNOA`](https://blog.sandro-pereira.com/2009/08/15/edifact-encoding-edi-character-set-support/) will be used. |
| `write(chunk)` | Write a chunk of data to the parser |
| `end()` | Terminate the EDI interchange |

<a name="Reader"></a>
### Reader

A convenience class which already implements default callbacks for common parsing tasks. 

```typescript
new Reader();
```

| Function | Description |
| -------- | ----------- |
| `define(definitions: (Dictionary\<SegmentEntry> \| Dictionary\<ElementEntry>)): void` | Feeds the validator used inside the reader with the set of known segment and element definitions. Parsed segments which do not adhere to the segments or elements defined in these tables will lead to a failure being thrown and therefore fail the parsing of the Edifact document. |
| `encoding(encoding: string): void` | Specifies the character set to use while parsing the Edifact document. By default [`UNOA`](https://blog.sandro-pereira.com/2009/08/15/edifact-encoding-edi-character-set-support/) will be used. | 
| `parse(document: string): ResultType[]` | Will attempt to parse the document to an array of segment objects where each segment object contains a name and a further multidimensional array of strings representing the elements in the outer array and the respective components of an element in the inner array. Any validation error encountered while reading the Edifact document will lead to an error being thrown and does ending the parsing process preemptively. |

<a name="Tracker"></a>
### Tracker

A utility class which validates segment order against a given message structure. The constructor accepts a segment table as it's first argument:

```
new Tracker(table)
```

| Function | Description |
| -------- | ----------- |
| `accept(segment)` | Match a segment to the message structure and update the current position of the tracker. |
| `reset()` | Reset the tracker to the initial position of the current segment table. |

<a name="Validator"></a>
### Validator

The `Validator` can be used to validate segments, elements and components. It keeps track of element and component counts and checks if the component types match those in the segment definition.

```typescript
new ValidatorImpl()
```

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

The `buffer` argument to both `onopencomponent()` and `onclosecomponent()` should provide three methods `alpha()`, `alphanumeric()`, and `numeric()` allowing the mode of the buffer to be set. It should also expose a `length()` method to check the length of the data currently in the buffer.

<a name="InterchangeBuilder"></a>
### InterchangeBuilder

The `InterchangeBuilder` uses the result of the `Parser` or `Reader` to convert the array of segments into a JavaScript/TypeScript object structure representing the interchange envelop and the respective Edifact messages parsed. 

It will attempt to use the specific message structure definition for the concrete version defined in the message header (`UNH`) to check whether a mandatory segment according to the Edifact specification is missing. A `D96A` invoice should therefore attempt to use the respective `D96A_INVOIC` message structure specification and if not obtainable fall back of a common `INVOIC` message struture specification.

```typescript
new InterchangeBuilder(parsingResult: ResultType[]);
```