/**
 * @author Roman Vottner
 * @copyright 2020 Roman Vottner
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Tokenizer } from "./tokenizer";

export class Dictionary<T> {

    private entries: { [key: string]: T };

    constructor(data?: { [key: string]: T}) {
        this.entries = {};

        if (data) {
            for (const key in data) {
                this.add(key, data[key]);
            }
        }
    }

    contains(key: string): boolean {
        if (Object.prototype.hasOwnProperty.call(this.entries, key)) {
            return true;
        }
        return false;
    }

    get(key: string): T | undefined {
        if (this.contains(key)) {
            return this.entries[key];
        }
        return undefined;
    }

    keys(): string[] {
        return Object.keys(this.entries);
    }

    add(key: string, value: T): T {
        this.entries[key] = value;
        return value;
    }

    length(): number {
        return this.keys().length;
    }
}

export type SegmentEntry = { requires: number; elements: string[] };
export type ElementEntry = { requires: number; components: string[] };

interface FormatType {
    alpha: boolean;
    numeric: boolean;
    minimum: number;
    maximum: number;
}

export enum ValidatorStates {
    /**
     * Setting validation to none will disable the validator completely. The
     * validator will not even try to obtain a segment description for segments
     * encountered. Almost all overhead is eliminated in this state.
     */
    NONE = 0,
    /**
     * The segments state implies no segment definition was found for the current
     * segment, so validation should be disabled for its elements and components.
     * Normal validation should be resumed, however, as of the next segment.
     */
    SEGMENTS = 1,
    /**
     * The elements state is equivalent to the segments state, but validation is
     * only temporary disabled for the current element. Normal validation resumes
     * as of the next element.
     */
    ELEMENTS = 2,
    /**
     * Validation is enabled for all entities, including segments, elements and
     * components.
     */
    ALL = 3,
    ENTER = 4,
    ENABLE = 5,
}

export interface EventValidator {
    onOpenSegment(segment: string): void;
    onElement(): void;
    onOpenComponent(buffer: Tokenizer): void;
    onCloseComponent(buffer: Tokenizer): void;
    onCloseSegment(segment: string): void;
}

export interface Validator extends EventValidator {
    disable(): void;
    enable(): void;
    define(definitions: (Dictionary<SegmentEntry> | Dictionary<ElementEntry>)): void;
    format(formatString: string): FormatType | undefined;
}

export class NullValidator implements EventValidator {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenSegment(): void {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onElement(): void {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenComponent(): void {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCloseComponent(): void {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCloseSegment(): void {}
}

/**
 * The `Validator` can be used as an add-on to `Parser` class, to enable
 * validation of segments, elements and components. This class implements a
 * tolerant validator, only segments and elemens for which definitions are
 * provided will be validated. Other segments or elements will pass through
 * untouched. Validation includes:
 * * Checking data element counts, including mandatory elements.
 * * Checking component counts, including mandatory components.
 * * Checking components against they're required format.
 */
export class ValidatorImpl implements Validator {

    private segments: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>();
    private elements: Dictionary<ElementEntry> = new Dictionary<ElementEntry>();
    private formats: Dictionary<FormatType> = new Dictionary<FormatType>();
    private counts = {
        segment: 0,
        element: 0,
        component: 0
    };
    private state: ValidatorStates;

    private segment: SegmentEntry | undefined = undefined;
    private element: ElementEntry | undefined = undefined;
    private component: FormatType | undefined = undefined;

    private required: number = 0;
    private minimum: number = 0;
    private maximum: number = 0;

    constructor() {
        this.state = ValidatorStates.ALL;
    }

    /**
     * @summary Enable validation on the next segment.
     */
    public disable(): void {
        this.state = ValidatorStates.NONE;
    }

    /**
     * @summary Enable validation on the next segment.
     */
    public enable(): void {
        this.state = ValidatorStates.SEGMENTS;
    }

