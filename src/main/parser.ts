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

import { Configuration } from "./configuration";
import { Tokenizer } from "./tokenizer";
import { EventValidator, NullValidator } from "./validator";

import { EventEmitter } from "events";

enum States {
    EMPTY = 0,
    SEGMENT = 1,
    ELEMENT = 2,
    COMPONENT = 3,
    MODESET = 4,
    DATA = 5,
    CONTINUED = 6,
}

export class Parser extends EventEmitter {

    private validator: EventValidator;
    private configuration: Configuration;
    private tokenizer: Tokenizer;
    private state: States;

    constructor(validator?: EventValidator) {
        super();

        EventEmitter.apply(this);

        if (validator) {
            this.validator = validator;
        } else {
            this.validator = new NullValidator();
        }
        this.configuration = new Configuration();
        this.tokenizer = new Tokenizer(this.configuration);
        this.state = States.EMPTY;
    }

    onOpenSegment(segment: string): void {
        this.emit("openSegment", segment);
    }

    onCloseSegment(): void {
        this.emit("closeSegment");
    }

    onElement(): void {
        this.emit("element");
    }

    onComponent(data: string): void {
        this.emit("component", data);
    }

    /**
     * Set an encoding level.
     * @param level - The encoding level name.
     */
    encoding(level: string): void {
        const previous: string = this.configuration.level;

        this.configuration.encoding(level);
        if (this.configuration.level !== previous) {
            this.tokenizer.configure(this.configuration);
        }
    }

    /**
     * @summary Ends the EDI interchange.
     * @throws {Error} If more data is expected.
     */
    end(): void {
        // The stream can only be closed if the last segment is complete. This
        // means the parser is currently in a state accepting segment data, but no
        // data was read so far.
        if (this.state !== States.SEGMENT || this.tokenizer.buffer !== "") {
            throw this.errors.incompleteMessage();
        } else {
            this.state = States.EMPTY;
        }
    }

    una(chunk: string): boolean {
        if (/^UNA.... ./g.test(chunk)) {
            this.configuration.config.componentDataSeparator = chunk.charCodeAt(3);
            this.configuration.config.dataElementSeparator   = chunk.charCodeAt(4);
            this.configuration.config.decimalMark            = chunk.charCodeAt(5);
            this.configuration.config.releaseCharacter       = chunk.charCodeAt(6);
            this.configuration.config.segmentTerminator      = chunk.charCodeAt(8);

            this.tokenizer.configure(this.configuration);
            return true;
        } else {
            return false;
        }
    }

    write(chunk: string): void {
        // The position of the parser
        let index: number = 0;
        if (this.state === States.CONTINUED) {
            this.state = States.MODESET;
        }
        while (index < chunk.length) {
            switch (this.state) {
                case States.EMPTY:
                    index = this.una(chunk) ? 9 : 0;
                    // If the first segment is interrupted by, for example, a line break, the
                    // parser will remain in the same state as it has here. Since we don't
                    // want the parser to detect another UNA header, in such a case, we put it
                    // in the segment state.
                    this.state = States.SEGMENT;
                    // Continue to read the first segment, otherwise the index increment add
                    // the end of the loop would cause the parser to skip the first character.
                // eslint-disable-next-line no-fallthrough
                case States.SEGMENT:
                    index = this.tokenizer.segment(chunk, index);
                    // Determine the next parser state
                    switch (chunk.charCodeAt(index) || this.configuration.config.endOfTag) {
                        case this.configuration.config.dataElementSeparator:
                            this.validator.onOpenSegment(this.tokenizer.buffer);
                            this.onOpenSegment(this.tokenizer.buffer);
                            this.state = States.ELEMENT;
                            this.tokenizer.buffer = "";
                            break;
                        case this.configuration.config.segmentTerminator:
                            this.validator.onOpenSegment(this.tokenizer.buffer);
                            this.onOpenSegment(this.tokenizer.buffer);
                            this.validator.onCloseSegment("");
                            this.onCloseSegment();
                            this.state = States.SEGMENT;
                            this.tokenizer.buffer = "";
                            break;
                        case this.configuration.config.endOfTag:
                        case this.configuration.config.carriageReturn:
                        case this.configuration.config.lineFeed:
                            break;
                        default:
                            throw this.errors.invalidControlAfterSegment(this.tokenizer.buffer, chunk.charAt(index));
                    }
                    break;
                case States.ELEMENT:
                    // Start reading a new element
                    this.validator.onElement();
                    this.onElement();
                // eslint-disable-next-line no-fallthrough
                case States.COMPONENT:
                    // Start reading a new component
                    this.validator.onOpenComponent(this.tokenizer);
                    // Fall through to process the available component data
                case States.MODESET:
                case States.DATA:
                    index = this.tokenizer.data(chunk, index);
                    // Determine the next parser state
                    switch (chunk.charCodeAt(index) || this.configuration.config.endOfTag) {
                        case this.configuration.config.componentDataSeparator:
                            this.validator.onCloseComponent(this.tokenizer);
                            this.onComponent(this.tokenizer.buffer);
                            this.state = States.COMPONENT;
                            this.tokenizer.buffer = "";
                            break;
                        case this.configuration.config.dataElementSeparator:
                            this.validator.onCloseComponent(this.tokenizer);
                            this.onComponent(this.tokenizer.buffer);
                            this.state = States.ELEMENT;
                            this.tokenizer.buffer = "";
                            break;
                        case this.configuration.config.segmentTerminator:
                            this.validator.onCloseComponent(this.tokenizer);
                            this.onComponent(this.tokenizer.buffer);
                            this.validator.onCloseSegment("");
                            this.onCloseSegment();
                            this.state = States.SEGMENT;
                            this.tokenizer.buffer = "";
                            break;
                        case this.configuration.config.decimalMark:
                            this.tokenizer.decimal(chunk, index);
                            this.state = States.DATA;
                            break;
                        case this.configuration.config.releaseCharacter:
                            index++;
                            this.tokenizer.release(chunk, index);
                            this.state = States.DATA;
                            break;
                        case this.configuration.config.endOfTag:
                        case this.configuration.config.carriageReturn:
                        case this.configuration.config.lineFeed:
                            this.state = States.DATA;
                            break;
                        default:
                            throw this.errors.invalidCharacter(chunk.charAt(index), index);
                    }
            }
            // Consume the control character
            index++;
        }
    }

    private errors = {
        incompleteMessage: function(): Error {
            return new Error("Cannot close an incomplete message");
        },
        invalidCharacter: function(character: string, index: number): Error {
            let message: string = "";
            message += "Invalid character " + character;
            message += ` at position ${index}`;
            return new Error(message);
        },
        invalidControlAfterSegment: function (segment: string, character: string): Error {
            let message: string = "";
            message += "Invalid character " + character;
            message += " after reading segment name " + segment;
            return new Error(message);
        }
    };
}
