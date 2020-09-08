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

import { Dictionary, SegmentEntry, ElementEntry } from "../validator";
import { MessageType } from "../tracker";
import { HttpClient } from "../httpClient";
import { Parser, DomHandler } from "htmlparser2";
import { isDefined } from "../util";

export interface EdifactMessageSpecification {
    readonly messageType: string;
    readonly version: string;
    readonly release: string;
    readonly controllingAgency: string;

    /**
     * Contains the available segments as key and the respective elements
     * a segment contains as well as the mandatory count as value
     */
    readonly segmentTable: Dictionary<SegmentEntry>;
    /**
     * Contains the respective element ID as key and the type definition of
     * the respective components as value
     */
    readonly elementTable: Dictionary<ElementEntry>;
    /**
     * Contains the actual message structure generatedby this parser
     */
    readonly messageStructureDefinition: MessageType[];

    type(): string;
    versionAbbr(): string;
}

class EdifactMessageSpecificationImpl implements EdifactMessageSpecification {

    messageType: string;
    version: string;
    release: string;
    controllingAgency: string;

    segmentTable: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>();
    elementTable: Dictionary<ElementEntry> = new Dictionary<ElementEntry>();
    messageStructureDefinition: MessageType[] = [];

    constructor(messageType: string, version: string, release: string, controllingAgency: string) {
        this.messageType = messageType;
        this.version = version;
        this.release = release;
        this.controllingAgency = controllingAgency;
    }

    public type(): string {
        return this.version + this.release + "_" + this.messageType;
    }

    public versionAbbr(): string {
        return this.version + this.release;
    }
}

enum Part {
    BeforeStructureDef,
    RefLink,
    Pos,
    Tag,
    Deprecated,
    Name,
    AfterStructureDef
}

export class MessageStructureParser {

    private version: string;
    private type: string;
    private httpClient: HttpClient;

    constructor(version: string, type: string) {
        this.version = version.toLowerCase();
        this.type = type.toLowerCase();

        const baseUrl: string = "https://www.unece.org/trade/untdid/" + this.version + "/trmd/" + this.type + "_c.htm";
        this.httpClient = new HttpClient(baseUrl);
    }

    async loadPage(page: string): Promise<string> {
        const data: string = await this.httpClient.get(page);
        return data;
    }

    private extractTextValue(text: string, regex: RegExp, index: number = 0): string {
        const arr: RegExpExecArray | null = regex.exec(text);
        if (isDefined(arr)) {
            return arr[index];
        }
        return "";
    }

