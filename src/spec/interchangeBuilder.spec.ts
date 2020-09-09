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

import { ResultType } from "../main/reader";
import { InterchangeBuilder, Edifact, Group } from "../main/interchangeBuilder";
import { Separators, EdifactSeparatorsBuilder } from "../main/edi/separators";

describe("InterchangeBuilder", () => {
    let parseResult: ResultType[];
    const separators: Separators = new EdifactSeparatorsBuilder().build();

    beforeEach(() => {
        parseResult = [
            {
                name: "UNB", elements: [
                    ["UNOA", "1", '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['005435656', '1'],
                    ['006415160', '1'],
                    ['060515', '1434'],
                    ['00000000000778']
                ]
            },
            {
                name: "UNH", elements: [
                    ['00000000000117'],
                    ['INVOIC', 'D', '01B', 'UN']
                ]
            },
            {
                name: "BGM", elements: [
                    ['380'],
                    ['342459'],
                    ['9']
                ]
            },
            {
                name: "DTM", elements: [
                    ['3', '20060515', '102']
                ]
            },
            // added for demonstration purpose that the interchange builder values the respective spec
            {
                name: "GIR", elements: [
                    ['3'],
                    ['00999100', 'ML']
                ]
            },
            {
                name: "RFF", elements: [
                    ['ON', '521052']
                ]
            },
            {
                name: "NAD", elements: [
                    ['BY'],
                    ['792820524', '', '16'],
                    [''],
                    ['CUMMINS MID-RANGE ENGINE PLANT']
                ]
            },
            {
                name: "NAD", elements: [
                    ['SE'],
                    ['005435656', '', '16'],
                    [''],
                    ['GENERAL WIDGET COMPANY']
                ]
            },
            {
                name: "CUX", elements: [
                    ['1', 'USD']
                ]
            },
            {
                name: "LIN", elements: [
                    ['1'],
                    [''],
                    ['157870', 'IN']
                ]
            },
            {
                name: "IMD", elements: [
                    ['F'],
                    [''],
                    ['', '', '', 'WIDGET']
                ]
            },
            {
                name: "QTY", elements: [
                    ['47', '1020', 'EA']
                ]
            },
            {
                name: "ALI", elements: [
                    ['US']
                ]
            },
            {
                name: "MOA", elements: [
                    ['203', '1202.58']
                ]
            },
            {
                name: "PRI", elements: [
                    ['INV', '1.179']
                ]
            },
            {
                name: "LIN", elements: [
                    ['2'],
                    [''],
                    ['157871', 'IN']
                ]
            },
            {
                name: "IMD", elements: [
                    ['F'],
                    [''],
                    ['', '', '', 'DIFFERENT WIDGET']
                ]
            },
            {
                name: "QTY", elements: [
                    ['47', '20', 'EA']
                ]
            },
            {
                name: "ALI", elements: [
                    ['JP']
                ]
            },
            {
                name: "MOA", elements: [
                    ['203', '410']
                ]
            },
            {
                name: "PRI", elements: [
                    ['INV', '20.5']
                ]
            },
            {
                name: "UNS", elements: [
                    ['S']
                ]
            },
            {
                name: "MOA", elements: [
                    ['39', '2137.58']
                ]
            },
            {
                name: "ALC", elements: [
                    ['C'],
                    ['ABG']
                ]
            },
            {
                name: "MOA", elements: [
                    ['8', '525']
                ]
            },
            {
                name: "UNT", elements: [
                    ['23'],
                    ['00000000000117']
                ]
            },
            {
                name: "UNZ", elements: [
                    ['1'],
                    ['00000000000778']
                ]
            }
        ];
    });

    it ("shouldn't accept empty parse result as input", () => {
        expect(() => new InterchangeBuilder([], separators, "./src/main/messages/")).toThrow();
    });

    it ("should build D01B interchange correctly", () => {
        const builder: InterchangeBuilder = new InterchangeBuilder(parseResult, separators, "./src/main/messages/");
        const edi: Edifact = builder.interchange;
        expect(edi).toBeDefined();
        expect(edi.messages.length).toEqual(1);
        // expected 1 group holding two 2 subgroups with LIN, IMD, QTY, ALI and further segments
        expect(edi.messages[0].detail.length).toEqual(1);
        expect((edi.messages[0].detail[0] as Group).data.length).toEqual(2);
        // looking up the LIN segments by group name should also return the same result
        const segGroup: Group | undefined = edi.messages[0].groupByName("Segment group 26");
        expect(segGroup?.data.length).toEqual(2);
        // subgroup should contain 6 segments (LIN, IMD, QTY, ALI) or groups (MOA + PRI)
        const linGroup0: Group = segGroup?.data[0] as Group;
        expect(linGroup0.data.length).toEqual(6);
    });

    it ("should fail D96A message structure", () => {
        parseResult[1].elements = [
            ['00000000000117'],
            ['INVOIC', 'D', '96A', 'UN']
        ];
        expect(() => new InterchangeBuilder(parseResult, separators, "./src/main/messages/")).toThrow();
    });
});