    public define(definitions: (Dictionary<SegmentEntry> | Dictionary<ElementEntry>)): void {
        for (const key of definitions.keys()) {
            const entry: (SegmentEntry | ElementEntry | undefined) = definitions.get(key);
            if (entry && Object.prototype.hasOwnProperty.call(entry, "elements")) {
                this.segments.add(key, entry as SegmentEntry);
            }
            if (entry && Object.prototype.hasOwnProperty.call(entry, "components")) {
                this.elements.add(key, entry as ElementEntry);
            }
        }
    }

    /**
     * @summary Request a component definition associated with a format string.
     * @returns A component definition.
     */
    format(formatString: string): FormatType | undefined {
        // Check if we have a component definition in cache for this format string.
        if (this.formats.contains(formatString)) {
            return this.formats.get(formatString);
        } else {
            let parts: RegExpExecArray | null;
            if ((parts = /^(a|an|n)(\.\.)?([1-9][0-9]*)?$/.exec(formatString))) {
                const max: number = parseInt(parts[3]);
                const min: number = parts[2] === ".." ? 0 : max;
                let alpha: boolean = false;
                let numeric: boolean = false;
                switch (parts[1]) {
                    case "a":
                        alpha = true;
                        break;
                    case "n":
                        numeric = true;
                        break;
                    case "an":
                        alpha = true;
                        numeric = true;
                        break;
                }

                return this.formats.add(formatString, { alpha: alpha, numeric: numeric, minimum: min, maximum: max });
            } else {
                throw this.errors.invalidFormatString(formatString);
            }
        }
    }

    onOpenSegment(segment: string): void {
        switch (this.state) {
            case ValidatorStates.ALL:
            case ValidatorStates.ELEMENTS:
            case ValidatorStates.SEGMENTS:
            case ValidatorStates.ENABLE:
                // Try to retrieve a segment definition if validation is not turned off.
                if ((this.segment = this.segments.get(segment))) {
                    // The onelement function will close the previous element, however we
                    // don't want the component counts to be checked. To disable them we put
                    // the validator in the elements state.
                    this.state = ValidatorStates.ELEMENTS;
                } else {
                    throw this.errors.missingSegmentDefinition(segment);
                }
        }
        this.counts.segment += 1;
        this.counts.element = 0;
    }

    onElement(): void {
        let name: string;

        switch (this.state) {
            case ValidatorStates.ALL:
                if (this.segment === undefined) {
                    throw this.errors.missingSegmentStart();
                }
                name = this.segment.elements[this.counts.element];
                if (this.element === undefined) {
                    throw this.errors.missingElementStart(name);
                }

                // Check component of the previous enter
                if (this.counts.component < this.element.requires || this.counts.component > this.element.components.length) {
                    throw this.errors.countError("Element", name, this.element, this.counts.component);
                }
                // Fall through to continue with element count validation
            case ValidatorStates.ENTER:
                // Skip component count checks for the first element
            // eslint-disable-next-line no-fallthrough
            case ValidatorStates.ELEMENTS:
                if (this.segment === undefined) {
                    throw this.errors.missingSegmentStart();
                }
                // eslint-disable-next-line no-case-declarations
                const key: string = this.segment.elements[this.counts.element];
                if ((this.element = this.elements.get(key))) {
                    this.state = ValidatorStates.ALL;
                } else {
                    this.state = ValidatorStates.ELEMENTS;
                }
        }
        this.counts.element += 1;
        this.counts.component = 0;
    }

    /**
     * @summary Start validation for a new component.
     * @param buffer - An object which implements the buffer interface.
     *
     * The buffer object should allow the mode to be set to alpha, numeric or
     * alphanumeric with their corresponding methods.
     */
    onOpenComponent(buffer: Tokenizer): void {
        if (this.segment === undefined) {
            throw this.errors.missingSegmentStart();
        }

        switch (this.state) {
            case ValidatorStates.ALL:
                // eslint-disable-next-line no-case-declarations
                const name: string = this.segment.elements[this.counts.element];
                if (this.element === undefined) {
                    throw this.errors.missingElementStart(name);
                }

                // Retrieve a component definition if validation is set to all
                this.component = this.format(this.element.components[this.counts.component]);
                if (this.component === undefined) {
                    return;
                }
                this.required = this.element.requires;
                this.minimum = this.component.minimum;
                this.maximum = this.component.maximum;
                // Set the corresponding buffer mode
                if (this.component.alpha) {
                    if (this.component.numeric) {
                        buffer.alphanumeric();
                    } else {
                        buffer.alpha();
                    }
                } else {
                    if (this.component.numeric) {
                        buffer.numeric();
                    } else {
                        buffer.alphanumeric();
                    }
                }
                break;
            default:
                // Set the buffer to its default mode
                buffer.alphanumeric();
        }
        this.counts.component += 1;
    }

