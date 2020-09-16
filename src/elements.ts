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

import { Dictionary, ElementEntry } from "./validator";
import * as fs from "fs";
import { TableBuilder, Suffix } from "./tableBuilder";

export class ElementTableBuilder extends TableBuilder<ElementEntry> {

    constructor(type: string) {
        super(type, Suffix.Elements);
    }

    static enrichWithDefaultElements(data: Dictionary<ElementEntry>): Dictionary<ElementEntry> {
        // UNB
        data.add("S001", { requires: 2, components: ["a4", "n1", "an..6", "an..3"] });
        data.add("S002", { requires: 1, components: ["an..35", "an..4", "an..35", "an..35"] });
        data.add("S003", { requires: 1, components: ["an..35", "an..4", "an..35", "an..35"] });
        data.add("S004", { requires: 2, components: ["n..8", "n4"] }); // usually the date is given in 6 digits, i.e. 200101, so I changed the n8 to n..8
        data.add("0020", { requires: 1, components: ["an..14"] });
        data.add("S005", { requires: 1, components: ["an..14", "an2"] });
        data.add("0026", { requires: 0, components: ["an..14"] });
        data.add("0029", { requires: 0, components: ["a1"] });
        data.add("0031", { requires: 0, components: ["n1"] });
        data.add("0032", { requires: 0, components: ["an..35"] });
        data.add("0035", { requires: 0, components: ["n1"] });

        // UNH
        data.add("0062", { requires: 1, components: ["an..14"] });
        data.add("S009", { requires: 4, components: ["an..6", "an..3", "an..3", "an..3", "an..6", "an..6", "an..6"] });
        data.add("0068", { requires: 0, components: ["an..35"] });
        data.add("S010", { requires: 1, components: ["n..2", "a1"] });
        data.add("S016", { requires: 1, components: ["an..14", "an..3", "an..3", "an..3"] });
        data.add("S017", { requires: 1, components: ["an..14", "an..3", "an..3", "an..3"] });
        data.add("S018", { requires: 1, components: ["an..14", "an..3", "an..3", "an..3"] });

        // UNS
        data.add("0081", { requires: 1, components: ["a1"] });

        // UNT
        data.add("0074", { requires: 1, components: ["n..10"] });
        data.add("0062", { requires: 1, components: ["an..14"] });

        // UNZ
        data.add("0036", { requires: 1, components: ["n..6"] });
        data.add("0020", { requires: 1, components: ["an..14"] });

        return data;
    }

    build(): Dictionary<ElementEntry> {

        let dict: Dictionary<ElementEntry>;
        const fileLoc: string | undefined = this.getDefinitionFileLoc();
        if (fileLoc) {
            const sData: string = fs.readFileSync(fileLoc, { encoding: "utf-8" });
            const data: { [key: string]: ElementEntry} = JSON.parse(sData) as ({ [key: string]: ElementEntry });

            dict = new Dictionary<ElementEntry>(data);
        } else {
            dict = new Dictionary<ElementEntry>();
        }

        return ElementTableBuilder.enrichWithDefaultElements(dict);
    }
}
