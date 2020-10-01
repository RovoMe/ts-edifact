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

import { Configuration } from "./configuration";
import { Separators } from "./edi/separators";

interface RegExType {
    alpha: RegExp;
    numeric: RegExp;
    alphanumeric: RegExp;
    decimal: RegExp;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export abstract class Charset implements RegExType {
    name: string;

    alpha: RegExp;
    alphanumeric: RegExp;
    numeric: RegExp;
    decimal: RegExp;

    constructor(name: string, configuration: Configuration, admissibleAlphabet: string[][], unicode: boolean = false) {
        this.name = name;
        const exclude: number[] = configuration.delimiters();
        const alphas: RegExp[] = this.compile(admissibleAlphabet, exclude, unicode);
        this.alpha = alphas[0];
        this.alphanumeric = alphas[1];

        // parsing decimals is a multiple step process. First, the numeric part will be parsed, then the decimal separator
        // added and last the decimal part of the value added to the end of that value. So no need to catch the decimal
        // value with a regular expression actually
        if (unicode) {
            this.numeric = /[-]?[\p{Nd}]*/g;
            this.decimal = /[\p{Nd}]*/gu;
        } else {
            this.numeric = /[-]?[0-9]*/g;
            this.decimal = /[0-9]*/g;
        }
    }

    private compile(admissibleAlphabet: string[][], excludes: number[], unicode: boolean = false): RegExp[] {
        // String.fromCharCode(parseInt("\u002F".codePointAt(0).toString(16), 16)) --> '/'
        const flag: string = unicode ? "gu" : "g";

        let output: string = "";
        for (const seq of admissibleAlphabet) {
            if (seq.length > 1) {
                const start: number | undefined = seq[0].codePointAt(0); // '/' --> 47 as the 47 character in the codepage
                const end: number | undefined = seq[1].codePointAt(0);
                if (start && end) {
                    for (let i: number = start; i <= end; i++) {
                        if (!excludes.includes(i)) {
                            output += Separators.escapeIfNeeded(String.fromCodePoint(i));
                        }
                    }
                }
            } else {
                const idx: number | undefined = seq[0].codePointAt(0);
                if (idx) {
                    output += Separators.escapeIfNeeded(String.fromCodePoint(idx));
                }
            }
        }

        const ret: RegExp[] = [];
        ret.push(new RegExp("[" + output + "]*", flag));
        ret.push(new RegExp("[0-9" + output + "]*", flag));
        return ret;
    }
}

/*
enum Modes {
    alphanumeric = 0,
    alpha = 1,
    numeric = 2,
    decimal = 3
}
*/

class UNOA extends Charset {

    private static charset: string[][] = [
        ["\u0020"],           // (space)
        ["\u0028", "\u0029"], // ( )
        ["\u002C", "\u002F"], // , - . /
        ["\u003D"],           // =
        ["\u0041", "\u005A"]  // A-Z
    ];

    constructor(config: Configuration) {
        super("UNOA", config, UNOA.charset);
    }
}

class UNOB extends Charset {

    private static charset: string[][] = [
        ["\u0020", "\u0022"], // (space) ! "
        ["\u0041", "\u005A"], // A-Z
        ["\u0025", "\u002F"], // % & ' ( ) * + , - . /
        ["\u003A", "\u003F"], // : ; < = > ?
        ["\u0061", "\u007A"]  // a-z
    ];

    constructor(config: Configuration) {
        super("UNOB", config, UNOB.charset);
    }
}

class UNOC extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-1#Codepage_layout
    private static charset: string[][] = [
        ["\u0020", "\u002F"], // basic symbols and punctuation characters
        ["\u003A", "\u007E"], // basic characters
        ["\u00A0", "\u00FF"]  // special characters
    ];

    constructor(config: Configuration) {
        super("UNOC", config, UNOC.charset);
    }
}

