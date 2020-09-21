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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { UNECEMessageStructureParser, EdifactMessageSpecification, ParsingResultType } from "../src/edi/messageStructureParser";
import { Dictionary, SegmentEntry, ElementEntry } from "../src/validator";
import { MessageType } from "../src/tracker";
// import { persist } from "../src/util";

describe("MessageStructureParser", () => {

    describe("Message Structure Definition Parser", () => {

        let sut: UNECEMessageStructureParser;

        beforeAll(() => {
            sut = new UNECEMessageStructureParser("D01B", "INVOIC");
        });

        it("should extract message structure correctly", (done) => {
            const page: string = `
<P>
            Message Type : INVOIC
            Version      : D
            Release      : 01B
            Contr. Agency: UN

            Revision     : 13
            Date         : 2001-05-15
...
<P>
4.3    Message structure

4.3.1  Segment table

<A NAME = "0010_X"></A><A HREF = "invoic_c.htm#0010">0010</A>   <A HREF="http://www.gefeg.com/jswg/">UNH</A> Message header                            M   1     
<A NAME = "0020_X"></A><A HREF = "invoic_c.htm#0020">0020</A>   <A HREF = "../trsd/trsdbgm.htm">BGM</A> Beginning of message                      M   1     
<A NAME = "0030_X"></A><A HREF = "invoic_c.htm#0030">0030</A>   <A HREF = "../trsd/trsddtm.htm">DTM</A> Date/time/period                          M   35    
<A NAME = "0040_X"></A><A HREF = "invoic_c.htm#0040">0040</A>   <A HREF = "../trsd/trsdpai.htm">PAI</A> Payment instructions                      C   1     
<A NAME = "0050_X"></A><A HREF = "invoic_c.htm#0050">0050</A>   <A HREF = "../trsd/trsdali.htm">ALI</A> Additional information                    C   5     
<A NAME = "0060_X"></A><A HREF = "invoic_c.htm#0060">0060</A>   <A HREF = "../trsd/trsdimd.htm">IMD</A> Item description                          C   1     
<A NAME = "0070_X"></A><A HREF = "invoic_c.htm#0070">0070</A>   <A HREF = "../trsd/trsdftx.htm">FTX</A> Free text                                 C   99    
<A NAME = "0080_X"></A><A HREF = "invoic_c.htm#0080">0080</A>   <A HREF = "../trsd/trsdloc.htm">LOC</A> Place/location identification             C   10    
<A NAME = "0090_X"></A><A HREF = "invoic_c.htm#0090">0090</A> X <A HREF = "../trsd/trsdgis.htm">GIS</A> General indicator                         C   10    
<A NAME = "0100_X"></A><A HREF = "invoic_c.htm#0100">0100</A>   <A HREF = "../trsd/trsddgs.htm">DGS</A> Dangerous goods                           C   1     
<A NAME = "0110_X"></A><A HREF = "invoic_c.htm#0110">0110</A>   <A HREF = "../trsd/trsdgir.htm">GIR</A> Related identification numbers            C   10    

<A NAME = "0120_X"></A><A HREF = "invoic_c.htm#0120">0120</A>       ----- Segment group 1  ------------------ C   99999-------+
<A NAME = "0130_X"></A><A HREF = "invoic_c.htm#0130">0130</A>   <A HREF = "../trsd/trsdrff.htm">RFF</A> Reference                                 M   1           |
<A NAME = "0140_X"></A><A HREF = "invoic_c.htm#0140">0140</A>   <A HREF = "../trsd/trsddtm.htm">DTM</A> Date/time/period                          C   5           |
<A NAME = "0150_X"></A><A HREF = "invoic_c.htm#0150">0150</A>   <A HREF = "../trsd/trsdgir.htm">GIR</A> Related identification numbers            C   5           |
<A NAME = "0160_X"></A><A HREF = "invoic_c.htm#0160">0160</A>   <A HREF = "../trsd/trsdloc.htm">LOC</A> Place/location identification             C   2           |
<A NAME = "0170_X"></A><A HREF = "invoic_c.htm#0170">0170</A>   <A HREF = "../trsd/trsdmea.htm">MEA</A> Measurements                              C   5           |
<A NAME = "0180_X"></A><A HREF = "invoic_c.htm#0180">0180</A>   <A HREF = "../trsd/trsdqty.htm">QTY</A> Quantity                                  C   2           |
<A NAME = "0190_X"></A><A HREF = "invoic_c.htm#0190">0190</A>   <A HREF = "../trsd/trsdftx.htm">FTX</A> Free text                                 C   5           |
<A NAME = "0200_X"></A><A HREF = "invoic_c.htm#0200">0200</A>   <A HREF = "../trsd/trsdmoa.htm">MOA</A> Monetary amount                           C   2           |
<A NAME = "0210_X"></A><A HREF = "invoic_c.htm#0210">0210</A>   <A HREF = "../trsd/trsdrte.htm">RTE</A> Rate details                              C   99----------+

<A NAME = "0220_X"></A><A HREF = "invoic_c.htm#0220">0220</A>       ----- Segment group 2  ------------------ C   99----------+
<A NAME = "0230_X"></A><A HREF = "invoic_c.htm#0230">0230</A>   <A HREF = "../trsd/trsdnad.htm">NAD</A> Name and address                          M   1           |
<A NAME = "0240_X"></A><A HREF = "invoic_c.htm#0240">0240</A>   <A HREF = "../trsd/trsdloc.htm">LOC</A> Place/location identification             C   25          |
<A NAME = "0250_X"></A><A HREF = "invoic_c.htm#0250">0250</A>   <A HREF = "../trsd/trsdfii.htm">FII</A> Financial institution information         C   5           |
<A NAME = "0260_X"></A><A HREF = "invoic_c.htm#0260">0260</A>   <A HREF = "../trsd/trsdmoa.htm">MOA</A> Monetary amount                           C   99          |
                                                                     |
<A NAME = "0270_X"></A><A HREF = "invoic_c.htm#0270">0270</A>       ----- Segment group 3  ------------------ C   9999-------+|
<A NAME = "0280_X"></A><A HREF = "invoic_c.htm#0280">0280</A>   <A HREF = "../trsd/trsdrff.htm">RFF</A> Reference                                 M   1          ||
<A NAME = "0290_X"></A><A HREF = "invoic_c.htm#0290">0290</A>   <A HREF = "../trsd/trsddtm.htm">DTM</A> Date/time/period                          C   5----------+|
                                                                     |
<A NAME = "0300_X"></A><A HREF = "invoic_c.htm#0300">0300</A>       ----- Segment group 4  ------------------ C   5----------+|
<A NAME = "0310_X"></A><A HREF = "invoic_c.htm#0310">0310</A>   <A HREF = "../trsd/trsddoc.htm">DOC</A> Document/message details                  M   1          ||
<A NAME = "0320_X"></A><A HREF = "invoic_c.htm#0320">0320</A>   <A HREF = "../trsd/trsddtm.htm">DTM</A> Date/time/period                          C   5----------+|
                                                                     |
<A NAME = "0330_X"></A><A HREF = "invoic_c.htm#0330">0330</A>       ----- Segment group 5  ------------------ C   5----------+|
<A NAME = "0340_X"></A><A HREF = "invoic_c.htm#0340">0340</A>   <A HREF = "../trsd/trsdcta.htm">CTA</A> Contact information                       M   1          ||
<A NAME = "0350_X"></A><A HREF = "invoic_c.htm#0350">0350</A>   <A HREF = "../trsd/trsdcom.htm">COM</A> Communication contact                     C   5----------++

DETAIL SECTION

<A NAME = "1090_X"></A><A HREF = "invoic_c.htm#1090">1090</A>       ----- Segment group 26 ------------------ C   9999999-----+
<A NAME = "1100_X"></A><A HREF = "invoic_c.htm#1100">1100</A>   <A HREF = "../trsd/trsdlin.htm">LIN</A> Line item                                 M   1           |
<A NAME = "1110_X"></A><A HREF = "invoic_c.htm#1110">1110</A>   <A HREF = "../trsd/trsdpia.htm">PIA</A> Additional product id                     C   25          |
                                                                     |
<A NAME = "1250_X"></A><A HREF = "invoic_c.htm#1250">1250</A>       ----- Segment group 27 ------------------ C   99---------+|
<A NAME = "1260_X"></A><A HREF = "invoic_c.htm#1260">1260</A>   <A HREF = "../trsd/trsdmoa.htm">MOA</A> Monetary amount                           M   1          ||
<A NAME = "1270_X"></A><A HREF = "invoic_c.htm#1270">1270</A>   <A HREF = "../trsd/trsdcux.htm">CUX</A> Currencies                                C   1----------++

SUMMARY SECTION

<A NAME = "2170_X"></A><A HREF = "invoic_c.htm#2170">2170</A>   <A HREF="http://www.gefeg.com/jswg/">UNS</A> Section control                           M   1   
<A NAME = "2320_X"></A><A HREF = "invoic_c.htm#2320">2320</A>   <A HREF="http://www.gefeg.com/jswg/">UNT</A> Message trailer                           M   1     
<P>
`;
            const expectedBGMEntry: MessageType = {
                content: "BGM",
                mandatory: true,
                repetition: 1,
                data: undefined,
                section: undefined
            };

            const expectedSegmentGroup26Entry: MessageType = {
                content: [
                    { content: "LIN", mandatory: true, repetition: 1, data: undefined, section: undefined },
                    { content: "PIA", mandatory: false, repetition: 25, data: undefined, section: undefined },
                    { content: [
                        { content: "MOA", mandatory: true, repetition: 1, data: undefined, section: undefined },
                        { content: "CUX", mandatory: false, repetition: 1, data: undefined, section: undefined }
                    ], mandatory: false, repetition: 99, name: "Segment group 27", section: undefined }
                ], mandatory: false, repetition: 9999999, name: "Segment group 26", section: "detail"
            };

            const expectedUNSEntry: MessageType = {
                content: "UNS",
                mandatory: true,
                repetition: 1,
                data: undefined,
                section: "summary"
            };

            (sut as any).parsePage(page)
                .then((result: ParsingResultType) => {
                    expect(result.specObj.messageStructureDefinition).toContain(expectedBGMEntry);
                    expect(result.specObj.messageStructureDefinition).toContain(expectedSegmentGroup26Entry);
                    expect(result.specObj.messageStructureDefinition).toContain(expectedUNSEntry);
                    expect(result.promises).not.toEqual([]);
                    done();
                });
        });
    });

    describe("Segment Detail Page Parser", () => {

        let mockDefinition: EdifactMessageSpecification;

        beforeEach(() => {
            mockDefinition = {
                messageType: "INVOIC",
                version: "D01",
                release: "B",
                controllingAgency: "UN",
                segmentTable: new Dictionary<SegmentEntry>(),
                elementTable: new Dictionary<ElementEntry>(),
                messageStructureDefinition: [],

                type(): string {
                    return this.version + this.release + "_" + this.messageType;
                },
                versionAbbr(): string {
                    return this.version + this.release;
                }
            };
        });

        it("should parse segment definition page", (done) => {

            const page: string = `
<H3>       MEA  MEASUREMENTS</H3>

       Function: To specify physical measurements, including
                 dimension tolerances, weights and counts.

010    <A HREF = "../tred/tred6311.htm">6311</A> MEASUREMENT PURPOSE CODE QUALIFIER         M    1 an..3

020    <A HREF = "../trcd/trcdc502.htm">C502</A> MEASUREMENT DETAILS                        C    1
       <A HREF = "../tred/tred6313.htm">6313</A>  Measured attribute code                   C      an..3
       <A HREF = "../tred/tred6321.htm">6321</A>  Measurement significance code             C      an..3
       <A HREF = "../tred/tred6155.htm">6155</A>  Non-discrete measurement name code        C      an..17
       <A HREF = "../tred/tred6154.htm">6154</A>  Non-discrete measurement name             C      an..70

030    <A HREF = "../trcd/trcdc174.htm">C174</A> VALUE/RANGE                                C    1
       <A HREF = "../tred/tred6411.htm">6411</A>  Measurement unit code                     M      an..3
       <A HREF = "../tred/tred6314.htm">6314</A>  Measurement value                         C      an..18
       <A HREF = "../tred/tred6162.htm">6162</A>  Range minimum value                       C      n..18
       <A HREF = "../tred/tred6152.htm">6152</A>  Range maximum value                       C      n..18
       <A HREF = "../tred/tred6432.htm">6432</A>  Significant digits quantity               C      n..2

040    <A HREF = "../tred/tred7383.htm">7383</A> SURFACE OR LAYER CODE                      C    1 an..3

<P>`;

            const sut: UNECEMessageStructureParser = new UNECEMessageStructureParser("d01b", "invoic");
            // testing private method
            (sut as any).parseSegmentDefinitionPage("MEA", page, mockDefinition)
                .then((response: EdifactMessageSpecification) => {
                    const segments: Dictionary<SegmentEntry> = response.segmentTable;
                    const elements: Dictionary<ElementEntry> = response.elementTable;

                    expect(segments.get("MEA")?.elements).toEqual(jasmine.arrayContaining(["6311", "C502", "C174", "7383"]));
                    expect(segments.get("MEA")?.requires).toEqual(1);

                    expect(elements.get("6311")?.components).toEqual(jasmine.arrayContaining(["an..3"]));
                    expect(elements.get("6311")?.requires).toEqual(1);
                    expect(elements.get("C174")?.components).toEqual(jasmine.arrayContaining(["an..3", "an..18", "n..18", "n..18", "n..2"]));
                    expect(elements.get("C174")?.requires).toEqual(1);

                    // sub-components should not be stored
                    expect(elements.get("6411")).toBeUndefined();

                    done();
                });
        });

        it("should handle multi-line definitions correctly", (done) => {
            const page: string = `
<H3>       DTM  DATE/TIME/PERIOD</H3>

       Function: To specify date, and/or time, or period.
     
010    <A HREF = "../trcd/trcdc507.htm">C507</A> DATE/TIME/PERIOD                           M    1
       <A HREF = "../tred/tred2005.htm">2005</A>  Date or time or period function code
             qualifier                                 M      an..3
       <A HREF = "../tred/tred2380.htm">2380</A>  Date or time or period value              C      an..35
       <A HREF = "../tred/tred2379.htm">2379</A>  Date or time or period format code        C      an..3

<P>`;
            const sut: UNECEMessageStructureParser = new UNECEMessageStructureParser("d01b", "invoic");
            (sut as any).parseSegmentDefinitionPage("DTM", page, mockDefinition)
                .then((response: EdifactMessageSpecification) => {
                    const segments: Dictionary<SegmentEntry> = response.segmentTable;
                    const elements: Dictionary<ElementEntry> = response.elementTable;

                    expect(segments.get("DTM")?.elements).toEqual(jasmine.arrayContaining(["C507"]));
                    expect(segments.get("DTM")?.requires).toEqual(1);

                    expect(elements.get("C507")?.components).toEqual(jasmine.arrayContaining(["an..3", "an..35", "an..3"]));
                    expect(elements.get("C507")?.requires).toEqual(1);

                    done();
                });
        });

        it("should skip already defined segments", (done) => {
            const page: string = `
<H3>       DTM  DATE/TIME/PERIOD</H3>

       Function: To specify date, and/or time, or period.
     
010    <A HREF = "../trcd/trcdc507.htm">C507</A> DATE/TIME/PERIOD                           M    1
       <A HREF = "../tred/tred2005.htm">2005</A>  Date or time or period function code
             qualifier                                 M      an..3
       <A HREF = "../tred/tred2380.htm">2380</A>  Date or time or period value              C      an..35
       <A HREF = "../tred/tred2379.htm">2379</A>  Date or time or period format code        C      an..3

<P>`;

            const sut: UNECEMessageStructureParser = new UNECEMessageStructureParser("d01b", "invoic");

            const definitionMock: EdifactMessageSpecification = mockDefinition;
            // wrong definition, though should not get overridden
            definitionMock.segmentTable.add("DTM", { "requires": 0, "elements": [] });

            (sut as any).parseSegmentDefinitionPage("DTM", page, definitionMock)
                .then((response: EdifactMessageSpecification) => {
                    const segments: Dictionary<SegmentEntry> = response.segmentTable;
                    const elements: Dictionary<ElementEntry> = response.elementTable;

                    expect(segments.get("DTM")?.elements).toEqual(jasmine.arrayContaining([]));
                    expect(segments.get("DTM")?.requires).toEqual(0);

                    // will also skip element assignment as this should already
                    // have happened during the definition of the previous segment
                    // definition
                    expect(elements.get("C507")).toBeUndefined();

                    done();
                });
        });

        it("should add multiple element definitions only once", (done) => {
            const page: string = `
<H3>       CUX  CURRENCIES</H3>

       Function: To specify currencies used in the transaction
                 and relevant details for the rate of exchange.
    
010    <A HREF = "../trcd/trcdc504.htm">C504</A> CURRENCY DETAILS                           C    1
       <A HREF = "../tred/tred6347.htm">6347</A>  Currency usage code qualifier             M      an..3
       <A HREF = "../tred/tred6345.htm">6345</A>  Currency identification code              C      an..3
       <A HREF = "../tred/tred6343.htm">6343</A>  Currency type code qualifier              C      an..3
       <A HREF = "../tred/tred6348.htm">6348</A>  Currency rate value                       C      n..4

020    <A HREF = "../trcd/trcdc504.htm">C504</A> CURRENCY DETAILS                           C    1
       <A HREF = "../tred/tred6347.htm">6347</A>  Currency usage code qualifier             M      an..3
       <A HREF = "../tred/tred6345.htm">6345</A>  Currency identification code              C      an..3
       <A HREF = "../tred/tred6343.htm">6343</A>  Currency type code qualifier              C      an..3
       <A HREF = "../tred/tred6348.htm">6348</A>  Currency rate value                       C      n..4

030    <A HREF = "../tred/tred5402.htm">5402</A> CURRENCY EXCHANGE RATE                     C    1 n..12

040    <A HREF = "../tred/tred6341.htm">6341</A> EXCHANGE RATE CURRENCY MARKET IDENTIFIER   C    1 an..3
 
<P>`;
            const sut: UNECEMessageStructureParser = new UNECEMessageStructureParser("d01b", "invoic");

            const definitionMock: EdifactMessageSpecification = mockDefinition;

            (sut as any).parseSegmentDefinitionPage("CUX", page, definitionMock)
                .then((response: EdifactMessageSpecification) => {
                    const segments: Dictionary<SegmentEntry> = response.segmentTable;
                    const elements: Dictionary<ElementEntry> = response.elementTable;

                    expect(segments.get("CUX")?.elements).toEqual(jasmine.arrayContaining(["C504", "C504", "5402", "6341"]));
                    expect(segments.get("CUX")?.requires).toEqual(0);

                    expect(elements.get("C504")?.components.length).toEqual(4);
                    expect(elements.get("C504")?.components).toEqual(jasmine.arrayContaining(["an..3", "an..3", "an..3", "n..4"]));

                    done();
                });
        });

        it("should parse segment definition with long element name", (done) => {

            const page: string = `
<H3>       TAX  DUTY/TAX/FEE DETAILS</H3>

       Function: To specify relevant duty/tax/fee information.
     
010    <A HREF = "../tred/tred5283.htm">5283</A> DUTY OR TAX OR FEE FUNCTION CODE QUALIFIER M    1 an..3
     
020    <A HREF = "../trcd/trcdc241.htm">C241</A> DUTY/TAX/FEE TYPE                          C    1
       <A HREF = "../tred/tred5153.htm">5153</A>  Duty or tax or fee type name code         C      an..3
       <A HREF = "../tred/tred1131.htm">1131</A>  Code list identification code             C      an..17
       <A HREF = "../tred/tred3055.htm">3055</A>  Code list responsible agency code         C      an..3
       <A HREF = "../tred/tred5152.htm">5152</A>  Duty or tax or fee type name              C      an..35
     
030    <A HREF = "../trcd/trcdc533.htm">C533</A> DUTY/TAX/FEE ACCOUNT DETAIL                C    1
       <A HREF = "../tred/tred5289.htm">5289</A>  Duty or tax or fee account code           M      an..6
       <A HREF = "../tred/tred1131.htm">1131</A>  Code list identification code             C      an..17
       <A HREF = "../tred/tred3055.htm">3055</A>  Code list responsible agency code         C      an..3
     
040    <A HREF = "../tred/tred5286.htm">5286</A> DUTY OR TAX OR FEE ASSESSMENT BASIS VALUE  C    1 an..15
   
050    <A HREF = "../trcd/trcdc243.htm">C243</A> DUTY/TAX/FEE DETAIL                        C    1
       <A HREF = "../tred/tred5279.htm">5279</A>  Duty or tax or fee rate code              C      an..7
       <A HREF = "../tred/tred1131.htm">1131</A>  Code list identification code             C      an..17
       <A HREF = "../tred/tred3055.htm">3055</A>  Code list responsible agency code         C      an..3
       <A HREF = "../tred/tred5278.htm">5278</A>  Duty or tax or fee rate                   C      an..17
       <A HREF = "../tred/tred5273.htm">5273</A>  Duty or tax or fee rate basis code        C      an..12
       <A HREF = "../tred/tred1131.htm">1131</A>  Code list identification code             C      an..17
       <A HREF = "../tred/tred3055.htm">3055</A>  Code list responsible agency code         C      an..3
     
060    <A HREF = "../tred/tred5305.htm">5305</A> DUTY OR TAX OR FEE CATEGORY CODE           C    1 an..3
     
070    <A HREF = "../tred/tred3446.htm">3446</A> PARTY TAX IDENTIFIER                       C    1 an..20
     
080    <A HREF = "../tred/tred1227.htm">1227</A> CALCULATION SEQUENCE CODE                  C    1 an..3
     
<P>`;

            const sut: UNECEMessageStructureParser = new UNECEMessageStructureParser("d01b", "invoic");
            (sut as any).parseSegmentDefinitionPage("TAX", page, mockDefinition)
                .then((response: EdifactMessageSpecification) => {
                    const segments: Dictionary<SegmentEntry> = response.segmentTable;
                    const elements: Dictionary<ElementEntry> = response.elementTable;

                    expect(segments.get("TAX")?.elements).toEqual(jasmine.arrayContaining(["5283", "C241", "C533", "5286", "C243", "5305", "3446", "1227"]));
                    expect(segments.get("TAX")?.requires).toEqual(1);

                    expect(elements.get("5283")?.components).toEqual(jasmine.arrayContaining(["an..3"]));
                    expect(elements.get("5283")?.requires).toEqual(1);
                    expect(elements.get("C241")?.components).toEqual(jasmine.arrayContaining(["an..3", "an..17", "an..3", "an..35"]));
                    expect(elements.get("C241")?.requires).toEqual(0);

                    done();
                });
        });
    });

    describe("should parse real UNECE page for structure and segment/element definitions", () => {

        it("successfully", (done) => {
            const sut: UNECEMessageStructureParser = new UNECEMessageStructureParser("d01b", "invoic");

            sut.loadTypeSpec()
                .then((response: EdifactMessageSpecification) => {
                    // persist(response, ".");
                    expect(response.type()).toEqual("D01B_INVOIC");
                    expect(response.messageStructureDefinition.length).not.toEqual(0);
                    done();
                })
                .catch((error: Error) => fail(error.message));
        }, 10000);
    });
});
