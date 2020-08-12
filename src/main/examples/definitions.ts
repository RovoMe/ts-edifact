/**
 *
 */

import { Reader, ResultType } from "../reader";
import { Tracker, MessageType } from "../tracker";

import * as fs from "fs";

let document: string = "";
document += "UNB+UNOA:1:::::::::::::::::::::+005435656:1+006415160:1+060515:1434+00000000000778'";
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

function _validateDocument(doc: string, callback?: (numChecked: number) => void): number | undefined {
    const reader: Reader = new Reader();
    const result: ResultType[] = reader.parse(doc);

    let checked: number = 0;
    const data: string = fs.readFileSync("INVOIC.json", { encoding: "utf-8"});
    const msgStruct: MessageType[] = JSON.parse(data) as MessageType[];
    const tracker: Tracker = new Tracker(msgStruct);

    for (const obj of result) {
        if (obj.name !== "UNA" && obj.name !== "UNB" && obj.name !== "UNZ") {
            console.log("Checking " + obj.name);
            tracker.accept(obj.name);
            checked++;
        }
    }
    if (callback) {
        callback(checked);
    } else {
        return checked;
    }
}

function validateDocumentSync(doc: string): void {
    _validateDocument(doc, (checked: number) => {
        console.log(`Finished validation of ${checked} segments`);
    });
}

validateDocumentSync(document);

async function validateDocumentAsync(doc: string): Promise<number> {
    const promise: Promise<number> = new Promise(resolve => {
        _validateDocument(doc, resolve);
    });
    const result: number = await promise;
    console.log(`Finished validation of ${result} segments`);
    return result;
}

void validateDocumentAsync(document);

function validateDocumentAsync2(doc: string): number | undefined {
    const result: number | undefined = _validateDocument(doc);
    console.log(`Finished validation of ${result as number} segments`);
    return result;
}

validateDocumentAsync2(document);

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

void sleep(500);