    onCloseComponent(buffer: Tokenizer): void {
        let length: number;

        switch (this.state) {
            case ValidatorStates.ALL:
                // Component validation is only needed when validation is set to all
                length = buffer.length();
                // eslint-disable-next-line no-case-declarations
                let name: string;
                if (this.segment) {
                    name = this.segment.elements[this.counts.element];
                } else {
                    throw this.errors.missingSegmentStart(this.segment);
                }

                // We perform validation if either the required component count is greater than
                // or equal to the current component count or if a non-empty value was found
                if (this.required >= this.counts.component || length > 0) {
                    if (length < this.minimum) {
                        throw this.errors.invalidData(name, `'${buffer.content()}' length is less than minimum length ${this.minimum}`);
                    } else if (length > this.maximum) {
                        throw this.errors.invalidData(name, `'${buffer.content()} exceeds maximum length ${this.maximum}`);
                    }
                }
        }
    }

    /**
     * @summary Finish validation for the current segment.
     */
    onCloseSegment(segment: string): void {
        let name: string;

        switch (this.state) {
            case ValidatorStates.ALL:
                if (this.segment === undefined) {
                    throw this.errors.missingSegmentStart(segment);
                }
                if (this.element === undefined) {
                    throw this.errors.missingElementStart(segment);
                }

                if (this.counts.component < this.element.requires || this.counts.component > this.element.components.length) {
                    name = this.segment.elements[this.counts.element];
                    throw this.errors.countError("Element", name, this.element, this.counts.component);
                }
                // Fall through to continue with element cound validation
            case ValidatorStates.ELEMENTS:
                if (this.segment === undefined) {
                    throw this.errors.missingSegmentStart(segment);
                }

                if (this.counts.element < this.segment.requires || this.counts.element > this.segment.elements.length) {
                    name = segment;
                    throw this.errors.countError("Segment", name, this.segment, this.counts.element);
                }
        }
    }

    private errors = {
        invalidData: function(element: string, msg: string): Error {
            return new Error(`Could not accept data on element ${element}: ${msg}`);
        },
        invalidFormatString: function(formatString: string): Error {
            return new Error("Invalid format string " + formatString);
        },
        countError: function(type: string, name: string, definition: (ElementEntry | SegmentEntry), count: number): Error {
            let array: string;
            let start: string = type + " " + name;
            let end: string;

            let length: number = 0;
            if (type === "Segment") {
                array = "elements";
                const entry: SegmentEntry = definition as SegmentEntry;
                length = entry.elements.length;
            } else {
                array = "components";
                const entry: ElementEntry = definition as ElementEntry;
                length = entry.components.length;
            }

            if (count < definition.requires) {
                start += " only";
                end = ` but requires at least ${definition.requires}`;
            } else {
                end = ` but accepts at most ${length}`;
            }
            return new Error(start + ` got ${count} ` + array + end);
        },
        missingElementStart: function(segment: string): Error {
            const message: string = "Active open element expected on segment " + segment ;
            return new Error(message);
        },
        missingSegmentStart: function(segment?: string): Error {
            let name: string;
            if (segment) {
                name = "'" + segment + "' ";
            } else {
                name = "";
            }
            return new Error(`Active open segment ${name} expected. Found none`);
        },
        missingSegmentDefinition: function(segment: string): Error {
            return new Error(`No segment definition found for segment name ${segment}`);
        }
    };
}
