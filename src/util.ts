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

import * as fs from "fs";
import { Suffix } from "./tableBuilder";
import { EdifactMessageSpecification, MessageStructureParser, UNECEMessageStructureParser } from "./edi/messageStructureParser";

export function isDefined<T>(value: T | undefined | null): value is T {
    return <T>value !== undefined && <T>value !== null;
}

function toString(data: any, pretty?: boolean): string {
    if (pretty) {
        return JSON.stringify(data, null, 2);
    } else {
        return JSON.stringify(data);
    }
}

export function persist(data: EdifactMessageSpecification, path: string, pretty?: boolean): void {
    const messageStructDef: string = toString(data.messageStructureDefinition, pretty);
    const messageStructDefFileName: string = data.version + data.release + "_" + data.messageType + ".struct.json";

    const segments: string = toString((data.segmentTable as any).entries);
    const segmentsFileName: string = data.version + data.release + "_" + data.messageType + "." + Suffix.Segments + ".json";

    const elements: string = toString((data.elementTable as any).entries);
    const elementsFileName: string = data.version + data.release + "_" + data.messageType + "." + Suffix.Elements + ".json";

    let p: string = path;
    if (!p.endsWith("/")) {
        p += "/";
    }

    fs.writeFileSync(p + messageStructDefFileName, messageStructDef);
    fs.writeFileSync(p + segmentsFileName, segments);
    fs.writeFileSync(p + elementsFileName, elements);
}

