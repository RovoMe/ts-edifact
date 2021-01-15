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

import { Parser, DomHandler } from "htmlparser2";
import { StateMachine, StateMachineDefinition } from "@initics/tsm";

import { isDefined } from "../util";
import { EdifactMessageSpecification } from "./messageStructureParser";

export abstract class UNECEPageParser {

    protected sm: StateMachine;
    protected _spec?: EdifactMessageSpecification;

    constructor(smdef: StateMachineDefinition) {
        this.sm = new StateMachine(smdef);
    }

    get spec(): EdifactMessageSpecification {
        if (!this._spec) {
            throw new Error(`EdifactMessageSpecification not defined`);
        }
        return this._spec;
    }

    parse(page: string): void {
        const parser: Parser = new Parser(this.setupHandler());
        parser.write(page);
        parser.end();
    }

    protected setupHandler(): DomHandler {
        return new DomHandler();
    }

    protected extractTextValue(text: string, regex: RegExp, index: number = 0): string {
        const arr: RegExpExecArray | null = regex.exec(text);
        if (isDefined(arr)) {
            return arr[index];
        }
        return "";
    }

    protected throwInvalidParserState(state: string): void {
        throw new Error(`Invalid parser state: ${state}`);
    }

    protected throwCouldNotParsePage(): void {
        throw new Error('Could not parse page');
    }

}
