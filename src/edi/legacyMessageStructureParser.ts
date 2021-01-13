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

import {
    EdifactMessageSpecification,
    ParsingResultType,
    UNECEMessageStructureParser
} from "./messageStructureParser";
import { UNECEMetaDataPageParser } from './uneceMetaDataPageParser';
import { UNECEStructurePageParser } from './uneceStructurePageParser';

export class UNECELegacyMessageStructureParser extends UNECEMessageStructureParser {

    parseMetaDataPage(page: string): EdifactMessageSpecification {
        const parser: UNECEMetaDataPageParser = new UNECEMetaDataPageParser();
        parser.parse(page);
        return parser.spec;
    }

    parseStructurePage(page: string, spec: EdifactMessageSpecification): void {
        const parser: UNECEStructurePageParser = new UNECEStructurePageParser(spec);
        parser.parse(page);
    }

    loadTypeSpec(): Promise<EdifactMessageSpecification> {
        const url: string = "./" + this.type + "_c.htm";
        return this.loadPage(url)
            .then(async (metaDataPage: string) => {
                const spec: EdifactMessageSpecification = this.parseMetaDataPage(metaDataPage);
                const structurePage: string = await this.loadPage(`./${this.type}_s.htm`);
                this.parseStructurePage(structurePage, spec);
                return {
                    specObj: spec,
                    promises: []
                };
            })
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