    private parsePage(page: string): EdifactMessageSpecification {
        let definition: EdifactMessageSpecification | undefined;
        const handler: DomHandler = new DomHandler();

        let state: Part = Part.BeforeStructureDef;
        let section: string | null = "header";
        const segStack: MessageType[][] = [];

        const nextState = () => {
            if (state === Part.RefLink) {
                state = Part.Pos;
            } else if (state === Part.Pos) {
                state = Part.Deprecated;
            } else if (state === Part.Deprecated) {
                state = Part.Tag;
            } else if (state === Part.Tag) {
                state = Part.Name;
            } else if (state === Part.Name) {
                state = Part.RefLink;
            }
        };

        handler.ontext = (text: string) => {
            if (text.includes("Message Type") && text.includes("Version") && text.includes("Release")) {
                const messageType: string = this.extractTextValue(text, /Message Type\s*: ([A-Z]*)\s/g, 1);
                const version: string = this.extractTextValue(text, /Version\s*: ([A-Z]*)\s/g, 1);
                const release: string = this.extractTextValue(text, /Release\s*: ([0-9A-Z]*)\s/g, 1);
                const controllingAgency: string = this.extractTextValue(text, /Contr. Agency\s*: ([0-9A-Z]*)\s/g, 1);
                definition = new EdifactMessageSpecificationImpl(messageType, version, release, controllingAgency);
                segStack.push(definition.messageStructureDefinition);
            } else if (text.includes("Message structure")) {
                state = Part.RefLink;
            } else if (text.includes("DETAIL SECTION")) {
                section = "detail";
            } else if (text.includes("SUMMARY SECTION")) {
                section = "summary";
            } else if (state !== Part.BeforeStructureDef && state !== Part.AfterStructureDef) {
                if (state === Part.RefLink) {
                    // ignored
                    console.log(`RefLink: ${text}`);
                } else if (state === Part.Pos) {
                    console.log(`Pos: ${text}`);
                } else if (state === Part.Deprecated) {

                    if (text.includes("----- Segment group")) {
                        const regex: RegExp = /^\s*-* (Segment group \d*)\s*-*\s*([M|C])\s*(\d*)([-|\\+|\\|]*).*/g;
                        const arr: RegExpExecArray | null = regex.exec(text);
                        if (isDefined(arr)) {
                            const groupArray: MessageType[] = [];
                            const group: MessageType = {
                                content: groupArray,
                                mandatory: arr[2] === "M" ? true : false,
                                repetition: parseInt(arr[3]),
                                name: arr[1]
                            };
                            // add the group to the end of the current top segments
                            segStack[segStack.length - 1].push(group);
                            // push the array managed by this group to the end of the stack to fill it down the road
                            segStack.push(groupArray);
                        }
                        // no further tags available, continue on the next line with the RefLink
                        state = Part.RefLink;
                    } else {
                        console.log(`Deprecated: ${text}`);
                        nextState();
                    }
                } else if (state === Part.Tag) {
                    console.log(`Tag: ${text}`);
                    const _section: string | undefined = section !== null ? section : undefined;
                    let _data: string[] | undefined;
                    if (definition) {
                        _data = text === "UNH" ? [ definition.versionAbbr(), definition.messageType ] : undefined;
                    }
                    const segment: MessageType = {
                        content: text,
                        mandatory: false,
                        repetition: 0,
                        data: _data,
                        section: _section
                    };
                    if (definition) {
                        segStack[segStack.length - 1].push(segment);
                    }
                    section = null;
                } else if (state === Part.Name) {
                    console.log(`Name: ${text}`);
                    // reusing the regex-pattern result in an empty value every second usage for some reason ...
                    const regex: RegExp = /^([a-zA-Z /\\-]*)\s*?([M|C])\s*?([0-9]*?)[^0-9]*?([-|\\+|\\||\s]*?)$/g;
                    const arr: RegExpExecArray | null = regex.exec(text);
                    if (isDefined(arr)) {
                        const name: string = arr[1].trim();
                        const sMandatory: string = arr[2];
                        const sRepetition: string = arr[3];
                        const remainder: string = arr[4];
                        console.log(`Processing segment: ${name}`);

                        // update the last element on the top-most stack with the respective data
                        const segArr: MessageType[] = segStack[segStack.length - 1];
                        const segData: MessageType = segArr[segArr.length - 1];
                        segData.mandatory = sMandatory === "M" ? true : false;
                        segData.repetition = parseInt(sRepetition);

                        // check whether the remainder contains a closing hint for a subgroup: -...-++
                        if (remainder.includes("-") && remainder.includes("+")) {
                            for (let i: number = 0; i < remainder.split("+").length - 1; i++) {
                                segStack.pop();
                            }
                        }

                        nextState();
                    }
                } else {
                    console.log(`Unknown part: ${text}`);
                }
            }
        };
        handler.onopentag = (name: string) => {
            if (name === "p" && state !== Part.BeforeStructureDef && state !== Part.AfterStructureDef) {
                state = Part.AfterStructureDef;
            }
        };
        handler.onclosetag = () => {
            nextState();
        };
        const parser: Parser = new Parser(handler);
        parser.write(page);
        parser.end();

        if (definition) {
            return definition;
        }
        throw new Error("Could not extract values from read page successfully");
    }

    loadTypeSpec(): Promise<EdifactMessageSpecification> {
        const url: string = "./" + this.type + "_c.htm";
        return this.loadPage(url)
            .then((page: string) => this.parsePage(page));
    }
}