class UNOD extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-2
    private static charset: string[][] = [
        ["\u0020", "\u002F"],
        ["\u003A", "\u007E"],
        ["\u00A0"], ["\u0104"], ["\u02D8"], ["\u0141"], ["\u00A4"], ["\u013D"], ["\u015A"], ["\u00A7"], ["\u0048"], ["\u0160"], ["\u015E"], ["\u0164"], ["\u0179"], ["\u00AD"], ["\u017D"], ["\u017B"],
        ["\u00B0"], ["\u0105"], ["\u02DB"], ["\u0142"], ["\u00B4"], ["\u013E"], ["\u015B"], ["\u02C7"], ["\u00B8"], ["\u0161"], ["\u015F"], ["\u0165"], ["\u017A"], ["\u02DD"], ["\u017E"], ["\u017C"],
        ["\u0154"], ["\u00C1"], ["\u00C2"], ["\u0102"], ["\u00C4"], ["\u0139"], ["\u0106"], ["\u00C7"], ["\u010C"], ["\u00C9"], ["\u0118"], ["\u00CB"], ["\u011A"], ["\u00CD"], ["\u00CE"], ["\u010E"],
        ["\u0110"], ["\u0143"], ["\u0147"], ["\u00D3"], ["\u00D4"], ["\u0150"], ["\u00D6"], ["\u00D7"], ["\u0158"], ["\u016E"], ["\u00DA"], ["\u0170"], ["\u00DC"], ["\u00DD"], ["\u0162"], ["\u00DF"],
        ["\u0155"], ["\u00E1"], ["\u00E2"], ["\u0103"], ["\u00E4"], ["\u013A"], ["\u0107"], ["\u00E7"], ["\u010D"], ["\u00E9"], ["\u0119"], ["\u00EB"], ["\u011B"], ["\u00ED"], ["\u00EE"], ["\u010F"],
        ["\u0111"], ["\u0144"], ["\u0148"], ["\u00F3"], ["\u00F4"], ["\u0151"], ["\u00F6"], ["\u00F7"], ["\u0159"], ["\u016F"], ["\u00FA"], ["\u0171"], ["\u00FC"], ["\u00FD"], ["\u0163"], ["\u02D9"]
    ];

    constructor(config: Configuration) {
        super("UNOD", config, UNOD.charset);
    }
}

class UNOE extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-5
    private static charset: string[][] = [
        ["\u0020", "\u002F"],
        ["\u003A", "\u007E"],
        ["\u00A0"], ["\u0401", "\u040C"], ["\u00AD"], ["\u040E", "\u044F"], // spans 5 lines
        ["\u2116"], ["\u0451", "\u045C"], ["\u00A7"], ["\u045E"], ["\u045F"]
    ];

    constructor(config: Configuration) {
        super("UNOE", config, UNOE.charset);
    }
}

class UNOF extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-7
    private static charset: string[][] = [
        ["\u0020", "\u002F"],
        ["\u003A", "\u007E"],
        ["\u00A0"], ["\u2018", "\u2019"], ["\u00A3"], ["\u20AC"], ["\u20AF"], ["\u00A6", "\u00A9"], ["\u037A"], ["\u00AB", "\u00AD"], ["\u2015"],
        ["\u00B0", "\u00B3"], ["\u0384", "\u0386"], ["\u00B7"], ["\u0388", "\u038A"], ["\u00BB"], ["\u038C", "\u03A1"],
        ["\u03A3", "\u03CE"]
    ];

    constructor(config: Configuration) {
        super("UNOF", config, UNOF.charset);
    }
}

class UNOG extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-3
    private static charset: string[][] = [
        ["\u0020", "\u002F"],
        ["\u003A", "\u007E"],
        ["\u00A0"], ["\u0126"], ["\u02D8"], ["\u00A3"], ["\u00A4"], ["\u0124"], ["\u00A7"], ["\u00A8"], ["\u0130"], ["\u015E"], ["\u011E"], ["\u0134"], ["\u00AD"], ["\u017B"],
        ["\u00B0"], ["\u0127"], ["\u00B2"], ["\u00B3", "\u00B5"], ["\u0125"], ["\u00B7"], ["\u00B8"], ["\u0131"], ["\u015F"], ["\u011F"], ["\u0135"], ["\u00BD"], ["\u017C"],
        ["\u00C0", "\u00C2"], ["\u00C4"], ["\u010A"], ["\u0108"], ["\u00C7", "\u00CF"],
        ["\u00D1", "\u00D4"], ["\u0120"], ["\u00D6"], ["\u00D7"], ["\u011C"], ["\u00D9", "\u00DC"], ["\u016C"], ["\u015C"], ["\u00DF", "\u00E2"],
        ["\u00E4"], ["\u010B"], ["\u0109"], ["\u00E7", "\u00EF"],
        ["\u00F1", "\u00F4"], ["\u0121"], ["\u00F6"], ["\u00F7"], ["\u011D"], ["\u00F9", "\u00FC"], ["\u016D"], ["\u015D"], ["\u02D9"]
    ];

    constructor(config: Configuration) {
        super("UNOG", config, UNOG.charset);
    }
}

