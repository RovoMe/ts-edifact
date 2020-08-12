/**
 *
 */

import { Reader, ResultType } from "../reader";
import { InterchangeBuilder, Edifact } from "../interchangeBuilder";

let document: string = "";
document += "UNB+UNOA:1:::::::::::::::::::::+005435656:1+006415160:1+060515:1434+00000000000778'";
document += "UNH+00000000000117+INV\n\rOIC:D:96A:UN'";
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

function parseDocument(doc: string): Edifact {
    const reader: Reader = new Reader();
    const result: ResultType[] = reader.parse(doc);

    const builder: InterchangeBuilder = new InterchangeBuilder(result);

    return builder.interchange;
}

parseDocument(document);
