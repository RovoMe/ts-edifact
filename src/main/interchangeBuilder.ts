/* eslint-disable no-case-declarations */
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

import { ResultType } from "./reader";
import { MessageType, Pointer } from "./tracker";
import * as fs from "fs";

abstract class SegmentContainer {
    groups: Group[] = [];
    segments: ResultType[] = [];

    addSegment(segment: ResultType): void {
        this.segments.push(segment);
    }

    addGroup(group: Group): void {
        this.groups.push(group);
    }

    containsGroup(groupName: string): boolean {
        for (const group of this.groups) {
            if (group.name === groupName) {
                return true;
            }
        }
        return false;
    }

    groupByName(groupName: string): Group | undefined {
        for (const group of this.groups) {
            if (group.name === groupName) {
                return group;
            }
        }
        return undefined;
    }
}

class Group extends SegmentContainer {
    name: string;
    parent: Message | Group;

    constructor(name: string, parent: Message | Group) {
        super();
        this.name = name;
        this.parent = parent;
    }
}

class MessageIdentifier {

    messageType: string;
    messageVersionNumber: string;
    messageReleaseNumber: string;
    controllingAgency: string;
    associationAssignedCode: string | undefined;
    codeListDirectoryVersionNumber: string | undefined;
    messageTypeSubFunctionId: string | undefined;

    constructor(components: string[]) {
        this.messageType = components[0];
        this.messageVersionNumber = components[1];
        this.messageReleaseNumber = components[2];
        this.controllingAgency = components[3];
        if (components.length >= 5) {
            this.associationAssignedCode = components[4];
        }
        if (components.length >= 6) {
            this.codeListDirectoryVersionNumber = components[5];
        }
        if (components.length === 7) {
            this.messageTypeSubFunctionId = components[6];
        }
    }
}

class StatusOfTransfer {

    sequenceOfTransfer: number;
    firstAndLastTransfer: string | undefined;

    constructor(components: string[]) {
        this.sequenceOfTransfer = parseInt(components[0]);
        if (components.length === 2) {
            this.firstAndLastTransfer = components[1];
        }
    }
}

abstract class IdAndVersionPart {

    id: string;
    versionNumber: string | undefined;
    releaseNumber: string | undefined;
    controllingAgency: string | undefined;

    constructor(components: string[]) {
        this.id = components[0];
        if (components.length >= 2) {
            this.versionNumber = components[1];
        }
        if (components.length >= 3) {
            this.releaseNumber = components[2];
        }
        if (components.length === 4) {
            this.controllingAgency = components[3];
        }
    }
}

class MessageSubsetIdentification extends IdAndVersionPart {

    constructor(components: string[]) {
        super(components);
    }
}

class MessageImplementationGuidelineIdentification extends IdAndVersionPart {
    constructor(components: string[]) {
        super(components);
    }
}

class ScenarioIdentification extends IdAndVersionPart {
    constructor(components: string[]) {
        super(components);
    }
}

class Message extends SegmentContainer {

    messageRefNumber: string | undefined;
    messageIdentifier: MessageIdentifier;
    commonAccessReference: string | undefined;
    statusOfTransfer: StatusOfTransfer | undefined;
    messageSubsetId: MessageSubsetIdentification | undefined;
    messageImplGuidelineId: MessageImplementationGuidelineIdentification | undefined;
    scenarioId: ScenarioIdentification | undefined;

    constructor(elements: string[][]) {
        super();
        this.messageRefNumber = elements[0][0];
        this.messageIdentifier = new MessageIdentifier(elements[1]);
        if (elements.length >= 3) {
            this.commonAccessReference = elements[2][0];
        }
        if (elements.length >= 4) {
            this.statusOfTransfer = new StatusOfTransfer(elements[3]);
        }
        if (elements.length >= 5) {
            this.messageSubsetId = new MessageSubsetIdentification(elements[4]);
        }
        if (elements.length >= 6) {
            this.messageImplGuidelineId = new MessageImplementationGuidelineIdentification(elements[5]);
        }
        if (elements.length === 7) {
            this.scenarioId = new ScenarioIdentification(elements[6]);
        }
    }
}

class SyntaxIdentifier {

    syntaxIdentifer: string;
    version: string;
    serviceCodeListDirectoryVersionNumber: string | undefined;
    charEncoding: string | undefined;

