/**
 * @author Stefan Partheymüller
 * @copyright 2021 Stefan Partheymüller
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

import { StateMachineDefinition } from "@initics/tsm";
import { UNECEDomHandler } from "./uneceDomHandler";
import { MessageType } from "../tracker";

import { EdifactMessageSpecification } from "./messageStructureParser";
import { UNECEPageParser } from "./unecePageParser";

enum State {
    initial = 'initial',
    messageStructureStart = 'messageStructureStart',
    messageStructureEnd = 'messageStructureEnd',
    headerSection = 'headerSection',
    detailSection = 'detailSection',
    summarySection = 'summarySection',
    beforeDetailSection = 'beforeDetailSection',
    segmentPosition = 'segmentPosition',
    segmentGroup = 'segmentGroup',
    segmentName = 'segmentName',
    segmentDescription = 'segmentDescription',
}

const SM_DEFINITION: StateMachineDefinition = {
    initial: State.initial,
    transitions: [
        { from: State.initial, to: State.messageStructureStart },
        { from: State.messageStructureStart, to: State.headerSection },
        { from: State.messageStructureStart, to: State.segmentPosition },
        { from: State.headerSection, to: State.segmentPosition },
        { from: State.detailSection, to: State.segmentPosition },
        { from: State.summarySection, to: State.segmentPosition },
        { from: State.segmentPosition, to: State.segmentGroup },
        { from: State.segmentPosition, to: State.messageStructureEnd },
        { from: State.segmentGroup, to: State.segmentName },
        { from: State.segmentGroup, to: State.segmentPosition },
        { from: State.segmentName, to: State.segmentDescription },
        { from: State.segmentDescription, to: State.segmentPosition },
        { from: State.segmentDescription, to: State.detailSection },
        { from: State.segmentDescription, to: State.summarySection }
    ]
};

/**
 * This class is capable to parse legacy UN/EDIFACT message type specification
 * pages from UNECE up to version D99A.
 */
export class UNECEStructurePageParser extends UNECEPageParser {

    readonly segmentNames: string[];

    constructor(spec: EdifactMessageSpecification) {
        super(SM_DEFINITION);
        this._spec = spec;
        this.segmentNames = [];
    }

    protected setupHandler(): UNECEDomHandler {
        const helper: UNECEDomHandler = super.setupHandler();

        let index: number = 0;
        const stack: MessageType[][] = [];
        const resetStack = () => {
            for (; index > 0; index--) {
                stack.pop();
            }
        };

        let isSegmentGroupEnd: boolean = false;
        let section: string | undefined;
        let name: string;

        stack.push(this.spec.messageStructureDefinition);

        helper.onText = (text: string) => {
            switch (this.sm.state) {
                case State.initial:
                    if (text.includes('Message structure')) {
                        this.sm.transition(State.messageStructureStart);
                    }
                    break;

                case State.messageStructureStart:
                    if (text.includes('HEADER SECTION')) {
                        this.sm.transition(State.headerSection);
                        section = 'header';
                        this.sm.transition(State.segmentPosition);
                    }
                    break;

                case State.segmentPosition:
                    if (text.match(/[0-9]{4}/g)) {
                        this.sm.transition(State.segmentGroup);
                    } else {
                        this.sm.transition(State.messageStructureEnd);
                    }
                    break;

                case State.segmentGroup:
                    if (text.includes('Segment group')) {
                        isSegmentGroupEnd = false;
                        const group: MessageType = this.parseSegmentGroup(section, text);
                        const level: number = this.parseSegmentGroupLevel(text);
                        const delta: number = level - index;
                        if (delta <= 0) {
                            for (let i: number = 0; i < (delta * -1 + 1); i++) {
                                stack.pop();
                                index--;
                            }
                        }

                        stack[index].push(group);
                        stack.push(group.content as []);
                        index++;

                        // reset section assignment after first segment group
                        section = undefined;

                        this.sm.transition(State.segmentPosition);
                    } else {
                        // if the previous segment group was has ended and there
                        // is not a new segment group => reset the stack.
                        if (isSegmentGroupEnd) {
                            resetStack();
                        }
                        this.sm.transition(State.segmentName);
                    }
                    break;

                case State.segmentName:
                    name = text;
                    this.addSegmentName(name);
                    this.sm.transition(State.segmentDescription);
                    break;

                case State.segmentDescription: {
                    const item: MessageType = this.parseSegment(name, section, text);
                    stack[index].push(item);

                    isSegmentGroupEnd = this.isSegmentGroupEnd(text);

                    const detailSection: boolean = text.includes('DETAIL SECTION');
                    const summarySection: boolean = text.includes('SUMMARY SECTION');
                    if (detailSection || summarySection) {
                        // reset the stack if a new section begins
                        resetStack();
                        if (detailSection) {
                            section = 'detial';
                            this.sm.transition(State.detailSection);
                        } else {
                            section = 'summary';
                            this.sm.transition(State.summarySection);
                        }
                    }

                    this.sm.transition(State.segmentPosition);
                    break;
                }

                case State.messageStructureEnd: break;

                default: this.throwInvalidParserState(this.sm.state);
            }
        };
        helper.onOpenTag = name => {
            if (this.sm.state === State.messageStructureStart && name === 'a') {
                this.sm.transition(State.segmentPosition);
            }
        };

        return helper;
    }