class UNOH extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-4
    private static charset: string[][] = [
        ["\u0020", "\u002F"],
        ["\u003A", "\u007E"],
        ["\u00A0"], ["\u0104"], ["\u0138"], ["\u0156"], ["\u00A4"], ["\u0128"], ["\u013B"], ["\u00A7"], ["\u00A8"], ["\u0160"], ["\u0112"], ["\u0122"], ["\u0166"], ["\u00AD"], ["\u017D"], ["\u00AF"],
        ["\u00B0"], ["\u0105"], ["\u02DB"], ["\u0157"], ["\u00B4"], ["\u0129"], ["\u013C"], ["\u02C7"], ["\u00B8"], ["\u0161"], ["\u0113"], ["\u0123"], ["\u0167"], ["\u014A"], ["\u017E"], ["\u014B"],
        ["\u0100"], ["\u00C1", "\u00C6"], ["\u012E"], ["\u010C"], ["\u00C9"], ["\u0118"], ["\u00CB"], ["\u0116"], ["\u00CD"], ["\u00CE"], ["\u012A"],
        ["\u0110"], ["\u0145"], ["\u014C"], ["\u0136"], ["\u00D4", "\u00D8"], ["\u0172"], ["\u00DA", "\u00DC"], ["\u0168"], ["\u016A"], ["\u00DF"],
        ["\u0101"], ["\u00E1", "\u00E6"], ["\u012F"], ["\u010D"], ["\u00E9"], ["\u0119"], ["\u00EB"], ["\u0117"], ["\u00ED"], ["\u00EE"], ["\u0128"],
        ["\u0111"], ["\u0146"], ["\u014D"], ["\u0137"], ["\u00F4", "\u00F8"], ["\u0173"], ["\u00FA", "\u00FC"], ["\u0169"], ["\u0168"], ["\u02D9"]
    ];

    constructor(config: Configuration) {
        super("UNOH", config, UNOH.charset);
    }
}

class UNOI extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-6
    private static charset: string[][] = [
        ["\u0020", "\u002F"],
        ["\u003A", "\u007E"],
        ["\u00A0"], ["\u00A4"], ["\u060C"], ["\u00AD"],
        ["\u061B"], ["\u061F"],
        ["\u0621", "\u063A"],
        ["\u0640", "\u0652"]
    ];

    constructor(config: Configuration) {
        super("UNOI", config, UNOI.charset);
    }
}

class UNOJ extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-8
    private static charset: string[][] = [
        ["\u0020", "\u002F"],
        ["\u003A", "\u007E"],
        ["\u00A0"], ["\u00A2", "\u00A9"], ["\u00D7"], ["\u00AB", "\u00B9"],
        ["\u00F7"], ["\u00BB", "\u00BE"],
        ["\u2017"], ["\u05D0", "\u05EA"],
        ["\u200E"], ["\u200F"]
    ];

    constructor(config: Configuration) {
        super("UNOJ", config, UNOJ.charset);
    }
}

class UNOK extends Charset {

    // https://en.wikipedia.org/wiki/ISO/IEC_8859-9
    private static charset: string[][] = [
        ["\u0020", "\u002F"],
        ["\u003A", "\u007E"],
        ["\u00A0", "\u00CF"], // covers 3 lines
        ["\u011E"], ["\u00D1", "\u00DC"], ["\u0130"], ["\u015E"], ["\u00DF", "\u00EF"], // covers 2 lines
        ["\u011F"], ["\u00F1", "\u00FC"], ["\u0131"], ["\u015F"], ["\u00FF"]
    ];

    constructor(config: Configuration) {
        super("UNOK", config, UNOK.charset);
    }
}

// // TODO
// class UNOX extends Charset {

//     // https://en.wikipedia.org/wiki/ISO/IEC_2022#ISO-2022-JP
//     private static charset: string[][] = [];

//     constructor(config: Configuration) {
//         super("UNOX", config, UNOX.charset);
//     }
// }

// class UNOY extends Charset {

//     // https://en.wikipedia.org/wiki/Universal_Coded_Character_Set
//     private static charset: string[][] = [
//         ["\u0020", "\u002F"],
//         ["\u003A", "\u007E"],
//         ["\u00A0", "\u{FFFFF}"]
//     ];

//     constructor(config: Configuration) {
//         super("UNOY", config, UNOY.charset, true);
//     }
// }

// class UCS2 extends Charset {

//     // https://en.wikipedia.org/wiki/Universal_Coded_Character_Set
//     private static charset: string[][] = [
//         ["\u0020", "\u002F"],
//         ["\u003A", "\u007E"],
//         ["\u00A0", "\uD800"],
//         ["\uE000", "\uFFFF"]
//     ];

//     constructor(config: Configuration) {
//         super("UCS2", config, UCS2.charset, true);
//     }
// }

// class KECA extends Charset {

