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
    sanitizeFloat,
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

export { SegmentTableBuilder } from "./segments";
export { ElementTableBuilder } from "./elements";

// default D01B message specifications

import * as APERAK from "./messageSpec/APERAK.struct.json";
import * as AUTHOR from "./messageSpec/AUTHOR.struct.json";
import * as BALANC from "./messageSpec/BALANC.struct.json";
import * as DESADV from "./messageSpec/DESADV.struct.json";
import * as GENRAL from "./messageSpec/GENRAL.struct.json";
import * as IFTMIN from "./messageSpec/IFTMIN.struct.json";
import * as INVOIC from "./messageSpec/INVOIC.struct.json";
import * as INVRPT from "./messageSpec/INVRPT.struct.json";
import * as ORDERS from "./messageSpec/ORDERS.struct.json";
import * as OSTENQ from "./messageSpec/OSTENQ.struct.json";
import * as OSTRPT from "./messageSpec/OSTRPT.struct.json";
import * as PARTIN from "./messageSpec/PARTIN.struct.json";
import * as TAXCON from "./messageSpec/TAXCON.struct.json";
import * as VATDEC from "./messageSpec/VATDEC.struct.json";

import * as D96A_INVOIC from "./messageSpec/D96A_INVOIC.struct.json";

export { APERAK, AUTHOR, BALANC, DESADV, GENRAL, IFTMIN, INVOIC, INVRPT, ORDERS, OSTENQ, OSTRPT, PARTIN, TAXCON, VATDEC };
export { D96A_INVOIC };
