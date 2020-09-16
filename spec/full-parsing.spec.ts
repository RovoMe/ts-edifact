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

import { Validator, ValidatorImpl, Dictionary, SegmentEntry, ElementEntry } from "../src/validator";
import { Parser } from "../src/parser";
import { SegmentTableBuilder } from "../src/segments";
import { ElementTableBuilder } from "../src/elements";

// issue #1 - Differences between ts-edifact and edifact libraries
describe("Parsing edifact document", () => {

    describe("should complete without any errors", () => {
        let parser: Parser;

        it("should parse original sample document", () => {
            const segments: Dictionary<SegmentEntry> =
                new SegmentTableBuilder("INVOIC").specLocation("./src/messageSpec").build();
            const elements: Dictionary<ElementEntry> =
                new ElementTableBuilder("INVOIC").specLocation("./src/messageSpec").build();

            const validator: Validator = new ValidatorImpl();
            validator.define(segments);
            validator.define(elements);

            parser = new Parser(validator);
            parser.encoding("UNOA");

            let document: string = "";

            document += "UNB+UNOA:1+005435656:1+006415160:1+060515:1434+00000000000778'";
            document += "UNH+00000000000117+INV\n\rOIC:D:97B:UN'";
            document += "BGM+380+342459+9'";
            document += "DTM+3:20060515:102'";
            document += "RFF+ON:521052'";
            document += "NAD+BY+792820524::16++CUMMINS MID-RANGE ENGINE PLANT'";
            document += "NAD+SE+005435656::16++GENERAL WIDGET COMPANY'";
            document += "CUX+1:USD'";
            document += "LIN+1++157870:IN'";
            document += "IMD+F++:::WIDGET'";
            document += "QTY+47:1020:EA'";
            document += "ALI+US'";
            document += "MOA+203:1202.58'";
            document += "PRI+INV:1.179'";
            document += "LIN+2++157871:IN'";
            document += "IMD+F++:::DIFFERENT WIDGET'";
            document += "QTY+47:20:EA'";
            document += "ALI+JP'";
            document += "MOA+203:410'";
            document += "PRI+INV:20.5'";
            document += "UNS+S'";
            document += "MOA+39:2137.58'";
            document += "ALC+C+ABG'";
            document += "MOA+8:525'";
            document += "UNT+23+00000000000117'";
            document += "UNZ+1+00000000000778'";

            expect(() => parser.write(document)).not.toThrow();
        });

        it("should parse issue #1 document", () => {

            const segments: Dictionary<SegmentEntry> =
            new SegmentTableBuilder("IFTMIN").specLocation("./src/messageSpec").build();
            const elements: Dictionary<ElementEntry> =
                new ElementTableBuilder("IFTMIN").specLocation("./src/messageSpec").build();

            const validator: Validator = new ValidatorImpl();
            validator.define(segments);
            validator.define(elements);

            parser = new Parser(validator);
            parser.encoding("UNOA");

            let document: string = "";
            document += "UNA:+.? '";
            document += "UNH+ME000001+IFTMIN:D:01B:UN:EAN004'";
            document += "BGM+610+569952+9'";
            document += "DTM+137:20020301:102'";
            document += "DTM+2:200203081100:203'";
            document += "CNT+11:1'";
            document += "RFF+CU:TI1284'";
            document += "TDT+20++30+31'";
            document += "DTM+133:200203051100:203'";
            document += "LOC+9+5412345678908::9'";
            document += "NAD+CZ+5412345123453::9'";
            document += "NAD+CA+5411234512309::9'";
            document += "NAD+CN+5411234444402::9'";
            document += "NAD+DP+5412345145660::9'";
            document += "GID+1+1:09::9+14:PK'";
            document += "HAN+EAT::9'";
            document += "TMP+2+000:CEL'";
            document += "RNG+5+CEL:-5:5'";
            document += "MOA+44:45000:EUR'";
            document += "PIA+5+5410738377117:SRV'";
            document += "MEA+AAE+X7E+KGM:250'";
            document += "PCI+33E'";
            document += "GIN+BJ+354123450000000014'";
            document += "UNT+23+ME000001'";

            expect(() => parser.write(document)).not.toThrow();
        });
    });
});