//     private static charset: string[][] = [
//         // . , – ( ) / = ! ” % & * ; < >
//         ["\u0021", "\u0022"], // ! "
//         ["\u0041", "\u005A"], // A-Z
//         ["\u0025", "\u0026"], // % &
//         ["\u0028", "\u002A"], // ( ) *
//         ["\u002B", "\u002F"], // , - . /
//         ["\u003B", "\u003E"]  // ; < = >
//         // Korean Syllables (2350 characters)
//         // Korean Hanja (4888 characters)
//         // Korean Alphabets
//         // Characters and numbers enclosed in a circle
//         // The length of the strings are counted by bytes instead of characters.
//         //     So if you have a data element of length 3, you can have 3 latin characters,
//         //     1 Korean character or 1 Korean and 1 Latin character!
//     ];

//     constructor(config: Configuration) {
//         super("KECA", config, KECA.charset);
//     }
// }

export class Tokenizer {

    private regexes: RegExType;

    private regex: RegExp;
    buffer: string;

    alpha(): void {
        this.regex = this.regexes.alpha;
    }

    alphanumeric(): void {
        this.regex = this.regexes.alphanumeric;
    }

    numeric(): void {
        this.regex = this.regexes.numeric;
    }

    decimal(chunk: string, index: number): void {
        let result: string = ".";

        switch (this.regex) {
            case this.regexes.numeric:
                this.regex = this.regexes.decimal;
                break;
            case this.regexes.alpha:
            case this.regexes.alphanumeric:
                result = chunk.charAt(index);
                break;
            case this.regexes.decimal:
                throw this.errors.secondDecimalMark();
        }
        this.buffer += result;
    }

    constructor(config: Configuration) {
        this.regexes = this.setCharsetBasedOnConfig(config);
        this.regex = this.regexes.alphanumeric;
        this.buffer = "";
    }

    setCharsetBasedOnConfig(config: Configuration): RegExType {
        switch (config.charset) {
            case "UNOA":
                // ISO 646 without lowercase letters and a couple of symbols
                this.regexes = new UNOA(config);
                break;
            case "UNOB":
                // ISO 646
                this.regexes = new UNOB(config);
                break;
            case "UNOC":
                // ISO 8859-1: Latin alphabet No. 1
                this.regexes = new UNOC(config);
                break;
            case "UNOD":
                // ISO 8859-2: Latin alphabet No. 2
                this.regexes = new UNOD(config);
                break;
            case "UNOE":
                // ISO 8859-5: Latin/Cyrillic alphabet
                this.regexes = new UNOE(config);
                break;
            case "UNOF":
                // ISO 8859-7: Latin/Greek alphabet
                this.regexes = new UNOF(config);
                break;
            case "UNOG":
                // ISO 8859-3: Latin alphabet
                this.regexes = new UNOG(config);
                break;
            case "UNOH":
                // ISO 8859-4: Latin alphabet
                this.regexes = new UNOH(config);
                break;
            case "UNOI":
                // ISO 8859-6: Latin/Arabic alphabet
                this.regexes = new UNOI(config);
                break;
            case "UNOJ":
                // ISO 8859-8: Latin/Hebrew alphabet
                this.regexes = new UNOJ(config);
                break;
            case "UNOK":
                // ISO 8859-9: Latin alphabet
                this.regexes = new UNOK(config);
                break;
            // TODO:
            // case "UNOX":
            //     // ISO 2022-JP: Japanese; escape techniques in accordance with ISO 2375
            //     break;
            // case "UNOY":
            //     // ISO 10646-1 without code extension technique
            //     break;
            // case "KECA":
            //     break;
            default:
                throw new Error(`Unsupported charset encoding '${config.charset}'`);
        }
        return this.regexes;
    }

    segment(chunk: string, index: number): number {
        let code: number;

        // Read segment name data from the buffer
        const start: number = index;
        // Consume available ASCII uppercase characters
        while ((code = chunk.charCodeAt(index) || 0) < 91 && code > 64) {
            index++;
        }
        this.buffer += chunk.slice(start, index);

        return index;
    }

    data(chunk: string, index: number): number {
        this.regex.lastIndex = index;
        this.regex.test(chunk);
        this.buffer += chunk.slice(index, this.regex.lastIndex);
        return this.regex.lastIndex;
    }

    release(chunk: string, index: number): void {
        this.buffer += chunk.charAt(index);
    }

    length(): number {
        return this.buffer.length - (this.regex === this.regexes.decimal ? 1 : 0);
    }

    content(): string {
        return this.buffer;
    }

    private errors = {
        secondDecimalMark: function(): Error {
            return new Error("Cannot accept a second decimal mark while parsing a number");
        }
    };
}