    private addSegmentName(name: string): void {
        const excludeSegmentNames: string[] = ['UNH', 'UNS', 'UNT'];
        if (!excludeSegmentNames.includes(name) && !this.segmentNames.includes(name)) {
            this.segmentNames.push(name);
        }
    }

    private parseSegmentGroup(section: string | undefined, descriptionString: string): MessageType {
        const regex: RegExp = /^.* (Segment group \d*).*\s*([M|C])\s*(\d*).*/g;
        const matches: RegExpExecArray | null = regex.exec(descriptionString);
        if (!matches) {
            throw new Error('Invalid segment description string');
        }

        const name: string = matches[1];
        const mandatoryString: string = matches[2];
        const repetitionString: string = matches[3];

        return {
            name,
            content: [],
            mandatory: mandatoryString === 'M',
            repetition: Number.parseInt(repetitionString),
            data: undefined,
            section: section || undefined
        };
    }

    private parseSegment(name: string, section: string | undefined, descriptionString: string): MessageType {
        const regex: RegExp = /^([a-zA-Z /\\-]*)\s*?([M|C])\s*?([0-9]*?)([^0-9]*)$/g;
        const matches: RegExpExecArray | null = regex.exec(descriptionString);
        if (!matches) {
            throw new Error(`${name}: Invalid segment description string: ${descriptionString}`);
        }

        const mandatoryString: string = matches[2];
        const repetitionString: string = matches[3];

        return {
            content: name,
            mandatory: mandatoryString === 'M',
            repetition: Number.parseInt(repetitionString),
            data: undefined,
            section: section || undefined
        };
    }

    private parseSegmentGroupLevel(descriptionString: string): number {
        const regex: RegExp = /^.*[0-9]+([^0-9]*)$/g;
        const matches: RegExpExecArray | null = regex.exec(descriptionString);
        if (!matches) {
            throw new Error('Invalid segment description string');
        }

        // Create the "level string" by reversing the segment group description.
        const levelString: string = Array.from(matches[1]).reverse().join('');
        let normalization: number = 0;

        // In some message type specifications the segment group description
        // ends with LF and sometimes with CRLF.
        // Make sure both cases are covered:
        if (levelString.charCodeAt(0) !== 10) {
            console.warn(`Unrecognized character in level string: ${levelString[0]} (${levelString.charCodeAt(0)})`);
        } else if (levelString.charCodeAt(1) === 13) {
            normalization = 1;
        }

        return levelString.indexOf('Ŀ') - normalization;
    }

    private isSegmentGroupEnd(descriptionString: string): boolean {
        const regex: RegExp = /\d+�+/g;
        return !!regex.exec(descriptionString);
    }

}
