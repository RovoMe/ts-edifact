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

import { Dictionary, SegmentEntry } from "./validator";
import { TableBuilder, Suffix } from "./tableBuilder";
import * as fs from "fs";

export class SegmentTableBuilder extends TableBuilder<SegmentEntry> {

    constructor(type: string) {
        super(type, Suffix.Segments);
    }

    static enrichWithDefaultSegments(data: Dictionary<SegmentEntry>): Dictionary<SegmentEntry> {
        data.add("UNB", { requires: 5, elements: ["S001", "S002", "S003", "S004", "0020", "S005", "0026", "0029", "0031", "0032", "0035"] });
        data.add("UNH", { requires: 2, elements: ["0062", "S009", "0068", "S010", "S016", "S017", "S018"] });
        data.add("UNS", { requires: 1, elements: ["0081"] });
        data.add("UNT", { requires: 2, elements: ["0074", "0062"] });
        data.add("UNZ", { requires: 2, elements: ["0036", "0020"] });

        return data;
    }

    build(): Dictionary<SegmentEntry> {
        const fileLoc: string | undefined = this.getDefinitionFileLoc();
        let dict: Dictionary<SegmentEntry>;
        if (fileLoc) {
            const sData: string = fs.readFileSync(fileLoc, { encoding: "utf-8" });
            const data: { [key: string]: SegmentEntry} = JSON.parse(sData) as ({ [key: string]: SegmentEntry });

            dict = new Dictionary<SegmentEntry>(data);
        } else {
            dict = new Dictionary<SegmentEntry>();
        }

        return SegmentTableBuilder.enrichWithDefaultSegments(dict);
    }
}
