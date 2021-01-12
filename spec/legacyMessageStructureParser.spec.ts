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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { readFileSync } from "fs";
import { join } from "path";

import { UNECELegacyMessageStructureParser } from "../src/edi/legacyMessageStructureParser";
import { EdifactMessageSpecificationImpl, EdifactMessageSpecification } from "../src/edi/messageStructureParser";
import { MessageType } from "../src/tracker";

const D99A_INVOIC_METADATA_PAGE: string = `
<HTML><PRE><body bgcolor=ffffff><TITLE>UNTDID - D.99A - Message INVOIC</title>
<! --- This document was created by Viorel Iordache - UN/ECE ----->
                              UN/EDIFACT

                UNITED NATIONS STANDARD MESSAGE (UNSM)

                            <B>Invoice message</B>


                                            Message Type : <B>INVOIC</B>
                                            Version      : D
                                            Release      : 99A
                                            Contr. Agency: UN

                                            Revision     : 10
                                            Date         : 99-01-14

SOURCE: Joint Rapporteurs Message Design Group JM2



                               <B>CONTENTS</B>

0.   <A HREF="invoic_d.htm#INTRODUCTION">INTRODUCTION</A>

1.   <A HREF="invoic_d.htm#SCOPE">SCOPE</A>

     1.1   <A HREF="invoic_d.htm#FUNDEF">Functional definition</A>
     1.2   <A HREF="invoic_d.htm#FOA">Field of application</A>
     1.3   <A HREF="invoic_d.htm#PRINCIP">Principles</A>

2.   <A HREF="invoic_d.htm#REF">REFERENCES</A>

3.   <A HREF="invoic_d.htm#TAD">TERMS AND DEFINITIONS</A>

     3.1   <A HREF="invoic_d.htm#TAD1">Standard terms and definitions</A>

4.   <A HREF="invoic_d.htm#MESDEF">MESSAGE DEFINITION</A>

     4.1   <A HREF="invoic_d.htm#DSC">Data segment clarification</A>
           4.1.1 <A HREF="invoic_d.htm#HS">Header section</A>
           4.1.2 <A HREF="invoic_d.htm#DS">Detail section</A>
           4.1.3 <A HREF="invoic_d.htm#SS">Summary section</A>
     4.2   <A HREF="invoic_d.htm#DSGI">Data segment index</A>(alphabetical sequence)
     4.3   <A HREF="invoic_s.htm">Message structure</A>
           4.3.1 <A HREF="invoic_s.htm">Segment table</A>
<A HREF="stand_1.htm">Standard text</A>
<hr>

</html>
`;

const D99A_INVOIC_STRUCTURE_PAGE: string =
    readFileSync(join(__dirname, 'data', 'd99a_invoic_s.html'), 'utf-8');

describe('UNECELegacyMessageStructureParser', () => {

    let sut: UNECELegacyMessageStructureParser;

    const expectedBGMEntry: MessageType = {
        content: "BGM",
        mandatory: true,
        repetition: 1,
        data: undefined,
        section: "header"
    };

    const expectedSegmentGroup27Entry: MessageType = {
        name: "Segment group 27",
        content: [
            { content: "MOA", mandatory: true, repetition: 1, data: undefined, section: undefined },
            { content: "CUX", mandatory: false, repetition: 1, data: undefined, section: undefined }
        ],
        mandatory: false,
        repetition: 99,
        data: undefined,
        section: undefined
    };

    const expectedUNSEntry: MessageType = {
        content: "UNS",
        mandatory: true,
        repetition: 1,
        data: undefined,
        section: "summary"
    };

    beforeAll(() => {
        sut = new UNECELegacyMessageStructureParser('D99A', 'INVOIC');
    });

    describe('parseMetaDataPage', () => {

        it("should extract meta data correctly from D99A INVOIC meta data page", () => {
            const expectedSpec: EdifactMessageSpecificationImpl =
                new EdifactMessageSpecificationImpl('INVOIC', 'D', '99A', 'UN');

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const spec: EdifactMessageSpecificationImpl = (sut as any).parseMetaDataPage(D99A_INVOIC_METADATA_PAGE);
            expect(spec).toEqual(expectedSpec);
        });

    });

    describe('parseStructurePage', () => {

        it("should extract message structure correctly from D99A INVOIC structure page", () => {

            const spec: EdifactMessageSpecification =
                new EdifactMessageSpecificationImpl('INVOIC', 'D', '99A', 'UN');

            sut.parseStructurePage(D99A_INVOIC_STRUCTURE_PAGE, spec);

            expect(spec.messageStructureDefinition).toContain(expectedBGMEntry);
            expect(spec.messageStructureDefinition).toContain(expectedUNSEntry);
            const sg26: MessageType | undefined =
                spec.messageStructureDefinition.find(item => item.name === 'Segment group 26');
            expect(sg26).toBeDefined();
            expect((sg26 as any).content).toContain(expectedSegmentGroup27Entry);
        });

    });

    describe('loadTypeSpec', () => {

        it("should parse remote UNECE specification", async () => {
            const spec: EdifactMessageSpecification = await sut.loadTypeSpec();
            expect(spec.controllingAgency).toBe('UN');
            expect(spec.version).toBe('D');
            expect(spec.release).toBe('99A');
            expect(spec.messageType).toBe('INVOIC');
            expect(spec.messageStructureDefinition).toContain(expectedBGMEntry);
            expect(spec.messageStructureDefinition).toContain(expectedUNSEntry);
            const sg26: MessageType | undefined =
                spec.messageStructureDefinition.find(item => item.name === 'Segment group 26');
            expect(sg26).toBeDefined();
            expect((sg26 as any).content).toContain(expectedSegmentGroup27Entry);
        });

    });

});
