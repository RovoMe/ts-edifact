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

type PropConfig = {
    segmentTerminator?: number;
    dataElementSeparator?: number;
    componentDataSeparator?: number;
    decimalMark?: number;
    releaseCharacter?: number;
    lineFeed?: number;
    carriageReturn?: number;
    endOfTag?: number;
    level?: string;
};

type Config = {
    segmentTerminator: number;
    dataElementSeparator: number;
    componentDataSeparator: number;
    decimalMark: number;
    releaseCharacter: number;
    lineFeed: number;
    carriageReturn: number;
    endOfTag: number;
};

const DEFAULT_CONFIG: Config = {
    segmentTerminator: 39,
    dataElementSeparator: 43,
    componentDataSeparator: 58,
    decimalMark: 46,
    releaseCharacter: 63,
    lineFeed: 10,
    carriageReturn: 13,
    endOfTag: 4
};

type Charsets = {
    [key: string]: number[][];
};

export class Configuration {

    readonly config: Config;
    level: string;

    private readonly charsets: Charsets = {
        UNOA: [[32, 35], [37, 64], [65, 91]],
        UNOB: [[32, 35], [37, 64], [65, 91], [97, 123]],
        UNOC: [[32, 128], [160, 256]],
        UNOY: [[32, 128], [160, 1114112]],
        UCS2: [[32, 128], [160, 55296], [57344, 65536]]
    };

    private mergeWithDefault(config?: PropConfig): Config {
        const conf: Config = { ...DEFAULT_CONFIG };
        if (config) {
            if (config.segmentTerminator) {
                conf.segmentTerminator = config.segmentTerminator;
            }
            if (config.dataElementSeparator) {
                conf.dataElementSeparator = config.dataElementSeparator;
            }
            if (config.componentDataSeparator) {
                conf.componentDataSeparator = config.componentDataSeparator;
            }
            if (config.decimalMark) {
                conf.decimalMark = config.decimalMark;
            }
            if (config.releaseCharacter) {
                conf.releaseCharacter = config.releaseCharacter;
            }
            if (config.lineFeed) {
                conf.lineFeed = config.lineFeed;
            }
            if (config.carriageReturn) {
                conf.carriageReturn = config.carriageReturn;
            }
            if (config.endOfTag) {
                conf.endOfTag = config.endOfTag;
            }
        }
        return conf;
    }

    constructor(config?: PropConfig) {
        this.config = this.mergeWithDefault(config);
        if (config && config.level) {
            this.level = config.level;
        } else {
            this.level = "UNOA";
        }
    }

    /**
     * Return an array containing the ranges accepted by this configurations
     * character set.
     */
    public charset(): number[][] {
        return this.charsets[this.level];
    }

    /**
     * Set the encoding level.
     *
     * @param level - A string identifying the encoding level used.
     */
    public encoding(level: string): void {
        if (Object.prototype.hasOwnProperty.call(this.charsets, level)) {
            this.level = level;
        } else {
            throw this.errors.invalidEncoding(level);
        }
    }

    /**
     * Return a sorted array containing the code points of the control characters
     * used by this configuration.
     */
    public delimiters(): number[] {
        const compareAndSwap = function(array: number[], a: number, b: number): void {
            if (array[a] > array[b]) {
                // eslint-disable-next-line no-bitwise
                array[a] = array[a] ^ array[b];
                // eslint-disable-next-line no-bitwise
                array[b] = array[a] ^ array[b];
                // eslint-disable-next-line no-bitwise
                array[a] = array[a] ^ array[b];
            }
        };

        const exclude: number[] = [this.config.segmentTerminator, this.config.dataElementSeparator, this.config.componentDataSeparator, this. config.releaseCharacter];

        // Sort the array of excluded characters using a sorting network.
        compareAndSwap(exclude, 1, 2);
        compareAndSwap(exclude, 3, 4);
        compareAndSwap(exclude, 1, 3);
        compareAndSwap(exclude, 0, 2);
        compareAndSwap(exclude, 2, 4);
        compareAndSwap(exclude, 0, 3);
        compareAndSwap(exclude, 0, 1);
        compareAndSwap(exclude, 2, 3);
        compareAndSwap(exclude, 1, 2);

        return exclude;
    }

    public toString(): string {
        let result: string = this.level;
        result += String.fromCharCode(this.config.componentDataSeparator, this.config.decimalMark, this.config.releaseCharacter, this.config.segmentTerminator);
        return result;
    }

    private errors = {
        invalidEncoding: function(level: string): Error {
            return new Error("No definition found for character encoding level " + level);
        }
    };
}