    constructor(components: string[]) {
        this.syntaxIdentifer = components[0];
        this.version = components[1];
        if (components.length >= 3) {
            this.serviceCodeListDirectoryVersionNumber = components[2];
        }
        if (components.length === 4) {
            this.charEncoding = components[3];
        }
    }
}

abstract class Participant {

    id: string;
    codeQualifier: string | undefined;
    internalId: string | undefined;
    internalSubId: string | undefined;

    constructor(components: string[]) {
        this.id = components[0];
        if (components.length >= 2) {
            this.codeQualifier = components[1];
        }
        if (components.length >= 3) {
            this.internalId = components[2];
        }
        if (components.length === 4) {
            this.internalSubId = components[3];
        }
    }
}

class Sender extends Participant {

    constructor(compnenets: string[]) {
        super(compnenets);
    }
}

class Receiver extends Participant {

    constructor(components: string[]) {
        super(components);
    }
}

class RecipientsRef {

    password: string;
    passwordQualifier: string | undefined;

    constructor(components: string[]) {
        this.password = components[0];
        if (components.length === 2) {
            this.passwordQualifier = components[1];
        }
    }
}

export class Edifact {
    syntaxIdentifier: SyntaxIdentifier;
    sender: Sender;
    receiver: Receiver;
    date: string;
    time: string;
    interchangeNumber: string;
    recipientsRef: RecipientsRef | undefined;
    applicationRef: string | undefined;
    processingPriorityCode: string | undefined;
    ackRequest: number | undefined;
    agreementId: string | undefined;
    testIndicator: number;

    messages: Message[] = [];

    constructor(elements: string[][]) {
        this.syntaxIdentifier = new SyntaxIdentifier(elements[0]);
        this.sender = new Sender(elements[1]);
        this.receiver = new Receiver(elements[2]);
        this.date = elements[3][0];
        this.time = elements[3][1];
        this.interchangeNumber = elements[4][0];
        if (elements.length >= 6) {
            this.recipientsRef = new RecipientsRef(elements[5]);
        }
        if (elements.length >= 7) {
            this.applicationRef = elements[6][0];
        }
        if (elements.length >= 8) {
            this.processingPriorityCode = elements[7][0];
        }
        if (elements.length >= 9) {
            this.ackRequest = parseInt(elements[8][0]);
        }
        if (elements.length >= 10) {
            this.agreementId = elements[9][0];
        }
        if (elements.length === 11) {
            this.testIndicator = parseInt(elements[10][0]);
        } else {
            this.testIndicator = 0;
        }
    }

    addMessage(message: Message): void {
        this.messages.push(message);
    }
}

export class InterchangeBuilder {

    interchange: Edifact;

    private stack: Pointer[] = [];

    constructor(parsingResult: ResultType[]) {

        if (!parsingResult || parsingResult.length === 0) {
            throw Error("Invalid list of parsed segments provided");
        }

        let interchange: Edifact | undefined;
        for (const segment of parsingResult) {
            switch (segment.name) {
                case "UNB":
                    interchange = new Edifact(segment.elements);
                    break;
                case "UNZ":
                    // nothing to do
                    break;
                case "UNT":
                    this.reset();
                    break;
                default:
                    if (segment.name === "UNH") {
                        const message: Message = new Message(segment.elements);
                        // lookup the message definition for the respective edifact version, i.e. D96A => INVOIC
                        const messageVersion: string = message.messageIdentifier.messageVersionNumber
                                + message.messageIdentifier.messageReleaseNumber;
                        const messageType: string =message.messageIdentifier.messageType;
                        const table: MessageType[] = this.getMessageStructureDefForMessage(messageVersion, messageType);
                        this.stack = [ new Pointer(table, 0) ];

                        if (interchange) {
                            interchange.addMessage(message);
                        } else {
                            throw Error("");
                        }
                    }

                    const message: Message | undefined = interchange?.messages[interchange.messages.length - 1];
                    if (message) {
                        this.accept(segment, message);
                    } else {
                        throw Error(`Couldn't process ${segment.name} segment as no message was found.`);
                    }
            }
        }

        if (interchange) {
            this.interchange = interchange;
        } else {
            throw Error("Could not generate EDIFACT interchange structure");
        }
    }

