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

export { Cache } from "./cache";
export { Configuration } from "./configuration";
export { Tokenizer } from "./tokenizer";
export { Parser } from "./parser";
export {
    EventValidator,
    NullValidator,
    Validator,
    ValidatorImpl,
    Dictionary,
    SegmentEntry,
    ElementEntry,
    ValidatorStates
} from "./validator";
export { MessageType, Pointer, Tracker } from "./tracker";
export { Reader, ResultType } from "./reader";
export {
    Separators,
    EdifactSeparatorsBuilder,
    AnsiX12SeparatorsBuilder,
    TradacomsSeparatorsBuilder
} from "./edi/separators";
export {
    InterchangeBuilder,
    Edifact,
    Group,
    Message,
    SyntaxIdentifier,
    Sender,
    Receiver,
    RecipientsRef
} from "./interchangeBuilder";
export {
    Map,
    MapConstructor,
    sanitizeFloat,
    MoaType,
    Segment,
    BeginOfMessage,
    LineItem,
    Quantity,
    PriceDetails,
    MonetaryAmount
} from "./edifact";

export {
    EdifactMessageSpecification,
    UNECEMessageStructureParser
} from "./edi/messageStructureParser";

export { segments as segmentTable } from "./segments";
export { elements as elementTable} from "./elements";

import * as APERAK from "./messages/APERAK.json";
import * as AUTHOR from "./messages/AUTHOR.json";
import * as BALANC from "./messages/BALANC.json";
import * as DESADV from "./messages/DESADV.json";
import * as INVOIC from "./messages/INVOIC.json";
import * as INVRPT from "./messages/INVRPT.json";
import * as ORDERS from "./messages/ORDERS.json";
import * as OSTENQ from "./messages/OSTENQ.json";
import * as OSTRPT from "./messages/OSTRPT.json";
import * as PARTIN from "./messages/PARTIN.json";
import * as TAXCON from "./messages/TAXCON.json";
import * as VATDEC from "./messages/VATDEC.json";

import * as D96A_INVOIC from "./messages/D96A_INVOIC.json";
import * as D01B_INVOIC from "./messages/D01B_INVOIC.json";

import * as D04A_DESADV from "./messages/D04A_DESADV.json";
import * as D05A_DESADV from "./messages/D05A_DESADV.json";
import * as D06A_DESADV from "./messages/D06A_DESADV.json";
import * as D07A_DESADV from "./messages/D07A_DESADV.json";
import * as D08A_DESADV from "./messages/D08A_DESADV.json";
import * as D09A_DESADV from "./messages/D09A_DESADV.json";
import * as D18A_DESADV from "./messages/D18A_DESADV.json";

import * as D16A_APERAK from "./messages/D16A_APERAK.json";
import * as D16A_AUTHOR from "./messages/D16A_AUTHOR.json";
import * as D16A_BALANC from "./messages/D16A_BALANC.json";
import * as D16A_DESADV from "./messages/D16A_DESADV.json";
import * as D16A_INVOIC from "./messages/D16A_INVOIC.json";
import * as D16A_INVRPT from "./messages/D16A_INVRPT.json";
import * as D16A_ORDERS from "./messages/D16A_ORDERS.json";
import * as D16A_OSTENQ from "./messages/D16A_OSTENQ.json";
import * as D16A_OSTRPT from "./messages/D16A_OSTRPT.json";
import * as D16A_PARTIN from "./messages/D16A_PARTIN.json";
import * as D16A_TAXCON from "./messages/D16A_TAXCON.json";
import * as D16A_VATDEC from "./messages/D16A_VATDEC.json";

export { APERAK, AUTHOR, BALANC, DESADV, INVOIC, INVRPT, ORDERS, OSTENQ, OSTRPT, PARTIN, TAXCON, VATDEC };
export { D96A_INVOIC, D01B_INVOIC };
export { D04A_DESADV, D05A_DESADV, D06A_DESADV, D07A_DESADV, D08A_DESADV, D09A_DESADV, D18A_DESADV};
export { D16A_APERAK, D16A_AUTHOR, D16A_BALANC, D16A_DESADV, D16A_INVOIC, D16A_INVRPT, D16A_ORDERS, D16A_OSTENQ, D16A_OSTRPT, D16A_PARTIN, D16A_TAXCON, D16A_VATDEC};