export function storeAllDefaultSpecs(version: string, location: string): void {
    const types: string[] = [
        "APERAK", // 	Application error and acknowledgement message
        "AUTHOR", // 	Authorization message
        "AVLREQ", // 	Availability request – interactive message
        "AVLRSP", // 	Availability response – interactive message
        "BALANC", // 	Balance message
        "BANSTA", // 	Banking status message
        "BAPLIE", // 	Bayplan/stowage plan occupied and empty locations message
        "BAPLTE", // 	Bayplan/stowage plan total numbers message
        "BERMAN", // 	Berth management message
        "BMISRM", // 	Bulk marine inspection summary report message
        "BOPBNK", // 	Bank transactions and portfolio transactions report message
        "BOPCUS", // 	Balance of payment customer transaction report message
        "BOPDIR", // 	Direct balance of payment declaration message
        "BOPINF", // 	Balance of payment information from customer message
        "BUSCRD", // 	Business credit report message
        "CALINF", // 	Vessel call information message
        "CASINT", // 	Request for legal administration action in civil proceedings message
        "CASRES", // 	Legal administration response in civil proceedings message
        "CHACCO", // 	Chart of accounts message
        "CLASET", // 	Classification information set message
        "CNTCND", // 	Contractual conditions message
        "COACSU", // 	Commercial account summary message
        "COARRI", // 	Container discharge/loading report message
        "CODECO", // 	Container gate-in/gate-out report message
        "CODENO", //	Permit expiration/clearance ready notice message
        "COEDOR", // 	Container stock report message
        "COHAOR", // 	Container special handling order message
        "COLREQ", // 	Request for a documentary collection message
        "COMDIS", // 	Commercial dispute message
        "CONAPW", // 	Advice on pending works message
        "CONDPV", // 	Direct payment valuation message
        "CONDRA", // 	Drawing administration message
        "CONDRO", // 	Drawing organization message
        "CONEST", // 	Establishment of contract message
        "CONITT", // 	Invitation to tender message
        "CONPVA", // 	Payment valuation message
        "CONQVA", // 	Quantity valuation message
        "CONRPW", // 	Response of pending works message
        "CONTEN", // 	Tender message
        "CONWQD", // 	Work item quantity determination message
        "COPARN", // 	Container announcement message
        "COPAYM", // 	Contributions for payment
        "COPINO", // 	Container pre-notification message
        "COPRAR", // 	Container discharge/loading order message
        "COREOR", // 	Container release order message
        "COSTCO", // 	Container stuffing/stripping confirmation message
        "COSTOR", // 	Container stuffing/stripping order message
        "CREADV", // 	Credit advice message
        "CREEXT", // 	Extended credit advice message
        "CREMUL", // 	Multiple credit advice message
        "CUSCAR", // 	Customs cargo report message
        "CUSDEC", // 	Customs declaration message
        "CUSEXP", // 	Customs express consignment declaration message
        "CUSPED", // 	Periodic customs declaration message
        "CUSREP", // 	Customs conveyance report message
        "CUSRES", // 	Customs response message
        "DEBADV", // 	Debit advice message
        "DEBMUL", // 	Multiple debit advice message
        "DEBREC", // 	Debts recovery message
        "DELFOR", // 	Delivery schedule message
        "DELJIT", // 	Delivery just in time message
        "DESADV", // 	Dispatch advice message
        "DESTIM", // 	Equipment damage and repair estimate message
        "DGRECA", // 	Dangerous goods recapitulation message
        "DIRDEB", // 	Direct debit message
        "DIRDEF", // 	Directory definition message
        "DMRDEF", // 	Data maintenance request definition message
        "DMSTAT", // 	Data maintenance status report/query message
        "DOCADV", // 	Documentary credit advice message
        "DOCAMA", // 	Advice of an amendment of a documentary credit message
        "DOCAMI", // 	Documentary credit amendment information message
        "DOCAMR", // 	Request for an amendment of a documentary credit message
        "DOCAPP", // 	Documentary credit application message
        "DOCARE", // 	Response to an amendment of a documentary credit message
        "DOCINF", // 	Documentary credit issuance information message
        "ENTREC", // 	Accounting entries message
        "FINCAN", // 	Financial cancellation message
        "FINPAY", // 	Multiple interbank funds transfer message
        "FINSTA", // 	Financial statement of an account message
        "GENRAL", // 	General purpose message
        "GESMES", // 	Generic statistical message
        "HANMOV", // 	Cargo/goods handling and movement message
        "ICASRP", // 	Insurance claim assessment and reporting message
        "ICSOLI", // 	Insurance claim solicitor’s instruction message
        "IFCSUM", // 	Forwarding and consolidation summary message
        "IFTCCA", // 	Forwarding and transport shipment charge calculation message
        "IFTDGN", // 	Dangerous goods notification message
        "IFTFCC", // 	International transport freight costs and other charges message
        "IFTIAG", // 	Dangerous cargo list message
        "IFTICL", // 	Cargo insurance claims message
        "IFTMAN", // 	Arrival notice message
        "IFTMBC", // 	Booking confirmation message
        "IFTMBF", // 	Firm booking message
        "IFTMBP", // 	Provisional booking message
        "IFTMCA", // 	Consignment advice message
        "IFTMCS", // 	Instruction contract status message
        "IFTMFR", // 	International Forwarding And Transport
        "IFTMIN", // 	Instruction message
        "IFTRIN", // 	Forwarding and transport rate information message
        "IFTSAI", // 	Forwarding and transport schedule and availability information me
        "IFTSTA", // 	International multimodal status report message
        "IFTSTQ", // 	International multimodal status request message
        "IHCEBI", // 	Interactive health insurance eligibility and benefits inquiry and
        "IHCLME", // 	Health care claim or encounter request and response – interactive
        "IMPDEF", // 	EDI implementation guide definition message
        "INFCON", // 	Infrastructure condition message
        "INFENT", // 	Enterprise accounting information message
        "INSDES", // 	Instruction to dispatch message
        "INSPRE", // 	Insurance premium message
        "INSREQ", // 	Inspection request message
        "INSRPT", // 	Inspection report message
        "INTCHG", // 	Interchange Control Structures
        "INVOIC", // 	Invoice message
        "INVRPT", // 	Inventory report message
        "IPPOAD", // 	Insurance policy administration message
        "IPPOMO", // 	Motor insurance policy message
        "ISENDS", // 	Intermediary system enablement or disablement message
        "ITRRPT", // 	In transit report detail message
        "JAPRES", // 	Job application result message
        "JINFDE", // 	Job information demand message
        "JOBAPP", // 	Job application proposal message
        "JOBCON", // 	Job order confirmation message
        "JOBMOD", // 	Job order modification message
        "JOBOFF", // 	Job order message
        "JUPREQ", // 	Justified payment request message
        "LEDGER", // 	Ledger message
        "LREACT", // 	Life reinsurance activity message
        "LRECLM", // 	Life reinsurance claims message
        "MEDPID", // 	Person identification message
        "MEDPRE", // 	Medical prescription message
        "MEDREQ", // 	Medical service request message
        "MEDRPT", // 	Medical service report message
        "MEDRUC", // 	Medical resource usage and cost message
        "MEQPOS", // 	Means of transport and equipment position message
        "MOVINS", // 	Stowage instruction message
        "MSCONS", // 	Metered services consumption report message
        "ORDCHG", // 	Purchase order change request message
        "ORDERS", // 	Purchase order message
        "ORDRSP", // 	Purchase order response message
        "OSTENQ", // 	Order status enquiry message
        "OSTRPT", // 	Order status report message
        "PARTIN", // 	Party information message
        "PASREQ", // 	Travel tourism and leisure product application status request – i
        "PASRSP", // 	Travel tourism and leisure product application status response –
        "PAXLST", // 	Passenger list message
        "PAYDUC", // 	Payroll deductions advice message
        "PAYEXT", // 	Extended payment order message
        "PAYMUL", // 	Multiple payment order message
        "PAYORD", // 	Payment order message
        "PRICAT", // 	Price/sales catalogue message
        "PRIHIS", // 	Pricing history message
        "PROCST", // 	Project cost reporting message
        "PRODAT", // 	Product data message
        "PRODEX", // 	Product exchange reconciliation message
        "PROINQ", // 	Product inquiry message
        "PROSRV", // 	Product service message
        "PROTAP", // 	Project tasks planning message
        "PRPAID", // 	Insurance premium payment message
        "QALITY", // 	Quality data message
        "QUOTES", // 	Quote message
        "RDRMES", // 	Raw data reporting message
        "REBORD", // 	Reinsurance bordereau message
        "RECADV", // 	Receiving advice message
        "RECALC", // 	Reinsurance calculation message
        "RECECO", // 	Credit risk cover message
        "RECLAM", // 	Reinsurance claims message
        "RECORD", // 	Reinsurance core data message
        "REGENT", // 	Registration of enterprise message
        "RELIST", // 	Reinsured objects list message
        "REMADV", // 	Remittance advice message
        "REPREM", // 	Reinsurance premium message
        "REQDOC", // 	Request for document message
        "REQOTE", // 	Request for quote message
        "RESETT", // 	Reinsurance settlement message
        "RESMSG", // 	Reservation message
        "RESREQ", // 	Reservation request – interactive message
        "RESRSP", // 	Reservation response – interactive message
        "RETACC", // 	Reinsurance technical account message
        "RETANN", // 	Announcement for returns message
        "RETINS", // 	Instruction for returns message
        "RPCALL", // 	Repair call message
        "SAFHAZ", // 	Safety and hazard data message
        "SANCRT", // 	International movement of goods governmental regulatory message
        "SKDREQ", // 	Schedule request – interactive message
        "SKDUPD", // 	Schedule update – interactive message
        "SLSFCT", // 	Sales forecast message
        "SLSRPT", // 	Sales data report message
        "SOCADE", // 	Social administration message
        "SSIMOD", // 	Modification of identity details message
        "SSRECH", // 	Worker’s insurance history message
        "SSREGW", // 	Notification of registration of a worker message
        "STATAC", // 	Statement of account message
        "STLRPT", // 	Settlement transaction reporting message
        "SUPCOT", // 	Superannuation contributions advice message
        "SUPMAN", // 	Superannuation maintenance message
        "SUPRES", // 	Supplier response message
        "TANSTA", // 	Tank status report message
        "TAXCON", // 	Tax control message
        "TIQREQ", // 	Travel tourism and leisure information inquiry request – interactive
        "TIQRSP", // 	Travel tourism and leisure information inquiry response – interactive
        "TPFREP", // 	Terminal performance message
        "TSDUPD", // 	Timetable static data update – interactive message
        "TUPREQ", // 	Travel, tourism and leisure data update request – interactive message
        "TUPRSP", // 	Travel, tourism and leisure data update response – interactive message
        "UTILMD", // 	Utilities master data message
        "UTILTS", // 	Utilities time series message
        "VATDEC", // 	Value added tax message
        "VESDEP", // 	Vessel departure message
        "WASDIS", // 	Waste disposal information message
        "WKGRDC", // 	Work grant decision message
        "WKGRRE" // 	Work grant request message"
    ];

    for (const typeName of types) {
        const structParser: MessageStructureParser = new UNECEMessageStructureParser(version, typeName);
        structParser.loadTypeSpec()
            .then((result: EdifactMessageSpecification) => {
                persist(result, location);
            }).then(() => {
                console.log(`Stored definition for type ${typeName} of version ${version} at location ${location}`);
            }).catch((error: Error) => {
                console.warn(`Could not load Message structure and segment/element definitions for message type ${typeName} of version ${version}. Reason: ${error.message}`);
            });
    }
}

// Run with: npx ts-node src/util.ts
// storeAllDefaultSpecs("d01b", ".");
