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

import { Cache } from "./cache";
import { Configuration } from "./configuration";

interface RegExType {
    alpha: RegExp;
    numeric: RegExp;
    alphanumeric: RegExp;
    decimal: RegExp;
}

/*
enum Modes {
    alphanumeric = 0,
    alpha = 1,
    numeric = 2,
    decimal = 3
}
*/

export class Tokenizer {

    private regexes: RegExType =  {
        alpha: /[A-Z]*/g,
        numeric: /[-]?[0-9]*/g,
        alphanumeric: /[-]?[A-Z0-9]*/g,
        decimal: /[-]?[0-9]*/g
    };
    private cache: Cache<RegExType> = new Cache<RegExType>(40);

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

    private compile(ranges: number[][], chars: number[]): RegExp {
        let output: string = "";
        let i: number = 0;
        let j: number = 0;
        let minimum: number = ranges[i] && ranges[i][0];

        while (i < ranges.length && j < chars.length) {
            minimum = Math.max(ranges[i][0], minimum);
            if (minimum < chars[j]) {
                output += String.fromCharCode(minimum, 45, Math.min(ranges[i][1], chars[j]) - 1);
                minimum = Math.min(ranges[i][1], chars[j]);
                i += ranges[i][1] > chars[j] + 1 ?  0 :  1;
            } else {
                minimum = chars[j] + 1;
                j++;
            }
        }

        while (i < ranges.length) {
            output += String.fromCharCode(Math.max(minimum, ranges[i][0]), 45, ranges[i][1] - 1);
            i++;
        }
        return new RegExp("[" + output + "]*", "g");
    }

    configure(configuration: Configuration): Tokenizer {
        let charset: number[][];
        let exclude: number[];

        if (this.cache.contains(configuration.toString())) {
            this.regexes = this.cache.get(configuration.toString());
        } else {
            // Reconfigure if the charset was changed.
            charset = configuration.charset();
            exclude = configuration.delimiters();

            this.regexes = {
                alpha: this.regexes.alpha,
                alphanumeric: this.compile(charset, exclude),
                numeric: this.regexes.numeric,
                decimal: this.regexes.decimal
            };

            this.alphanumeric();

            this.cache.insert(configuration.toString(), this.regexes);
        }

        return this;
    }

    constructor(configuration?: Configuration) {
        if (configuration) {
            this.configure(configuration);
        }
        this.regex = this.regexes.alphanumeric;
        this.buffer = "";
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