    private reset(): void {
        this.stack.length = 1;
        this.stack[0].position = 0;
        this.stack[0].count = 0;
    }

    private accept(segment: ResultType, obj: Message): void {
        let current: Pointer = this.stack[this.stack.length - 1];
        let optionals: number[] = [];
        let probe: number = 0;

        while (segment.name !== current.content() || current.count === current.repetition()) {
            if (Array.isArray(current.content()) && current.count < current.repetition()) {
                // Enter the subgroup
                probe++;
                if (!current.mandatory()) {
                    optionals.push(this.stack.length);
                }

                current.count++;
                current = new Pointer(current.content() as MessageType[], 0);
                this.stack.push(current);
            } else {
                // Check if we ware omitting mandatory content
                if (current.mandatory() && current.count === 0) {
                    if (optionals.length === 0) {
                        const segName: string | undefined = current.name();
                        if (segName) {
                            throw new Error(`A mandatory segment ${current.content() as string} defined in segment group '${segName}' is missing`);
                        } else {
                            // We will never encounter groups here, so we can safely use the
                            // name of the segment stored in it's content property
                            throw new Error(`A mandatory segment ${current.content() as string} is missing`);
                        }
                    } else {
                        // If we are omitting mandatory content inside a conditional group,
                        // we just skip the entire group
                        probe = probe - this.stack.length;
                        this.stack.length = optionals.pop() as number;
                        current = this.stack[this.stack.length - 1];
                        probe = probe + this.stack.length;
                    }
                }

                current.position++;
                current.count = 0;
                if (current.position === current.array.length) {
                    this.stack.pop();
                    current = this.stack[this.stack.length - 1];
                    if (this.stack.length === 0) {
                        throw new Error(`Reached the end of the segment table while processing segment ${segment.name}`);
                    }
                    if (probe === 0 && current.count < current.repetition()) {
                        // If we are not currently probing (meaning the tracker actually
                        // accepted the group), we should retry the current group, except if
                        // the maximum number of repetition was reached
                        probe++;
                        optionals = [ this.stack.length ];
                        current.count++;
                        current = new Pointer(current.content() as MessageType[], 0);
                        this.stack.push(current);
                    } else {
                        if (!current.mandatory() || current.count > 1) {
                            optionals.push();
                        }
                        // Decrease the probing level only if the tracker is currently in a
                        // probing state
                        probe = probe > 0 ? probe - 1 : 0;
                        // Make sure the tracker won't enter the current group again by
                        // setting an appropriate count value on the groups pointer
                        current.count = current.repetition();
                    }
                }
            }
        }
        current.count += 1;

        // Generate the tree-structure of the Edifact document
        if (this.stack.length > 1) {
            let curObj: Message | Group = obj;
            for (let idx: number = 0; idx < this.stack.length; idx++) {
                const pointer: Pointer = this.stack[idx];
                const groupName: string | undefined =  pointer.name();
                if (groupName) {
                    if (!curObj.containsGroup(groupName)) {
                        const group: Group = new Group(groupName, curObj);
                        curObj.addGroup(group);
                        curObj = group;
                    } else {
                        const group: Group | undefined = curObj.groupByName(groupName);
                        if (group) {
                            curObj = group;
                        } else {
                            throw Error(`Could not find group ${groupName} as part of ${curObj.toString()}`);
                        }
                    }
                } else {
                    curObj.addSegment(segment);
                }
            }
        } else {
            obj.addSegment(segment);
        }
    }

    private getMessageStructureDefForMessage(messageVersion: string, messageType: string): MessageType[] {
        const basePath: string = "./src/main/messages/";
        let path: string = basePath + messageVersion + "_" + messageType + ".json";
        if (fs.existsSync(path)) {
            return this.readFileAsMessageStructure(path);
        } else {
            path = basePath + messageType + ".json";
            if (fs.existsSync(path)) {
                return this.readFileAsMessageStructure(path);
            } else {
                throw new Error(`Could not find message definiton for message type '${messageType}' of version '${messageVersion}'`);
            }
        }
    }

    private readFileAsMessageStructure(path: string): MessageType[] {
        const data: string = fs.readFileSync(path, { encoding: "utf-8"});
        return JSON.parse(data) as MessageType[];
    }
}
