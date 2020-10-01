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

import { Reader, ResultType } from "../src/reader";

describe("Edifact Reader", () => {

    it("should read document with custom decimal separator", () => {

        let document: string = "";
        // custom decimal character in UNA segment!
        document += "UNA:+,? '";
        document += "UNB+UNOA:1+005435656:1+006415160:1+060515:1434+00000000000778'";
        document += "UNH+00000000000117+INV\n\rOIC:D:01B:UN'";
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
        document += "MOA+203:1202,58'";
        document += "PRI+INV:1,179'";
        document += "LIN+2++157871:IN'";
        document += "IMD+F++:::DIFFERENT WIDGET'";
        document += "QTY+47:20:EA'";
        document += "ALI+JP'";
        document += "MOA+203:410'";
        document += "PRI+INV:20,5'";
        document += "UNS+S'";
        document += "MOA+39:2137,58'";
        document += "ALC+C+ABG'";
        document += "MOA+8:525'";
        document += "UNT+23+00000000000117'";
        document += "UNZ+1+00000000000778'";

        const sut: Reader = new Reader("./src/messageSpec");

        const parsingResult: ResultType[] = sut.parse(document);

        expect(parsingResult.length).toEqual(26);
        expect(sut.separators.decimalSeparator).toEqual(",");
    });

    it("should read document with reported issues", () => {
        const sut: Reader = new Reader("./src/messageSpec");

        let doc: string = "";
        doc += "UNA:+.? '";
        doc += "UNB+UNOC:3+SENDER:ZZZ+RECEIVER:ZZZ+200921:1518+7++++++1'";
        doc += "UNH+1+INVOIC:D:07A:UN:GAVA23'";
        doc += "BGM+380::272+DEI-10647-2020'";
        doc += "DTM+137:20200811:102'";
        doc += "DTM+158:20200701:102'";
        doc += "DTM+159:20200731:102'";
        doc += "FTX+AAI+++Wir erlauben uns wie folgt in Rechnung zu stellen?:'";
        doc += "FTX+REG+++Geschäftsführer?: M. Muster; Partner?: T. Test;: Registergericht?: München; HRB 123456; Ust-ID?: DE 123456789; T ?+49 00 :9876 543-0; office@test.com; www.test.com'";
        doc += "NAD+SE+12345678::92++The Test Company GmbH+Teststraße 1+München++80992+DE'";
        doc += "RFF+VA:DE123456789'";
        doc += "RFF+XA:Registergericht München HRB 123456'";
        doc += "CTA+IC+:Max Muster'";
        doc += "COM+m.muster@test.com:EM'";
        doc += "NAD+BY+A1::92++Buyer AG+Markplatz 1+München++80788+DE'";
        doc += "RFF+VA:DE987654321'";
        doc += "RFF+FC:123/456/78901'";
        doc += "CTA+IC+:Steve Test'";
        doc += "NAD+ST+A1::92++Buyer AG+Marktplatz 1+München++80788+DE'";
        doc += "CUX+2:EUR:4'";
        doc += "PYT+1'";
        doc += "DTM+140:20200910:102'";
        doc += "FII+RH+DE12345678901234567890:The Test Company GmbH+::::::Some Bank'";
        doc += "LIN+10'";
        doc += "PIA+1+2:SA'";
        doc += "IMD+++:::Rüsttage'";
        doc += "QTY+47:43:E49'";
        doc += "MOA+203:18060:EUR'";
        doc += "PRI+AAA:420::CON:1'";
        doc += "RFF+ON:ABC123B'";
        doc += "DTM+171:20191231:102'";
        doc += "TAX+7+VAT+++:::16'";
        doc += "LIN+20'";
        doc += "PIA+1+3:SA'";
        doc += "IMD+++:::Durchführung'";
        doc += "QTY+47:48:E49'";
        doc += "MOA+203:33600:EUR'";
        doc += "PRI+AAA:700::CON:1'";
        doc += "RFF+ON:ABC123B'";
        doc += "DTM+171:20191231:102'";
        doc += "TAX+7+VAT+++:::16'";
        doc += "LIN+30'";
        doc += "PIA+1+7:SA'";
        doc += "IMD+++:::Reisekosten und Materialien'";
        doc += "QTY+47:1:EA'";
        doc += "MOA+203:1166.35:EUR'";
        doc += "PRI+AAA:1166.35::CON:1'";
        doc += "RFF+ON:ABC123B'";
        doc += "DTM+171:20191231:102'";
        doc += "TAX+7+VAT+++:::16'";
        doc += "UNS+S'";
        doc += "MOA+79:52826.35:EUR'";
        doc += "MOA+125:52826.35:EUR'";
        doc += "MOA+176:8452.22:EUR'";
        doc += "MOA+77:61278.57:EUR'";
        doc += "MOA+109:0:EUR'";
        doc += "UNT+55+1'";
        doc += "UNZ+1+7'";

        const parsingResult: ResultType[] = sut.parse(doc);

        expect(parsingResult.length).toEqual(57);
    });
});
