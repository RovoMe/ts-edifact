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


// Run this sample with: npx ts-node examples/interchangeBuilderSample.ts

import { Reader, ResultType } from "../src/reader";
import { InterchangeBuilder, Edifact, Group } from "../src/interchangeBuilder";
import { Separators } from "../src/edi/separators";
import { MessageStructureParser, UNECEMessageStructureParser, EdifactMessageSpecification } from "../src/edi/messageStructureParser";
import { persist } from "../src/util";
import { ItemDescription, LineItem, Quantity, PriceDetails, MonetaryAmount } from "../src/edifact";

let document: string = "";
document += "UNB+UNOA:1+005435656:1+006415160:1+060515:1434+00000000000778'";
document += "UNH+00000000000117+INVOIC:D:01B:UN'";
document += "BGM+380+342459+9'";
document += "DTM+3:20060515:102'";
document += "RFF+ON:521052'";
document += "NAD+BY+792820524::16++CUMMINS MID-RANGE ENGINE PLANT'";
document += "NAD+SE+005435656::16++GENERAL WIDGET COMPANY'";
document += "CUX+1:USD'";
document += "LIN+1++157870:IN'"; // start of detail section and first item, items (LIN and following segments) will be grouped and added to the respective item group
document += "IMD+F++:::WIDGET'";
document += "QTY+47:1020:EA'";
document += "ALI+US'";
document += "MOA+203:1202.58'";
document += "PRI+INV:1.179'";
document += "LIN+2++157871:IN'"; // start 2nd item
document += "IMD+F++:::DIFFERENT WIDGET'";
document += "QTY+47:20:EA'";
document += "ALI+JP'";
document += "MOA+203:410'";
document += "PRI+INV:20.5'";
document += "UNS+S'"; // start of summary section
document += "MOA+39:2137.58'";
document += "ALC+C+ABG'";
document += "MOA+8:525'";
document += "UNT+23+00000000000117'";
document += "UNZ+1+00000000000778'";

async function parseDocument(doc: string): Promise<Edifact> {
    const specDir: string = "./";
    const specParser: MessageStructureParser = new UNECEMessageStructureParser("D01B", "INVOIC");
    const edifact: Edifact = await specParser.loadTypeSpec()
        .then((data: EdifactMessageSpecification) => {
            persist(data, specDir, true);
        })
        .then(() => {
            const reader: Reader = new Reader(specDir);
            const result: ResultType[] = reader.parse(doc);
            const separators: Separators = reader.separators;

            const builder: InterchangeBuilder = new InterchangeBuilder(result, separators, specDir);
            return builder.interchange;
        })
        .catch((error: Error) => {
            throw error;
        });
    return edifact;
}

parseDocument(document)
    .then((doc: Edifact) => {
        console.log(`Sender: ${doc.sender.id}`);
        console.log(`Receiver: ${doc.receiver.id}`);
        console.log(`Interchange Number: ${doc.interchangeNumber}`);
        console.log(`Number of messages: ${doc.messages.length}`);
        console.log(`Number of items in first message: ${(doc.messages[0].detail[0] as Group).data.length}`);
        for (const entry of (doc.messages[0].detail[0] as Group).data) {
            if (entry instanceof Group) {
                console.log(`Info on item #${entry.name}:`);

                let articleNumber: string | undefined = "";
                let name: string | undefined = "";
                let qty: string | undefined = "0";
                let price: number | undefined = 0;
                let total: number | undefined = 0;
                for (const itemData of entry.data) {
                    if (!(itemData instanceof Group)) {
                        if (itemData instanceof LineItem) {
                            articleNumber = itemData?.itemNumberIdentification?.itemIdentifier;
                        } else if (itemData instanceof ItemDescription) {
                            name = itemData?.itemDescription?.itemDescription;
                        } else if (itemData instanceof Quantity) {
                            qty = itemData.quantityDetails.quantity;
                        }
                    } else {
                        for (const subGroupItem of itemData.data) {
                            if (subGroupItem instanceof PriceDetails) {
                                price = subGroupItem?.priceInformation?.priceAmount;
                            } else if (subGroupItem instanceof MonetaryAmount) {
                                total = subGroupItem.monetaryAmount?.monetaryAmount;
                            }
                        }
                    }
                }
                console.log(`\t${articleNumber ? articleNumber : ""} ${name ? name : ""}   x ${qty} à $${price ? price : 0} = ${total ?  total : 0}`);
            }
        }
    })
    .catch((error: Error) => {
        console.log(error.stack);
        console.trace(`Caught exception while attempting to parse Edifact document. Reason: ${error.message}`);
    });
