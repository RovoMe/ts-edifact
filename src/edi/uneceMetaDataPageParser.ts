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
import { DomHandler } from "htmlparser2";

import { EdifactMessageSpecificationImpl } from "./messageStructureParser";
import { UNECEPageParser } from "./unecePageParser";

enum State {
    initial = 'initial',
    beforeMessageType = 'beforeMessageType',
    afterMessageType = 'afterMessageType',
    beforeMetaData = 'beforeMetaData',
    afterMetaData = 'afterMetaData'
}

const SM_DEFINITION: StateMachineDefinition = {
    initial: State.initial,
    transitions: [
        { from: State.initial, to: State.beforeMessageType },
        { from: State.beforeMessageType, to: State.afterMessageType },
        { from: State.afterMessageType, to: State.beforeMetaData },
        { from: State.beforeMetaData, to: State.afterMetaData }
    ]
};

export class UNECEMetaDataPageParser extends UNECEPageParser {

    private messageType?: string;

    constructor() {
        super(SM_DEFINITION);
    }

    protected setupHandler(): DomHandler {
        const handler: DomHandler = super.setupHandler();

        handler.ontext = (text: string) => {
            switch (this.sm.state) {
                case State.initial:
                    if (text.includes('Message Type')) {
                        this.sm.transition(State.beforeMessageType);
                    }
                    break;

                case State.beforeMessageType:
                    this.messageType = text;
                    this.sm.transition(State.afterMessageType);
                    break;

                case State.afterMessageType:
                    if (!this.messageType) {
                        this.throwCouldNotParsePage();
                    } else {
                        if (text.includes('Version') && text.includes('Release') && text.includes('Contr. Agency')) {
                            const version: string = this.extractTextValue(text, /Version\s*: ([A-Z]*)\s/g, 1);
                            const release: string = this.extractTextValue(text, /Release\s*: ([0-9A-Z]*)\s/g, 1);
                            const controllingAgency: string = this.extractTextValue(text, /Contr. Agency\s*: ([0-9A-Z]*)\s/g, 1);
                            this._spec = new EdifactMessageSpecificationImpl(
                                this.messageType,
                                version,
                                release,
                                controllingAgency
                            );
                        }
                    }
                    break;

                default: this.throwInvalidParserState(this.sm.state);
            }
        };

        return handler;
    }

}
