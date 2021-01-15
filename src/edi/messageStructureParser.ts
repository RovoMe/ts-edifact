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

enum SegmentPart {
    BeforeStructureDef,
    Data,
    AfterStructureDef
}

export type ParsingResultType = {
    specObj: EdifactMessageSpecification;
    promises: Promise<EdifactMessageSpecification>[];
};

export interface MessageStructureParser {

    loadTypeSpec(): Promise<EdifactMessageSpecification>;
}

export class UNECEMessageStructureParser implements MessageStructureParser {

    private version: string;
    private type: string;
    private httpClient: HttpClient;

    constructor(version: string, type: string) {
        this.version = version.toLowerCase();
        this.type = type.toLowerCase();

        const baseUrl: string = "https://service.unece.org/trade/untdid/" + this.version + "/trmd/" + this.type + "_c.htm";
        this.httpClient = new HttpClient(baseUrl);
    }

    private async loadPage(page: string): Promise<string> {
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

    private async parseSegmentDefinitionPage(segment: string, page: string, definition: EdifactMessageSpecification): Promise<EdifactMessageSpecification> {
        if (definition.segmentTable.contains(segment)) {
            return Promise.resolve(definition);
        }

        const segEntry: SegmentEntry = { "requires": 0, "elements": [] };
        let state: SegmentPart = SegmentPart.BeforeStructureDef;

        let skipAddingElement: boolean = false;
        let overflowLine: string | null = null;
        let complexEleId: string | null = null;
        let complexEleEntry: ElementEntry | null = null;
        for (let line of page.split("\n")) {
            line = line.trimRight();
            if (overflowLine !== null) {
                line = overflowLine.trimRight() + " " + line.trim();
                overflowLine =  null;
            }

            if (state === SegmentPart.BeforeStructureDef && line.includes("<H3>")) {
                state = SegmentPart.Data;
            } else if (state === SegmentPart.Data && !line.includes("<P>")) {
                const regexp: RegExp = /^([\d]*)\s*?([X|\\*]?)\s*<A.*>([a-zA-Z0-9]*)<\/A>([a-zA-Z0-9 \-\\/&]{44,})([M|C])\s*([\d]*)\s*([a-zA-Z0-9\\.]*).*$/g;
                const arr: RegExpExecArray | null = regexp.exec(line);
                if (isDefined(arr)) {
                    const segGroupId: string | undefined = arr[1] === "" ? undefined : arr[1];
                    // const deprecated: boolean = arr[2] === "X" ? true : false;
                    const id: string = arr[3];
                    // const name: string = arr[4].trim();
                    const mandatory: boolean = arr[5] === "M" ? true : false;
                    // const repetition: number | undefined = isDefined(arr[6]) ? parseInt(arr[6]) : undefined;
                    const elementDef: string | undefined = arr[7] === "" ? undefined :  arr[7];

                    if (segGroupId) {
                        if (id === "") {
                            console.warn(`Could not determine element ID based on line ${line}`);
                            continue;
                        }
                        segEntry.elements.push(id);
                        skipAddingElement = false;

                        if (mandatory) {
                            segEntry.requires = segEntry.requires +  1;
                        }
                        if (elementDef) {
                            if (complexEleEntry !== null && complexEleId !== null) {
                                definition.elementTable.add(complexEleId, complexEleEntry);
                            }
                            complexEleId = null;
                            complexEleEntry = null;

                            if (definition.elementTable.contains(id)) {
                                continue;
                            }
                            const eleEntry: ElementEntry = { "requires": 0, "components": [] };
                            if (mandatory) {
                                eleEntry.requires = eleEntry.requires + 1;
                            }
                            eleEntry.components.push(elementDef);
                            definition.elementTable.add(id, eleEntry);
                        } else {
                            if (complexEleEntry !== null && complexEleId !== null) {
                                definition.elementTable.add(complexEleId, complexEleEntry);
                            }
                            if (definition.elementTable.contains(id)) {
                                skipAddingElement = true;
                                continue;
                            }
                            complexEleId =  id;
                            complexEleEntry = { "requires": 0, "components": [] };
                        }
                    } else {
                        if (!skipAddingElement) {
                            if (complexEleEntry !== null && elementDef) {
                                complexEleEntry.components.push(elementDef);
                                complexEleEntry.requires = mandatory ? complexEleEntry.requires + 1 : complexEleEntry.requires;
                            } else {
                                // simple element definition
                                if (definition.elementTable.contains(id)) {
                                    continue;
                                }

                                const eleEntry: ElementEntry = { "requires": 0, "components": [] };

                                if (mandatory) {
                                    eleEntry.requires = eleEntry.requires + 1;
                                }
                                if (elementDef) {
                                    eleEntry.components.push(elementDef);
                                }
                                definition.elementTable.add(id, eleEntry);
                            }
                        }
                    }
                } else {
                    const regexpAlt: RegExp = /^([\d]*)\s*([X|\\*]?)\s*<A.*>([a-zA-Z0-9]*)<\/A>\s*([a-zA-Z0-9 \\-\\/&]*)/g;
                    const arrAlt: RegExpExecArray | null = regexpAlt.exec(line);
                    if (isDefined(arrAlt)) {
                        overflowLine = line;
                    }
                }
            } else if (state === SegmentPart.Data && line.includes("<P>")) {
                state = SegmentPart.AfterStructureDef;
                break;
            }
        }
        if (complexEleEntry !== null && complexEleId !== null) {
            definition.elementTable.add(complexEleId, complexEleEntry);
        }
        if (segment !== "") {
            definition.segmentTable.add(segment, segEntry);
        }

        return Promise.resolve(definition);
    }

    private async parsePage(page: string): Promise<ParsingResultType> {
        let definition: EdifactMessageSpecification | undefined;
        const handler: DomHandler = new DomHandler();

        let state: Part = Part.BeforeStructureDef;
        let section: string | null = "header";
        const segStack: MessageType[][] = [];
        const lookupSegmentPromises: Promise<EdifactMessageSpecification>[] = [];

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
            } else if (state !== Part.BeforeStructureDef && state !== Part.AfterStructureDef) {
                if (state === Part.RefLink) {
                    // ignored
                    // console.debug(`RefLink: ${text}`);
                } else if (state === Part.Pos) {
                    // console.debug(`Pos: ${text}`);
                } else if (state === Part.Deprecated) {

                    if (text.includes("- Segment group")) {
                        const regex: RegExp = /^\s*-* (Segment group \d*)\s*-*\s*([M|C])\s*(\d*)([-|\\+|\\|]*).*/g;
                        const arr: RegExpExecArray | null = regex.exec(text);
                        if (isDefined(arr)) {
                            const groupArray: MessageType[] = [];
                            const group: MessageType = {
                                content: groupArray,
                                mandatory: arr[2] === "M" ? true : false,
                                repetition: parseInt(arr[3]),
                                name: arr[1],
                                section: isDefined(section) ? section : undefined
                            };
                            section = null;
                            // add the group to the end of the current top segments
                            segStack[segStack.length - 1].push(group);
                            // push the array managed by this group to the end of the stack to fill it down the road
                            segStack.push(groupArray);
                        }
                        // no further tags available, continue on the next line with the RefLink
                        state = Part.RefLink;
                    } else {
                        // console.debug(`Deprecated: ${text}`);
                        nextState();
                    }
                } else if (state === Part.Tag) {
                    // console.debug(`Tag: ${text}`);
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
                    // console.debug(`Name: ${text}`);
                    const regex: RegExp = /^([a-zA-Z /\\-]*)\s*?([M|C])\s*?([0-9]*?)([^0-9]*)$/g;
                    const arr: RegExpExecArray | null = regex.exec(text);
                    if (isDefined(arr)) {
                        // const name: string = arr[1].trim();
                        const sMandatory: string = arr[2];
                        const sRepetition: string = arr[3];
                        const remainder: string = arr[4];
                        // console.debug(`Processing segment: ${name}`);

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
                    if (text.includes("DETAIL SECTION")) {
                        section = "detail";
                    } else if (text.includes("SUMMARY SECTION")) {
                        section = "summary";
                    }
                } else {
                    console.warn(`Unknown part: ${text}`);
                }
            }
        };
        handler.onopentag = (name: string, attribs: { [key: string]: string }) => {
            if (name === "p" && state !== Part.BeforeStructureDef && state !== Part.AfterStructureDef) {
                state = Part.AfterStructureDef;
            }
            if (state === Part.Tag && attribs.href !== undefined) {
                if (definition) {
                    const end: number = attribs.href.indexOf(".htm");
                    const curSeg: string = attribs.href.substring(end - 3, end).toUpperCase();

                    // skip segments that do not point to the right segment definition page
                    if (curSeg !== "UNH" && curSeg !== "UNS" && curSeg !== "UNT") {

                        // console.debug(`Adding promise to lookup segment definition for segment ${curSeg} for URI ${attribs.href}`);

                        const def: EdifactMessageSpecification = definition;
                        lookupSegmentPromises.push(this.loadPage(attribs.href)
                            .then(result => this.parseSegmentDefinitionPage(curSeg, result, def))
                        );
                    }
                }
            }
        };
        handler.onclosetag = () => {
            nextState();
        };
        const parser: Parser = new Parser(handler);
        parser.write(page);
        parser.end();

        if (definition) {
            return Promise.resolve({ specObj: definition, promises: lookupSegmentPromises });
        }
        return Promise.reject(new Error("Could not extract values from read page successfully"));
    }

    loadTypeSpec(): Promise<EdifactMessageSpecification> {
        const url: string = "./" + this.type + "_c.htm";
        return this.loadPage(url)
            .then((page: string) => this.parsePage(page))
            .then((result: ParsingResultType) =>
                Promise.all(result.promises)
                    .then(() => result.specObj)
                    .catch((error: Error) => {
                        console.warn(`Error while processing segment definition promises: Reason ${error.message}`);
                        return result.specObj;
                    })
            );
    }
}
